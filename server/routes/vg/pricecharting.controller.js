const logger = require('../../config/logger');
const axios = require('axios');
const { SERVER_ERROR, BAD_REQUEST } = require('../../extra/utils/HttpStatusConstants');
const priceChartingStats = require('./vgCrud/gamesSupp/priceChartingStats');
const priceChartingUpdates = require('./vgCrud/gamesSupp/priceChartingUpdates');
const db = require('../../db');

const createSearchGameName = game => {
  return game
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .join('+');
};

const constructReqUrl = (type, param) => {
  if (type === 'NAME_SEARCH') {
    return `https://www.pricecharting.com/api/products?t=${
      process.env.PRICECHARTING_API_KEY
    }&q=${createSearchGameName(param)}`;
  } else if (type === 'ID_SEARCH') {
    return `https://www.pricecharting.com/api/product?t=${process.env.PRICECHARTING_API_KEY}&id=${param}`;
  }
};

// returns array of results, no prices, but has IDs
module.exports.searchByName = (req, res) => {
  if (req?.body?.item) {
    const url = constructReqUrl('NAME_SEARCH', req.body.item);
    axios
      .get(url)
      .then(result => {
        if (req.body.isPlatform) {
          res.json(result?.data?.products);
        } else {
          const formatted = result?.data.products.map(item => {
            return {
              ...item,
              productConsoleCombined: `${item['product-name']}${
                item['console-name'] ? ' | ' + item['console-name'] : ''
              }`
            };
          });
          res.json(formatted);
        }
      })
      .catch(error => {
        logger.logThis(req, error);
        console.log('error', error);
        res.status(SERVER_ERROR).json({ error: true, message: error });
      });
  } else {
    res.status(BAD_REQUEST).json({ error: true, message: 'You sent and empty or bad request.' });
  }
};

module.exports.searchById = (req, res) => {
  if (req?.body?.id) {
    const url = constructReqUrl('ID_SEARCH', req.body.id);
    axios
      .get(url)
      .then(result => {
        res.json(result.data);
      })
      .catch(error => {
        logger.logThis(req, error);
        console.log('error', error);
        res.status(SERVER_ERROR).json({ error: true, message: error });
      });
  } else {
    res.status(BAD_REQUEST).json({ error: true, message: 'You sent and empty or bad request.' });
  }
};

module.exports.gameStats = function (req, res) {
  try {
    res.json(priceChartingStats.getGameStats());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.platformStats = function (req, res) {
  try {
    res.json(priceChartingStats.getPlatformStats());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.accStats = function (req, res) {
  try {
    res.json(priceChartingStats.getAccStats());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.cloneStats = function (req, res) {
  try {
    res.json(priceChartingStats.getClonesStats());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.updateGamesPrices = async function (req, res) {
  try {
    await priceChartingUpdates.updateGames();
    res.json(db.games.find());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.updateConsolesPrices = async function (req, res) {
  try {
    await priceChartingUpdates.updateConsoles();
    res.json(db.consoles.find());
  } catch (error) {
    console.log('(*^&^%^%$%$#%$^%&^%&^%*&error', error);
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.updateClonesPrices = async function (req, res) {
  try {
    await priceChartingUpdates.updateClones();
    res.json(db.clones.find());
  } catch (error) {
    console.log('(*^&^%^%$%$#%$^%&^%&^%*&error', error);
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.updateAccPrices = async function (req, res) {
  try {
    await priceChartingUpdates.updateAcc();
    res.json(db.gameAcc.find());
  } catch (error) {
    console.log('(*^&^%^%$%$#%$^%&^%&^%*&error', error);
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.mostValuableGames = function (req, res) {
  try {
    res.json(priceChartingStats.getMostValuableGames());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};

module.exports.mostValuablePlatforms = function (req, res) {
  try {
    res.json(priceChartingStats.getMostValuableConsoles());
  } catch (error) {
    res.status(SERVER_ERROR).send(error);
  }
};
