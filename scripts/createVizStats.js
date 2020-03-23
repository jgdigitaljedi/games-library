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
      isExclusive: 0
    };
  }
}

function handleSpecial(data) {
  if (data && data.length) {
    data.forEach(d => {
      // Genesis extras
      if (d.value === 'Sega Genesis/Mega Drive black box grid game') {
        inCollectionExtra('Sega Mega Drive/Genesis');
        if (!inCollection['Sega Mega Drive/Genesis'].blackBoxGrid) {
          inCollection['Sega Mega Drive/Genesis'].blackBoxGrid = 1;
        } else {
          inCollection['Sega Mega Drive/Genesis'].blackBoxGrid++;
        }
      }

      if (d.value === 'Sega Genesis Team Player compatible title') {
        inCollectionExtra('Sega Mega Drive/Genesis');
        if (!inCollection['Sega Mega Drive/Genesis'].teamPlayer) {
          inCollection['Sega Mega Drive/Genesis'].teamPlayer = 1;
        } else {
          inCollection['Sega Mega Drive/Genesis'].teamPlayer++;
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
    setTimeout(() => {
      console.log('inCollection', inCollection);
    });
  })
  .catch(error => {
    console.log(chalk.red.bold("CAN'T GET VIZ STATS IF MASTER DATA SCRIPTS WON'T FINISH!!"));
    console.log('error', error);
  });
