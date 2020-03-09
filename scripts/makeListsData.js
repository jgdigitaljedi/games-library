const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const games = require('../server/db/combinedGames.json');

const multiplayer = []; // games that are 3 or more players in multiplayer modes; party games
const extraData = []; // games with extra data; might be interesting
const launch = []; // launch titles
const exclusives = []; // console/platform exclusives
const special = []; // special categories

function writeError(error, source) {
  console.log(chalk.red.bold(`ERROR WRITING ${source} LIST: `, error));
}

function writeSuccess(source) {
  console.log(chalk.cyan(`${source} was successfully written!`));
}

games.forEach(game => {
  if (game.multiplayerNumber && game.multiplayerNumber >= 3) {
    multiplayer.push(game);
  }
  if (game.extraData && game.extraData.length > 0) {
    extraData.push(game);
  }
  if (game.extraDataFull && game.extraDataFull.length) {
    const edArr = game.extraDataFull;
    edArr.forEach(g => {
      if (g.isExclusive && g.isExclusive.length) {
        exclusives.push(game);
      }
      if (g.isLaunchTitle && g.isLaunchTitle.length) {
        launch.push(game);
      }
      if (g.special && g.special.length) {
        special.push(game);
      }
    });
  }
});

fs.writeFile(
  path.join(__dirname, '../server/db/listMultiplayer.json'),
  JSON.stringify(multiplayer),
  error => {
    if (error) {
      writeError(error, 'MULTIPLAYER');
    } else {
      writeSuccess('Multiplayer list');
    }
  }
);

fs.writeFile(
  path.join(__dirname, '../server/db/listExtraData.json'),
  JSON.stringify(extraData),
  error => {
    if (error) {
      writeError(error, 'EXTRA DATA');
    } else {
      writeSuccess('Extra data list');
    }
  }
);

fs.writeFile(
  path.join(__dirname, '../server/db/listLaunch.json'),
  JSON.stringify(launch),
  error => {
    if (error) {
      writeError(error, 'LAUNCH TITLES');
    } else {
      writeSuccess('Launch title list');
    }
  }
);

fs.writeFile(
  path.join(__dirname, '../server/db/listExclusives.json'),
  JSON.stringify(exclusives),
  error => {
    if (error) {
      writeError(error, 'EXCLUSIVES');
    } else {
      writeSuccess('Exclusives list');
    }
  }
);

fs.writeFile(
  path.join(__dirname, '../server/db/listSpecial.json'),
  JSON.stringify(special),
  error => {
    if (error) {
      writeError(error, 'SPECIAL');
    } else {
      writeSuccess('Special list');
    }
  }
);
