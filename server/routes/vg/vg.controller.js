const db = require('../../db');
const igdb = require('igdb-api-node').default;
const moment = require('moment');
const _cloneDeep = require('lodash/cloneDeep');
const axios = require('axios');
const logger = require('../../config/logger');

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
      .then((result) => {
        if (result && result.data) {
          const rCopy = _cloneDeep(result.data);
          const cleaned = rCopy.map((item) => {
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
      .catch((error) => {
        logger.logThis(error, req);
        res.status(500).send(error);
      });
  }
};

module.exports.searchGame = async function (req, res) {
  const fields = `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name`;
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
      .then((result) => {
        if (result.status === 200) {
          const rCopy = _cloneDeep(result.data);
          const cleaned = rCopy.map((item) => {
            if (item.first_release_date) {
              const rDate = item.first_release_date;
              item.first_release_date = moment(parseInt(`${rDate}000`)).format('MM/DD/YYYY');
            }
            if (item.total_rating) {
              const trCopy = item.total_rating.toFixed();
              item.total_rating = parseInt(trCopy);
            }
            item.esrb = { rating: null, letterRating: null };
            if (item.age_ratings && item.age_ratings.length) {
              const esrb = item.age_ratings.filter((r) => r.rating > 5).map((r) => r.rating);
              item.esrb.rating = esrb[0];
              item.esrb.letterRating =
                esrbData && esrb && esrb.length ? esrbData[esrb[0].toString()] : '';
            }
            const gCopy = _cloneDeep(item.genres);
            const gCleaned = gCopy && gCopy.length ? gCopy.map((g) => g.name) : null;
            item.genres = gCleaned;
            item.forConsoleId = req.body.platform || undefined;
            if (item.cover && item.cover.url) {
              const bigImage = item.cover.url.replace('t_thumb', 't_cover_big');
              item.image = `https:${bigImage}`;
            } else {
              item.image = '';
            }
            return item;
          });
          res.status(200).json(cleaned);
        }
      })
      .catch((error) => {
        console.log('error', error);
        logger.logThis(error, req);
        res.status(500).json(error);
      });
  }
};

module.exports.getGenre = function (req, res) {
  if (req.body.genre) {
    axios
      .get(`https://api-endpoint.igdb.com/genres/${req.body.genre}?fields=id,name`, {
        headers: { 'user-key': process.env.IGDBKEY }
      })
      .then((result) => {
        res.json(result.data);
      })
      .catch((error) => {
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
