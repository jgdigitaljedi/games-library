const db = require('../../db');
const _get = require('lodash/get');
const _uniqBy = require('lodash/uniqBy');

const itemMap = {
  Consoles: 'consoles',
  Games: 'games',
  Clones: 'clones',
  Accessories: 'gameAcc',
  Collectibles: 'collectibles',
  General: 'hardware'
};

const wlItemMap = {
  Consoles: 'wlConsoles',
  Games: 'wlGames',
  Clones: 'wlClones',
  Accessories: 'wlAccessories',
  collectibles: 'wlCollectibles',
  General: 'wlHardware'
};

const charactersMap = {
  Sonic: ['sonic', 'knuckles', 'smash bros. wii u', 'smash bros. ultimate'],
  Mario: ['mario', 'smash bros'],
  Link: ['zelda', 'crossbow', 'smash bros', 'mario kart 8', 'link', 'hyrule'],
  DK: ['party', 'donkey', 'konga', 'smash bros', 'mario kart'],
  Kirby: ['smash bros', 'kirby'],
  Simon: ['castlevania', 'smash bros. ultimate'],
  Samus: ['metroid', 'smash bros'],
  Yoshi: ['yoshi', 'smash bros', 'mario world', 'mario party', 'mario kart']
};

const dateCats = ['igdb.first_release_date'];

function handleDateData(prop, data, res) {
  const sorted = data
    .sort((a, b) => {
      const aa = _get(a, prop);
      const bb = _get(b, prop);
      if (!aa) return 1;
      if (!bb) return -1;
      return new Date(bb) - new Date(aa);
    })
    .reverse();
  const filtered = sorted.filter(p => {
    const parsed = _get(p, prop);
    return parsed && parsed !== '';
  });
  const firstDate = new Date(_get(filtered[0], prop)).getFullYear();
  const lastDate = new Date(_get(filtered[filtered.length - 1], prop)).getFullYear();
  let dateArr = [];
  for (let i = 0; firstDate + i <= lastDate; i++) {
    dateArr.push({ name: (firstDate + i).toString(), value: 0 });
  }
  // const dataArr = [];
  sorted.forEach(item => {
    const val = _get(item, prop);
    if (val) {
      const itemYear = new Date(val).getFullYear().toString();
      const keys = dateArr.map(d => d.name);
      const ind = keys.indexOf(itemYear);
      dateArr[ind].value++;
    }
  });
  res.json(dateArr);
}

function getCharacters(res, fun, wishlist) {
  const games = wishlist ? db.wlGames.find() : db.games.find();
  const acc = wishlist ? db.wlAccessories.find() : db.gameAcc.find();
  const collectibles = wishlist ? db.wlCollectibles.find() : db.collectibles.find();
  try {
    const characters = Object.keys(charactersMap);
    const final = characters.map(character => {
      const keywords = charactersMap[character];
      const cGames = games.filter(g => {
        const name = g.igdb.name.toLowerCase();
        const matches = keywords.filter(k => name.indexOf(k) >= 0);
        return matches.length >= 1;
      });
      const cAcc = acc.filter(g => {
        const notes = g.notes.toLowerCase();
        const name = g.name.toLowerCase();
        const matches = keywords.filter(k => name.indexOf(k) >= 0 || notes.indexOf(k) >= 0);
        return matches.length >= 1;
      });
      const cColl = collectibles.filter(g => {
        const name = g.character.toLowerCase();
        const matches = keywords.filter(k => name.indexOf(k) >= 0);
        return matches.length >= 1;
      });
      return {
        platform: character,
        games: cGames,
        acc: cAcc,
        coll: cColl
      };
    });
    if (fun) {
      return final;
    }
    res.json(final);
  } catch (e) {
    res
      .status(500)
      .json({ error: true, message: 'ERROR:  Problem calculating character totals!', code: e });
  }
}

function getTotals(res, fun, wishlist) {
  const consoles = wishlist ? db.wlConsoles.find() : db.consoles.find();
  const clones = wishlist ? db.wlClones.find() : db.clones.find();
  clones.forEach(c => {
    c.clone = true;
    consoles.push(c);
  });
  const games = wishlist ? db.wlGames.find() : db.games.find();
  const acc = wishlist ? db.wlAccessories.find() : db.gameAcc.find();
  const coll = wishlist ? db.wlCollectibles.find() : db.collectibles.find();
  const hw = wishlist ? db.wlHardware.find() : db.hardware.find();
  try {
    const data = consoles.map(c => {
      const cName = c.clone ? c.name : c.igdb.name;
      const cGames = games.filter(g => {
        return g.consoleName === cName;
      });
      const cAcc = acc.filter(a => {
        return a.forConsoleName === cName;
      });
      const cColl = coll.filter(item => {
        const cons = item.associatedConsoles.map(n => n.name);
        return cons.indexOf(cName) >= 0;
      });
      const cHw = hw.filter(item => {
        const cons = item.forConsoles.map(n => n.name);
        return cons.indexOf(cName) >= 0;
      });
      return {
        platform: cName,
        games: cGames,
        acc: cAcc,
        coll: cColl,
        hw: cHw
      };
    });
    const cleaned = _uniqBy(data, 'platform');
    if (fun) {
      return cleaned;
    }
    res.json(cleaned);
  } catch (e) {
    res.status(500).json({ error: true, message: 'ERROR:  Problem calculating totals!', code: e });
  }
}

function getFunData(res, wishlist) {
  const totals = getTotals(null, true, wishlist);
  // const characters = getCharacters(null, true);
  const games = wishlist ? db.wlGames.find() : db.games.find();
  const acc = wishlist ? db.wlAccessories.find() : db.gameAcc.find();
  const coll = wishlist ? db.wlCollectibles.find() : db.collectibles.find();
  const hardware = wishlist ? db.wlHardware.find() : db.hardware.find();
  const consoles = wishlist ? db.wlConsoles.find() : db.consoles.find();
  const clones = wishlist ? db.wlClones.find() : db.clones.find();
  res.json({ totals, clones, games, consoles, acc, coll, hardware });
}

module.exports.dataVizData = function(req, res) {
  const wishlist = req.body.wishlist;
  if (req.body && req.body.item && req.body.category) {
    const prop = req.body.category;
    if (prop === 'total') {
      return getTotals(res, false, wishlist);
    } else if (prop === 'character') {
      return getCharacters(res, false, wishlist);
    } else if (prop === 'fun') {
      return getFunData(res, wishlist);
    }
    const which = wishlist ? wlItemMap[req.body.item] : itemMap[req.body.item];
    const itemData = db[which].find();
    if (dateCats.indexOf(prop) >= 0) {
      return handleDateData(prop, itemData, res, wishlist);
    }
    const returnArr = [];
    itemData.forEach(item => {
      const parsed = _get(item, prop);
      const bool = typeof parsed === 'boolean';
      const keys = returnArr.map(r => r.name);
      if ((parsed && parsed !== '') || bool) {
        if (returnArr.length) {
          if (Array.isArray(parsed)) {
            parsed.forEach(p => {
              const ind = keys.indexOf(typeof p === 'object' ? p.name : p);
              if (ind >= 0) {
                returnArr[ind].value++;
              } else {
                returnArr.push({ name: typeof p === 'object' ? p.name : p, value: 1 });
              }
            });
          } else {
            const ind = keys.indexOf(bool ? parsed.toString() : parsed);
            if (ind >= 0) {
              if (item.hasOwnProperty('quantity')) {
                returnArr[ind].value += parseInt(item.quantity);
              } else {
                returnArr[ind].value++;
              }
            } else {
              if (item.hasOwnProperty('quantity')) {
                returnArr.push({ name: parsed, value: parseInt(item.quantity) });
              } else {
                returnArr.push({ name: bool ? parsed.toString() : parsed, value: 1 });
              }
            }
          }
        } else {
          if (Array.isArray(parsed)) {
            parsed.forEach(p => {
              returnArr.push({ name: typeof p === 'object' ? p.name : p, value: 1 });
            });
          } else {
            returnArr.push({ name: bool ? parsed.toString() : parsed, value: 1 });
          }
        }
      } else {
        const nsInd = keys.indexOf('NOT SET');
        if (nsInd >= 0) {
          if (item.hasOwnProperty('quantity')) {
            returnArr[nsInd].value += parseInt(item.quantity);
          } else {
            returnArr[nsInd].value++;
          }
        } else {
          if (item.hasOwnProperty('quantity')) {
            returnArr.push({ name: 'NOT SET', value: parseInt(item.quantity) });
          } else {
            returnArr.push({ name: 'NOT SET', value: 1 });
          }
        }
      }
    });
    res.json(returnArr);
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Malformed request; missing a body parameter.' });
  }
};
