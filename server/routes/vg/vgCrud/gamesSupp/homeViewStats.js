const _cloneDeep = require('lodash/cloneDeep');
const db = require('../../../../db');

const games = db.games.find();
const platforms = db.consoles.find();
const everDrives = require('../../../../extra/everDrive.json');
const accessories = db.gameAcc.find();
const collectibles = db.collectibles.find();
const clones = db.clones.find();

let genres = {},
  conGames = {},
  conGamesCounts = {},
  esrbCounts = {},
  gameMedia = {
    physical: 0,
    digital: 0
  },
  cibGames = 0,
  platformCompanies = {},
  howAcquiredGames = {},
  gamesBoughtByMonth = {},
  igdbRatingsBreakdown = [
    { category: 'Great (90+)', value: 0 },
    { category: 'Good (70 - 89)', value: 0 },
    { category: 'Fair (50 - 69)', value: 0 },
    { category: 'Poor (30 - 49)', value: 0 },
    { category: 'Terrible (< 30)', value: 0 }
  ],
  // consolesByCompany = { UNKNOWN: 0 },
  consolesByGeneration = { UNKNOWN: 0 },
  gamesCount = games.length,
  platformsCount = platforms.length,
  accessoriesCount = accessories.length,
  collectiblesCount = collectibles.length,
  clonesCount = clones.length;

function resetAll() {
  genres = {};
  conGames = {};
  conGamesCounts = {};
  esrbCounts = {};
  gameMedia = {
    physical: 0,
    digital: 0
  };
  cibGames = 0;
  platformCompanies = {};
  howAcquiredGames = {};
  gamesBoughtByMonth = {};
  igdbRatingsBreakdown = [
    { category: 'Great (90+)', value: 0 },
    { category: 'Good (70 - 89)', value: 0 },
    { category: 'Fair (50 - 69)', value: 0 },
    { category: 'Poor (30 - 49)', value: 0 },
    { category: 'Terrible (< 30)', value: 0 }
  ];
  // consolesByCompany = { UNKNOWN: 0 };
  consolesByGeneration = { UNKNOWN: 0 };
  gamesCount = games.length;
  platformsCount = platforms.length;
  accessoriesCount = accessories.length;
  collectiblesCount = collectibles.length;
  clonesCount = clones.length;
}

function handleConsoleByGeneration(con) {
  const gen = (con && con.generation) || null;
  if (gen && consolesByGeneration.hasOwnProperty(gen)) {
    consolesByGeneration[gen]++;
  } else if (gen) {
    consolesByGeneration[gen] = 1;
  } else {
    consolesByGeneration.UNKNOWN++;
  }
}

function handleConsoleByCompany(con) {
  if (con && con.company && platformCompanies[con.company]) {
    platformCompanies[con.company]++;
  } else if (con && con.company) {
    platformCompanies[con.company] = 1;
  } else if (platformCompanies.UNKNOWN) {
    platformCompanies.UNKNOWN++;
  } else {
    platformCompanies.UNKNOWN = 1;
  }
}

function handleIgdbRating(game) {
  const rating = game && game.hasOwnProperty('total_rating') ? game.total_rating : null;
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
  const gameGenres = game && game.genres ? game.genres : ['NO GENRE'];
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
  const esrb = game && game.esrb ? game.esrb : 'NOT RATED';
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
  _cloneDeep(games).forEach(game => {
    if (conGames.hasOwnProperty(game.consoleName)) {
      conGames[game.consoleName].push(game);
    } else {
      conGames[game.consoleName] = [game];
    }
  });
}

function handleConGamesData() {
  Object.keys(_cloneDeep(conGames)).forEach(con => {
    conGamesCounts[con] = conGames[con].length;
  });
}

function createMostRecentArr(data, num) {
  return _cloneDeep(data)
    .sort((a, b) => {
      const aDate = a.datePurchased;
      const bDate = b.datePurchased;
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

function getMostPopularGameDecade() {
  return games
    .map(g => {
      if (g && g.first_release_date) {
        return g.first_release_date;
      }
      return null;
    })
    .filter(g => g)
    .reduce((acc, gameDate, index) => {
      const gameDecade = gameDate.split('/')[2].slice(0, -1) + '0';
      if (acc[gameDecade]) {
        acc[gameDecade]++;
      } else {
        acc[gameDecade] = 1;
      }
      return acc;
    }, {});
}

module.exports.getStats = () => {
  makeConGames();
  handleConGamesData();
  const mostRecentGameArr = createMostRecentArr(games, 5);
  const mostRecentConsoleArr = createMostRecentArr(platforms, 5);
  const highestPricePaidGames = getMostExpensive(games, 5);
  const highestPricePaidPlatforms = getMostExpensive(platforms, 5);
  const gamesByDecade = getMostPopularGameDecade();
  const everDriveCounts = everDrives.length;

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
    platformCompanies,
    consolesByGenerationSorted: consolesByGenSorted,
    totalGames: gamesCount,
    totalPlatforms: platformsCount,
    totalAccessories: accessoriesCount,
    totalCollectibles: collectiblesCount,
    totalClones: clonesCount,
    gamesByDecade,
    everDriveCounts
  };
  resetAll();
  return finalData;
};
