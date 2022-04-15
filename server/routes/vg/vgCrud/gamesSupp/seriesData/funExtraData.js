const nesBlackBox = require('../../../../../extra/otherData/nesBlackBoxTitles.json');
const genBlackBox = require('../../../../../extra/otherData/blackBoxGridGenesisGames.json');
const nesHangTab = require('../../../../../extra/otherData/nesHangtabGames.json');
const db = require('../../../../../db');
const _uniq = require('lodash/uniq');

const games = db.games.find();

const nesHangTabTotal = nesHangTab.length;
const nesBBTotal = nesBlackBox.length;
const genBBTotal = genBlackBox.length;

const nesHangTabsIds = [],
  nesBBIds = [],
  genBBIds = [],
  bannedIds = [];

function gatherExtraData(extraData, id) {
  const last = extraData.length - 1;
  return new Promise((resolve, reject) => {
    extraData.forEach((data, index) => {
      const detailsString = data?.details?.join(';');
      if (/NES hang tab game/gi.test(detailsString)) {
        nesHangTabsIds.push(id);
      } else if (/Sega Genesis\/Mega Drive black box grid game/gi.test(detailsString)) {
        genBBIds.push(id);
      }
      if (/NES black box game/gi.test(detailsString)) {
        nesBBIds.push(id);
      }
      if (/banned/gi.test(detailsString)) {
        bannedIds.push(id);
      }
      if (index === last) {
        resolve();
      }
    });
  });
}

module.exports.funExtraData = function () {
  return new Promise((resolve, reject) => {
    Promise.all(
      games.map(game => {
        const extraData = game.extraDataFull || [];
        if (extraData?.length > 0) {
          return gatherExtraData(extraData, game.id);
        }
        return Promise.resolve();
      })
    )
      .then(() => {
        resolve([
          {
            total: nesHangTabTotal,
            owned: _uniq(nesHangTabsIds).length,
            title: 'NES Hang Tab Games'
          },
          {
            total: nesBBTotal,
            owned: _uniq(nesBBIds).length,
            title: 'NES Block Box Games'
          },
          {
            total: genBBTotal,
            owned: _uniq(genBBIds).length,
            title: 'Genesis Black Box Grid Games'
          },
          {
            total: null,
            owned: _uniq(bannedIds).length,
            title: 'Banned Games'
          }
        ]);
      })
      .catch(error => {
        reject(error);
      });
  });
};
