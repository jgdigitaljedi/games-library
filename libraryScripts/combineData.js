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
    .map(con => (con.notes && con.notes.length ? `${con.consoleName}: ${con.notes}` : null))
    .filter(c => c)
    .join(', ');
}

const indexes = [];
const combined = games.reduce((acc, game, index) => {
  if (parseInt(game.igdb.id) === 9999) {
    game.igdb.id = parseInt(`${game.igdb.id}${index}`);
  }
  game.compilation = null;
  if (!acc) {
    acc = [];
  }

  if (game && game.igdb && game.igdb.id) {
    const ind = indexes.indexOf(game.igdb.id);
    if (ind >= 0) {
      const theIds = acc[ind].consoleArr.map(c => c.consoleId);
      if (theIds.indexOf(game.consoleIgdbId) < 0) {
        acc[ind].consoleArr.push({
          consoleName: game.consoleName,
          consoleId: game.consoleIgdbId,
          physical: game.physical,
          pricePaid: game.pricePaid,
          datePurchased: game.datePurchased,
          howAcquired: game.howAcquired,
          condition: game.condition,
          case: game.case,
          cib: game.cib,
          notes: game.notes
        });
      }
      const xbBc = bc.xboxBcCheck(game.igdb.id, game.consoleIgdbId === 11);
      xbBc.forEach(c => acc[ind].consoleArr.push(c));
      acc[ind].consoleArr.forEach(con => {
        // const bcConsoles = bc(game.consoleIgdbId);
        const bcConsoles =
          con.consoleId && parseInt(con.consoleId) < 9000 ? bc.bc(con.consoleId) : [];
        bcConsoles.forEach(c => {
          const caIds = acc[ind].consoleArr.map(g => g.consoleId);
          if (caIds.indexOf(c.consoleId) < 0) {
            acc[ind].consoleArr.push(c);
          }
        });
      });
    } else {
      indexes.push(game.igdb.id);
      game.consoleArr = [
        {
          consoleName: game.consoleName,
          consoleId: game.consoleIgdbId,
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
      const bcConsoles =
        game.consoleIgdbId && parseInt(game.consoleIgdbId) < 9000 ? bc.bc(game.consoleIgdbId) : [];
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
  } else {
    console.log('GAME MISSED:', game);
  }
  return acc;
}, []);

const physicalDigitalAssignment = game => {
  return game.consoleArr.map(con => {
    if (!con.hasOwnProperty('physical')) {
      return 'backwardComp';
    }
    const pd = !!con.physical;
    return pd ? 'physical' : 'digital';
  });
};

const dedupe = combined.map(game => {
  game.consoleArr = _uniqBy(game.consoleArr, 'consoleId');
  const pd = physicalDigitalAssignment(game);
  game.physicalDigital = pd;
  game.notes = getGameNotes(game.consoleArr);
  return game;
});

const withLocations = dedupe.map((game, index) => {
  const location = game.consoleArr.map(con => {
    return getLocation(con.consoleId);
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

const handheldData = withLocations.map(game => {
  // looking for games that are handheld only
  game.handheld = isHandheld(game);
  return game;
});

const writable = JSON.stringify(handheldData);

fs.writeFile(path.join(__dirname, '../server/db/combinedGames.json'), writable, error => {
  if (error) {
    console.log(chalk.red.bold('ERROR COMBINING DATA', error));
  } else {
    console.log(chalk.cyan('SUCCESSFULLY COMBINED DATA!'));
  }
});
