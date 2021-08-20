const db = require('../../db');
const _sortBy = require('lodash/sortBy');
const _uniq = require('lodash/uniq');

// eventually move all of static asset type data to this call and use the ItemsContext
module.exports.getItems = function (req, res) {
  const items = {
    platformsWithId: _sortBy(
      db.consoles.find().map(con => ({ id: con.id, name: con.name })),
      'name'
    ),
    gameReleaseYears: _uniq(
      db.games
        .find()
        .map(game => {
          return new Date(game.first_release_date).getFullYear() || null;
        })
        .filter(g => g)
        .sort()
    )
  };
  res.status(200).json(items);
};
