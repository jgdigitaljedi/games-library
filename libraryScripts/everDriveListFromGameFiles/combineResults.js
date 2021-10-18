// use this once your results folder is ready to combine into 1 new everdrive file for the app
// NOTE: once you create this file, copy to everdrives folder and ADD TO MASTER LIST!
const { readIn } = require('./util/readInFiles');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const _flatten = require('lodash/flatten');
const _sortBy = require('lodash/sortBy');

const edFilesPath = path.join(__dirname, 'results');

// change this to suit needs
const writeOutFileName = 'GBAEverDrive.json';

function readInSingleFile(fileName) {
  return new Promise((resolve, reject) => {
    try {
      const jsonFile = require(path.join(__dirname, `results/${fileName}.json`));
      resolve(jsonFile);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const edGamesFiles = await readIn(edFilesPath);
  Promise.all(edGamesFiles.map(file => readInSingleFile(file))).then(async results => {
    const flatAndSorted = _sortBy(_flatten(results), 'name');
    await fs.writeFileSync(
      path.join(__dirname, `final/${writeOutFileName}`),
      JSON.stringify(flatAndSorted)
    );
    console.log(chalk.green.bold(`WROTE ${flatAndSorted.length} GAMES TO ${writeOutFileName}!`));
  });
})();
