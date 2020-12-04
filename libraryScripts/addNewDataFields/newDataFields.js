const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const games = require('./base.json');

const supp = games.map((game) => {
  game.compilation = false; // just set it to false and deal with this manually later
  game.compilationGamesIds = [];
  game.gamesService = {
    xbGold: false,
    xbPass: false,
    psPlus: false,
    primeFree: false
  };

  return game;
});

const writable = JSON.stringify(supp);

fs.writeFile(path.join(__dirname, './output.json'), writable, (error) => {
  if (error) {
    console.log(chalk.red.bold('ERROR WRITING NEW FILE'));
  } else {
    console.log(chalk.green('NEW FILE WRITTEN SUCCESSFULLY!'));
  }
});
