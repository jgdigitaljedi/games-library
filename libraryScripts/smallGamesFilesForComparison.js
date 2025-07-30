const fs = require('node:fs');
const path = require('node:path');
const games = require('../server/db/games.json');
const newGames = require('../server/db/gamesNew.json');

const start = 200;
const limit = 200;

(function () {
  const gamesShort = games.slice(start, start + limit);
  const newGamesShort = newGames.slice(start, start + limit);

  fs.writeFileSync(
    path.join(__dirname, './scriptsOutput/gamesShort.json'),
    JSON.stringify(gamesShort, null, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, './scriptsOutput/gamesNewShort.json'),
    JSON.stringify(newGamesShort, null, 2)
  );
})();
