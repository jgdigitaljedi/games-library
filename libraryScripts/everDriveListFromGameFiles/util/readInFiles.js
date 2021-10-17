const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _flatten = require('lodash/flatten');

module.exports.readIn = async (folderPath, subs) => {
  let subDirs = [];
  if (subs?.length) {
    subDirs = await Promise.all(
      subs.map(async dir => {
        try {
          return await fs.readdirSync(path.join(folderPath, dir));
        } catch (err) {
          console.log(chalk.red.bold(`ERROR READING SUB DIRECTORY ${dir}`));
        }
      })
    );
  }
  try {
    const flatSubs = subDirs?.length ? _flatten(subDirs) : [];
    const main = await fs.readdirSync(folderPath, { withFileTypes: true });
    const cleaned = main
      .filter(file => file.isFile())
      .map(file => {
        const fSplit = file.name.split('.');
        const fNoExt = fSplit.slice(0, -1);
        return fNoExt.join(' ');
      });
    return Promise.resolve([...cleaned, ...flatSubs].sort());
  } catch (error) {
    return Promise.resolve({ error: true, message: 'ERROR READING FILES AT PATH: ', folderPath });
  }
};
