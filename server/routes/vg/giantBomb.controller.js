const axios = require('axios');
const gbKey = process.env.JGBKEY;

module.exports.getConsoleData = function(guid) {
  return new Promise((resolve, reject) => {
    return axios
      .get(`https://www.giantbomb.com/api/platform/${guid}/?api_key=${gbKey}&format=json`)
      .then(result => {
        if (result.data.results) {
          resolve(result.data.results);
        } else {
          reject({ error: true, message: 'ERROR FETCHING CONSOLE FROM GB!', code: result.data });
        }
      })
      .catch(error => {
        reject({ error: true, message: 'ERROR FETCHING CONSOLE FROM GB!', code: error });
      });
  });
};

module.exports.searchConsoles = function(req, res) {
  const urlName = encodeURI(req.body.platform);
  axios
    .get(
      `https://www.giantbomb.com/api/platforms/?api_key=${gbKey}&filter=name:${urlName}&format=json`
    )
    .then(result => {
      try {
        const cleaned = result.data.results.map(item => {
          item.gbid = item.id;
          return item;
        });
        res.status(200).json(cleaned);
      } catch (error) {
        res.status(500).json({ error: true, message: `UNKNOWN ERROR WITH GB: ${error}` });
      }
    })
    .catch(error => {
      res.status(500).send(error);
    });
};

module.exports.searchGames = function(req, res) {
  if (req.body && req.body.platform && req.body.game) {
    const urlName = encodeURI(req.body.game);
    axios
      .get(
        `https://www.giantbomb.com/api/games/?api_key=${gbKey}&filter=name:${urlName},platforms:${
          req.body.platform
        }&format=json`
      )
      .then(result => {
        if (result && result.data && result.data.results) {
          try {
            const cleaned = result.data.results.map(item => {
              item.gbid = item.id;
              return item;
            });
            res.json(cleaned);
          } catch (err) {
            res.status(500).json({ error: true, message: `UNKNOWN ERROR WITH GB: ${err}` });
          }
        } else {
          res.status(500).json({
            error: true,
            message:
              'ERROR: Empty response or something went wrong searching Giant Bomb for that game!'
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          error: true,
          code: error,
          message: 'ERROR: PROBLEM SEARCHING GIANT BOMB FOR THAT GAME!'
        });
      });
  }
};
