const a2600 = require('./data/Atari2600.json');
const xb360 = require('./data/MicrosoftXbox360.json');
const xbOne = require('./data/MicrosoftXboxOne.json');
const n64 = require('./data/Nintendo64.json');
const nes = require('./data/NintendoEntertainmentSystem.json');
const gc = require('./data/NintendoGameCube.json');
const wiiU = require('./data/NintendoWiiU.json');
const s32x = require('./data/Sega32X.json');
const scd = require('./data/SegaCD.json');
const sDc = require('./data/SegaDreamcast.json');
const sGg = require('./data/SegaGameGear.json');
const gen = require('./data/SegaGenesis.json');
const sat = require('./data/SegaSaturn.json');
const ps1 = require('./data/SonyPlaystation.json');
const ps2 = require('./data/SonyPlaystation2.json');
const psp = require('./data/SonyPlayStationPortable.json');
const snes = require('./data/SuperNintendoEntertainmentSystem.json');
const tg16 = require('./data/TurboGrafx16.json');
const xbox = require('./data/MicrosoftXbox.json');
const wii = require('./data/NintendoWii.json');
const gb = require('./data/NintendoGameBoy.json');
const ds = require('./data/NintendoDS.json');
const gba = require('./data/NintendoGameBoyAdvance.json');
const gbc = require('./data/NintendoGameBoyColor.json');
const ps4 = require('./data/SonyPlayStation4.json');

const igdbIdToFile = {
  '18': nes,
  '19': snes,
  '4': n64,
  '21': gc,
  '130': null, // Nintendo Switch
  '5': wii,
  '41': wiiU,
  '37': null, // Nintendo 3DS
  '24': gba,
  '29': gen,
  '30': s32x,
  '23': sDc,
  '32': sat,
  '11': xbox,
  '12': xb360,
  '49': xbOne,
  '7': ps1,
  '8': ps2,
  '9': null, // PS3
  '48': ps4, // ps4
  '38': psp,
  '20': ds,
  '33': gb,
  '22': gbc,
  '50': null, // 3DO
  '78': scd,
  '35': sGg,
  '86': tg16,
  '59': a2600,
  '6': null // PC
};

module.exports.getFileRef = id => {
  return igdbIdToFile[id.toString()];
};
