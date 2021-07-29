const _get = require('lodash/get');
const _sortBy = require('lodash/sortBy');
const moment = require('moment');

module.exports.validate = function (obj, reqKeys) {
  return new Promise((resolve, reject) => {
    console.log('VALIDATING ***********************');
    try {
      const missing = reqKeys.filter(item => {
        if (item.required) {
          let parsed = _get(obj, item.key);
          if (parsed === null || parsed === undefined || typeof parsed !== item.type) {
            return item.key;
          }
        }
      });
      console.log('MISSING IN VALIDATE ****************************', missing);
      resolve(missing);
    } catch (error) {
      console.log('validation error', error);
      reject(error);
    }
  });
};

module.exports.timeStamp = function () {
  return moment().format('MM/DD/YYYY hh:mm a');
};

module.exports.consolesRequiredFields = function () {
  return [
    { key: 'id', required: true, type: 'number' },
    { key: 'name', required: true, type: 'string' },
    { key: 'logo', required: false },
    { key: 'generation', required: false },
    { key: 'alternative_name', required: false },
    { key: 'version', required: false },
    { key: 'pricePaid', required: false },
    { key: 'mods', required: false },
    { key: 'notes', required: false },
    { key: 'condition', required: false },
    { key: 'box', required: true, type: 'boolean' },
    { key: 'datePurchased', required: false },
    { key: 'ghostConsole', required: true, type: 'boolean' },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' },
    { key: 'category', required: false, type: 'string' },
    { key: 'manual', required: false, type: 'boolean' },
    { key: 'connectivity', required: false, type: 'string' },
    { key: 'cpu', required: false, type: 'string' },
    { key: 'media', required: false, type: 'string' },
    { key: 'os', required: false, type: 'string' },
    { key: 'output', required: false, type: 'string' },
    { key: 'storage', required: false, type: 'string' },
    { key: 'summary', required: false, type: 'string' },
    { key: 'releaseDate', required: false },
    { key: 'newDatePurchased', required: false }
  ];
};

module.exports.gamesRequiredFields = function () {
  return [
    { key: 'id', required: false },
    { key: 'name', required: true, type: 'string' },
    { key: 'total_rating', required: false },
    { key: 'genres', required: false },
    { key: 'first_release_date', required: false },
    { key: 'esrb', required: false },
    { key: 'pricePaid', required: false },
    { key: 'physical', required: false },
    { key: 'case', required: true, type: 'string' },
    { key: 'condition', required: true, type: 'string' },
    { key: 'cib', required: false },
    { key: 'maxMultiplayer', required: false },
    { key: 'datePurchased', required: false },
    { key: 'howAcquired', required: false },
    { key: 'createdAt', required: true, type: 'string' },
    { key: 'updatedAt', required: true, type: 'string' },
    { key: 'consoleName', required: true, type: 'string' },
    { key: 'consoleId', required: true, type: 'number' },
    { key: 'multiplayerModes.splitscreen', required: false },
    { key: 'multiplayerModes.offlinemax', required: false },
    { key: 'multiplayerModes.offlinecoopmax', required: false },
    { key: 'notes', required: false },
    { key: 'image', required: false },
    { key: 'description', required: false },
    { key: 'story', required: false },
    { key: 'videos', required: false },
    { key: 'player_perspectives', required: false },
    { key: 'handheld', required: false },
    { key: 'manual', required: false },
    { key: 'gamesService.xbGold', required: false },
    { key: 'gamesService.xbPass', required: false },
    { key: 'gamesService.psPlus', required: false },
    { key: 'gamesService.primeFree', required: false },
    { key: 'gamesService.switchFree', required: false },
    { key: 'compilation', required: false },
    { key: 'compilationsIds', required: false },
    { key: 'location', required: false }
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

module.exports.sortByDate = function (items, keys, reversed) {
  const sorted = _sortBy(items, keys);
  if (reversed) {
    return sorted.reverse();
  }
  return sorted;
};
