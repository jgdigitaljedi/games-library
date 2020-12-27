const db = require('../../../db');
const helper = require('../vgHelpers');
const moment = require('moment');
const required = helper.gamesRequiredFields();
const sortByDate = helper.sortByDate;

module.exports.save = function (game) {
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    game.createdAt = now;
    game.updatedAt = now;

    console.log('ABOUT TO VALIDATE *********************');
    helper
      .validate(game, required)
      .then((missing) => {
        console.log('missing', missing);
        if (!missing || !missing.length) {
          try {
            const saved = db.games.save(game);
            resolve(saved);
          } catch (error) {
            reject(error);
          }
        } else {
          reject({
            missing: true,
            message: `Your game save request is missing the following required keys: ${missing.join(
              ', '
            )}`
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.getGames = function () {
  return sortByDate(db.games.find(), ['datePurchased'], true);
};

module.exports.search = function () {};

module.exports.delete = function (id) {
  return db.games.remove({
    _id: id
  });
};

module.exports.edit = function (id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db.games.update({ _id: id }, updatedData, { multi: false, upsert: false });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: 'ERROR: Cannot find game in DB. Bad Request!' });
    }
  });
};
