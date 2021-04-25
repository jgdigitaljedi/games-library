const db = require('../../db');
const igdb = require('igdb-api-node').default;
const moment = require('moment');
const _cloneDeep = require('lodash/cloneDeep');
const _uniq = require('lodash/uniq');
const axios = require('axios');
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
  console.log('clientId', twitchClientId);
  console.log('token', appKey.access_token);
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

module.exports.searchPlatforms = async function (req, res) {
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req.body && req.body.platform) {
    const request = client
      .fields(
        `alternative_name,generation,name,summary,versions.name,versions.platform_version_release_dates.date,platform_logo.url,url`
      )
      .search(req.body.platform)
      .request('/platforms');
    request
      .then(result => {
        if (result && result.data) {
          const rCopy = _cloneDeep(result.data);
          const cleaned = rCopy.map(item => {
            if (item && item.platform_logo && item.platform_logo.url) {
              item.logo = { url: item.platform_logo.url };
            }
            return item;
          });
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

module.exports.searchGame = async function (req, res) {
  console.log('search game');
  const fields = `age_ratings.rating,total_rating,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name,storyline,summary`;
  if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
    client = await refreshAppKey();
  }
  if (req.body && req.body.game && req.body.platform) {
    let request;
    if (req.body.fuzzy || req.body.platform === 99999) {
      request = client.fields(fields).search(req.body.game).request('/games');
    } else {
      request = client
        .fields(fields)
        .search(req.body.game)
        .where(`platforms = [${req.body.platform}]`)
        .request('/games');
    }

    request
      .then(result => {
        if (result.status === 200) {
          const rCopy = _cloneDeep(result.data);
          const cleaned = rCopy.map(item => {
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
            game.consoleId = req.body.platform || undefined;
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
            game.consoleName = getConsoleName(req.body.platform);
            game.name = item.name;
            game.id = item.id;
            const defaultedOut = getDefaults(game);
            return defaultedOut;
          });
          res.status(200).json(cleaned);
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

// module.exports.updateGameRatings = async function(id) {
//   if (!client || !appKey || moment().isAfter(appKeyTimestamp)) {
//     client = await refreshAppKey();
//   }

//   return new Promise((resolve, reject) => {
//     return client
//       .fields(`id,name,total_rating,total_rating_count`)
//       .search(req.body.game)
//       .where(`platforms = [${req.body.platform}]`)
//       .request('/games')
//       .then(result => {
//         resolve(result.data);
//       })
//       .catch(error => {
//         logger.logThis(error, 'Update game with id: ' + id);
//         reject(error);
//       });
//   });
// };
