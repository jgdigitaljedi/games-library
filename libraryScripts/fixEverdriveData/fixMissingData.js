const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const filePath = './results/megaEverdrive32xGames.json';

const games = require(filePath);
// const sg = require('./results/megaEverdriveGames.json');
// const s32x = require('./results/megaEverdrive32xGames.json');

const fixed = games.map(game => {
  game.consoleArr = [{ consoleName: game.consoleName, consoleId: game.consoleId }];
  game.physicalDigital = ['EverDrive'];
  return game;
});

fs.writeFile(path.join(__dirname, filePath), JSON.stringify(fixed, null, 2), 'utf8', error => {
  if (error) {
    console.log(chalk.red.bold(`ERROR WRITING ${filePath}:`, JSON.stringify(error)));
  } else {
    console.log(chalk.green(`SUCCESSFULLY WROTE ${filePath}!`));
  }
});
