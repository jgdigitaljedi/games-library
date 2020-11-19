const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const games = require('../server/db/games.json');
const gamesExtra = require('../server/db/gamesExtra.json');

(() => {
  const gamesWithManuals = games.map((g) => {
    g.manual = !!g.cib;
    return g;
  });

  const extraWithManuals = gamesExtra.map((g) => {
    g.manual = !!g.cib;
    return g;
  });

  fs.writeFile(
    path.join(__dirname, '../server/db/games.json'),
    JSON.stringify(gamesWithManuals),
    (err) => {
      if (err) {
        console.log(chalk.red.bold('ERROR WRITING NEW GAMES FILE:', err));
      } else {
        console.log(chalk.green('Successfully wrote new games file!'));
      }
    }
  );

  fs.writeFile(
    path.join(__dirname, '../server/db/gamesExtra.json'),
    JSON.stringify(extraWithManuals),
    (err) => {
      if (err) {
        console.log(chalk.red.bold('ERROR WRITING NEW EXTRA FILE:', err));
      } else {
        console.log(chalk.green('Successfully wrote new extra file!'));
      }
    }
  );
})();
