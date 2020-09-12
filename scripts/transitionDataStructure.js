const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _get = require('lodash/get');

const games = require('../server/db/games.json');

function gameNewProps(game) {
  game.image = _get(game, 'gb.image');
  game.description = _get(game, 'gb.deck');
  game.name = _get(game, 'igdb.name') || _get(game, 'gb.name');
  delete game.pirated;
  game.miltiplayerNumber = game.multiplayerNumber ? parseInt(game.multiplayerNumber) : 1;
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

const consoles = require('../server/db/consoles.json');

function platformNewProps(platform) {
  platform.name = _get(platform, 'igdb.name');
  delete platform.connectedBy;
  delete platform.upscaler;
  return platform;
}

const transitionedPlatform = consoles.map(p => {
  const newPlatform = platformNewProps(p);
  return newPlatform;
});

fs.writeFile(
  path.join(__dirname, '../server/db/consoles.json'),
  JSON.stringify(transitionedPlatform),
  err => {
    if (err) {
      console.log(chalk.red.bold('ERROR WRITING FILE IN TRANSITION'));
    } else {
      console.log(chalk.cyan('CONSOLES SUCCESSFULLY TRANSITIONED TO NEW DATA STRUCTURE!'));
    }
  }
);
