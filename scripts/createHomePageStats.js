const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _cloneDeep = require('lodash/cloneDeep');

const games = require('../server/db/gamesExtra.json');
const platforms = require('../server/db/consoles.json');

// add month that most games purchased
// add year that most games purchased
// add year that most consoles purchased
// add games IGDB ratings breakdown
// add consoles by company
// add consoles by release date decade
// add games by relase date decade

let genres = {},
  conGames = {},
  conGamesCounts = {},
  esrbCounts = {},
  gameMedia = {
    physical: 0,
    digital: 0
  },
  cibGames = 0,
  howAcquiredGames = {};

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
  gamesWithGenre: genres
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
