const moment = require('moment');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const parse = require('csv-parse');
const games = require('../db/games.json');
const platforms = require('../db/consoles.json');
const clones = require('../db/clones.json');
// const accessories = require('../db/gameAcc.json');
// const collectibles = require('../db/collectibles.json');

const csvPath = path.join(__dirname, './csvDumps');

function getLatestDump() {
  try {
    const dumps = fs.readdirSync(csvPath, 'utf8');
    const mostRecent = dumps
      .sort((a, b) => {
        const aDate = a.split('_')[0];
        const bDate = b.split('_')[0];
        return moment(aDate).diff(bDate);
      })
      .reverse()[0];
    return { error: false, data: mostRecent };
  } catch (error) {
    return { error: true, message: 'ERROR READING GAMEYE CSV DIRECTORY', code: error };
  }
}

function csvRowToJson(rowData) {
  return {
    platform: rowData[0],
    type: rowData[1],
    quantity: rowData[2],
    title: rowData[5],
    status: rowData[9],
    myValue: rowData[13]
  };
}

function csvToJson(fileName) {
  return new Promise((resolve, reject) => {
    const parsedReturn = { platforms: [], games: [], accessories: [], collectibles: [], other: [] };
    try {
      fs.createReadStream(path.join(csvPath, fileName))
        .pipe(parse({ delimiter: ',', trim: true }))
        .on('data', csvRow => {
          const rowJson = csvRowToJson(csvRow);
          switch (rowJson.type) {
            case 'VideoGame':
              parsedReturn.games.push(rowJson);
              break;
            case 'System':
              parsedReturn.platforms.push(rowJson);
              break;
            case 'Peripheral':
              parsedReturn.accessories.push(rowJson);
              break;
            case 'Toys To Life':
              parsedReturn.collectibles.push(rowJson);
              break;
            default:
              parsedReturn.other.push(rowJson);
              break;
          }
        })
        .on('error', err => {
          console.log(chalk.red('ERROR PARSING LINE'));
          console.log(chalk.red(err.name));
          console.log(chalk.red(err.message));
        })
        .on('end', () => {
          resolve(parsedReturn);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function geToGameMatch(geGames) {
  const combinedData = games.map(game => {});
}

function geToPlatformMatch(gePlatforms) {}

(async function () {
  const mostRecent = getLatestDump();
  if (mostRecent.error) {
    console.log(chalk.red.bold(mostRecent.message));
    console.log(chalk.red(mostRecent.code));
  } else {
    let csvData;

    try {
      csvData = await csvToJson(mostRecent.data);
    } catch (error) {
      console.log(chalk.red.bold('ERROR READING CSV DATA'));
      console.log(chalk.red(error));
      return;
    }

    console.log(JSON.stringify(csvData, null, 2));
    try {
      fs.writeFileSync(path.join(__dirname, 'csvToJson.json'), JSON.stringify(csvData, null, 2));
    } catch (error) {
      console.log(chalk.red.bold('ERROR WRITING JSON FILE FOR RAW RESULTS'));
      console.log(chalk.red(error));
      return;
    }
  }
})();
