const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _uniq = require('lodash/uniq');

const tgEd = require('../server/extra/everDrives/turboEverdrive.json');
const megaEd = require('../server/extra/everDrives/megaEverdriveGames.json');

const tgSpecial = require('./data/TurboGrafx16.json');
const tgSpecialIds = idArray(tgSpecial);

const genSpecial = require('./data/SegaGenesis.json');
const genSpecialIds = idArray(genSpecial);

function getJoinedId(game, collectionList) {
  let igdb, gb;
  if (collectionList) {
    igdb = game.igdb && game.igdb.id && typeof game.igdb.id === 'number' ? game.igdb.id : 9999;
    gb = game.gb && game.gb.gbid && typeof game.gb.gbid === 'number' ? game.gb.gbid : 9999;
  } else {
    igdb = typeof game.igdbId === 'number' ? game.igdbId : 9999;
    gb = typeof game.gbId === 'number' ? game.gbId : 9999;
    return `${igdb}${gb}`;
  }
  return `${igdb}${gb}`;
}

function idArray(arr) {
  return arr.map(g => getJoinedId(g));
}

function exclusiveAndLaunch(games, ids, list) {
  return games.map(game => {
    const gameJoinedId = getJoinedId(game, true);
    const listIndex = ids.indexOf(gameJoinedId);
    if (listIndex >= 0) {
      const selected = list[listIndex];
      game.isExclusive = selected.isExclusive ? [selected.isExclusive[0]] : false;
      game.isLaunchTitle = selected.isLaunchTitle ? [selected.isLaunchTitle[0]] : false;
      game.extraData = _uniq(selected.details);
      game.extraDataFull = [selected];
    } else {
      game.isExclusive = false;
      game.isLaunchTitle = false;
      game.extraData = [];
      game.extraDataFull = [];
    }
    return game;
  });
}

const meFixed = megaEd.map(item => {
  if (!item.igdb.genres || !Array.isArray(item.igdb.genres)) {
    item.genres = [];
  }
  item.notes = 'Mega EverDrive';
  return item;
});

const tgEL = exclusiveAndLaunch(tgEd, tgSpecialIds, tgSpecial);
const genEL = exclusiveAndLaunch(meFixed, genSpecialIds, genSpecial);

const combined = [...tgEL, ...genEL];

fs.writeFile(
  path.join(__dirname, '../server/extra/everDrive.json'),
  JSON.stringify(combined),
  error => {
    if (error) {
      console.log(chalk.red.bold(error));
    } else {
      console.log(chalk.green('EverDrive entries have been combined!'));
    }
  }
);