const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const currentGames = require('./masterResults.json');
const games = require('../../server/db/games.json');
const _find = require('lodash/find');
const _get = require('lodash/get');

(() => {
  const gamesWithNames = games.map((game) => {
    const name = _get(game, 'igdb.name');
    game.name = name;
    return game;
  });

  const misses = [];

  const withIdsFirst = currentGames.map((game) => {
    const matchGame = _find(gamesWithNames, {
      name: game.name,
      createdAt: game.createdAt
    });
    if (matchGame) {
      game.id = matchGame.igdb.id;
    } else {
      misses.push(game);
    }
    return game;
  });

  fs.writeFile(
    path.join(__dirname, './masterWithIds.json'),
    JSON.stringify(withIdsFirst),
    (err) => {
      if (err) {
        console.log(chalk.red.bold('ERROR WRITING FILE:', err));
      } else {
        console.log(chalk.green(`File successfully written with ${misses.length} misses!`));
        if (misses && misses.length) {
          fs.writeFile(path.join(__dirname, './misses.json'), JSON.stringify(misses), (error) => {
            if (error) {
              console.log(chalk.red.bold('ERROR WIRITING MISSES', error));
            } else {
              console.log(chalk.cyan('MISSES FILE WRITTEN!'));
            }
          });
        }
      }
    }
  );
})();
