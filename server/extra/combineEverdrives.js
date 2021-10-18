const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
console.log('HERE');
const flatten = require('lodash/flatten');

const edMasterList = require('./everDrives/everdriveLoadersMasterList.json');

const fileReads = edMasterList.map(list => {
  try {
    const rawContents = fs.readFileSync(path.join(__dirname, `everDrives/${list.file}`));
    console.log(chalk.green.bold(`Getting games from ${list.file}...`));
    return JSON.parse(rawContents);
  } catch (error) {
    console.log(chalk.red.bold(`ERROR READING EVERDRIVE FILE ${list.file}`, error));
    return [];
  }
});

let idInc = 100000;
const flattened = flatten(fileReads).map(g => {
  g._id = idInc;
  idInc++;
  return g;
});

fs.writeFile(path.join(__dirname, 'everDrive.json'), JSON.stringify(flattened), 'utf8', error => {
  if (error) {
    console.log(chalk.red.bold('ERROR WRITING everdrive.json:', JSON.stringify(error)));
  } else {
    console.log(chalk.green('SUCCESSFULLY WROTE everdrive.json!'));
  }
});
