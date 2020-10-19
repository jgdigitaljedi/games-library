const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const ed = require('../server/extra/everDrive.json');

const fixed = ed.map(d => {
  d.consoleArr = [{ consoleName: d.consoleName, consoleId: d.consoleIgdbId }];
  d.location = 'upstairs';
  d.handheld = false;
  return d;
});

fs.writeFile(
  path.join(__dirname, '../server/extra/everDrive.json'),
  JSON.stringify(fixed, null, 2),
  error => {
    if (error) {
      console.log(chalk.red.bold(error));
    } else {
      console.log(chalk.green('EverDrive entries have added consoleArr!'));
    }
  }
);
