const gamesCrud = require('./vgCrud/gamesCrud.controller');
const consolesCrud = require('./vgCrud/consolesCrud.controller');
const accCrud = require('./vgCrud/accCrud.controller');
const collCrud = require('./vgCrud/collectiblesCrud.controller');
const clonesCrud = require('./vgCrud/clonesCrud.controller');
const hwCrud = require('./vgCrud/hwCrud.controller');
const wlCrud = require('./vgCrud/wishlistCrud.controller');
const logger = require('../../config/logger');
const everDrives = require('../../extra/everDrive.json');
const homePageStats = require('./vgCrud/gamesSupp/homeViewStats');
const gameStats = require('../../extra/gameStats.json');
const db = require('../../db');
const combined = require('./vgCrud/gamesSupp/combineGames');
const sortBy = require('lodash/sortBy');

/***********************************************************
 * Games CRUD
 ***********************************************************/

module.exports.saveGame = function (req, res) {
  if (req.body && req.body.hasOwnProperty('name')) {
    gamesCrud
      .save(req.body)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: 'ERROR: Problem saving game!', code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyGames = function (req, res) {
  const games = gamesCrud.getGames();
  res.status(200).json(games);
};

module.exports.gamesTotal = function (req, res) {
  const games = gamesCrud.getGames();
  res.status(200).json({ count: games.length });
};

module.exports.getPhysicalGamesTotal = function (req, res) {
  const games = gamesCrud.getGames();
  const physicalGames = games.filter(g => g.physical);
  res.status(200).json({ count: physicalGames.length });
};

module.exports.getCombinedGameData = function (req, res) {
  combined
    .combine()
    .then(result => {
      res.status(200).json(sortBy(result, 'datePurchased').reverse());
    })
    .catch(error => {
      res.status(500).json({ error: true, message: 'ERROR COMBINING GAMES DATA!', code: error });
    });
};

module.exports.everDrives = function (req, res) {
  try {
    res.status(200).json(everDrives);
  } catch (error) {
    res.status(503).send(error);
  }
};

module.exports.everdrivesTotal = function (req, res) {
  const games = everDrives;
  res.status(200).json({ count: games.length });
};

module.exports.collectionStats = function (req, res) {
  try {
    res.json(homePageStats.getStats());
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports.gameStats = function (req, res) {
  try {
    res.status(200).json(gameStats);
  } catch (error) {
    res.status(503).send(error);
  }
};

module.exports.deleteGame = function (req, res) {
  if (req.params.id) {
    res.status(200).send(gamesCrud.delete(req.params.id));
  } else {
    res.status(400).json({ error: true, message: 'BAD REQUEST! MISSING "game"!' });
  }
};

module.exports.editGame = function (req, res) {
  if (req.params.id && req.body.name) {
    gamesCrud
      .edit(req.params.id, req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};

/*********************************************
 * Consoles CRUD
 *********************************************/

module.exports.savePlatform = function (req, res) {
  if (req.body && req.body.hasOwnProperty('platform')) {
    consolesCrud
      .save(req.body.platform)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: 'ERROR: Problem saving console/platform!', code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyPlatforms = function (req, res) {
  const platforms = consolesCrud.getPlatforms();
  res.status(200).json(platforms);
};

module.exports.searchMyPlatforms = function (req, res) {
  if (req.body && req.body.hasOwnProperty('key') && req.body.hasOwnProperty('value')) {
    const search = consolesCrud.searchMyPlatforms(req.body.key, req.body.value);
    if (search.error) {
      res.status(400).json(search);
    } else {
      res.status(200).json(search);
    }
  }
};

module.exports.deleteConsole = function (req, res) {
  if (req.params.id) {
    res.status(200).send(consolesCrud.delete(req.params.id));
  } else {
    res.status(400).json({ error: true, message: 'BAD REQUEST! MISSING "platform"!' });
  }
};

module.exports.editConsole = function (req, res) {
  if (req.params.id && req.body.platform) {
    consolesCrud
      .edit(req.params.id, req.body.platform)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};

/*********************************************
 * Accessories CRUD
 *********************************************/

module.exports.saveAcc = function (req, res) {
  if (req.body && req.body.hasOwnProperty('acc')) {
    accCrud
      .save(req.body.acc)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: 'ERROR: Problem saving accessory!', code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyAcc = function (req, res) {
  const acc = accCrud.getAcc();
  res.status(200).json(acc);
};

module.exports.deleteAcc = function (req, res) {
  if (req.params.id) {
    res.status(200).send(accCrud.delete(req.params.id));
  } else {
    res.status(400).json({ error: true, message: 'BAD REQUEST! MISSING "accessory"!' });
  }
};

module.exports.editAcc = function (req, res) {
  if (req.params.id && req.body.acc) {
    accCrud
      .edit(req.params.id, req.body.acc)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};

/*********************************************
 * Collectibles CRUD
 *********************************************/

module.exports.saveColl = function (req, res) {
  if (req.body && req.body.hasOwnProperty('coll')) {
    collCrud
      .save(req.body.coll)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: 'ERROR: Problem saving collectible!', code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyColl = function (req, res) {
  const coll = collCrud.getColl();
  res.status(200).json(coll);
};

module.exports.deleteColl = function (req, res) {
  if (req.params.id) {
    res.status(200).send(collCrud.delete(req.params.id));
  } else {
    res.status(400).json({ error: true, message: 'BAD REQUEST! MISSING "collectible"!' });
  }
};

module.exports.editColl = function (req, res) {
  if (req.params.id && req.body.platform) {
    collCrud
      .edit(req.params.id, req.body.platform)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};

/*********************************************
 * Clones CRUD
 *********************************************/

module.exports.saveClone = function (req, res) {
  if (req.body && req.body.hasOwnProperty('clone')) {
    clonesCrud
      .save(req.body.clone)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: 'ERROR: Problem saving clone system!', code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyClones = function (req, res) {
  const coll = clonesCrud.getClones();
  res.status(200).json(coll);
};

module.exports.deleteClone = function (req, res) {
  if (req.params.id) {
    res.status(200).send(clonesCrud.delete(req.params.id));
  } else {
    res.status(400).json({ error: true, message: 'BAD REQUEST! MISSING "clone"!' });
  }
};

module.exports.editClone = function (req, res) {
  if (req.params.id && req.body.platform) {
    clonesCrud
      .edit(req.params.id, req.body.platform)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};

/*********************************************
 * Hardware CRUD
 *********************************************/

module.exports.saveHardware = function (req, res) {
  if (req.body && req.body.hasOwnProperty('hw')) {
    hwCrud
      .save(req.body.hw)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: 'ERROR: Problem saving hardware!', code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyHardware = function (req, res) {
  const hw = hwCrud.getHw();
  res.status(200).json(hw);
};

module.exports.deleteHardware = function (req, res) {
  if (req.params.id) {
    res.status(200).send(hwCrud.delete(req.params.id));
  } else {
    res.status(400).json({ error: true, message: 'BAD REQUEST! MISSING "hardware"!' });
  }
};

module.exports.editHardware = function (req, res) {
  if (req.params.id && req.body.platform) {
    hwCrud
      .edit(req.params.id, req.body.platform)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};

/*********************************************
 * Wishlist CRUD
 *********************************************/

module.exports.saveWishlist = function (req, res) {
  if (req.body && req.body.hasOwnProperty('wl') && req.params.hasOwnProperty('which')) {
    const which = req.params.which;
    wlCrud
      .save(which, req.body.wl)
      .then(result => {
        res.status(200).json({ error: false, result });
      })
      .catch(error => {
        if (error.missing) {
          res.status(400).json({
            error: true,
            message: error.message
          });
        } else {
          res
            .status(500)
            .json({ error: true, message: `ERROR: Problem saving ${which}!`, code: error });
        }
      });
  } else {
    logger.logThis(req, 'ERROR: Malformed or incomplete request!');
    res.status(400).json({ error: true, message: 'ERROR: Malformed or incomplete request!' });
  }
};

module.exports.getMyWishlist = function (req, res) {
  if (req.params && req.params.hasOwnProperty('which')) {
    const wl = wlCrud.getWl(req.params.which);
    res.status(200).json(wl);
  } else {
    res.status(500).json({ error: true, message: 'ERROR: REQUEST MISSING WHICH PARAM!' });
  }
};

module.exports.deleteWishlist = function (req, res) {
  if (req.params.id && req.params.which) {
    res.status(200).send(wlCrud.delete(req.params.which, req.params.id));
  } else {
    res.status(400).json({ error: true, message: `BAD REQUEST! MISSING "${req.params.which}"!` });
  }
};

module.exports.editWishlist = function (req, res) {
  if (req.params.id && req.body.platform && req.params.hasOwnProperty('which')) {
    wlCrud
      .edit(req.params.which, req.params.id, req.body.platform)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: Bad Request! Missing either body or id in URL!' });
  }
};
