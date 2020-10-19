const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const atari = require('./data/Atari2600.json'); // exclusives and launch titles
const a52 = require('./data/Atari5200.json'); // exclusives, launch titles, and 4 player
const a78 = require('./data/Atari7800.json'); // exclusives and launch titles
const xbox = require('./data/MicrosoftXbox.json'); // exclusives and launch titles
const xbox360 = require('./data/MicrosoftXbox360.json'); // exclusives and launch titles
const xboxOne = require('./data/MicrosoftXboxOne.json'); // exclusives and launch titles
const n64 = require('./data/Nintendo64.json'); // exclusives and launch titles
const nds = require('./data/NintendoDS.json'); // exclusives and launch titles
const nes = require('./data/NintendoEntertainmentSystem.json'); // exclusives, launch titles, hang tabs, four score, and black box
const ngb = require('./data/NintendoGameBoy.json'); // exlusives and launch titles
const gba = require('./data/NintendoGameBoyAdvance.json'); // exclusives and launch titles
const gbc = require('./data/NintendoGameBoyColor.json'); // exclusives and launch titles
const ngc = require('./data/NintendoGameCube.json'); // exclusives and launch titles
const wii = require('./data/NintendoWii.json'); // exclusives and launch titles
const wiiu = require('./data/NintendoWiiU.json'); // exclusives and launch titles
const s32x = require('./data/Sega32X.json'); // exclusives and launch titles
const scd = require('./data/SegaCD.json'); // exclusives and launch titles
const sdc = require('./data/SegaDreamcast.json'); // exclusives and launch titles
const sgg = require('./data/SegaGameGear.json'); // exclusives and launch titles
const gen = require('./data/SegaGenesis.json'); // exclusives, launch titles, team player, and black box grid
const sst = require('./data/SegaSaturn.json'); // exclusives and launch titles
const ps1 = require('./data/SonyPlaystation.json'); // exclusives, launch titles, and multitap
const ps2 = require('./data/SonyPlaystation2.json'); // exclusives and launch titles
const psp = require('./data/SonyPlayStationPortable.json'); // exclusives and launch titles
const snes = require('./data/SuperNintendoEntertainmentSystem.json'); // exclusives, launch titles, and multitap
const tg16 = require('./data/TurboGrafx16.json'); // exclusives, launch titles, and multitap
const ps4 = require('./data/SonyPlayStation4.json'); // exclusives and launch titles

const exclusiveLaunch = [
  { name: 'Atari 2600', data: atari }, // 0
  { name: 'Microsoft Xbox', data: xbox }, // 1
  { name: 'Microsoft Xbox 360', data: xbox360 }, // 2
  { name: 'Microsoft Xbox One', data: xboxOne }, // 3
  { name: 'Nintendo 64', data: n64 }, // 4
  { name: 'Nintendo DS', data: nds }, // 5
  { name: 'Nintendo Entertainment System', data: nes }, // 6
  { name: 'Nintendo Game Boy', data: ngb }, // 7
  { name: 'Nintendo Game Boy Advance', data: gba }, // 8
  { name: 'Nintendo Game Boy Color', data: gbc }, // 9
  { name: 'Nintendo GameCube', data: ngc }, // 10
  { name: 'Nintendo Wii', data: wii }, // 11
  { name: 'Nintendo Wii U', data: wiiu }, // 12
  { name: 'Sega 32X', data: s32x }, // 13
  { name: 'Sega CD', data: scd }, // 14
  { name: 'Sega Dreamcast', data: sdc }, // 15
  { name: 'Sega Game Gear', data: sgg }, // 16
  { name: 'Sega Genesis', data: gen }, // 17
  { name: 'Sega Saturn', data: sst }, // 18
  { name: 'Sony PlayStation', data: ps1 }, // 19
  { name: 'Sony PlayStation 2', data: ps2 }, // 20
  { name: 'Sony PlayStation Portable', data: psp }, // 21
  { name: 'Super Nintendo Entertainment System', data: snes }, // 22
  { name: 'NEC TurboGrafx 16', data: tg16 }, // 23
  { name: 'Atari 5200', data: a52 }, // 24
  { name: 'Atari 7800', data: a78 }, // 25
  { name: 'Sony PlayStation 4', data: ps4 } // 48
];

let masterData = {};

const multitap = [exclusiveLaunch[19], exclusiveLaunch[22], exclusiveLaunch[23]];

module.exports.getExclusivesCount = data => {
  return data.filter(d => d.isExclusive).length;
};

module.exports.getLaunchTitlesCount = data => {
  return data.filter(d => d.isLaunchTitle).length;
};

module.exports.wordInDetails = (data, word) => {
  return data.filter(game => {
    return game.details.filter(de => de.toLowerCase().indexOf(word) >= 0).length;
  }).length;
};

module.exports.createMaster = () => {
  return new Promise((resolve, reject) => {
    exclusiveLaunch.forEach(platform => {
      masterData[platform.name] = {
        exclusives: this.getExclusivesCount(platform.data),
        launchTitles: this.getLaunchTitlesCount(platform.data)
      };
    });

    multitap.forEach(platform => {
      masterData[platform.name].multitap = this.wordInDetails(platform.data, 'multitap');
    });

    masterData['Nintendo Entertainment System'].fourScore = this.wordInDetails(
      nes,
      'four score compatible'
    );
    masterData['Nintendo Entertainment System'].blackBox = this.wordInDetails(nes, 'black box');
    masterData['Nintendo Entertainment System'].hangTab = this.wordInDetails(nes, 'hang tab');

    masterData['Sega Genesis'].teamPlayer = this.wordInDetails(gen, 'team player');
    masterData['Sega Genesis'].blackBoxGrid = this.wordInDetails(gen, 'black box grid');

    masterData['Atari 5200'].fourPlayer = this.wordInDetails(a52, 'player game');

    fs.writeFile(
      // this is being done this way because I am still working on updating this data and adding to it in another repo
      // eventually this data will be static and won't need to be compiled over and over, but by then the data will live in a different API
      path.join(__dirname, './other/gamesMasterCounts.json'),
      JSON.stringify(masterData, null, 2),
      error => {
        if (error) {
          console.log(chalk.red.bold('ERROR GENERATING MASTER DATA: ', error));
          reject(error);
        } else {
          console.log(chalk.cyan('Master data successfully generated!'));
          resolve();
        }
      }
    );
  });
};
