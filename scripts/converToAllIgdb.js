const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const APIKEY = process.env.IGDBV3KEY;
const apicalypse = require('apicalypse');
const _get = require('lodash/get');
const _flatten = require('lodash/flatten');
const games = require('../server/db/gamesExtra.json');

async function getIgdb(game) {
  return new Promise((resolve, reject) => {
    const id = game.igdb.id;
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        Accept: 'application/json',
        'user-key': APIKEY
      }
    };
    const request = apicalypse
      .default(requestOptions)
      .fields(
        `alternative_names.name,bundles.name,bundles.id,cover.url,franchise.name,multiplayer_modes.offlinemax,multiplayer_modes.offlinecoopmax,platforms.name,summary`
      )
      // .search(req.body.game)
      .where(`id = ${id}`)
      .request('/games');
    request
      .then(result => {
        // console.log('result', result.data);
        const singleResult = Array.isArray(result.data) ? result.data[0] : result.data;
        if (singleResult) {
          const igdbSection = Object.assign(game.igdb, singleResult);
          game.igdb = igdbSection;

          const cover = _get(singleResult, 'cover.url');
          if (cover) {
            game.image = `https:${cover}`;
          } else {
            game.image = game.gb.image;
          }
          const multi = _get(singleResult, 'multiplayer_modes[0]');
          if (multi) {
            game.multiplayerNumber =
              multi.offlinecoopmax > multi.offlinemax ? multi.offlinecoopmax : multi.offlinemax;
          } else {
            game.multiplayerNumber = game.multiplayerNumber || 1;
          }
          game.description = singleResult.summary || game.description;
          delete game.gb;
          resolve(game);
        } else {
          // console.log(chalk.yellow('MISSED', game.name));
          fs.writeFileSync(path.join(__dirname, './missedShit.json'), JSON.stringify(game));
          resolve(game);
        }
      })
      .catch(error => {
        console.log('error', error);
        reject(game);
      });
  });
}

// for testing so I don't exhaust my API key
// const gamesShort = games.splice(0, 20);

const converted = games.map(async game => {
  return await getIgdb(game);
});

Promise.all(converted).then(results => {
  const flat = _flatten(results);
  fs.writeFile(path.join(__dirname, './testIgdbConversion.json'), JSON.stringify(flat), error => {
    if (error) {
      console.log(chalk.red.bold('ERROR WIRITING IGDB CONVERSION', error));
    } else {
      console.log(chalk.cyan('SUCCESSFULLY WROTE IGDB CONVERSION FOR GAMES'));
    }
  });
});
