const db = require('../../db');
const igdb = require('igdb-api-node').default;
const client = igdb(process.env.IGDBKEY);
const moment = require('moment');
const _cloneDeep = require('lodash/cloneDeep');
const axios = require('axios');
const logger = require('../../config/logger');
const apicalypse = require('apicalypse');
/*******
 * Expander API: https://igdb.github.io/api/references/expander/
 * Endpoints API: https://igdb.github.io/api/endpoints/game/
 * ESRB: https://igdb.github.io/api/enum-fields/esrb-rating/
 *****/

const esrbData = {
  '6': 'RP',
  '7': 'EC',
  '8': 'E',
  '9': 'E10+',
  '10': 'T',
  '11': 'M',
  '12': 'AO'
};

module.exports.login = function(req, res) {
  const creds = db.admin.find();
  if (
    req.body &&
    req.body.pass &&
    req.body.pass === creds[0].secret &&
    req.body.username &&
    req.body.username === creds[0].uName
  ) {
    res.json({
      success: true,
      key: creds[0].key
    });
  } else {
    res.status(200).json({
      success: false,
      message: 'Password is incorrect!'
    });
  }
};

module.exports.checkKey = function(req, res) {
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

module.exports.searchPlatforms = function(req, res) {
  if (req.body && req.body.platform) {
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        Accept: 'application/json',
        'user-key': process.env.IGDBV3KEY
      }
    };
    const request = apicalypse
      .default(requestOptions)
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

module.exports.searchGame = function(req, res) {
  if (req.body && req.body.game && req.body.platform) {
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        Accept: 'application/json',
        'user-key': process.env.IGDBV3KEY
      }
    };
    let request;
    if (req.body.fuzzy) {
      request = apicalypse
        .default(requestOptions)
        .fields(
          `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name`
        )
        .search(req.body.game)
        .request('/games');
    } else {
      request = apicalypse
        .default(requestOptions)
        .fields(
          `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name`
        )
        .search(req.body.game)
        .where(`platforms = [${req.body.platform}]`)
        .request('/games');
    }

    request
      .then(result => {
        if (result.status === 200) {
          const rCopy = _cloneDeep(result.data);
          const cleaned = rCopy.map(item => {
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
              const esrb = item.age_ratings.filter(r => r.rating > 5).map(r => r.rating);
              item.esrb.rating = esrb[0];
              item.esrb.letterRating =
                esrbData && esrb && esrb.length ? esrbData[esrb[0].toString()] : '';
            }
            const gCopy = _cloneDeep(item.genres);
            const gCleaned = gCopy && gCopy.length ? gCopy.map(g => g.name) : null;
            item.genres = gCleaned;
            return item;
          });
          res.status(200).json(cleaned);
        }
      })
      .catch(error => {
        console.log('error', error);
        logger.logThis(error, req);
        res.status(500).json(error);
      });
  }
};

module.exports.getGenre = function(req, res) {
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

module.exports.updateGameRatings = function(id) {
  const requestOptions = {
    method: 'POST',
    baseURL: 'https://api-v3.igdb.com',
    headers: {
      Accept: 'application/json',
      'user-key': process.env.IGDBV3KEY
    }
  };

  return new Promise((resolve, reject) => {
    return apicalypse
      .default(requestOptions)
      .fields(`id,name,total_rating,total_rating_count`)
      .search(req.body.game)
      .where(`platforms = [${req.body.platform}]`)
      .request('/games')
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        logger.logThis(error, 'Update game with id: ' + id);
        reject(error);
      });
    // return axios
    //   .get(
    //     `https://api-endpoint.igdb.com/games/${id}?fields=id,name,total_rating,total_rating_count`,
    //     {
    //       headers: { 'user-key': process.env.IGDBKEY }
    //     }
    //   )
    //   .then(result => {
    //     resolve(result.data);
    //   })
    //   .catch(error => {
    //     logger.logThis(error, 'Update game with id: ' + id);
    //     reject(error);
    //   });
  });
};
