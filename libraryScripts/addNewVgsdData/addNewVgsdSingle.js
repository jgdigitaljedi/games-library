const fs = require('fs');
const path = require('path');
const games = require('../../server/db/games.json');
const chalk = require('chalk');
const _uniqBy = require('lodash/uniqBy');
const _uniq = require('lodash/uniq');

const consoleListWithNewData = require('../../server/extra/consoleSpecificGameData/Nintendo3DS.json');

const newDataConsoleIdgbId = 37;
const testOutputPath = path.join(__dirname, '../backup/gamesNew.json');

(function () {
  // backup original games.json file for safety
  // fs.writeFileSync(
  //   path.join(__dirname, '../backup/gamesBackup.json'),
  //   JSON.stringify(games),
  //   'utf-8'
  // );

  // create array of ids for new list for quick checking
  const gamesIds = consoleListWithNewData.map(game => game.igdbId);

  // loop through games, if has right consoleId, check if in file
  const newDataAdded = games.map(game => {
    const dataIndex = gamesIds.indexOf(game.id);
    if (game.consoleId === newDataConsoleIdgbId && dataIndex > -1) {
      console.log('dataIndex', dataIndex);
      const newData = consoleListWithNewData[dataIndex];
      let newEdf = [];
      if (game?.extraDataFull?.length) {
        newEdf = _uniqBy([newData, ...game.extraDataFull], 'details');
      } else {
        newEdf = [newData];
      }
      const newDetails = _uniq([...newData.details, ...game.extraData]);
      game.extraDataFull = Array.isArray(newEdf) ? newEdf : [newEdf];
      game.extraData = Array.isArray(newDetails) ? newDetails : [newDetails];
      return game;
    } else {
      return game;
    }
  });
  fs.writeFile(testOutputPath, JSON.stringify(newDataAdded), error => {
    if (error) {
      console.log(chalk.red.bold('THERE WAS AN ERROR WRITING THE NEW FILE', error));
    } else {
      console.log(chalk.green('New file written successfully!'));
    }
  });
})();
