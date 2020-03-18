const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _cloneDeep = require('lodash/cloneDeep');

const games = require('../server/db/gamesExtra.json');
const platforms = require('../server/db/consoles.json');

/*** ideas for possible future additions
 * add games by relase date decade
 ***/

let genres = {},
  conGames = {},
  conGamesCounts = {},
  esrbCounts = {},
  gameMedia = {
    physical: 0,
    digital: 0
  },
  cibGames = 0,
  howAcquiredGames = {},
  gamesBoughtByMonth = {},
  igdbRatingsBreakdown = [
    { category: 'Great (90+)', value: 0 },
    { category: 'Good (70 - 89)', value: 0 },
    { category: 'Fair (50 - 69)', value: 0 },
    { category: 'Poor (30 - 49)', value: 0 },
    { category: 'Terrible (< 30)', value: 0 }
  ],
  consolesByCompany = { UNKNOWN: 0 },
  consolesByGeneration = { UNKNOWN: 0 };

function handleConsoleByGeneration(con) {
  const gen = con && con.igdb && con.igdb.generation ? con.igdb.generation.toString() : null;
  if (gen && consolesByGeneration.hasOwnProperty(gen)) {
    consolesByGeneration[gen]++;
  } else if (gen) {
    consolesByGeneration[gen] = 1;
  } else {
    consolesByGeneration.UNKNOWN++;
  }
}

function handleConsoleByCompany(con) {
  if (con && con.gb && con.gb.company && consolesByCompany.hasOwnProperty(con.gb.company)) {
    consolesByCompany[con.gb.company]++;
  } else if (con && con.gb && con.gb.company) {
    consolesByCompany[con.gb.company] = 1;
  } else {
    consolesByCompany.UNKNOWN++;
  }
}

function handleIgdbRating(game) {
  const rating =
    game && game.igdb && game.igdb.hasOwnProperty('total_rating') ? game.igdb.total_rating : null;
  if (rating !== null) {
    // it could potentially be 0 so general falsy check no good here
    if (rating >= 90) {
      igdbRatingsBreakdown[0].value++;
    } else if (rating >= 70 && rating < 90) {
      igdbRatingsBreakdown[1].value++;
    } else if (rating >= 50 && rating < 70) {
      igdbRatingsBreakdown[2].value++;
    } else if (rating >= 30 && rating < 50) {
      igdbRatingsBreakdown[3].value++;
    } else {
      igdbRatingsBreakdown[4].value++;
    }
  }
}

function purchasesByMonth(game) {
  const myDate = game.datePurchased || null;
  if (myDate) {
    const dSplit = myDate.split('-');
    const monthYear = `${dSplit[1]}/${dSplit[0]}`;
    if (gamesBoughtByMonth.hasOwnProperty(monthYear)) {
      gamesBoughtByMonth[monthYear]++;
    } else {
      gamesBoughtByMonth[monthYear] = 1;
    }
  }
}

function handleGenres(game) {
  const gameGenres = game && game.igdb && game.igdb.genres ? game.igdb.genres : ['NO GENRE'];
  if (gameGenres) {
    gameGenres.forEach(g => {
      const lc = g.toLowerCase();
      if (genres.hasOwnProperty(lc)) {
        genres[lc]++;
      } else {
        genres[lc] = 1;
      }
    });
  }
}

function handleEsrb(game) {
  const esrb = game && game.igdb && game.igdb.esrb ? game.igdb.esrb : 'NOT RATED';
  if (esrb) {
    if (esrbCounts.hasOwnProperty(esrb)) {
      esrbCounts[esrb]++;
    } else {
      esrbCounts[esrb] = 1;
    }
  }
}

function handleGameMedia(game) {
  if (game.physical) {
    gameMedia.physical++;
  } else {
    gameMedia.digital++;
  }
}

function handleCib(game) {
  if (game.cib) {
    cibGames++;
  }
}

function handleAcqusition(game) {
  const ha = game && game.howAcquired ? game.howAcquired : 'UNKNOWN';
  if (howAcquiredGames.hasOwnProperty(ha)) {
    howAcquiredGames[ha]++;
  } else {
    howAcquiredGames[ha] = 1;
  }
}

function makeConGames() {
  games.forEach(game => {
    if (conGames.hasOwnProperty(game.consoleName)) {
      conGames[game.consoleName].push(game);
    } else {
      conGames[game.consoleName] = [game];
    }
  });
}

function handleConGamesData() {
  Object.keys(conGames).forEach(con => {
    conGamesCounts[con] = conGames[con].length;
  });
}

function createMostRecentArr(data, num) {
  return _cloneDeep(data)
    .sort((a, b) => {
      const aDate = a.createdAt;
      const bDate = b.createdAt;
      if ((!aDate && !bDate) || aDate === bDate) {
        return 0;
      }
      if (!aDate) {
        return 1;
      }
      if (!bDate) {
        return -1;
      }
      return new Date(aDate) > new Date(bDate) ? -1 : 1;
    })
    .slice(0, num);
}

function getMostExpensive(data, num) {
  return _cloneDeep(data)
    .sort((a, b) => {
      const aPrice = a.hasOwnProperty('pricePaid') ? a.pricePaid : a.purchasePrice;
      const bPrice = b.hasOwnProperty('pricePaid') ? b.pricePaid : b.purchasePrice;
      /* eslint-disable-next-line */
      if ((!aPrice && !bPrice) || aPrice == bPrice) {
        return 0;
      }
      if (!aPrice && bPrice) {
        return 1;
      }
      if (aPrice && !bPrice) {
        return -1;
      }
      return (typeof aPrice == 'string' ? parseFloat(aPrice) : aPrice) >
        (typeof bPrice === 'string' ? parseFloat(bPrice) : bPrice)
        ? -1
        : 1;
    })
    .slice(0, num);
}

function sortByDateCounts(a, b) {
  const aNum = a.games;
  const bNum = b.games;
  if ((!aNum && !bNum) || aNum === bNum) {
    return 0;
  }
  if (!aNum && bNum) {
    return 1;
  }
  if (aNum && !bNum) {
    return -1;
  }
  return aNum > bNum ? -1 : 1;
}

makeConGames();
handleConGamesData();
const mostRecentGameArr = createMostRecentArr(games, 5);
const mostRecentConsoleArr = createMostRecentArr(platforms, 5);
const highestPricePaidGames = getMostExpensive(games, 5);
const highestPricePaidPlatforms = getMostExpensive(platforms, 5);

games.forEach(game => {
  handleGenres(game);
  handleEsrb(game);
  handleGameMedia(game);
  handleCib(game);
  handleAcqusition(game);
  purchasesByMonth(game);
  handleIgdbRating(game);
});

platforms.forEach(platform => {
  handleConsoleByCompany(platform);
  handleConsoleByGeneration(platform);
});

const mostGamesInMonth = Object.keys(gamesBoughtByMonth)
  .map(month => {
    return {
      dateFormatted: month,
      games: gamesBoughtByMonth[month]
    };
  })
  .sort(sortByDateCounts);

const gamesBoughtInYear = Object.keys(gamesBoughtByMonth).reduce((acc, obj) => {
  const objSplit = obj.split('/');
  const year = objSplit[1];
  if (acc.hasOwnProperty(year)) {
    acc[year] += gamesBoughtByMonth[obj];
  } else {
    acc[year] = gamesBoughtByMonth[obj];
  }
  return acc;
}, {});

const gamesInYearSorted = Object.keys(gamesBoughtInYear)
  .map(year => {
    return {
      dateFormatted: year,
      games: gamesBoughtInYear[year]
    };
  })
  .sort(sortByDateCounts);

const genSorted = Object.keys(consolesByGeneration).sort((a, b) => parseInt(a) > parseInt(b));

const consolesByGenSorted = {};
genSorted.forEach(gen => {
  consolesByGenSorted[gen] = consolesByGeneration[gen];
});

const finalData = {
  mostRecentlyAddedGames: mostRecentGameArr,
  mostRecentlyAddedPlatforms: mostRecentConsoleArr,
  mostPaidForGames: highestPricePaidGames,
  mostPaidForPlatforms: highestPricePaidPlatforms,
  gamePerConsoleCounts: conGamesCounts,
  gamesPerEsrb: esrbCounts,
  physicalVsDigitalGames: { ...gameMedia },
  gamesAcquisition: howAcquiredGames,
  cibGames,
  gamesWithGenre: genres,
  gamesAddedInMonth: mostGamesInMonth,
  gamesAddedPerYear: gamesInYearSorted,
  igdbRatingsBreakdown,
  consolesByCompany,
  consolesByGenerationSorted: consolesByGenSorted
};

fs.writeFile(
  path.join(__dirname, '../server/extra/collectionStats.json'),
  JSON.stringify(finalData, null, 2),
  error => {
    if (error) {
      console.log(chalk.red.bold('ERROR GENERATING STATS: ', error));
    } else {
      console.log(chalk.cyan('Stats successfully written!'));
    }
  }
);
