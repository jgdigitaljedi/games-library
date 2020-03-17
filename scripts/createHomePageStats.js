const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _cloneDeep = require('lodash/cloneDeep');

const games = require('../server/db/gamesExtra.json');
const platforms = require('../server/db/consoles.json');

let genres = {},
  conGames = {},
  conMostGames = [],
  conLeastGames = [];

function handleGenres(game) {
  const gameGenres = game && game.igdb && game.igdb.genres ? game.igdb.genres : null;
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
  let gamesSumObj = {};
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
});

const finalData = {
  mostRecentlyAddedGames: mostRecentGameArr,
  mostRecentlyAddedPlatforms: mostRecentConsoleArr,
  mostPaidForGames: highestPricePaidGames,
  mostPaidForPlatforms: highestPricePaidPlatforms,
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
