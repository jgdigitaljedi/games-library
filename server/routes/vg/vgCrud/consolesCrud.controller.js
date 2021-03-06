const db = require('../../../db');
const helper = require('../vgHelpers');

const required = helper.consolesRequiredFields();

module.exports.save = function(platform) {
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    platform.createdAt = now;
    platform.updatedAt = now;
    helper
      .validate(platform, required)
      .then(missing => {
        if (!missing || !missing.length) {
          try {
            const saved = db.consoles.save(platform);
            resolve(saved);
          } catch (error) {
            reject(error);
          }
        } else {
          reject({
            missing: true,
            message: `Your platform save request is missing the following required keys: ${missing.join(
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

module.exports.getPlatforms = function() {
  return db.consoles.find().map(c => {
    c.box = c.box.toString();
    if (c && c.gb && c.gb.aliases) {
      c.aliases = c.gb.aliases.split(/\n/).join(', ');
    } else {
      c.aliases = '';
    }
    c.gb.install_base =
      typeof c.gb.install_base === 'number'
        ? c.gb.install_base.toLocaleString()
        : parseInt(c.gb.install_base).toLocaleString();
    return c;
  });
};

module.exports.search = function(key, value) {
  if (key && value) {
    return db.consoles.find({ [key]: value });
  } else {
    return {
      error: true,
      message: 'ERROR: Malformed request must have key and value to quert DB!'
    };
  }
};

module.exports.delete = function(id) {
  return db.consoles.remove({
    _id: id
  });
};

module.exports.edit = function(id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db.consoles.update({ _id: id }, updatedData, { multi: false, upsert: false });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: 'ERROR: Cannot find console in DB. Bad Request!' });
    }
  });
};
