const axios = require('axios');
const moment = require('moment');
const chalk = require('chalk');
const removeBreaks = require('stringman-utils').whitespaceRemoveBreaks;
const parensRemove = require('stringman-utils').parensRemove;
const async = require('async');
const fileLookup = require('../../fileLookup').getFileRef;
const banned = require('../../other/bannedInternationally.json');
const getBasicGenre = require('../../../server/extra/utils/getBasicGenresFromName').getBasicGenre;
const _flatten = require('lodash/flatten');
const _uniq = require('lodash/uniq');

let edId = 0;
let userData = null;
let errorRun = null;

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchSecretToken = process.env.TWITCH_SECRET_TOKEN;
const fields = `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name,storyline,summary,genres.name,name`;

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

function createEverdriveId(edId) {
  edId++;
  return edId;
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

const getExtraData = (game, consoleId) => {
  const extraDataFile = fileLookup(consoleId);
  const extra = extraDataFile ? extraDataFile.filter(g => g.igdbId === game.id) : null;
  if (extra) {
    const bannedData = banned.filter(b => b.igdbId === game.id);
    let short = [];
    let long = [];
    if (extra && extra.length) {
      short = _flatten(extra.map(e => e.details));
      long = extra[0];
    }
    if (bannedData && bannedData.length) {
      short.push(banned[0].details);
      long.push(banned[0]);
    }
    game.extraData = short;
    game.extraDataFull = long;
    return game;
  }
  game.extraData = [];
  game.extraDataFull = {};
};

const getGenres = game => {
  const coreGenres = game.genres.map(g => g.name) || [];
  const extraGenres = getBasicGenre(game.name) || [];
  return _uniq([...coreGenres, ...extraGenres].filter(g => g)) || [];
};

async function getNewGameData(game) {
  const gameNoBrackets = game.replace(/ *\[[^\]]*]/g, '');
  // const gameNoHyphen = gameNoBrackets.replace(/ -/, ': ');
  const gameNoParens = errorRun ? game : parensRemove(gameNoBrackets).split('.')[0];
  console.log(gameNoParens);
  edId = createEverdriveId(edId);
  return new Promise((resolve, reject) => {
    const data = `fields ${fields};\nwhere release_dates.platform = ${userData.consoleId};\nsearch "${gameNoParens}";\nlimit 1;`;
    const headers = makeHeaders(appKey);
    axios({
      url: `https://api.igdb.com/v4/games`,
      method: 'POST',
      headers,
      data
    })
      .then(result => {
        if (result.status === 200) {
          const formatted = {};
          const item = result.data[0];
          formatted.id = item.id;
          formatted.name = item.name;
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
            const esrb = item.age_ratings
              ? item.age_ratings.filter(r => r.rating > 5).map(r => r.rating)
              : [];
            formatted.esrb = esrbData && esrb && esrb.length ? esrbData[esrb[0].toString()] : '';
          }
          if (item.genres && item.genres.length) {
            formatted.genres = getGenres(item);
            formatted.genresDisplay = formatted.genres.join(', ');
          }
          formatted.videos =
            item.videos && item.videos.length ? item.videos.map(v => v.video_id) : null;
          if (item.cover && item.cover.url) {
            const bigImage = item.cover.url.replace('t_thumb', 't_cover_big');
            formatted.image = `https:${bigImage}`;
          } else {
            item.image = '';
          }
          formatted.description = item.summary ? removeBreaks(item.summary) : null;
          formatted.story = item.storyline || null;
          formatted.player_perspectives = item.player_perspectives
            ? item.player_perspectives.map(p => p.name)
            : [];
          const multiplayer = item.multiplayer_modes
            ? getMultiplayerModes(item.multiplayer_modes)
            : { offlinemax: 0, offlinecoopmax: 0, splitscreen: false };
          formatted.multiplayer_modes = multiplayer.combined;
          formatted.maxMultiplayer = multiplayer.max;
          const newGameData = { ...formatted, ...userData, _id: edId };
          getExtraData(newGameData, userData.consoleId);
          console.log(chalk.magenta(gameNoParens));
          resolve(newGameData);
        } else {
          const gameError = { gameNoParens, error: true };
          console.log(chalk.red(gameNoParens));
          resolve(gameError);
        }
      })
      .catch(error => {
        const gameError = { gameNoParens, error };
        console.log(chalk.red(gameNoParens));
        console.log(chalk.blue(error));
        resolve(gameError);
      });
  });
}

module.exports.setUserData = (
  conEdId,
  gameNotes,
  consoleName,
  consoleId,
  location,
  handheld,
  edConsole
) => {
  edId = conEdId;
  const gamesService = {
    xbGold: false,
    xbPass: false,
    psPlus: false,
    primeFree: false,
    switchFree: false
  };
  return {
    consoleName, // get name and console id from other files; making this pull from a list isn't worth the time
    consoleId,
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
    _id: createEverdriveId(edId),
    physicalDigital: ['EverDrive'],
    manual: false,
    handheld,
    location,
    compilation: false,
    compilationGamesIds: [],
    gamesService,
    consoleArr: [{ consoleName: edConsole.consoleName, consoleId: edConsole.consoleId }],
    vr: { vrOnly: false, vrCompatible: false }
  };
};

module.exports.fetchIgdbData = (gamesArr, userDataPassed, passedErrorRun) => {
  userData = userDataPassed;
  errorRun = passedErrorRun;
  return new Promise((resolve, reject) => {
    refreshAppKey()
      .then(() => {
        try {
          async.mapLimit(gamesArr, 1, getNewGameData, (error, results) => {
            if (error) {
              console.log(chalk.red.bold('ERROR IN ASYNC.MAP', error));
            }
            resolve(results);
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
  });
};
