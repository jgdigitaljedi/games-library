const db = require('../../db');
const helper = require('./vgHelpers');
const logger = require('../../config/logger');

module.exports.getBg = function(req, res) {
  try {
    const games = db.vgBeatGames.find();
    res.json(games);
  } catch (err) {
    logger.logThis(req, err);
    res.status(500).json({ error: true, message: 'ERROR FETCHING BEATEN GAMES!', code: err });
  }
};

module.exports.saveBg = function(req, res) {
  try {
    const newGame = req.body.game;
    const now = helper.timeStamp();
    newGame.createdAt = now;
    newGame.updatedAt = now;
    const saved = db.vgBeatGames.save(newGame);
    res.json(saved);
  } catch (err) {
    logger.logThis(req, err);
    res
      .status(500)
      .json({ error: true, message: 'ERROR SAVING NEW GAME TO BEATEN GAMES!', code: err });
  }
};

module.exports.updateBg = function(req, res) {};

module.exports.deleteBg = function(req, res) {};
