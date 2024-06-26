const db = require('../../db');
const igdb = require('./vg.controller');
const helper = require('../vg/vgHelpers');

module.exports.updateConsoles = function (req, res) {
  // @TODO: rebuild this endpoint using IGDB calls
  if (req.params.id) {
    const platform = db.consoles.find({ _id: req.params.id });
    res.json(platform);
  } else {
    res.status(400).json({ error: true, message: 'Malformed Request: id sent in route params!' });
  }
};

module.exports.updateGame = function (req, res) {
  if (req.params.id) {
    const game = db.games.find({ _id: req.params.id });
    const selected = game[0];
    igdb
      .updateGameRatings(selected.igdb.id)
      .then((result) => {
        const now = helper.timeStamp();
        const rating =
          result && result[0] && result[0].total_rating && typeof result[0].total_rating
            ? parseInt(result[0].total_rating)
            : '';
        selected.igdb.total_rating = rating;
        selected.igdb.total_rating_count = result[0].total_rating_count;
        selected.updatedAt = now;
        const updated = db.games.update({ _id: req.params.id }, selected, {
          multi: false,
          upsert: false
        });
        res.json({
          updated,
          total_rating: selected.igdb.total_rating,
          total_rating_count: selected.igdb.total_rating_count
        });
      })
      .catch((error) => {
        res.status(500).send({
          error: true,
          message: 'ERROR: Problem fetching IGDB data to update game ratings!',
          code: error
        });
      });
  } else {
    res.status(400).json({ error: true, message: 'Malformed Request: id sent in route params!' });
  }
};
