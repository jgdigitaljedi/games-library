const atari = require('../../../../extra/consoleSpecificGameData/Atari2600.json'); // exclusives and launch titles
const a52 = require('../../../../extra/consoleSpecificGameData/Atari5200.json'); // exclusives, launch titles, and 4 player
const a78 = require('../../../../extra/consoleSpecificGameData/Atari7800.json'); // exclusives and launch titles
const xbox = require('../../../../extra/consoleSpecificGameData/MicrosoftXbox.json'); // exclusives and launch titles
const xbox360 = require('../../../../extra/consoleSpecificGameData/MicrosoftXbox360.json'); // exclusives and launch titles
const xboxOne = require('../../../../extra/consoleSpecificGameData/MicrosoftXboxOne.json'); // exclusives and launch titles
const n64 = require('../../../../extra/consoleSpecificGameData/Nintendo64.json'); // exclusives and launch titles
const nds = require('../../../../extra/consoleSpecificGameData/NintendoDS.json'); // exclusives and launch titles
const nes = require('../../../../extra/consoleSpecificGameData/NintendoEntertainmentSystem.json'); // exclusives, launch titles, hang tabs, four score, and black box
const ngb = require('../../../../extra/consoleSpecificGameData/NintendoGameBoy.json'); // exclusives and launch titles
const gba = require('../../../../extra/consoleSpecificGameData/NintendoGameBoyAdvance.json'); // exclusives and launch titles
const gbc = require('../../../../extra/consoleSpecificGameData/NintendoGameBoyColor.json'); // exclusives and launch titles
const ngc = require('../../../../extra/consoleSpecificGameData/NintendoGameCube.json'); // exclusives and launch titles
const wii = require('../../../../extra/consoleSpecificGameData/NintendoWii.json'); // exclusives and launch titles
const wiiu = require('../../../../extra/consoleSpecificGameData/NintendoWiiU.json'); // exclusives and launch titles
const s32x = require('../../../../extra/consoleSpecificGameData/Sega32X.json'); // exclusives and launch titles
const scd = require('../../../../extra/consoleSpecificGameData/SegaCD.json'); // exclusives and launch titles
const sdc = require('../../../../extra/consoleSpecificGameData/SegaDreamcast.json'); // exclusives and launch titles
const sgg = require('../../../../extra/consoleSpecificGameData/SegaGameGear.json'); // exclusives and launch titles
const gen = require('../../../../extra/consoleSpecificGameData/SegaGenesis.json'); // exclusives, launch titles, team player, and black box grid
const sst = require('../../../../extra/consoleSpecificGameData/SegaSaturn.json'); // exclusives and launch titles
const ps1 = require('../../../../extra/consoleSpecificGameData/SonyPlaystation.json'); // exclusives, launch titles, and multitap
const ps2 = require('../../../../extra/consoleSpecificGameData/SonyPlaystation2.json'); // exclusives and launch titles
const psp = require('../../../../extra/consoleSpecificGameData/SonyPlayStationPortable.json'); // exclusives and launch titles
const snes = require('../../../../extra/consoleSpecificGameData/SuperNintendoEntertainmentSystem.json'); // exclusives, launch titles, and multitap
const tg16 = require('../../../../extra/consoleSpecificGameData/TurboGrafx16.json'); // exclusives, launch titles, and multitap
const ps4 = require('../../../../extra/consoleSpecificGameData/SonyPlayStation4.json'); // exclusives and launch titles

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

const multitap = [exclusiveLaunch[19], exclusiveLaunch[22], exclusiveLaunch[23]];

const getExclusivesCount = (data) => {
  return data.filter((d) => d.isExclusive).length;
};

const getLaunchTitlesCount = (data) => {
  return data.filter((d) => d.isLaunchTitle).length;
};

const wordInDetails = (data, word) => {
  return data.filter((game) => {
    return game.details.filter((de) => de.toLowerCase().indexOf(word) >= 0).length;
  }).length;
};

module.exports.createMaster = () => {
  const masterData = {};
  return new Promise((resolve, reject) => {
    exclusiveLaunch.forEach((platform) => {
      masterData[platform.name] = {
        exclusives: getExclusivesCount(platform.data),
        launchTitles: getLaunchTitlesCount(platform.data)
      };
    });

    multitap.forEach((platform) => {
      masterData[platform.name].multitap = wordInDetails(platform.data, 'multitap');
    });

    masterData['Nintendo Entertainment System'].fourScore = wordInDetails(
      nes,
      'four score compatible'
    );
    masterData['Nintendo Entertainment System'].blackBox = wordInDetails(nes, 'black box');
    masterData['Nintendo Entertainment System'].hangTab = wordInDetails(nes, 'hang tab');

    masterData['Sega Genesis'].teamPlayer = wordInDetails(gen, 'team player');
    masterData['Sega Genesis'].blackBoxGrid = wordInDetails(gen, 'black box grid');

    masterData['Atari 5200'].fourPlayer = wordInDetails(a52, 'player game');

    resolve(masterData);
  });
};
