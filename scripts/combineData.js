const fs = require('fs');
const path = require('path');
const _flatten = require('lodash/flatten');

const fileLookup = require('./fileLookup').getFileRef;
const bc = require('./backwardCompatible');
const games = require('../server/db/games.json');

// sort the games by console first to make iterating through files more efficient
const sorted = games.reduce((acc, obj) => {
  if (acc[obj.consoleIgdbId.toString()]) {
    acc[obj.consoleIgdbId.toString()].push(obj);
  } else {
    acc[obj.consoleIgdbId.toString()] = [obj];
  }
  return acc;
}, {});

const keys = Object.keys(sorted);

const supp = keys.map(key => {
  const file = fileLookup(key);
  if (file) {
    const ids = file.map(f => f.igdbId);
    return sorted[key].map(game => {
      if (game && game.igdb && game.igdb.id) {
        const index = ids.indexOf(game.igdb.id);
        if (game.extraData) {
          game.extraDataFull = [...game.extraDataFull, ...file[index]];
          game.extraData = [...game.extraData, ...file[index].details];
        } else {
          if (file[index]) {
            game.extraData = file[index].details;
            game.extraDataFull = file[index];
          } else {
            game.extraData = [];
            game.extraDataFull = [];
          }
        }
      }
      return game;
    });
  } else {
    return sorted[key];
  }
});

const flat = _flatten(supp);
const indexes = [];
const combined = flat.reduce((acc, game) => {
  if (!acc) {
    acc = [];
  }
  if (game && game.igdb && game.igdb.id) {
    const ind = indexes.indexOf(game.igdb.id);
    if (ind >= 0) {
      const theIds = acc[ind].consoleArr.map(c => c.consoleId);
      if (theIds.indexOf(game.consoleIgdbId) < 0) {
        acc[ind].consoleArr.push({ consoleName: game.consoleName, consoleId: game.consoleIgdbId });
      }
      const xbBc = bc.xboxBcCheck(game.igdb.id, game.consoleIgdbId === 11);
      xbBc.forEach(c => acc[ind].consoleArr.push(c));
      acc[ind].consoleArr.forEach(con => {
        // const bcConsoles = bc(game.consoleIgdbId);
        const bcConsoles = bc.bc(con.consoleId);
        bcConsoles.forEach(c => {
          const caIds = acc[ind].consoleArr.map(g => g.consoleId);
          if (caIds.indexOf(c.consoleId) < 0) {
            acc[ind].consoleArr.push(c);
          }
        });
      });
    } else {
      indexes.push(game.igdb.id);
      game.consoleArr = [{ consoleName: game.consoleName, consoleId: game.consoleIgdbId }];
      const bcConsoles = bc.bc(game.consoleIgdbId);
      bcConsoles.forEach(c => game.consoleArr.push(c));
      if (game.consoleIgdbId === 11 || game.consoleIgdbId === 12) {
        const xbBc = bc.xboxBcCheck(+game.igdb.id, +game.consoleIgdbId === 11);
        if (xbBc && xbBc.length) {
          // game.consoleArr = [...game.consoleArr, xbBc];
          xbBc.forEach(c => {
            const xbIds = game.consoleArr.map(g => g.consoleId);
            if (xbIds.indexOf(c.consoleId) < 0) {
              game.consoleArr.push(c);
            }
          });
        }
      }
      // @TODO: decide what to do for outer else
      acc.push(game);
    }
  }
  return acc;
}, []);
const writable = JSON.stringify(combined, null, 2);

fs.writeFile(path.join(__dirname, '../server/db/combinedGames.json'), writable, error => {
  console.log('error', error);
});
