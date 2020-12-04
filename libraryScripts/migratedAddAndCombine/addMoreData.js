const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _flatten = require('lodash/flatten');
const _sortBy = require('lodash/sortBy');

const fileLookup = require('./fileLookup').getFileRef;
const handhelds = require('./handhelds');

const games = require('../../server/db/games.json');
const conLocation = require('../consoleLocation');
const ps1ToPs2 = require('../other/ps1ToPs2Bc.json');
const banned = require('../other/bannedInternationally.json');

const outputResultsPath = path.join(__dirname, './outputtedResults.json');

const fixed = games.map(game => {
    // add location
    game.location = conLocation.getLocation(game.consoleId);

    // I'm gonna add handheld data now instead of when combined
    game.handheld = handhelds.isHandheld(game.consoleId, game.consoleName);

    // fix props that didn't take correctly but can be saved
    game.cib = !!game.cib;
    game.physical = !!game.physical;

    // add missing props as nulls
    if (!game.hasOwnProperty('player_perspectives')) {
        game.player_perspectives = [];
    }
    if (!game.hasOwnProperty('multiplayer_modes')) {
        game.multiplayer_modes = {
            offlinemax: 1,
            offlinecoopmax: 1,
            splitscreen: false
        }
    }
    if (!game.hasOwnProperty('manual')) {
        game.manual = game.cib;
    }
    if (!game.hasOwnProperty('maxMultiplayer') || game.maxMultiplayer === 0) {
        game.maxMultiplayer = 1;
    }
    if (!game.hasOwnProperty('story')) {
        game.story = null;
    }
    if (!game.hasOwnProperty(('description'))) {
        game.description = null;
    }
    if(!game.hasOwnProperty('videos')) {
        game.videos = [];
    }
    return game;
});

// add extra data
// sort the games by console first to make iterating through files more efficient
const sorted = fixed.reduce((acc, obj) => {
    if (acc[obj.consoleId.toString()]) {
        acc[obj.consoleId.toString()].push(obj);
    } else {
        acc[obj.consoleId.toString()] = [obj];
    }
    return acc;
}, {});

const keys = Object.keys(sorted);

// this is where the extraData and extraDataFull get addded
const supp = keys.map(key => {
    const file = fileLookup(key);
    if (file) {
        const ids = file.map(f => f.igdbId);
        return sorted[key].map(game => {
            if (game && game.id) {
                const index = ids.indexOf(game.id);
                if (game.extraData && index > -1) {
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
            } else {
                console.log(chalk.red.bold(`You have a game without and ID? ${game.name}`));
                game.extraData = [];
                game.extraDataFull = [];
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
    if (g.consoleId === 7 && psIds.indexOf(g.id) >= 0) {
        const ind = psIds.indexOf(g.id);
        if (g.extraData && g.extraData.length) {
            g.extraData = [...g.extraData, ...ps1ToPs2[ind].details];
            g.extraDataFull = [...g.extraDataFull, ...ps1ToPs2[ind]];
        } else {
            g.extraData = ps1ToPs2[ind].details;
            g.extraDataFull = [ps1ToPs2[ind]];
        }
    }

    // now check banned internationally file as it isn't console specific
    const bannedInd = bannedIds.indexOf(g.id);
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

fs.writeFile(outputResultsPath, writable, error => {
    if (error) {
        console.log(chalk.red.bold('ERROR SUPPLEMENTING DATA', error));
    } else {
        console.log(chalk.cyan('SUCCESSFULLY SUPPLEMENTED DATA!'));
    }
});