// @TODO: change these file specific variables each time
/***************************************************** */
const fileName = 'megaEverdrive32xGames.json';
const gameNotes = 'playable via Mega Everdrive';
const errorRun = null; // null for regular file, number if running against errors from previous run
const location = 'upstairs';
const handheld = false;
const compilation = false;
const compilationGamesIds = [];
const gamesService = {
  xbGold: false,
  xbPass: false,
  psPlus: false,
  primeFree: false,
  switchFree: false
};
/***************************************************** */

const games = require(`../../server/extra/everDrives/${fileName}`);
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const whitespace = require('stringman').whitespace;
const async = require('async');

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

let edId = 1000000;
function createEverdriveId() {
  edId++;
  return edId;
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
    condition: 'other',
    case: false,
    pricePaid: 0,
    physical: false,
    cib: false,
    datePurchased: moment().format('YYYY-MM-DD'),
    howAcquired: 'piracy',
    notes: gameNotes,
    createdAt: moment().format('MM/DD/YYYY'),
    updatedAt: moment().format('MM/DD/YYYY'),
    _id: createEverdriveId(),
    name: game.igdb && game.igdb.name ? game.igdb.name : '',
    extraData: game.extraData,
    extraDataFull: game.extraDataFull,
    genres: game.igdb ? game.igdb.genres : [],
    physicalDigital: ['EverDrive'],
    manual: false,
    handheld,
    location,
    compilation,
    compilationGamesIds,
    gamesService,
    consoleArr: [{ consoleName: game.consoleName, consoleId: game.consoleId }]
  };
  return oldData;
}

const getMultiplayerModes = modes => {
  // just getting the max numbers here
  // not concerned about which is true for which game mode as I can figure that out if I want to play multiplayer with someone
  let max = 0;
  const combined = modes.reduce((acc, obj, index) => {
    if (index === 0) {
      acc = { offlinemax: 0, offlinecoopmax: 0, splitscreen: false };
    }
    if (obj.offlinemax > acc.offlinemax) {
      acc.offlinemax = obj.offlinemax;
      if (obj.offlinemax > max) {
        max = obj.offlinemax;
      }
    }
    if (obj.offlinecoopmax > acc.offlinecoopmax) {
      acc.offlinecoopmax = obj.offlinecoopmax;
      if (obj.offlinecoopmax > max) {
        max = obj.offlinecoopmax;
      }
    }
    if (obj.splitscreen) {
      acc.splitscreen = true;
    }
    return acc;
  }, {});
  return { combined, max };
};

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
        .then(result => {
          // console.log(chalk.green('result', JSON.stringify(result.data, null, 2)));
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
              const esrb = item.age_ratings.filter(r => r.rating > 5).map(r => r.rating);
              formatted.esrb = esrbData && esrb && esrb.length ? esrbData[esrb[0].toString()] : '';
            }
            formatted.videos =
              item.videos && item.videos.length ? item.videos.map(v => v.video_id) : null;
            if (item.cover && item.cover.url) {
              const bigImage = item.cover.url.replace('t_thumb', 't_cover_big');
              formatted.image = `https:${bigImage}`;
            } else {
              item.image = '';
            }
            formatted.description = item.summary ? whitespace.removeBreaks(item.summary) : null;
            formatted.story = item.storyline || null;
            formatted.player_perspectives = item.player_perspectives
              ? item.player_perspectives.map(p => p.name)
              : [];
            const multiplayer = item.multiplayer_modes
              ? getMultiplayerModes(item.multiplayer_modes)
              : { offlinemax: 0, offlinecoopmax: 0, splitscreen: false };
            formatted.multiplayer_modes = multiplayer.combined;
            formatted.maxMultiplayer = multiplayer.max;
            const oldData = getUserData(game);
            const newGameData = { ...formatted, ...oldData };
            console.log(chalk.magenta(game.igdb.name));
            resolve(newGameData);
          } else {
            const gameError = { ...game, error: true };
            console.log(chalk.red(game.igdb.name));
            resolve(gameError);
          }
        })
        .catch(error => {
          const gameError = { ...game, error };
          console.log(chalk.red(game.igdb.name));
          console.log(chalk.blue(error));
          resolve(gameError);
        });
    } else {
      console.log(chalk.red(game.igdb.name));
      resolve({ ...game, error: true });
    }
  });
}

function handleResults(results) {
  const cleaned = [],
    errors = [];
  results.forEach(result => {
    if (result.error) {
      errors.push(result);
    } else {
      cleaned.push(result);
    }
  });
  console.log(chalk.green(`Writing ${cleaned.length} results`));
  console.log(chalk.yellow(`Writing ${errors.length} errors`));

  // write results
  fs.writeFile(
    path.join(__dirname, `./results/${fileName}${errorRun || ''}`),
    JSON.stringify(cleaned, null, 2),
    err => {
      if (err) {
        err.forEach(error => {
          console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
        });
      }
    }
  );

  // write errors to another file so I can address them later
  fs.writeFile(
    path.join(__dirname, `./errors/errors${fileName}${errorRun || ''}`),
    JSON.stringify(errors, null, 2),
    err => {
      if (err) {
        err.forEach(error => {
          console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
        });
      }
    }
  );
}

refreshAppKey()
  .then(() => {
    try {
      async.mapLimit(games, 1, getNewGameData, (error, results) => {
        if (error) {
          console.log(chalk.red.bold('ERROR IN ASYNC.MAP', error));
        }
        handleResults(results);
      });
    } catch (err) {
      console.log(chalk.red.bold('ERROR: Async.mapLimit encountered an error', err));
    }
  })
  .catch(errors => {
    console.log(
      chalk.red.bold('ERROR: Problem with refreshAppKey', JSON.stringify(errors, null, 2))
    );
  });
