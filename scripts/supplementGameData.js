const fs = require('fs');
const path = require('path');
const _flatten = require('lodash/flatten');
const chalk = require('chalk');
const _sortBy = require('lodash/sortBy');

const fileLookup = require('./fileLookup').getFileRef;
const games = require('../server/db/games.json');
const ps1ToPs2 = require('./other/ps1ToPs2Bc.json');
const banned = require('./other/bannedInternationally.json');

// sort the games by console first to make iterating through files more efficient
const sorted = games.reduce((acc, obj) => {
  if (acc[obj.consoleIgdbId.toString()]) {
    acc[obj.consoleIgdbId.toString()].push(obj);
  } else {
    acc[obj.consoleIgdbId.toString()] = [obj];
  }
  return acc;
}, {});

const keys = Object.keys(sorted);

// this is where the extraData and extraDataFull get addded
const supp = keys.map(key => {
  const file = fileLookup(key);
  if (file) {
    const ids = file.map(f => f.igdbId);
    const gbids = file.map(f => f.gbId);
    return sorted[key].map(game => {
      if (game && game.igdb && game.igdb.id) {
        const index = ids.indexOf(game.igdb.id);
        if (game.extraData) {
          game.extraDataFull = [...game.extraDataFull, file[index]];
          game.extraData = [...game.extraData, ...file[index].details];
        } else {
          if (file[index]) {
            game.extraData = file[index].details;
            game.extraDataFull = [file[index]];
          } else {
            game.extraData = [];
            game.extraDataFull = [];
          }
        }
      } else if (game && game.gb && game.gb.gbid) {
        const index = gbids.indexOf(game.gb.gbId);
        if (game.extraData) {
          game.extraDataFull = [...game.extraDataFull, file[index]];
          game.extraData = [...game.extraData, ...file[index].details];
        } else {
          if (file[index]) {
            game.extraData = file[index].details;
            game.extraDataFull = [file[index]];
          } else {
            game.extraData = [];
            game.extraDataFull = [];
          }
        }
      }
      return game;
    });
  } else {
    return sorted[key];
  }
});

const flat = _sortBy(_flatten(supp), 'datePurchased').reverse();

const psIds = ps1ToPs2.map(p => p.igdbId);
const bannedIds = banned.map(b => b.igdbId);

const extraDataArr = flat.map(g => {
  // check if PS1 game by igdbId of 7
  if (g.consoleIgdbId === 7 && psIds.indexOf(g.igdb.id) >= 0) {
    const ind = psIds.indexOf(g.igdb.id);
    if (g.extraData && g.extraData.length) {
      g.extraData = [...g.extraData, ...ps1ToPs2[ind].details];
      g.extraDataFull = [...g.extraDataFull, ...ps1ToPs2[ind]];
    } else {
      g.extraData = ps1ToPs2[ind].details;
      g.extraDataFull = [ps1ToPs2[ind]];
    }
  }

  // now check banned internationally file as it isn't console specific
  const bannedInd = bannedIds.indexOf(g.igdb.id);
  if (bannedInd >= 0) {
    if (g.extraData && g.extraData.length) {
      g.extraData = [...g.extraData, ...banned[bannedInd].details];
      g.extraDataFull = [...g.extraDataFull, banned[bannedInd]];
    } else {
      g.extraData = banned[bannedInd].details;
      g.extraDataFull = [banned[bannedInd]];
    }
  }

  return g;
});

const writable = JSON.stringify(extraDataArr);

fs.writeFile(path.join(__dirname, '../server/db/gamesExtra.json'), writable, error => {
  if (error) {
    console.log(chalk.red.bold('ERROR SUPPLEMENTING DATA', error));
  } else {
    console.log(chalk.cyan('SUCCESSFULLY SUPPLEMENTED DATA!'));
  }
});
