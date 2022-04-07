const db = require('../../../db');
const helper = require('../vgHelpers');

const required = helper.collRequiredFields();

module.exports.save = function (coll) {
  console.log('asdasdasd', JSON.stringify(coll, null, 2));
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    coll.createdAt = now;
    coll.updatedAt = now;
    helper
      .validate(coll, required)
      .then(missing => {
        if (!missing || !missing.length) {
          try {
            const saved = db.collectibles.save(coll);
            resolve(saved);
          } catch (error) {
            reject(error);
          }
        } else {
          reject({
            missing: true,
            message: `Your accessory save request is missing the following required keys: ${missing.join(
              ', '
            )}`
          });
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports.getColl = function () {
  return db.collectibles.find().map(c => {
    c.officialLicensed = c.officialLicensed.toString();
    return c;
  });
};

module.exports.delete = function (id) {
  return db.collectibles.remove({
    _id: id
  });
};

module.exports.edit = function (id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db.collectibles.update({ _id: id }, updatedData, {
      multi: false,
      upsert: false
    });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: 'ERROR: Cannot find collectible in DB. Bad Request!' });
    }
  });
};
