const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

(() => {
  fs.readFile(path.join(__dirname, '../../server/db/games.json'), (error, data) => {
    if (error) {
      console.log(chalk.red('ERROR READING IN GAMES'));
    } else {
      const results = JSON.parse(data);
      const noIds = results.filter((game) => {
        const id = game.igdb.id || null;
        return !id || parseInt(id) === 9999 || parseInt(id) === 99999;
      });
      fs.writeFile(path.join(__dirname, './noIds.json'), JSON.stringify(noIds, null, 2), (err) => {
        if (err) {
          console.log(chalk.red.bold('ERROR WRITING NOIDS', err));
        } else {
          console.log(chalk.green('WROTE NOIDS FILE!'));
        }
      });
    }
  });
})();
