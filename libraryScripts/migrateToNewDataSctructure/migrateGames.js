const games = require('../../server/db/gamesTransitioned.json');
const axios = require('axios');
const _throttle = require('lodash/throttle');
const igdb = require('igdb-api-node').default;
const moment = require('moment');

let client;
let appKey;
let appKeyTimestamp;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchSecretToken = process.env.TWITCH_SECRET_TOKEN;
const fields = `age_ratings.rating,total_rating,total_rating_count,first_release_date,genres.name,name,cover.url,multiplayer_modes,videos.video_id,multiplayer_modes.offlinecoopmax,multiplayer_modes.offlinemax,multiplayer_modes.splitscreen,player_perspectives.name`;

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

const getNewGameData = (game) => {
  client.fields(fields).where(`id = ${game.id}`).request('/games');
};

const throttled = _throttle((game) => {
  return getNewGameData(game);
}, 300);
