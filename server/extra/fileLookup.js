const a2600 = require('./consoleSpecificGameData/Atari2600.json');
const a5200 = require('./consoleSpecificGameData/Atari5200.json');
const a7800 = require('./consoleSpecificGameData/Atari7800.json');
const xb360 = require('./consoleSpecificGameData/MicrosoftXbox360.json');
const xbOne = require('./consoleSpecificGameData/MicrosoftXboxOne.json');
const n64 = require('./consoleSpecificGameData/Nintendo64.json');
const nes = require('./consoleSpecificGameData/NintendoEntertainmentSystem.json');
const gc = require('./consoleSpecificGameData/NintendoGameCube.json');
const wiiU = require('./consoleSpecificGameData/NintendoWiiU.json');
const s32x = require('./consoleSpecificGameData/Sega32X.json');
const scd = require('./consoleSpecificGameData/SegaCD.json');
const sDc = require('./consoleSpecificGameData/SegaDreamcast.json');
const sGg = require('./consoleSpecificGameData/SegaGameGear.json');
const gen = require('./consoleSpecificGameData/SegaGenesis.json');
const sat = require('./consoleSpecificGameData/SegaSaturn.json');
const ps1 = require('./consoleSpecificGameData/SonyPlaystation.json');
const ps2 = require('./consoleSpecificGameData/SonyPlaystation2.json');
const ps3 = require('./consoleSpecificGameData/SonyPlaystation3.json');
const psp = require('./consoleSpecificGameData/SonyPlayStationPortable.json');
const snes = require('./consoleSpecificGameData/SuperNintendoEntertainmentSystem.json');
const tg16 = require('./consoleSpecificGameData/TurboGrafx16.json');
const xbox = require('./consoleSpecificGameData/MicrosoftXbox.json');
const wii = require('./consoleSpecificGameData/NintendoWii.json');
const gb = require('./consoleSpecificGameData/NintendoGameBoy.json');
const ds = require('./consoleSpecificGameData/NintendoDS.json');
const gba = require('./consoleSpecificGameData/NintendoGameBoyAdvance.json');
const gbc = require('./consoleSpecificGameData/NintendoGameBoyColor.json');
const ps4 = require('./consoleSpecificGameData/SonyPlayStation4.json');
const sms = require('./consoleSpecificGameData/SegaMasterSystem.json');
const jag = require('./consoleSpecificGameData/AtariJaguar.json');
const miv = require('./consoleSpecificGameData/MattelIntellivision.json');
const nvb = require('./consoleSpecificGameData/VirtualBoy.json');
const n3ds = require('./consoleSpecificGameData/Nintendo3DS.json');
const r3do = require('./consoleSpecificGameData/3DOInteractiveMultiplayer.json');
const nsw = require('./consoleSpecificGameData/NintendoSwitch.json');
const gcom = require('./consoleSpecificGameData/GameCom.json');
const vita = require('./consoleSpecificGameData/SonyPlaystationVita.json')
const lynx = require('./consoleSpecificGameData/AtariLynx.json');

const igdbIdToFile = {
  '18': nes,
  '19': snes,
  '4': n64,
  '21': gc,
  '130': nsw, // Nintendo Switch
  '5': wii,
  '41': wiiU,
  '37': n3ds, // Nintendo 3DS
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
  '9': ps3, // PS3
  '48': ps4, // ps4
  '38': psp,
  '20': ds,
  '33': gb,
  '22': gbc,
  '50': r3do, // 3DO
  '78': scd,
  '35': sGg,
  '86': tg16,
  '59': a2600,
  '6': null, //pc
  '66': a5200,
  '60': a7800,
  '64': sms,
  '67': miv,
  '62': jag,
  '87': nvb,
  '46': vita,
  '379': gcom,
  '61': lynx
};

module.exports.getFileRef = id => {
  return igdbIdToFile[id.toString()];
};
