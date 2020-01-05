const logger = require('../../config/logger');
const xbTo360 = require('../../xboxBc/XboxToXbox360.json');
const xbToOne = require('../../xboxBc/XboxToXboxOne.json');
const xb360ToOne = require('../../xboxBc/Xbox360ToXboxOne.json');

module.exports.xboxBackward = function(req, res) {
  if (req.body && req.body.platform && req.body.game) {
    try {
      const { platform, game } = req.body;
      if (platform === 11) {
        const bc1 = xbTo360.filter(g => g.igdbId === game);
        const bc2 = xbToOne.filter(g => g.igdbId === game);
        const result1 = bc1 && bc1.length ? bc1[0] : null;
        const result2 = bc2 && bc2.length ? bc2[0] : null;
        res.json({ xbox360ToOne: null, xboxToXbox360: result1, xboxToXboxOne: result2 });
      } else {
        const bc = xb360ToOne.filter(g => g.igdbId === game);
        const result = bc && bc.length ? bc[0] : null;
        res.json({ xbox360ToOne: result, xboxToXbox360: null, xboxToXboxOne: null });
      }
    } catch (error) {
      console.log('error', error);
      logger.log('error', error);
      res.status(503).json({
        error: true,
        message: 'ERROR: THERE WAS A PROBLEM PROCESSING THE BACKWARD COMPATIBILITY REQUEST!',
        code: error
      });
    }
  } else {
    console.log('error in request', req.body);
    res.status(503).json({
      error: true,
      message: 'ERROR: YOU MUST SEND BOTH A GAME ID AND PLATFORM ID!',
      code: null
    });
  }
};
