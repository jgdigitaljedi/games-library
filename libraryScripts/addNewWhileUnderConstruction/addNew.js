const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const db = require('../../server/db');
const helper = require('../../server/routes/vg/vgHelpers');

const newGames = require('./newGames.json');

// newGames.forEach((game) => {
//   const now = helper.timeStamp();
//   game.createdAt = now;
//   game.updatedAt = now;
//   db.games.save(game);
// });

newGames.forEach((game) => {
  const now = helper.timeStamp();
  game.createdAt = now;
  game.updatedAt = now;
  game.extraData = [];
  game.extraDataFull = [];
  game.location = 'upstairs';
  game.handheld = false;
  db.gamesExtra.save(game);
});
