const db = require('../../../db');
const helper = require('../vgHelpers');

const required = helper.accRequiredFields();

module.exports.save = function (acc) {
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    acc.createdAt = now;
    acc.updatedAt = now;
    acc.quantity = parseInt(acc.quantity);
    acc.pricePaid = acc.pricePaid ? parseFloat(acc.pricePaid) : null;
    helper
      .validate(acc, required)
      .then(missing => {
        if (!missing || !missing.length) {
          try {
            const saved = db.gameAcc.save(acc);
            resolve(saved);
          } catch (error) {
            reject(error);
          }
        } else {
          console.log('missing***********', missing);
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

module.exports.getAcc = function () {
  return db.gameAcc.find();
};

module.exports.delete = function (id) {
  return db.gameAcc.remove({
    _id: id
  });
};

module.exports.edit = function (id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db.gameAcc.update({ _id: id }, updatedData, { multi: false, upsert: false });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: 'ERROR: Cannot find accessory in DB. Bad Request!' });
    }
  });
};
