const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const games = require('../../server/db/games.json');

const supp = games.map((game) => {
  game.gamesService = {
    xbGold: false,
    xbPass: false,
    psPlus: false,
    primeFree: false,
    switchFree: false
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
