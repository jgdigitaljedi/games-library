const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _get = require('lodash/get');

const games = require('../server/db/games.json');

function gameNewProps(game) {
  // game.image = _get(game, 'gb.image');
  // game.description = _get(game, 'gb.deck');
  delete game.pirated;
  game.multiplayerNumber = game.multiplayerNumber ? parseInt(game.multiplayerNumber) : 1;
  return game;
}

const transitioned = games.map(g => {
  const newGame = gameNewProps(g);
  return newGame;
});

fs.writeFile(
  path.join(__dirname, '../server/db/gamesTransitioned.json'),
  JSON.stringify(transitioned),
  err => {
    if (err) {
      console.log(chalk.red.bold('ERROR WRITING FILE IN TRANSITION'));
    } else {
      console.log(chalk.cyan('GAMES SUCCESSFULLY TRANSITIONED TO NEW DATA STRUCTURE!'));
    }
  }
);
