const games = require('../../db/combinedGames.json');

function makeList(which) {
  return games.filter((game) => {
    if (which === 'multiplayer') {
      if (game.maxMultiplayer && game.maxMultiplayer >= 3) {
        return true;
      }
    } else if (which === 'extraData') {
      if (game.extraData && game.extraData.length > 0) {
        return true;
      }
    } else if (which === 'multiplatform') {
      if (game.consoleArr && game.consoleArr.length > 1) {
        return true;
      }
    } else if (which === 'exclusives' || which === 'special' || which === 'launch') {
      if (game.extraDataFull && game.extraDataFull.length) {
        const edArr = game.extraDataFull;
        edArr
          .filter((g) => {
            if (which === 'exclusives' && g.isExclusive && g.isExclusive.length) {
              return true;
            }
            if (which === 'launch' && g.isLaunchTitle && g.isLaunchTitle.length) {
              return true;
            }
            if (which === 'special' && g.special && g.special.length) {
              return true;
            }
          })
          .filter((g) => g);
        return edArr.length;
      }
    }
  });
}

module.exports.getList = function (req, res) {
  try {
    if (req && req.body && req.body.which) {
      let theList;
      switch (req.body.which) {
        case 'exclusives':
          theList = makeList('exclusives');
          break;
        case 'extraData':
          theList = makeList('extraData');
          break;
        case 'launch':
          theList = makeList('launch');
          break;
        case 'multiplayer':
          theList = makeList('multiplayer');
          break;
        case 'special':
          theList = makeList('special');
          break;
        case 'multiplatform':
          theList = makeList('multiplatform');
          break;
        default:
          theList = [];
          break;
      }
      res.json(theList);
    } else {
      res.status(400).send('ERROR: Empty or bad request to fetch list.');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
