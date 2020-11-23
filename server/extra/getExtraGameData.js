const gameLocation = require('./consoleLocation');
const bc = require('backwardCompatible');

module.exports.getExtraGameData = (game) => {
  game.location = gameLocation.getLocation(game.id);
  let back;
  if (game.consoleId === 11 || game.consoleId === 12 || game.consoleId === 49) {
    back = bc.xboxBcCheck(game.id, game.consoleId === 11);
  } else {
    back = bc.bc(game.id);
  }
  // loop through bc data and add where belong; reference old scripts to figure out
  // get handheld data
  // get "other" data
  // add to stats collections
  // return game with extra data
  // eventually kill libraryScripts as migrations from other app won't be needed and this app will do everything on save
};
