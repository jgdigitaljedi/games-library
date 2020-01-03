const db = require('../../../db');
const helper = require('../vgHelpers');

const required = helper.hwRequiredFields();

module.exports.save = function (hw) {
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    hw.createdAt = now;
    hw.updatedAt = now;
    helper
      .validate(hw, required)
      .then(missing => {
        if (!missing || !missing.length) {
          try {
            const saved = db.hardware.save(hw);
            resolve(saved);
          } catch (error) {
            reject(error);
          }
        } else {
          reject({
            missing: true,
            message: `Your hardware save request is missing the following required keys: ${missing.join(
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

module.exports.getHw = function () {
  return db.hardware.find();
};

module.exports.delete = function (id) {
  return db.hardware.remove({
    _id: id
  });
};

module.exports.edit = function (id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db.hardware.update({ _id: id }, updatedData, { multi: false, upsert: false });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: 'ERROR: Cannot find hardware in DB. Bad Request!' });
    }
  });
};
