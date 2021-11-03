const db = require('../../../../db');
const axios = require('axios');
const chalk = require('chalk');
const async = require('async');
const saveUpdatedGame = require('../../vgCrud/gamesCrud.controller').edit;
const saveUpdatedConsole = require('../../vgCrud/consolesCrud.controller').edit;
const saveUpdatedClone = require('../../vgCrud/clonesCrud.controller').edit;
const saveUpdatedAcc = require('../../vgCrud/accCrud.controller').edit;
const saveUpdatedColl = require('../../vgCrud/collectiblesCrud.controller').edit;
const moment = require('moment');
const CurrencyUtils = require('stringman-utils').CurrencyUtils;
const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');
const Mult = require('stringman-utils').precisionMathMultiply;

function getPriceForBoxCase(data, boxCase) {
  if (boxCase === 'sealed') {
    return Math.abs(data['new-price'] || 0);
  } else if (boxCase === 'cib') {
    return Math.abs(data['cib-price'] || 0);
  }
  return Math.abs(data['loose-price'] || 0);
}

const formatPcResult = (newData, data, which) => {
  console.log('data', data);
  const boxCase = data.priceCharting.case;
  const itemPrice =
    which === 'ACC' || which === 'COLL'
      ? Mult(getPriceForBoxCase(newData, boxCase), data?.quantity || 1)
      : getPriceForBoxCase(newData, boxCase);
  const lastUpdated = moment().format('MM/DD/YYYY');
  return {
    consoleName: data.priceCharting.consoleName,
    id: data.priceCharting.id,
    price: currencyUtils.minorToMajorUnits(itemPrice, false),
    name: data.priceCharting.name,
    case: boxCase,
    lastUpdated
  };
};

async function getDataById(item) {
  try {
    const url = `https://www.pricecharting.com/api/product?t=${process.env.PRICECHARTING_API_KEY}&id=${item.priceCharting.id}`;
    return await axios.get(url);
  } catch (error) {
    console.log('pc call error', error);
    return { error: true, message: error };
  }
}

async function updateGameData(game) {
  if (game.hasOwnProperty('priceCharting')) {
    const newData = await getDataById(game);
    const formatted = formatPcResult(newData.data, game, 'GAME');
    const saveStatus = await saveUpdatedGame(game._id, {
      ...game,
      priceCharting: { ...formatted }
    });
    return saveStatus;
  } else {
    return null;
  }
}

async function updateConsoleData(data) {
  if (data.hasOwnProperty('priceCharting')) {
    const newData = await getDataById(data);
    const formatted = formatPcResult(newData.data, data, 'CONSOLE');
    const saveStatus = await saveUpdatedConsole(data._id, {
      ...data,
      priceCharting: { ...formatted }
    });
    return saveStatus;
  } else {
    return null;
  }
}

async function updateCloneData(data) {
  if (data.hasOwnProperty('priceCharting')) {
    const newData = await getDataById(data);
    const formatted = formatPcResult(newData.data, data, 'CLONE');
    const saveStatus = await saveUpdatedClone(data._id, {
      ...data,
      priceCharting: { ...formatted }
    });
    return saveStatus;
  } else {
    return null;
  }
}

async function updateAccData(data) {
  if (data.hasOwnProperty('priceCharting')) {
    const newData = await getDataById(data);
    const formatted = formatPcResult(newData.data, data, 'ACC');
    const saveStatus = await saveUpdatedAcc(data._id, {
      ...data,
      priceCharting: { ...formatted }
    });
    return saveStatus;
  } else {
    return null;
  }
}

async function updateCollData(data) {
  if (data.hasOwnProperty('priceCharting')) {
    const newData = await getDataById(data);
    const formatted = formatPcResult(newData.data, data, 'COLL');
    const saveStatus = await saveUpdatedColl(data._id, {
      ...data,
      priceCharting: { ...formatted }
    });
    return saveStatus;
  } else {
    return null;
  }
}

function throttleCalls(data, cb) {
  return new Promise((resolve, reject) => {
    try {
      return async.mapLimit(data, 1, cb, (error, results) => {
        if (error) {
          console.log(chalk.red.bold('ERROR IN ASYNC.MAP', error));
          reject(error);
        }
        resolve(results);
      });
    } catch (err) {
      console.log(chalk.red.bold('ERROR: Async.mapLimit encountered an error', err));
      reject(err);
    }
  });
}

module.exports.updateGames = async function () {
  const games = db.games.find();
  try {
    const result = await throttleCalls(games, updateGameData);
    return result;
  } catch (error) {
    return Promise.resolve({ error: true, message: error });
  }
};

module.exports.updateConsoles = async function () {
  const consoles = db.consoles.find();
  try {
    const result = await throttleCalls(consoles, updateConsoleData);
    return result;
  } catch (error) {
    return Promise.resolve({ error: true, message: error });
  }
};

module.exports.updateClones = async function () {
  const clones = db.clones.find();
  try {
    const result = await throttleCalls(clones, updateCloneData);
    return result;
  } catch (error) {
    return Promise.resolve({ error: true, message: error });
  }
};

module.exports.updateAcc = async function () {
  const acc = db.gameAcc.find();
  try {
    const result = await throttleCalls(acc, updateAccData);
    return result;
  } catch (error) {
    return Promise.resolve({ error: true, message: error });
  }
};

module.exports.updateColl = async function () {
  const coll = db.collectibles.find();
  try {
    const result = await throttleCalls(coll, updateCollData);
    return result;
  } catch (error) {
    return Promise.resolve({ error: true, message: error });
  }
};
