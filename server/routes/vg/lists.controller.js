const exlcusives = require('../../db/listExclusives.json');
const extraData = require('../../db/listExtraData.json');
const launch = require('../../db/listLaunch.json');
const multiplayer = require('../../db/listMultiplayer.json');
const special = require('../../db/listSpecial.json');

module.exports.getList = function(req, res) {
  try {
    if (req && req.body && req.body.which) {
      let theList;
      switch (req.body.which) {
        case 'exclusives':
          theList = exlcusives;
          break;
        case 'extraData':
          theList = extraData;
          break;
        case 'launch':
          theList = launch;
          break;
        case 'multiplayer':
          theList = multiplayer;
          break;
        case 'special':
          theList = special;
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
