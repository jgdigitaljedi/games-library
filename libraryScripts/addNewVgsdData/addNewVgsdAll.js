const fs = require('fs');
const path = require('path');
const games = require('../../server/db/games.json');
// const games = require('../backup/gamesBackup.json');
const chalk = require('chalk');
const _uniqBy = require('lodash/uniqBy');
const _uniq = require('lodash/uniq');
const _difference = require('lodash/difference');
const fileLookup = require('../../server/routes/vg/gamesHelpers/fileLookup');
const testOutputPath = path.join(__dirname, '../backup/gamesNew.json');
const diffOutputPath = path.join(__dirname, '../backup/diff.json');

(function () {
  // backup original games.json file for safety; comment out if db/games.json is in a bad state
  fs.writeFileSync(
    path.join(__dirname, '../backup/gamesBackup.json'),
    JSON.stringify(games),
    'utf-8'
  );

  const diffs = [];
  const newDataFiles = fileLookup.extraDataLists();
  const newDataArr = newDataFiles.map(nd => {
    if (nd.data) {
      nd.gameIds = nd.data.map(d => d.igdbId);
    } else {
      nd.gameIds = [];
    }
    return nd;
  });

  // loop through games, if has right consoleId, check if in file
  const newDataAdded = games.map(game => {
    try {
      // eslint-disable-next-line eqeqeq
      const conData = newDataArr.find(con => con.id == game.consoleId);
      const extraData = conData?.data;
      const dataIndex = extraData?.length ? conData.gameIds.indexOf(game.id) : -1;

      // evidently a few games didn't have this so making sure it's there
      if (!game.extraData) {
        game.extraData = [];
      }
      if (!game.extraDataFull) {
        game.extraDataFull = [];
      }

      if (dataIndex > -1) {
        console.log('asdasd', dataIndex);
        const newData = extraData[dataIndex];
        let newEdf = [];
        if (game?.extraDataFull?.length) {
          newEdf = _uniqBy([newData, ...game.extraDataFull], 'id');
        } else {
          newEdf = [newData];
        }
        const newDetails = _uniq([...newData.details, ...game.extraData]);

        // record as a diff for review
        if (_difference(newDetails, _uniq(game.extraData))) {
          diffs.push({ name: game.name, id: game.id, old: [...game.extraData], new: newDetails });
        }

        game.extraDataFull = Array.isArray(newEdf) ? newEdf : [newEdf];
        game.extraData = Array.isArray(newDetails) ? newDetails : [newDetails];
        return game;
      } else {
        return game;
      }
    } catch (err) {
      console.log(chalk.yellow('error game', JSON.stringify(game, null, 2)));
      console.log(chalk.red.bold('error message', err));
      throw err;
    }
  });
  fs.writeFile(testOutputPath, JSON.stringify(newDataAdded), error => {
    if (error) {
      console.log(chalk.red.bold('THERE WAS AN ERROR WRITING THE NEW FILE', error));
    } else {
      console.log(chalk.green('New file written successfully!'));
    }
    fs.writeFile(diffOutputPath, JSON.stringify(diffs, null, 2), err => {
      if (err) {
        console.log(chalk.yellow.bold('THERE WAS AN ERROR WRITING DIFFS'));
      } else {
        console.log(chalk.cyan('Diffs file written for review!'));
      }
      console.log(
        chalk.magentaBright.italic(
          'Make sure to verify diffs, then replace games db file with new data.'
        )
      );
    });
  });
})();
