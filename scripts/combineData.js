const fs = require('fs');
const path = require('path');
const bc = require('./backwardCompatible');
const games = require('../server/db/gamesExtra.json');
const chalk = require('chalk');

const indexes = [];
const combined = games.reduce((acc, game) => {
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
const writable = JSON.stringify(combined);

fs.writeFile(path.join(__dirname, '../server/db/combinedGames.json'), writable, error => {
  if (error) {
    console.log(chalk.red.bold('ERROR COMBINING DATA', error));
  } else {
    console.log(chalk.cyan('SUCCESSFULLY COMBINED DATA!'));
  }
});