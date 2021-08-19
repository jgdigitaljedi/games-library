const db = require('../../../../db');
const _uniq = require('lodash/uniq');
const bc = require('../../../../extra/backwardCompatible');
const moment = require('moment');

function getGameNotes(cons) {
  return cons
    .map(con => (con.notes && con.notes.length ? `${con.consoleName}: ${con.notes}` : null))
    .filter(c => c)
    .join(', ');
}
let indexes = [];

module.exports.combine = function () {
  return new Promise((resolve, reject) => {
    try {
      indexes = [];
      const games = db.games.find();
      const combined = games.reduce((acc, game, index) => {
        if (!game.id) {
          game.id = parseInt(`9999${index}`);
        }
        if (!acc) {
          acc = [];
        }

        const id = typeof game.id === 'string' ? parseInt(game.id) : game.id;
        if (game && id >= 0) {
          const ind = indexes.indexOf(id);
          if (ind >= 0) {
            const theIds = acc[ind].consoleArr.map(c => c.consoleId);
            const accCurrentConsoleId = theIds.indexOf(game.consoleId);
            if (
              theIds.indexOf(game.consoleId) < 0 ||
              acc[ind].consoleArr[accCurrentConsoleId].isBc
            ) {
              acc[ind].consoleArr.push({
                consoleName: game.consoleName,
                consoleId: game.consoleId,
                physical: game.physical,
                pricePaid: game.pricePaid,
                datePurchased: game.datePurchased,
                howAcquired: game.howAcquired,
                condition: game.condition,
                case: game.case,
                caseType: game.caseType,
                cib: game.cib,
                notes: game.notes,
                manual: game.manual,
                handheld: game.handheld,
                location: game.location
              });
              if (
                !acc[ind]?.consoleArr[accCurrentConsoleId]?.isBc &&
                moment(game.datePurchased).isAfter(acc[ind].datePurchased)
              ) {
                acc[ind].datePurchased = game.datePurchased;
              }
            }
            const xbBc = bc.xboxBcCheck(id, game.consoleId === 11);
            xbBc.forEach(c => acc[ind].consoleArr.push(c));
            acc[ind].consoleArr.forEach(con => {
              const bcConsoles =
                con.consoleId && parseInt(con.consoleId) < 9000 ? bc.bc(con.consoleId) : [];
              bcConsoles.forEach(c => {
                const caIds = acc[ind].consoleArr.map(g => g.consoleId);
                if (caIds.indexOf(c.consoleId) < 0) {
                  acc[ind].consoleArr.push({ ...c, isBc: true });
                }
              });
            });
          } else {
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
                caseType: game.caseType,
                cib: game.cib,
                notes: game.notes,
                manual: game.manual,
                handheld: game.handheld,
                location: game.location
              }
            ];
            const bcConsoles = game.consoleId ? bc.bc(game.consoleId) : [];
            bcConsoles.forEach(c => {
              const cIds = game.consoleArr.map(con => con.consoleId);
              if (cIds.indexOf(c.consoleId) < 0) {
                game.consoleArr.push({ ...c, isBc: true });
              }
            });
            if (game.consoleId === 11 || game.consoleId === 12) {
              const xbBc = bc.xboxBcCheck(id, +game.consoleId === 11);
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
            indexes.push(id);
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
        game.consoleArr = _uniq(game.consoleArr, 'consoleId');
        const pd = physicalDigitalAssignment(game);
        game.physicalDigital = pd;
        game.notes = getGameNotes(game.consoleArr);
        return game;
      });

      const withLocations = dedupe.map((game, index) => {
        const location = game.consoleArr.map(con => {
          return game.location || 'upstairs';
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

      resolve(withLocations);
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
};
