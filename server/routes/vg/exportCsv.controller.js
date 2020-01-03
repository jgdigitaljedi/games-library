const db = require('../../db');
const _sortBy = require('lodash/sortBy');
const _get = require('lodash/get');
const fs = require('fs');
const path = require('path');
const eHelper = require('./exportCsv.helper');

const gamesKeys = eHelper.getKeys('games');
const consolesKeys = eHelper.getKeys('consoles');
const clonesKeys = eHelper.getKeys('clones');
const collKeys = eHelper.getKeys('collectibles');
const generalKeys = eHelper.getKeys('general');
const accKeys = eHelper.getKeys('accessories');

const consolesCsv = eHelper.getHeaderLine('consoles');
const clonesCsv = eHelper.getHeaderLine('clones');
const collCsv = eHelper.getHeaderLine('collectibles');
const generalCsv = eHelper.getHeaderLine('general');

function sendStream(data, res) {
  const file = fs.createWriteStream(path.join(__dirname, '../../temp/export.csv'));
  file.write(data);
  res.setHeader('Content-disposition', 'attachment; filename=export.csv');
  res.set('Content-Type', 'text/csv');
  const readStream = fs.createReadStream(path.join(__dirname, '../../temp/export.csv'));
  readStream.pipe(res);
}

function exportAcc(options, res) {
  const allAcc = options.wishlist ? db.wlAccessories.find() : db.gameAcc.find();
  let chosenAcc;
  if (options && options.subKey && options.subValue && options.subKey === 'name') {
    chosenAcc = allAcc.filter(
      g =>
        _get(g, options.subKey)
          .toLowerCase()
          .indexOf(options.subValue.toLowerCase()) >= 0
    );
  } else if (options && options.subKey && options.subValue && options.subKey !== 'name') {
    chosenAcc = allAcc.filter(
      g => _get(g, options.subKey).toLowerCase() === options.subValue.toLowerCase()
    );
  } else {
    chosenAcc = _sortBy(allAcc, ['forConsoleName', 'type', 'name']);
  }
  let accCsv = eHelper.getHeaderLine('accessories');

  chosenAcc.forEach(item => {
    const newArr = accKeys.map(key => {
      const val = _get(item, key);
      if (Array.isArray(val)) {
        return val.join(' | ');
      } else if (typeof val === 'string' && val.indexOf(',') >= 0) {
        return val.split(',').join(' | ');
      } else if (typeof val === 'string' && val.indexOf(';') >= 0) {
        return val.split(';').join(' | ');
      } else {
        return val;
      }
    });
    accCsv += `${newArr.join(',')}\n`;
  });
  sendStream(accCsv, res);
}

function exportGames(options, res) {
  const allGames = options.wishlist ? db.wlGames.find() : db.games.find();
  let chosenGames;
  if (options && options.subKey && options.subValue && options.subKey === 'igdb.name') {
    chosenGames = allGames.filter(
      g =>
        _get(g, options.subKey)
          .toLowerCase()
          .indexOf(options.subValue.toLowerCase()) >= 0
    );
  } else if (options && options.subKey && options.subValue && options.subKey !== 'igdb.name') {
    chosenGames = allGames.filter(
      g => _get(g, options.subKey).toLowerCase() === options.subValue.toLowerCase()
    );
  } else {
    chosenGames = _sortBy(allGames, ['consoleName', 'igdb.name']);
  }
  let gamesCsv = eHelper.getHeaderLine('games');

  chosenGames.forEach(item => {
    const newArr = gamesKeys.map(key => {
      const val = _get(item, key);
      if (Array.isArray(val)) {
        return val.join(' | ');
      } else if (typeof val === 'string' && val.indexOf(',') >= 0) {
        return val.split(',').join(' | ');
      } else if (typeof val === 'string' && val.indexOf(';') >= 0) {
        return val.split(';').join(' | ');
      } else {
        return val;
      }
    });
    gamesCsv += `${newArr.join(',')}\n`;
  });
  sendStream(gamesCsv, res);
}

function exportSimple(options, res, which) {
  let outCsv;
  let allItems;
  let itemsKeys;
  switch (which) {
    case 'consoles':
      outCsv = consolesCsv;
      allItems = options && options.wishlist ? db.wlConsoles.find() : db.consoles.find();
      itemsKeys = consolesKeys;
      break;
    case 'clones':
      outCsv = clonesCsv;
      allItems = options && options.wishlist ? db.wlClones.find() : db.clones.find();
      itemsKeys = clonesKeys;
      break;
    case 'collectibles':
      outCsv = collCsv;
      allItems = options && options.wishlist ? db.wlCollectibles.find() : db.collectibles.find();
      itemsKeys = collKeys;
      break;
    case 'general':
      outCsv = generalCsv;
      allItems = options && options.wishlist ? db.wlHardware.find() : db.hardware.find();
      itemsKeys = generalKeys;
      break;
  }
  const chosenCons = _sortBy(allItems, 'igdb.name');
  chosenCons.forEach(item => {
    const newArr = itemsKeys.map(key => {
      const val = _get(item, key);
      if (Array.isArray(val)) {
        return val.join(' | ');
      } else if (typeof val === 'string' && val.indexOf(',') >= 0) {
        return val.split(',').join(' | ');
      } else {
        return val;
      }
    });
    outCsv += `${newArr.join(',')}\n`;
  });
  sendStream(outCsv, res);
}

module.exports.exportCsv = function (req, res) {
  if (req.body.type) {
    if (req.body.type === 'games') {
      exportGames(req.body.options, res);
    } else if (req.body.type === 'consoles') {
      exportSimple(req.body.options, res, 'consoles');
    } else if (req.body.type === 'clones') {
      exportSimple(req.body.options, res, 'clones');
    } else if (req.body.type === 'collectibles') {
      exportSimple(req.body.options, res, 'collectibles');
    } else if (req.body.type === 'general') {
      exportSimple(req.body.options, res, 'general');
    } else if (req.body.type === 'accessories') {
      exportAcc(req.body.options, res);
    }
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Malformed request; no data sent to export.' });
  }
};
