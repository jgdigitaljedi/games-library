const fs = require('fs');
const path = require('path');
const bc = require('./backwardCompatible');
const games = require('../server/db/gamesExtra.json');
const chalk = require('chalk');
const _uniqBy = require('lodash/uniqBy');
const getLocation = require('./consoleLocation').getLocation;
const isHandheld = require('./handheldPlatforms').isHandheld;

function getGameNotes(cons) {
  return cons
    .map((con) => (con.notes && con.notes.length ? `${con.consoleName}: ${con.notes}` : null))
    .filter((c) => c)
    .join(', ');
}
const indexes = [];
const combined = games.reduce((acc, game, index) => {
  if (!game.id) {
    game.id = `9999${index}`;
  }
  console.log('id', game.id);
  game.compilation = false;
  if (!acc) {
    acc = [];
  }

  if (game && game.id >= 0) {
    const ind = indexes.indexOf(game.id);
    if (ind >= 0) {
      const theIds = acc[ind].consoleArr.map((c) => c.consoleId);
      if (theIds.indexOf(game.consoleId) < 0) {
        acc[ind].consoleArr.push({
          consoleName: game.consoleName,
          consoleId: game.consoleId,
          physical: game.physical,
          pricePaid: game.pricePaid,
          datePurchased: game.datePurchased,
          howAcquired: game.howAcquired,
          condition: game.condition,
          case: game.case,
          cib: game.cib,
          notes: game.notes,
          manual: game.manual,

        });
      }
      const xbBc = bc.xboxBcCheck(game.id, game.consoleId === 11);
      xbBc.forEach((c) => acc[ind].consoleArr.push(c));
      acc[ind].consoleArr.forEach((con) => {
        // const bcConsoles = bc(game.consoleIgdbId);
        const bcConsoles =
          con.consoleId && parseInt(con.consoleId) < 9000 ? bc.bc(con.consoleId) : [];
        bcConsoles.forEach((c) => {
          const caIds = acc[ind].consoleArr.map((g) => g.consoleId);
          if (caIds.indexOf(c.consoleId) < 0) {
            acc[ind].consoleArr.push(c);
          }
        });
      });
    } else {
      indexes.push(game.id);
      game.consoleArr = [
        {
          consoleName: game.consoleName,
          consoleId: game.consoleId,
          physical: game.physical,
          pricePaid: game.pricePaid,
          datePurchased: game.datePurchased,
          howAcquired: game.howAcquired,
          condition: game.condition,
          case: game.case,
          cib: game.cib,
          notes: game.notes
        }
      ];
      const bcConsoles = game.consoleId ? bc.bc(game.consoleId) : [];
      bcConsoles.forEach((c) => game.consoleArr.push(c));
      if (game.consoleId === 11 || game.consoleId === 12) {
        const xbBc = bc.xboxBcCheck(+game.id, +game.consoleId === 11);
        if (xbBc && xbBc.length) {
          // game.consoleArr = [...game.consoleArr, xbBc];
          xbBc.forEach((c) => {
            const xbIds = game.consoleArr.map((g) => g.consoleId);
            if (xbIds.indexOf(c.consoleId) < 0) {
              game.consoleArr.push(c);
            }
          });
        }
      }
      // @TODO: decide what to do for outer else
      acc.push(game);
    }
  } else {
    console.log('GAME MISSED:', game);
  }
  return acc;
}, []);

const physicalDigitalAssignment = (game) => {
  return game.consoleArr.map((con) => {
    if (!con.hasOwnProperty('physical')) {
      return 'backwardComp';
    }
    const pd = !!con.physical;
    return pd ? 'physical' : 'digital';
  });
};

const dedupe = combined.map((game) => {
  game.consoleArr = _uniqBy(game.consoleArr, 'consoleId');
  const pd = physicalDigitalAssignment(game);
  game.physicalDigital = pd;
  game.notes = getGameNotes(game.consoleArr);
  return game;
});

const withLocations = dedupe.map((game, index) => {
  const location = game.consoleArr.map((con) => {
    if (con && con.consoleId) {
      return getLocation(con.consoleId);
    } else {
      return 'upstairs';
    }
  });
  if (
    (location.indexOf('upstairs') >= 0 && location.indexOf('downstairs') >= 0) ||
    location.indexOf('both') >= 0
  ) {
    game.location = 'both';
  } else if (location.indexOf('upstairs') >= 0) {
    game.location = 'upstairs';
  } else {
    game.location = 'downstairs';
  }
  return game;
});

const handheldData = withLocations.map((game) => {
  // looking for games that are handheld only
  game.handheld = isHandheld(game);
  return game;
});

console.log(chalk.cyan.bold('HAS LENGTH OF', handheldData.length));

const writable = JSON.stringify(handheldData);

fs.writeFile(path.join(__dirname, '../server/db/combinedGames.json'), writable, (error) => {
  if (error) {
    console.log(chalk.red.bold('ERROR COMBINING DATA', error));
  } else {
    console.log(chalk.cyan('SUCCESSFULLY COMBINED DATA!'));
  }
});
