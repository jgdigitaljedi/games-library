const fs = require('fs');
const path = require('path');
const consoles = require('../../server/db/consoles.json');
const _uniqBy = require('lodash/uniqBy');
const _sortBy = require('lodash/sortBy');
const chalk = require('chalk');

(function () {
  const platformsAndIds = consoles.map(({ id, name }) => {
    return { id, name };
  });
  const uniquePlats = _sortBy(_uniqBy(platformsAndIds, 'id'), 'name');
  fs.writeFile(path.join(__dirname, './consoleIds.json'), JSON.stringify(uniquePlats), error => {
    if (error) {
      console.log(chalk.red.bold('ERROR WRITING CONSOLE IDS!'));
      console.log(chalk.red.bold(error));
    } else {
      console.log(chalk.green('SUCCESSFULLY WROTE CONSOLE IDS LIST!'));
    }
  });
})();
