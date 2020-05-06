const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const tgEd = require('../server/extra/everDrives/turboEverdrive.json');
const megaEd = require('../server/extra/everDrives/megaEverdriveGames.json');

const meFixed = megaEd.map(item => {
  if (!item.igdb.genres || !Array.isArray(item.igdb.genres)) {
    item.genres = [];
  }
  item.notes = 'Mega EverDrive';
  return item;
});

const combined = [...tgEd, ...meFixed];

fs.writeFile(
  path.join(__dirname, '../server/extra/everDrive.json'),
  JSON.stringify(combined, null, 2),
  error => {
    if (error) {
      console.log(chalk.red.bold(error));
    } else {
      console.log(chalk.green('EverDrive entries have been combined!'));
    }
  }
);
