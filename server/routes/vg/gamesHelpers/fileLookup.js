const a2600 = require('../../../extra/consoleSpecificGameData/Atari2600.json');
const a5200 = require('../../../extra/consoleSpecificGameData/Atari5200.json');
const a7800 = require('../../../extra/consoleSpecificGameData/Atari7800.json');
const xb360 = require('../../../extra/consoleSpecificGameData/MicrosoftXbox360.json');
const xbOne = require('../../../extra/consoleSpecificGameData/MicrosoftXboxOne.json');
const n64 = require('../../../extra/consoleSpecificGameData/Nintendo64.json');
const nes = require('../../../extra/consoleSpecificGameData/NintendoEntertainmentSystem.json');
const gc = require('../../../extra/consoleSpecificGameData/NintendoGameCube.json');
const wiiU = require('../../../extra/consoleSpecificGameData/NintendoWiiU.json');
const s32x = require('../../../extra/consoleSpecificGameData/Sega32X.json');
const scd = require('../../../extra/consoleSpecificGameData/SegaCD.json');
const sDc = require('../../../extra/consoleSpecificGameData/SegaDreamcast.json');
const sGg = require('../../../extra/consoleSpecificGameData/SegaGameGear.json');
const gen = require('../../../extra/consoleSpecificGameData/SegaGenesis.json');
const sat = require('../../../extra/consoleSpecificGameData/SegaSaturn.json');
const ps1 = require('../../../extra/consoleSpecificGameData/SonyPlaystation.json');
const ps2 = require('../../../extra/consoleSpecificGameData/SonyPlaystation2.json');
const psp = require('../../../extra/consoleSpecificGameData/SonyPlayStationPortable.json');
const snes = require('../../../extra/consoleSpecificGameData/SuperNintendoEntertainmentSystem.json');
const tg16 = require('../../../extra/consoleSpecificGameData/TurboGrafx16.json');
const xbox = require('../../../extra/consoleSpecificGameData/MicrosoftXbox.json');
const wii = require('../../../extra/consoleSpecificGameData/NintendoWii.json');
const gb = require('../../../extra/consoleSpecificGameData/NintendoGameBoy.json');
const ds = require('../../../extra/consoleSpecificGameData/NintendoDS.json');
const gba = require('../../../extra/consoleSpecificGameData/NintendoGameBoyAdvance.json');
const gbc = require('../../../extra/consoleSpecificGameData/NintendoGameBoyColor.json');
const ps4 = require('../../../extra/consoleSpecificGameData/SonyPlayStation4.json');
const sms = require('../../../extra/consoleSpecificGameData/SegaMasterSystem.json');
const jag = require('../../../extra/consoleSpecificGameData/AtariJaguar.json');
const miv = require('../../../extra/consoleSpecificGameData/MattelIntellivision.json');

const igdbIdToFile = {
  18: nes,
  19: snes,
  4: n64,
  21: gc,
  130: null, // Nintendo Switch
  5: wii,
  41: wiiU,
  37: null, // Nintendo 3DS
  24: gba,
  29: gen,
  30: s32x,
  23: sDc,
  32: sat,
  11: xbox,
  12: xb360,
  49: xbOne,
  7: ps1,
  8: ps2,
  9: null, // PS3
  48: ps4, // ps4
  38: psp,
  20: ds,
  33: gb,
  22: gbc,
  50: null, // 3DO
  78: scd,
  35: sGg,
  86: tg16,
  59: a2600,
  6: null, //pc
  66: a5200,
  60: a7800,
  64: sms,
  67: miv,
  62: jag
};

module.exports.getFileRef = id => {
  return igdbIdToFile[id.toString()];
};
