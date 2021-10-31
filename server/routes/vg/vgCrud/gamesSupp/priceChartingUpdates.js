const db = require('../../../../db');
const axios = require('axios');
const chalk = require('chalk');
const async = require('async');
const saveUpdatedGame = require('../../vgCrud/gamesCrud.controller').edit;

async function getDataById(item) {
  try {
    const url = `https://www.pricecharting.com/api/product?t=${process.env.PRICECHARTING_API_KEY}&id=${item.priceCharting.id}`;
    return await axios.get(url);
  } catch (error) {
    return { error: true, message: error };
  }
}

async function updateGameData(game) {
  if (game.hasOwnProperty('priceCharting')) {
    const newData = await getDataById(game);
    const saveStatus = await saveUpdatedGame(game._id, { ...game, priceCharting: { ...newData } });
    return saveStatus;
  } else {
    return null;
  }
}

module.exports.updateGames = async function () {
  return new Promise((resolve, reject) => {
    const games = db.find.games();
    try {
      async.mapLimit(games, 1, updateGameData, (error, results) => {
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
};
