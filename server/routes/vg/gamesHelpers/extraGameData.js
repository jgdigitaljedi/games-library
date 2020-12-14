const _cloneDeep = require('lodash/cloneDeep');
const fileLookup = require('./fileLookup').getFileRef;
const ps1ToPs2 = require('../../../extra/otherData/ps1ToPs2Bc.json');
const banned = require('../../../extra/otherData/bannedInternationally.json');
const getLocation = require('./consoleLocation').getLocation;
const handhelds = require('./handhelds').isHandheld;

module.exports.getExtraData = (gameData) => {
  const game = _cloneDeep(gameData);
  game.extraData = [];
  game.extraDataFull = [];
  const file = fileLookup(game.consoleId);

  if (file) {
    const ids = file.map((f) => f.igdbId);
    if (game && game.id) {
      const index = ids.indexOf(game.id);
      if (game.extraData && index > -1) {
        game.extraDataFull = [...game.extraDataFull, file[index]];
        game.extraData = [...game.extraData, ...file[index].details];
      } else {
        if (file[index]) {
          game.extraData = file[index].details;
          game.extraDataFull = [file[index]];
        } else {
          game.extraData = [];
          game.extraDataFull = [];
        }
      }
    } else {
      game.extraData = [];
      game.extraDataFull = [];
    }
  }

  const psIds = ps1ToPs2.map((p) => p.igdbId);
  const bannedIds = banned.map((b) => b.igdbId);

  // check if PS1 game by igdbId of 7
  if (game.consoleId === 7 && psIds.indexOf(game.id) >= 0) {
    const ind = psIds.indexOf(game.id);
    if (game.extraData && game.extraData.length) {
      game.extraData = [...game.extraData, ...ps1ToPs2[ind].details];
      game.extraDataFull = [...game.extraDataFull, ...ps1ToPs2[ind]];
    } else {
      game.extraData = ps1ToPs2[ind].details;
      game.extraDataFull = [ps1ToPs2[ind]];
    }
  }

  // now check banned internationally file as it isn't console specific
  const bannedInd = bannedIds.indexOf(game.id);
  if (bannedInd >= 0) {
    if (game.extraData && game.extraData.length) {
      game.extraData = [...game.extraData, ...banned[bannedInd].details];
      game.extraDataFull = [...game.extraDataFull, banned[bannedInd]];
    } else {
      game.extraData = banned[bannedInd].details;
      game.extraDataFull = [banned[bannedInd]];
    }
  }
  game.location = getLocation(game.consoleId);
  game.handheld = handhelds(game.consoleId, game.consoleName);
  return game;
};
