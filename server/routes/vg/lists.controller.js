const _sortBy = require('lodash/sortBy');
const combined = require('./vgCrud/gamesSupp/combineGames').combine;

function greatestHitsOnly(ed) {
  console.log('ed', ed);
  return (
    ed.filter(
      g =>
        g.indexOf('Greatest Hits') > -1 ||
        g.indexOf('Nintendo Select') > -1 ||
        g.indexOf("Player's Choice") > -1
    ).length > 0
  );
}

function makeList(which, games) {
  console.log('which', which);
  return games.filter(game => {
    if (which === 'multiplayer') {
      if (game.maxMultiplayer && game.maxMultiplayer >= 3) {
        return true;
      }
    } else if (which === 'cib') {
      return game.consoleArr.map(g => g.cib).filter(g => g).length > 0;
    } else if (which === 'extraData') {
      if (game.extraData && game.extraData.length > 0) {
        return true;
      }
    } else if (which === 'multiplatform') {
      if (game.consoleArr && game.consoleArr.length > 1) {
        return true;
      }
    } else if (which === 'sealed') {
      return game.notes.toLowerCase().indexOf('sealed') > -1;
    } else if (which === 'free') {
      return game.notes.toLowerCase().indexOf('free') > -1;
    } else if (which === 'hits' && game.extraData?.length) {
      return greatestHitsOnly(game.extraData);
    } else if (which === 'exclusives' || which === 'special' || which === 'launch') {
      if (game.extraDataFull && game.extraDataFull.length) {
        const edArr = game.extraDataFull;
        return edArr
          .filter(g => {
            if (which === 'exclusives' && g.isExclusive && g.isExclusive.length) {
              return true;
            } else if (which === 'launch' && g.isLaunchTitle && g.isLaunchTitle.length) {
              return true;
            } else if (which === 'special' && g.special && g.special.length) {
              return true;
            }
            return false;
          })
          .filter(g => g).length;
        // return edArr.length;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
}

module.exports.getList = function (req, res) {
  try {
    if (req && req.body && req.body.which) {
      combined()
        .then(result => {
          let theList;
          switch (req.body.which) {
            case 'exclusives':
              theList = makeList('exclusives', result);
              break;
            case 'extraData':
              theList = makeList('extraData', result);
              break;
            case 'launch':
              theList = makeList('launch', result);
              break;
            case 'multiplayer':
              theList = makeList('multiplayer', result);
              break;
            case 'special':
              theList = makeList('special', result);
              break;
            case 'multiplatform':
              theList = makeList('multiplatform', result);
              break;
            case 'cib':
              theList = makeList('cib', result);
              break;
            case 'sealed':
              theList = makeList('sealed', result);
              break;
            case 'free':
              theList = makeList('free', result);
              break;
            case 'hits':
              theList = makeList('hits', result);
              break;
            default:
              theList = [];
              break;
          }
          res.json(_sortBy(theList, 'consoleName'));
        })
        .catch(error => {
          res.status(503).send(error);
        });
    } else {
      res.status(400).send('ERROR: Empty or bad request to fetch list.');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
