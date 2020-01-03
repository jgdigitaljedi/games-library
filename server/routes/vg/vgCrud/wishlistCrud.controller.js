const db = require('../../../db');
const helper = require('../vgHelpers');

// const required = {
//   wlConsoles: helper.consolesRequiredFields(),
//   wlGames: helper.gamesRequiredFields(),
//   wlHardware: helper.hwRequiredFields(),
//   wlAccessories: helper.accRequiredFields(),
//   wlClones: helper.clonesRequiredFields(),
//   wlCollectibles: helper.collRequiredFields()
// };

// function removeRequireds(which, item) {
//   switch (which) {
//     case 'consoles':
//       return
//   }
// }

module.exports.save = function (which, wl) {
  return new Promise((resolve, reject) => {
    const now = helper.timeStamp();
    wl.createdAt = now;
    wl.updatedAt = now;
    try {
      const saved = db[which].save(wl);
      resolve(saved);
    } catch (error) {
      reject({ error: true, message: 'ERROR SAVING WISHLIST ITEM!', code: error });
    }
  });
};

module.exports.getWl = function (which) {
  return db[which].find();
};

module.exports.delete = function (which, id) {
  return db[which].remove({
    _id: id
  });
};

module.exports.edit = function (which, id, updatedData) {
  return new Promise((resolve, reject) => {
    const updated = db[which].update({ _id: id }, updatedData, { multi: false, upsert: false });
    if (updated && updated.updated && updated.updated === 1) {
      resolve(updated);
    } else {
      reject({ error: true, message: `ERROR: Cannot find ${which} in DB. Bad Request!` });
    }
  });
};
