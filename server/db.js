const db = require('diskdb');
const path = require('path');
const dbPath = path.join(__dirname, 'db');

db.connect(dbPath, [
  'games',
  'consoles',
  'gameAcc',
  'clones',
  'collectibles',
  'hardware',
  'wlAccessories',
  'wlClones',
  'wlCollectibles',
  'wlGames',
  'wlHardware',
  'wlConsoles',
  'combinedGames',
  'gamesExtra',
  'listExclusives',
  'listExtraData',
  'listLaunch',
  'listMultiplayer',
  'listSpecial',
  'listMutliPlatform'
]);

module.exports = db;
