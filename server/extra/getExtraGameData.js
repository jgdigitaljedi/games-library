const gameLocation = require('./consoleLocation');
const bc = require('backwardCompatible');
const handheld = require('./handheldPlatforms');

module.exports.getExtraGameData = (game) => {
  // where is it played (location)
  game.location = gameLocation.getLocation(game.id);

  // is it backward compatible (consoleArr)
  let back;
  if (game.consoleId === 11 || game.consoleId === 12 || game.consoleId === 49) {
    back = bc.xboxBcCheck(game.id, game.consoleId === 11);
  } else {
    back = bc.bc(game.id);
  }
  if (back) {
    game.backwardCompatible = back;
  }

  // get "other" data

  // save to games.json

  // combine data

  // handheld or home console (handheld)
  // CAN'T DO HANDHELDS UNTIL DATA IS COMBINED SO CONSOLEARR EXISTS PROPERLY
  // handheld.isHandheld(game);

  // add to stats collections
  // return game with extra data
  // eventually kill libraryScripts as migrations from other app won't be needed and this app will do everything on save
};
