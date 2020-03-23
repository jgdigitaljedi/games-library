const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const createMaster = require('./createVizStatsMaster').createMaster;
const _get = require('lodash/get');

const games = require('../server/db/gamesExtra.json');

const inCollection = {};

function handleGame(data, which) {
  const platform = _get(data, `${which}.[0].name`);
  if (platform && !inCollection.hasOwnProperty(platform)) {
    inCollection[platform] = {
      isLaunchTitle: 0,
      isExclusive: 0
    };
  }
  if (platform) {
    inCollection[platform][which]++;
  }
}

function inCollectionExtra(platform) {
  if (!inCollection.hasOwnProperty(platform)) {
    inCollection[platform] = {
      isLaunchTitle: 0,
      isExclusive: 0,
      special: {}
    };
  } else if (inCollection[platform] && !inCollection[platform].special) {
    inCollection[platform].special = {};
  }
}

function handleSpecial(data) {
  if (data && data.length) {
    data.forEach(d => {
      // Genesis extras
      if (d.value === 'Sega Genesis/Mega Drive black box grid game') {
        inCollectionExtra('Sega Mega Drive/Genesis');
        if (!inCollection['Sega Mega Drive/Genesis'].special.blackBoxGrid) {
          inCollection['Sega Mega Drive/Genesis'].special.blackBoxGrid = {
            count: 1,
            text: 'Sega Mega Drive/Genesis black box grid'
          };
        } else {
          inCollection['Sega Mega Drive/Genesis'].special.blackBoxGrid.count++;
        }
      }

      if (d.value === 'Sega Genesis Team Player compatible title') {
        inCollectionExtra('Sega Mega Drive/Genesis');
        if (!inCollection['Sega Mega Drive/Genesis'].special.teamPlayer) {
          inCollection['Sega Mega Drive/Genesis'].special.teamPlayer = {
            count: 1,
            text: 'Sega Genesis Team Player compatible title'
          };
        } else {
          inCollection['Sega Mega Drive/Genesis'].special.teamPlayer.count++;
        }
      }

      // nes extras
      if (d.value === 'NES hang tab game') {
        inCollectionExtra('Nintendo Entertainment System (NES)');
        if (!inCollection['Nintendo Entertainment System (NES)'].special.hangTabGame) {
          inCollection['Nintendo Entertainment System (NES)'].special.hangTabGame = {
            count: 1,
            text: 'NES hang tab game'
          };
        } else {
          inCollection['Nintendo Entertainment System (NES)'].special.hangTabGame.count++;
        }
      }

      if (d.value === 'NES Four Score compatible title') {
        inCollectionExtra('Nintendo Entertainment System (NES)');
        if (!inCollection['Nintendo Entertainment System (NES)'].special.fourScore) {
          inCollection['Nintendo Entertainment System (NES)'].special.fourScore = {
            count: 1,
            text: 'NES Four Score compatible title'
          };
        } else {
          inCollection['Nintendo Entertainment System (NES)'].special.fourScore.count++;
        }
      }

      if (d.value.indexOf('NES black box game') >= 0) {
        inCollectionExtra('Nintendo Entertainment System (NES)');
        if (!inCollection['Nintendo Entertainment System (NES)'].special.blackBox) {
          inCollection['Nintendo Entertainment System (NES)'].special.blackBox = {
            count: 1,
            text: 'NES black box game'
          };
        } else {
          inCollection['Nintendo Entertainment System (NES)'].special.blackBox.count++;
        }
      }

      // playstation extras
      if (d.value.indexOf('Sony PlayStation multitap compatible title') >= 0) {
        inCollectionExtra('Sony PlayStation');
        if (!inCollection['Sony PlayStation'].special.multitap) {
          inCollection['Sony PlayStation'].special.multitap = {
            count: 1,
            text: 'Sony PlayStation multitap compatible title'
          };
        } else {
          inCollection['Sony PlayStation'].special.multitap.count++;
        }
      }

      // snes extras
      if (d.value.indexOf('SNES Super Multitap compatible title') >= 0) {
        inCollectionExtra('Super Nintendo Entertainment System (SNES)');
        if (!inCollection['Super Nintendo Entertainment System (SNES)'].special.multitap) {
          inCollection['Super Nintendo Entertainment System (SNES)'].special.multitap = {
            count: 1,
            text: 'SNES Super Multitap compatible title'
          };
        } else {
          inCollection['Super Nintendo Entertainment System (SNES)'].special.multitap.count++;
        }
      }

      // tg16 extras
      if (d.value.indexOf('TurboGrafx-16 Multitap compatible title') >= 0) {
        inCollectionExtra('TurboGrafx-16/PC Engine');
        if (!inCollection['TurboGrafx-16/PC Engine'].special.multitap) {
          inCollection['TurboGrafx-16/PC Engine'].special.multitap = {
            count: 1,
            text: 'TurboGrafx-16 Multitap compatible title'
          };
        } else {
          inCollection['TurboGrafx-16/PC Engine'].special.multitap.count++;
        }
      }
    });
  }
}

// now to get counts for games collection
createMaster()
  .then(result => {
    games.forEach(game => {
      const extraData = game.extraDataFull;

      if (extraData && extraData.length) {
        extraData.forEach(ed => {
          if (ed.isLaunchTitle && ed.isLaunchTitle.length) {
            handleGame(ed, 'isLaunchTitle');
          }
          if (ed.isExclusive) {
            handleGame(ed, 'isExclusive');
          }
          if (ed.special && ed.special.length) {
            handleSpecial(ed.special);
          }
        });
      }
    });
    fs.writeFile(
      path.join(__dirname, '../server/db/gameStats.json'),
      JSON.stringify(inCollection, null, 2),
      error => {
        if (error) {
          console.log(chalk.red('ERROR WRITING USER STATS', error));
        } else {
          console.log(chalk.cyan('USER STATS SUCCESSFULLY WRITTEN!!'));
        }
      }
    );
  })
  .catch(error => {
    console.log(chalk.red.bold("CAN'T GET VIZ STATS IF MASTER DATA SCRIPTS WON'T FINISH!!"));
    console.log('error', error);
  });
