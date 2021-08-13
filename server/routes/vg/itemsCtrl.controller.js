const db = require('../../db');
const _sortBy = require('lodash/sortBy');

// eventually move all of static asset type data to this call and use the ItemsContext
module.exports.getItems = function (req, res) {
  const items = {
    platformsWithId: _sortBy(
      db.consoles.find().map(con => ({ id: con.id, name: con.name })),
      'name'
    )
  };
  res.status(200).json(items);
};
