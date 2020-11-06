const games = require('../../server/db/gamesExtra.json');
const axios = require('axios');
const igdb = require('igdb-api-node').default;
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let appKeyTimestamp;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchSecretToken = process.env.TWITCH_SECRET_TOKEN;
const fields = `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name,summary`;

let client;
let appKey;
const esrbData = {
  6: 'RP',
  7: 'EC',
  8: 'E',
  9: 'E10+',
  10: 'T',
  11: 'M',
  12: 'AO'
};

async function getAppAccessToken() {
  return axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchSecretToken}&grant_type=client_credentials`
  );
}

async function refreshAppKey() {
  const appKeyRes = await getAppAccessToken();
  appKey = appKeyRes.data;
  appKeyTimestamp = moment().add(appKey.expires_in - 60, 'seconds');
  return igdb(twitchClientId, appKey.access_token);
}

/**
 * take game.igdb.id
 * make call to igdb with new fields
 * cleanup call and restructure game
 * throttle the whole thing because there is a 4 request per second limit gate
 * save to another file so I can check it over before comitting to using result
 *
 * MAYBE TRY WITH LIKE THE FIRST 10 GAMES OR SOMETHING AT FIRST TO VERIFY GETTING DESIRED RESULT WITHOUT WAITING FOREVER
 */

function getUserData(game) {
  const oldData = {
    consoleName: game.consoleName,
    consoleId: game.consoleIgdbId,
    condition: game.condition,
    case: game.case,
    pricePaid: parseFloat(+game.pricePaid.toFixed(2)),
    physical: game.physical,
    cib: game.cib,
    datePurchased: game.datePurchased,
    howAcquired: game.howAcquired,
    notes: game.notes,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    _id: game._id,
    name: game.igdb && game.igdb.name ? game.igdb.name : '',
    extraData: game.extraData,
    extraDataFull: game.extraDataFull,
    genres: game.igdb ? game.igdb.genres : []
  };
}

const getMultiplayerModes = (modes) => {
  // just getting the max numbers here
  // not concerned about which is true for which game mode as I can figure that out if I want to play multiplayer with someone
  const combined = modes.reduce((acc, obj, index) => {
    if (index === 0) {
      acc = { offlinemax: 0, offlinecoopmax: 0, splitscreen: false };
    }
    if (obj.offlinemax > acc.offlinemax) {
      acc.offlinemax = obj.offlinemax;
    }
    if (obj.offlinecoopmax > acc.offlinecoopmax) {
      acc.offlinecoopmax = obj.offlinecoopmax;
    }
    if (obj.splitscreen) {
      acc.splitscreen = true;
    }
    return acc;
  }, {});
  return combined;
};

// needs description and multiplayer data
async function getNewGameData(newClient, game) {
  console.log(chalk.yellow('id', game.igdb.id));
  return new Promise((resolve, reject) => {
    if (game.igdb && game.igdb.id && game.igdb.id !== 9999 && game.igdb.id !== 99999) {
      const apiCall = newClient
        .fields(fields)
        // .search()
        .where(`id = ${game.igdb.id}`)
        .request('/games');
      // console.log(apiCall);
      apiCall
        .then((result) => {
          console.log(chalk.green('result', result));
          if (result.status === 200) {
            const formatted = {};
            const item = result.data[0];
            if (item.first_release_date) {
              const rDate = item.first_release_date;
              formatted.first_release_date = moment(parseInt(`${rDate}000`)).format('MM/DD/YYYY');
            }
            if (item.total_rating) {
              const trCopy = item.total_rating.toFixed();
              formatted.total_rating = parseInt(trCopy);
            }
            item.esrb = { rating: null, letterRating: null };
            if (item.age_ratings && item.age_ratings.length) {
              const esrb = item.age_ratings.filter((r) => r.rating > 5).map((r) => r.rating);
              formatted.esrb = esrbData && esrb && esrb.length ? esrbData[esrb[0].toString()] : '';
            }
            formatted.videos = result.videos.map((v) => v.video_id) || null;
            if (item.cover && item.cover.url) {
              const bigImage = item.cover.url.replace('t_thumb', 't_cover_big');
              formatted.image = `https:${bigImage}`;
            } else {
              item.image = '';
            }
            formatted.summary = item.summary;
            formatted.player_perspectives = item.player_perspectives
              ? item.player_perspectives.map((p) => p.name)
              : null;
            formatted.multiplayer_modes = item.multiplayer_modes
              ? getMultiplayerModes(item.multiplayer_modes)
              : { offlinemax: 0, offlinecoopmax: 0, splitscreen: false };
            const oldData = getUserData(game);
            const newGameData = { ...formatted, ...oldData };
            resolve(newGameData);
          } else {
            reject({ game, result });
          }
        })
        .catch((error) => {
          console.log(chalk.blue(error));
          reject({ game, error });
        });
    } else {
      reject({ game, error: 'NOT A VALID GAME ID TO LOOKUP' });
    }
  });
}

refreshAppKey().then((newClient) => {
  console.log('newClient', newClient);
  client = newClient;
  const trialRun = games.slice(0, 1);

  const promiseArr = trialRun.map((g) => getNewGameData(newClient, g));

  Promise.all(promiseArr)
    .then((results) => {
      fs.writeFile(
        path.join(__dirname, './results.json'),
        JSON.stringify(results, null, 2),
        (err) => {
          if (err) {
            err.forEach((error) => {
              console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
            });
          }
        }
      );
    })
    .catch((errors) => {
      console.log(chalk.red.bold(JSON.stringify(errors, null, 2)));
    });
});
