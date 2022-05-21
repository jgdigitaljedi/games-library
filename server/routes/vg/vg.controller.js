const db = require('../../db');
const igdb = require('igdb-api-node').default;
const moment = require('moment');
const _cloneDeep = require('lodash/cloneDeep');
const _uniq = require('lodash/uniq');
const _sortBy = require('lodash/sortBy');
const axios = require('axios');
const chalk = require('chalk');
const async = require('async');

const saveUpdatedGame = require('./vgCrud/gamesCrud.controller').edit;
const saveUpdatedConsole = require('./vgCrud/clonesCrud.controller').edit;

const logger = require('../../config/logger');
const consolesCrud = require('./vgCrud/consolesCrud.controller');
const getLocation = require('./gamesHelpers/consoleLocation').getLocation;
const isHandheld = require('./gamesHelpers/handhelds').isHandheld;
const getExtraData = require('./gamesHelpers/extraGameData').getExtraData;
const getBasicGenre = require('../../extra/utils/getBasicGenresFromName').getBasicGenre;

let client;
let appKey;
let appKeyTimestamp;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchSecretToken = process.env.TWITCH_SECRET_TOKEN;

const esrbData = {
  6: 'RP',
  7: 'EC',
  8: 'E',
  9: 'E10+',
  10: 'T',
  11: 'M',
  12: 'AO'
};

// prettier-ignore
const preferredRegionIds = [
  {id: '2', region: 'North America'},
  {id: '8', region: 'Worldwide'},
  {id: '5', region: 'Japan'}
];

const gameRequestFields = `age_ratings.rating,total_rating,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name,storyline,summary`;
const platformVersionRequestFields = `connectivity,memory,cpu,os,media,name,output,platform_logo.url,platform_logo.image_id,platform_version_release_dates.human,platform_version_release_dates.region,resolutions,storage,summary,output`;
const platformRequestFields = `alternative_name,generation,name,summary,versions.name,versions.platform_version_release_dates.date,platform_logo.url,category`;

const pcId = 6;

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

function formatMultiplayerModes(modes) {
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
}

function getConsoleName(id) {
  const platforms = consolesCrud.getPlatforms();
  const selected = platforms.filter(p => p.igdb && p.igdb.id === id);
  if (selected && selected.length) {
    return selected[0].igdb.name;
  } else {
    return null;
  }
}

function getDefaults(game) {
  game.manual = false;
  game.pricePaid = 0;
  game.cib = false;
  game.compilation = false;
  game.compilationGamesIds = [];
  game.gamesService = {
    xbGold: false,
    xbPass: false,
    psPlus: false,
    primeFree: false
  };
  game.physical = game.consoleId !== pcId;
  game.case = game.consoleId === pcId ? 'none' : 'original';
  game.condition = game.consoleId === pcId ? 'Other' : 'Good';
  game.location = getLocation(game.consoleId);
  game.handheld = isHandheld(game.consoleId, game.consoleName);
  const withExtraData = getExtraData(game);
  return withExtraData;
}

module.exports.checkKey = function (req, res) {
  const creds = db.admin.find();
  if (creds) {
    if (req.body && req.body.key && req.body.key === creds[0].key) {
      res.status(200).json({ success: true, message: 'Keys match!' });
    } else {
      res.status(200).json({ success: false, message: 'Key DO NOT match!' });
    }
  } else {
    logger.logThis('ERROR FETCHING CREDS', req);
    res.status(500).json({ success: false, error: true, message: 'ERROR FETCHING CREDS FROM DB!' });
  }
};

function formatIgdbGameData(gameData, platform) {
  return gameData.map(item => {
    const game = {};
    if (item.summary) {
      game.description = item.summary;
    } else if (item.storyline) {
      game.description = item.storyline;
    } else {
      game.description = '';
    }
    if (item.summary && item.storyline) {
      game.story = item.storyline;
    } else {
      game.story = '';
    }
    if (item.first_release_date) {
      const rDate = item.first_release_date;
      game.first_release_date = moment(parseInt(`${rDate}000`)).format('MM/DD/YYYY');
    }
    if (item.total_rating) {
      const trCopy = item.total_rating.toFixed();
      game.total_rating = parseInt(trCopy);
    } else {
      game.total_rating = null;
    }
    item.esrb = { rating: null, letterRating: null };
    if (item.age_ratings && item.age_ratings.length) {
      const esrb = item.age_ratings.filter(r => r.rating > 5).map(r => r.rating);
      game.esrb = esrbData && esrb && esrb.length ? esrbData[esrb[0].toString()] : null;
    }
    if (item.videos && item.videos.length) {
      const vCopy = item.videos.map(v => v.video_id);
      game.videos = vCopy;
    } else {
      game.videos = [];
    }
    if (item.player_perspectives && item.player_perspectives.length) {
      const ppCopy = item.player_perspectives.map(p => p.name);
      game.player_perspectives = ppCopy;
    } else {
      game.player_perspectives = [];
    }
    const gCopy = _cloneDeep(item.genres);
    const gCleaned = gCopy && gCopy.length ? gCopy.map(g => g.name) : [];
    const basicGenres = getBasicGenre(item.name);
    const combinedGenres = _uniq([...gCleaned, ...basicGenres].filter(g => g)) || [];
    game.genres = combinedGenres;
    game.consoleId = platform || undefined;
    if (item.cover && item.cover.url) {
      const bigImage = item.cover.url.replace('t_thumb', 't_cover_big');
      game.image = `https:${bigImage}`;
    } else {
      game.image = '';
    }
    if (item.multiplayer_modes) {
      const modes = formatMultiplayerModes(item.multiplayer_modes);
      game.maxMultiplayer = modes.max;
      game.multiplayer_modes = modes.combined;
    }
    game.consoleName = getConsoleName(platform);
    game.name = item.name;
    game.id = item.id;
    const defaultedOut = getDefaults(game);
    return defaultedOut;
  });
}

module.exports.searchGame = async function (req, res) {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req.body && req.body.game && req.body.platform) {
    let request;
    if (req.body.fuzzy || req.body.platform === 99999) {
      request = client.fields(gameRequestFields).search(req.body.game).request('/games');
    } else {
      request = client
        .fields(gameRequestFields)
        .search(req.body.game)
        .where(`platforms = [${req.body.platform}]`)
        .request('/games');
    }

    request
      .then(result => {
        if (result.status === 200) {
          const rCopy = _cloneDeep(result.data);
          const igdbFormatted = formatIgdbGameData(rCopy, req.body.platform);
          res.status(200).json(igdbFormatted);
        }
      })
      .catch(error => {
        console.log('error', error);
        logger.logThis(error, req);
        res.status(500).json(error);
      });
  } else {
    if (req.body && !req.body.game) {
      res.status(400).json({ error: true, message: 'BAD REQUEST. MISSING GAME TITLE TO SEARCH.' });
    } else if (req.body && !req.body.platform) {
      res.status(400).json({ error: true, message: 'BAD REQUEST. MISSING PLATFORM TO SEARCH.' });
    } else {
      req.status(400).json({ error: true, message: 'BAD REQUEST.' });
    }
  }
};

module.exports.getGenre = function (req, res) {
  if (req.body.genre) {
    axios
      .get(`https://api-endpoint.igdb.com/genres/${req.body.genre}?fields=id,name`, {
        headers: { 'user-key': process.env.IGDBKEY }
      })
      .then(result => {
        res.json(result.data);
      })
      .catch(error => {
        logger.logThis(error, req);
        res
          .status(500)
          .json({ error: true, message: 'ERROR: SOMETHING WENT WRONG GETTING GENRE DATA!' });
      });
  } else {
    res
      .status(400)
      .json({ error: true, message: 'ERROR: You are missing a genre id in your request body!' });
  }
};

module.exports.updateGameById = async (req, res) => {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req?.body?.game && req.params.id) {
    const request = client
      .fields(gameRequestFields)
      .where(`id = ${req.params.id}`)
      .request('/games');

    const oldGame = req.body.game;

    request
      .then(result => {
        const rCopy = _cloneDeep(result.data);
        const igdbFormatted = formatIgdbGameData(rCopy, oldGame.consoleId)[0];
        const genres = _uniq([...(oldGame.genres || []), ...(igdbFormatted.genres || [])]);
        const final = {
          case: oldGame.case,
          caseType: oldGame.caseType,
          cib: oldGame.cib,
          compilation: oldGame.compilation,
          compilationGamesIds: oldGame.compilationGamesIds,
          condition: oldGame.condition,
          consoleId: oldGame.consoleId,
          consoleName: oldGame.consoleName,
          createdAt: oldGame.createdAt,
          datePurchased: oldGame.datePurchased,
          description: igdbFormatted.description,
          esrb: igdbFormatted.esrb,
          extraData: oldGame.extraData,
          extraDataFull: oldGame.extraDataFull,
          first_release_date: igdbFormatted.first_release_date,
          gamesService: oldGame.gamesService,
          genres,
          genresDisplay: genres.join(', '),
          handheld: oldGame.handheld,
          howAcquired: oldGame.howAcquired,
          id: oldGame.id,
          image: igdbFormatted.image,
          location: oldGame.location,
          manual: oldGame.manual,
          maxMultiplayer: igdbFormatted.maxMultiplayer,
          multiplayer_modes: igdbFormatted.multiplayer_modes,
          name: igdbFormatted.name,
          notes: oldGame.notes,
          physical: oldGame.physical,
          player_perspectives: igdbFormatted.player_perspectives,
          priceCharting: oldGame.priceCharting,
          pricePaid: oldGame.pricePaid,
          purchaseDate: oldGame.purchaseDate,
          story: igdbFormatted.story,
          total_rating: igdbFormatted.total_rating,
          updatedAt: moment().format('MM/DD/YYYY hh:mm a'),
          videos: igdbFormatted.videos,
          vr: oldGame.vr,
          _id: oldGame._id
        };
        res.status(200).json(final);
      })
      .catch(error => {
        console.log('error', error);
        logger.logThis(error, req);
        res.status(500).json(error);
      });
  } else {
    if (req.body && !req.body.game) {
      res.status(400).json({ error: true, message: 'BAD REQUEST. MISSING GAME ID TO SEARCH.' });
    } else {
      req.status(400).json({ error: true, message: 'BAD REQUEST.' });
    }
  }
};

/**
 * ************ Platform Calls ************
 * */

function getReleaseDate(prd) {
  const regionArr = prd.map(d => d.region.toString());
  const preferrdIdsOrdered = preferredRegionIds.map(p => p.id);
  const regionArrWithNames = preferrdIdsOrdered
    .map((key, index) => {
      const indOf = regionArr.indexOf(key);
      if (indOf >= 0) {
        return {
          index: indOf,
          region: preferredRegionIds[index].region,
          date: moment.isDate(prd[indOf].human)
            ? moment(prd[indOf].human).format('MM/DD/YYYY')
            : moment(prd[indOf].human, 'MMM DD, YYYY').format('MM/DD/YYYY')
        };
      }
      return null;
    })
    .filter(n => n);
  console.log('regionArrWithNames', regionArrWithNames);
  return {
    region:
      regionArrWithNames?.length && regionArrWithNames[0].hasOwnProperty('region')
        ? regionArrWithNames[0].region
        : null,
    date:
      regionArrWithNames?.length && regionArrWithNames[0].hasOwnProperty('date')
        ? regionArrWithNames[0].date
        : null
  };
}

function formatIgdbPlatformVersionData(item) {
  const formatted = {};
  formatted.cpu = item.cpu ? item.cpu : null;
  formatted.media = item.media ? item.media : null;
  formatted.memory = item.memory ? item.memory : null;
  formatted.output = item.output ? item.output : null;
  formatted.os = item.os ? item.os : null;
  formatted.platform_logo = item.platform_logo || {};
  formatted.connectivity = item.connectivity ? item.connectivity : null;
  console.log('item.platform_version_release_dates', item.platform_version_release_dates);
  formatted.releaseDate = item.platform_version_release_dates
    ? getReleaseDate(item.platform_version_release_dates)
    : null;
  return formatted;
}

function formatIgdbPlatformData(result) {
  const rCopy = _cloneDeep(Array.isArray(result) ? result : [result]);
  return rCopy.map(item => {
    if (item && item.platform_logo && item.platform_logo.url) {
      item.logo = { url: item.platform_logo.url };
    }
    return item;
  });
}

module.exports.searchPlatformVersions = async function (req, res) {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req.body && req.body.platform) {
    const request = client
      .fields(platformVersionRequestFields)
      // .search(req.body.platform)
      .where(`id = ${req.body.platform}`)
      .request('/platform_versions');
    request
      .then(result => {
        if (result.status === 200) {
          const item = result.data[0];
          console.log('result.data', result.data);
          const formatted = formatIgdbPlatformVersionData(item);
          res.status(200).json(formatted);
        } else {
          res.status(result.status || 500).json({ platformVersionId: req.body.platform, result });
        }
      })
      .catch(error => {
        logger.logThis(error, req);
        res.status(500).send(error);
      });
  }
};

module.exports.searchPlatforms = async function (req, res) {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req.body && req.body.platform) {
    const request = client
      .fields(platformRequestFields)
      .search(req.body.platform)
      .request('/platforms');
    request
      .then(result => {
        if (result && result.data) {
          // const rCopy = _cloneDeep(result.data);
          const cleaned = formatIgdbPlatformData(result.data);
          res.status(200).json(cleaned);
        } else {
          res.status(200).json({
            error: true,
            message: 'RESULT RETRIEVED BUT DOES NOT HAVE BODY!',
            result: result
          });
        }
      })
      .catch(error => {
        logger.logThis(error, req);
        res.status(500).send(error);
      });
  }
};

module.exports.updatePlatformById = async (req, res, shouldReturn) => {
  console.log('shouldReturn', shouldReturn);
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req?.body?.platform && req.params.id) {
    const oldPlatform = req.body.platform;
    const request = client
      .fields(platformRequestFields)
      // .search(req.body.platform)
      .where(`id = ${oldPlatform.id}`)
      .request('/platforms');

    const versionRequest = client
      .fields(platformVersionRequestFields)
      .where(`id = ${oldPlatform.version.id}`)
      .request('/platform_versions');

    return request
      .then(async result => {
        if (result.status === 200) {
          const item = result.data[0];
          const formatted = formatIgdbPlatformData(item);
          const versionRaw = (await versionRequest).data;
          const correctVersion = versionRaw.find(v => v.id === oldPlatform.version.id);
          const version = formatIgdbPlatformVersionData(correctVersion);
          const combined = { ...oldPlatform, ...formatted[0], ...version };
          delete combined.versions;
          console.log('combined', combined);
          if (shouldReturn === true) {
            combined.updatedAt = moment().format('MM/DD/YYYY hh:mm a');
            return Promise.resolve(combined);
          } else {
            res.status(200).json(combined);
          }
        } else {
          if (shouldReturn === true) {
            return Promise.resolve({
              error: true,
              message: 'There was a problem updating IGDB data.'
            });
          }
          logger.logThis(result.error, req);
          res.status(result.status || 500).json({ platformVersionId: req.body.platform, result });
        }
      })
      .catch(error => {
        console.log('ERROR*********', error);
        logger.logThis(error, req);
        if (shouldReturn) {
          return Promise.resolve(error);
        } else {
          res.status(500).send(error);
        }
      });
  } else {
    if (req.body && !req.body.platform) {
      res.status(400).json({ error: true, message: 'BAD REQUEST. MISSING PLATFORM ID TO SEARCH.' });
    } else {
      req.status(400).json({ error: true, message: 'BAD REQUEST.' });
    }
  }
};

/************** update all IGDB calls  ****************/

function throttleCalls(data, cb) {
  return new Promise((resolve, reject) => {
    try {
      return async.mapLimit(data, 1, cb, (error, results) => {
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
}

async function getDataById(item, which) {
  try {
    if (which === 'CONSOLE') {
      return await module.exports.updatePlatformById(
        { body: { platform: item }, params: { id: item.id } },
        null,
        true
      );
    } else {
    }
  } catch (error) {
    console.log('pc call error', error);
    return { error: true, message: error };
  }
}

async function updateGameData(game) {
  // if (game.hasOwnProperty('id')) {
  //   const newData = await getDataById(game);
  //   const formatted = formatPcResult(newData.data, game, 'GAME');
  //   const saveStatus = await saveUpdatedGame(game._id, {
  //     ...game,
  //     priceCharting: { ...formatted }
  //   });
  //   return saveStatus;
  // } else {
  //   return null;
  // }
}

async function updatePlatformData(platform) {
  console.log('platform', platform.name);
  if (platform.hasOwnProperty('id')) {
    try {
      const newData = await getDataById(platform, 'CONSOLE');
      console.log('result', newData);
      return newData;
      // const saveStatus = await saveUpdatedConsole(platform._id, {
      //   ...newData
      // });
      // return saveStatus;
    } catch (error) {
      logger.logThis(error, 'updatePlatformData call');
      return error;
    }
  } else {
    return platform;
  }
}

module.exports.updateAllIgdbGames = async (req, res) => {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  const games = db.games.find();
  try {
    const result = await throttleCalls(games, updateGameData);
    return result;
  } catch (error) {
    return Promise.resolve({ error: true, message: error });
  }
};

module.exports.updateAllIgdbPlatforms = async (req, res) => {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  const platforms = db.consoles.find();
  try {
    const result = await throttleCalls(platforms, updatePlatformData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error });
  }
};
