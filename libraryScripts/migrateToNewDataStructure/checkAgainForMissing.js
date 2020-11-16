const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const oldGames = require('../backup/games.json');
const newGames = require('../../server/db/games.json');
const newGamesHashes = newGames.map((game) => {
  return `${game.name}__${game.id}__${game.createdAt}`;
});

const missing = oldGames.filter((game) => {
  const hash = `${game.igdb.name}__${game.igdb.id}__${game.createdAt}`;
  return newGamesHashes.indexOf(hash) < 0;
});

fs.writeFile(
  path.join(__dirname, './secondAttemptAtMissing.json'),
  JSON.stringify(missing, null, 2),
  (err) => {
    if (err) {
      console.log(chalk.red.bold('ERROR WRITING MISSING', err));
    } else {
      console.log(chalk.green('MISSING FILE WRITTEN!'));
    }
  }
);
