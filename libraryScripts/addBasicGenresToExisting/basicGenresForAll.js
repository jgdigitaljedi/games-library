const getBasicGenre = require('../../server/extra/utils/getBasicGenresFromName').getBasicGenre;
const _uniq = require('lodash/uniq');
const _cloneDeep = require('lodash/cloneDeep');
const games = require('../../server/db/games.json');
const everdrives = require('../../server/extra/everDrive.json');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function getGenreReturnGame(game) {
  if (game.name) {
    const basicGenres = getBasicGenre(game.name);
    const existingGenres = game.genres || [];
    const newGenres = _uniq([...existingGenres, ...basicGenres].filter(g => g));
    const gCopy = _cloneDeep(game);
    gCopy.genres = newGenres;
    gCopy.genresDisplay = newGenres.join(', ');
    return gCopy;
  }
  return game;
}

const gamesFixed = games.map(game => getGenreReturnGame(game));
const edsFixed = everdrives.map(game => getGenreReturnGame(game));

fs.writeFile(
  path.join(__dirname, '../../server/db/games.json'),
  JSON.stringify(gamesFixed),
  error => {
    if (error) {
      console.log(chalk.red.bold('ERROR WRITING games.json', error));
    } else {
      console.log(chalk.green.bold('Successfully wrote games.json with basic genres added!'));
    }
  }
);

fs.writeFile(
  path.join(__dirname, '../../server/extra/everDrive.json'),
  JSON.stringify(edsFixed),
  error => {
    if (error) {
      console.log(chalk.red.bold('ERROR WRITING everDrive.json', error));
    } else {
      console.log(chalk.green.bold('Successfully wrote everDrive.json with basic genres added!'));
    }
  }
);
