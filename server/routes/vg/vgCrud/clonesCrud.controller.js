const db = require('../../../db');
const helper = require('../vgHelpers');

const required = helper.clonesRequiredFields();

module.exports.save = function(clone) {
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    clone.createdAt = now;
    clone.updatedAt = now;
    helper
      .validate(clone, required)
      .then(missing => {
        if (!missing || !missing.length) {
          try {
            const saved = db.clones.save(clone);
            resolve(saved);
          } catch (error) {
            reject(error);
          }
        } else {
          reject({
            missing: true,
            message: `Your clone save request is missing the following required keys: ${missing.join(
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

module.exports.getClones = function() {
  return db.clones.find().map(c => {
    c.wireless = c.wireless.toString();
    c.hacked = c.hacked.toString();
    return c;
  });
};

module.exports.delete = function(id) {
  return db.clones.remove({
    _id: id
  });
};

module.exports.edit = function(id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db.clones.update({ _id: id }, updatedData, { multi: false, upsert: false });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: 'ERROR: Cannot find clone in DB. Bad Request!' });
    }
  });
};
