const games = require('../../server/db/gamesExtra.json');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const whitespace = require('stringman').whitespace;
const _throttle = require('lodash/throttle');

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchSecretToken = process.env.TWITCH_SECRET_TOKEN;
const fields = `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name,storyline,summary`;

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

function makeHeaders(key) {
  return {
    Accept: 'application/json',
    'Client-ID': twitchClientId,
    Authorization: `Bearer ${key.access_token}`
  };
}

async function refreshAppKey() {
  const appKeyRes = await getAppAccessToken();
  appKey = appKeyRes.data;
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
    pricePaid: game.pricePaid ? parseFloat(+game.pricePaid.toFixed(2)) : null,
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
  return oldData;
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
async function getNewGameData(game) {
  return new Promise((resolve, reject) => {
    if (game.igdb && game.igdb.id && game.igdb.id !== 9999 && game.igdb.id !== 99999) {
      const data = `fields ${fields};where id = ${game.igdb.id};`;
      const headers = makeHeaders(appKey);
      axios({
        url: `https://api.igdb.com/v4/games`,
        method: 'POST',
        headers,
        data
      })
        .then((result) => {
          console.log(chalk.green('result', JSON.stringify(result.data, null, 2)));
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
            formatted.videos = item.videos.map((v) => v.video_id) || null;
            if (item.cover && item.cover.url) {
              const bigImage = item.cover.url.replace('t_thumb', 't_cover_big');
              formatted.image = `https:${bigImage}`;
            } else {
              item.image = '';
            }
            formatted.description = item.summary ? whitespace.removeBreaks(item.summary) : null;
            formatted.story = item.storyline || null;
            formatted.player_perspectives = item.player_perspectives
              ? item.player_perspectives.map((p) => p.name)
              : [];
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
          resolve({ game, error });
        });
    } else {
      resolve({ game, error: 'NOT A VALID GAME ID TO LOOKUP' });
    }
  });
}

refreshAppKey().then(() => {
  const trialRun = games.slice(0, 20);

  const promiseArr = trialRun.map((g) => getNewGameData(g));

  Promise.all(promiseArr)
    .then((results) => {
      // console.log(chalk.yellow('primose results', JSON.stringify(results, null, 2)));

      const cleaned = [],
        errors = [];
      results.forEach((result) => {
        if (result.error) {
          errors.push(result);
        } else {
          cleaned.push(result);
        }
      });

      // write results
      fs.writeFile(
        path.join(__dirname, './results.json'),
        JSON.stringify(cleaned, null, 2),
        (err) => {
          if (err) {
            err.forEach((error) => {
              console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
            });
          }
        }
      );

      // write errors to another file so I can address them later
      fs.writeFile(
        path.join(__dirname, './errors.json'),
        JSON.stringify(errors, null, 2),
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
