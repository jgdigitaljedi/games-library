const _get = require('lodash/get');
const moment = require('moment');

module.exports.validate = function (obj, reqKeys) {
  return new Promise((resolve, reject) => {
    try {
      const missing = reqKeys.filter((item) => {
        if (item.required) {
          let parsed = _get(obj, item.key);
          if (parsed === null || parsed === undefined || typeof parsed !== item.type) {
            return item.key;
          }
        }
      });
      resolve(missing);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.timeStamp = function () {
  return moment().format('MM/DD/YYYY hh:mm a');
};

module.exports.consolesRequiredFields = function () {
  return [
    { key: 'igdb.id', required: true, type: 'number' },
    { key: 'igdb.name', required: true, type: 'string' },
    { key: 'igdb.logo', required: false },
    { key: 'igdb.generation', required: false },
    { key: 'igdb.alternative_name', required: false },
    { key: 'igdb.version', required: false },
    { key: 'pricePaid', required: false },
    { key: 'mods', required: false },
    { key: 'notes', required: false },
    { key: 'condition', required: false },
    { key: 'box', required: true, type: 'boolean' },
    { key: 'connectedBy', required: true, type: 'string' },
    { key: 'upscaler', required: true, type: 'boolean' },
    { key: 'datePurchased', required: false },
    { key: 'ghostConsole', required: true, type: 'boolean' },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' }
  ];
};

module.exports.gamesRequiredFields = function () {
  return [
    { key: 'igdb.id', required: false },
    { key: 'igdb.name', required: true, type: 'string' },
    { key: 'igdb.total_rating', required: false },
    { key: 'igdb.total_rating_count', required: false },
    { key: 'igdb.developers', required: false },
    { key: 'igdb.genres', required: false },
    { key: 'igdb.first_release_date', required: false },
    { key: 'igdb.esrb', required: false },
    { key: 'gb.gbid', required: false },
    { key: 'gb.guid', required: false },
    { key: 'gb.aliases', required: false },
    { key: 'gb.image', required: false },
    { key: 'gb.deck', required: false },
    { key: 'gb.platforms', required: false },
    { key: 'pricePaid', required: false },
    { key: 'physical', required: false },
    { key: 'case', required: true, type: 'string' },
    { key: 'condition', required: true, type: 'string' },
    { key: 'cib', required: false },
    { key: 'pirated', required: false },
    { key: 'maxMultiplayer', required: false },
    { key: 'datePurchased', required: false },
    { key: 'howAcquired', required: false },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' }
  ];
};

module.exports.accRequiredFields = function () {
  return [
    { key: 'name', required: true, type: 'string' },
    { key: 'forConsoleName', required: true, type: 'string' },
    { key: 'forConsoleId', required: false },
    { key: 'image', required: false },
    { key: 'company', required: false },
    { key: 'type', required: true, type: 'string' },
    { key: 'notes', required: false },
    { key: 'pricePaid', required: false },
    { key: 'purchaseDate', required: false },
    { key: 'howAcquired', required: false },
    { key: 'officialLicensed', required: false },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' }
  ];
};

module.exports.clonesRequiredFields = function () {
  return [
    { key: 'name', required: true, type: 'string' },
    { key: 'company', required: true, type: 'string' },
    { key: 'image', required: false },
    { key: 'consolesEmulated', required: true, type: 'string' },
    { key: 'gamesIncludedAmount', required: false },
    { key: 'maxPlayers', required: false },
    { key: 'controllerNumber', required: false },
    { key: 'connectedBy', required: false },
    { key: 'upscaler', required: false },
    { key: 'hd', required: false },
    { key: 'wireless', required: false },
    { key: 'hacked', required: false },
    { key: 'addons', required: false },
    { key: 'purchaseDate', required: false },
    { key: 'pricePaid', required: false },
    { key: 'createdAt', required: false },
    { key: 'updatedAt', required: false },
    { key: 'gamesAddedNumber', required: false },
    { key: 'takesOriginalControllers', required: false },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' }
  ];
};

module.exports.collRequiredFields = function () {
  return [
    { key: 'name', required: true, type: 'string' },
    { key: 'associatedConsoleId', required: false },
    { key: 'associatedConsoleName', required: false },
    { key: 'associatedGame', required: false },
    { key: 'character', required: false },
    { key: 'image', required: false },
    { key: 'quantity', required: false },
    { key: 'company', required: false },
    { key: 'type', required: true, type: 'string' },
    { key: 'notes', required: false },
    { key: 'pricePaid', required: false },
    { key: 'purchaseDate', required: false },
    { key: 'howAcquired', required: false },
    { key: 'officialLicensed', required: false },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' }
  ];
};

module.exports.hwRequiredFields = function () {
  return [
    { key: 'name', required: true, type: 'string' },
    { key: 'image', required: false },
    { key: 'type', required: true, type: 'string' },
    { key: 'forConsoles', required: false },
    { key: 'purchaseDate', required: false },
    { key: 'pricePaid', required: false },
    { key: 'howAcquired', required: false },
    { key: 'company', required: false },
    { key: 'quantity', required: false },
    { key: 'notes', required: false },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' }
  ];
};
