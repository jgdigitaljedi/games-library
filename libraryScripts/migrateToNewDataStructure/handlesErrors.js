const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const helpers = require('./helpers');

let moreErrors = [];
let games = [];

let combined = [];
function combineErrors() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './errors'), (error, files) => {
      if (error) {
        console.log(chalk.red.bold('ERROR READING FILES***************'));
        console.log(chalk.red(error));
      } else {
        console.log('files', files);
        files.forEach((file, index) => {
          const contents = fs.readFileSync(path.join(__dirname, `./errors/${file}`), {
            encoding: 'utf-8'
          });
          JSON.parse(contents).forEach((c) => {
            combined.push(c.game);
          });

          if (index === files.length - 1) {
            fs.writeFile(
              path.join(__dirname, './masterErrors.json'),
              JSON.stringify(combined, null, 2),
              (error) => {
                if (error) {
                  console.log(chalk.red.bold('ERROR WRITING TO MASTER ERRORS FILE***********'));
                  console.log(chalk.red.bold(error));
                  reject(error);
                } else {
                  console.log(chalk.green('SUCCESS MAKING MASTER LIST!'));
                  resolve(combined);
                }
              }
            );
          }
        });
      }
    });
  });
}

function writeFiles() {
  console.log('WRITING FILES');
  fs.writeFile(
    path.join(__dirname, './results/noidsResults.json'),
    JSON.stringify(games, null, 2),
    (error) => {
      if (error) {
        console.log(chalk.red.bold('ERROR WRITING GAMES FILE*******************'));
        console.log(chalk.red(error));
      } else {
        console.log(chalk.green.bold('SUCCESS IN WRITING RESULTS!!'));
      }
    }
  );

  fs.writeFile(
    path.join(__dirname, './errors/noidsErrors.json'),
    JSON.stringify(games, null, 2),
    (error) => {
      if (error) {
        console.log(chalk.red.bold('ERROR WRITING ERRORS FILE*******************'));
        console.log(chalk.red(error));
      } else {
        console.log(chalk.green.bold('SUCCESS IN WRITING ERRORS!!'));
      }
    }
  );
}

function appendToResults(game) {
  fs.appendFile(
    path.join(__dirname, './results/noidsResults.json'),
    JSON.stringify(game, null, 2),
    (error) => {
      if (error) {
        console.log(chalk.red.bold('ERROR WRITING GAMES FILE*******************'));
        console.log(chalk.red(error));
        appendToErrors(game);
      } else {
        console.log(chalk.green.bold('SUCCESS IN WRITING RESULTS!!'));
      }
    }
  );
}
function appendToErrors(game) {
  fs.appendFile(
    path.join(__dirname, './errors/noidsErrors.json'),
    JSON.stringify(game, null, 2),
    (error) => {
      if (error) {
        console.log(chalk.red.bold('ERROR WRITING ERRORS FILE*******************'));
        console.log(chalk.red(error));
      } else {
        console.log(chalk.green.bold('SUCCESS IN WRITING ERRORS!!'));
      }
    }
  );
}

async function recursiveCalls(games, index, last) {
  const currentGame = games[index];
  if (
    currentGame &&
    currentGame.igdb &&
    (currentGame.igdb.id === 9999 ||
      currentGame.igdb.id === 99999 ||
      currentGame.igdb.id === '9999' ||
      currentGame.igdb.id === '99999')
  ) {
    moreErrors.push(currentGame);
  } else {
    // make call
    try {
      const data = await helpers.getNewGameData(currentGame);
      console.log(chalk.cyan(`SUCCESSFULLY FETCHED DATA FOR ${data.name}`));
      console.log('data', data);
      games.push(data);
      appendToResults(data);
    } catch (error) {
      console.log(chalk.red.bold('NEW ERROR FETCHING GAME DATA'));
      console.log(chalk.red(error));
      console.log('currentGame', currentGame);
      moreErrors.push(currentGame);
      appendToErrors(currentGame);
    }
  }
  const newIndex = index + 1;
  if (newIndex <= last) {
    setTimeout(() => {
      recursiveCalls(games, newIndex, last);
    }, 250);
  } else {
    console.log('in final write call');
    // writeFiles();
    // console.log(chalk.green('DONE!'));
  }
}

// helpers.refreshAppKey().then(() => {
//   combineErrors()
//     .then((results) => {
//       console.log('results', results);
//       const rLast = results.length - 1;
//       recursiveCalls(results, 0, rLast);
//     })
//     .catch((error) => {});
// });

helpers.refreshAppKey().then(() => {
  fs.readFile(path.join(__dirname, './noIds.json'), (err, data) => {
    if (err) {
      console.log(chalk.red.bold('ERROR READING NOIDS!'));
    } else {
      console.log('results', data);
      const results = JSON.parse(data);
      const rLast = results.length - 1;
      recursiveCalls(results, 0, rLast);
    }
  });
});
