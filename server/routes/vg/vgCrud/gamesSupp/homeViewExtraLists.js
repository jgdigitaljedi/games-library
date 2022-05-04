const db = require('../../../../db');
const { funExtraData } = require('./seriesData/funExtraData');

// TODO: get list for Virtual Boy exclusives

// launch titles
const atari2600Lt = require('../../../../extra/launchTitles/atari2600LaunchTitles.json').map(
  g => g.igdbId
);
const atari5200Lt = require('../../../../extra/launchTitles/atari5200LaunchTitles.json').map(
  g => g.igdbId
);
const atari7800Lt = require('../../../../extra/launchTitles/atari7800LaunchTitles.json').map(
  g => g.igdbId
);
const atariJagLt = require('../../../../extra/launchTitles/atariJaguarLaunchTitles.json').map(
  g => g.igdbId
);
const nesLtIds = require('../../../../extra/launchTitles/nesLaunchTitles.json').map(g => g.igdbId);
const snesLtIds = require('../../../../extra/launchTitles/snesLaunchTitles.json').map(
  g => g.igdbId
);
const n64LtIds = require('../../../../extra/launchTitles/n64LaunchTitles.json').map(g => g.igdbId);
const gcLtIds = require('../../../../extra/launchTitles/gamecubeLaunchTitles.json').map(
  g => g.igdbId
);
const switchLtIds = require('../../../../extra/launchTitles/switchLaunchTitles.json').map(
  g => g.igdbId
);
const wiiLtIds = require('../../../../extra/launchTitles/wiiLaunchTitles.json').map(g => g.igdbId);
const wiiULtIds = require('../../../../extra/launchTitles/wiiULaunchTitles.json').map(
  g => g.igdbId
);
const gbaLtIds = require('../../../../extra/launchTitles/gameBoyAdvanceLaunchTitles.json').map(
  g => g.igdbId
);
const genLtIds = require('../../../../extra/launchTitles/genesisLaunchTitles.json').map(
  g => g.igdbId
);
const s32xLtIds = require('../../../../extra/launchTitles/sega32xLaunchTitles.json').map(
  g => g.igdbId
);
const dcLtIds = require('../../../../extra/launchTitles/dreamcastLaunchTitles.json').map(
  g => g.igdbId
);
const ssLtIds = require('../../../../extra/launchTitles/segaSaturnLaunchTitles.json').map(
  g => g.igdbId
);
const ogxbLtIds = require('../../../../extra/launchTitles/xboxLaunchTitles.json').map(
  g => g.igdbId
);
const xb360LtIds = require('../../../../extra/launchTitles/xbox360LaunchTitles.json').map(
  g => g.igdbId
);
const xboneLtIds = require('../../../../extra/launchTitles/xboxOneLaunchTitles.json').map(
  g => g.igdbId
);
const ps1LtIds = require('../../../../extra/launchTitles/playstationLaunchTitles.json').map(
  g => g.igdbId
);
const ps2LtIds = require('../../../../extra/launchTitles/ps2LaunchTitles.json').map(g => g.igdbId);
const ps3LtIds = require('../../../../extra/launchTitles/ps3LaunchTitles.json').map(g => g.igdbId);
const ps4LtIds = require('../../../../extra/launchTitles/ps4LaunchTitles.json').map(g => g.igdbId);
const pspLtIds = require('../../../../extra/launchTitles/pspLaunchTitles.json').map(g => g.igdbId);
const dsLtIds = require('../../../../extra/launchTitles/dsLaunchTitles.json').map(g => g.igdbId);
const gbLtIds = require('../../../../extra/launchTitles/gameBoyLaunchTitles.json').map(
  g => g.igdbId
);
const gbcLtIds = require('../../../../extra/launchTitles/gameBoyColorLaunchTitles.json').map(
  g => g.igdbId
);
const scdLtIds = require('../../../../extra/launchTitles/segaCdLaunchTitles.json').map(
  g => g.igdbId
);
const ggLtIds = require('../../../../extra/launchTitles/gameGearLaunchTitles.json').map(
  g => g.igdbId
);
const tgLtIds = require('../../../../extra/launchTitles/turbografx16LaunchTitles.json').map(
  g => g.igdbId
);
const smsLtIds = require('../../../../extra/launchTitles/segaMasterSystemLaunchTitles.json').map(
  g => g.igdbId
);
const nvbLtIds = require('../../../../extra/launchTitles/virtualBoyLaunchTitles.json').map(
  g => g.igdbId
);
const mivLtIds = require('../../../../extra/launchTitles/intellivisionLaunchTitles.json').map(
  g => g.igdbId
);
const r3doLtIds = require('../../../../extra/launchTitles/3doLaunchTitles.json').map(g => g.igdbId);
const n3dsLtIds = require('../../../../extra/launchTitles/nintendo3dsLaunchTitles.json').map(
  g => g.igdbId
);

// exclusives
const atari2600Ex = require('../../../../extra/exclusives/atari2600Exclusives.json').map(
  g => g.igdbId
);
const atari5200Ex = require('../../../../extra/exclusives/atari5200Exclusives.json').map(
  g => g.igdbId
);
const atari7800Ex = require('../../../../extra/exclusives/atari7800Exclusives.json').map(
  g => g.igdbId
);
const atariJagEx = require('../../../../extra/exclusives/atariJaguarExclusives.json').map(
  g => g.igdbId
);
const nesExIds = require('../../../../extra/exclusives/nesExclusives.json').map(g => g.igdbId);
const snesExIds = require('../../../../extra/exclusives/nintendoSnesExclusives.json').map(
  g => g.igdbId
);
const n64ExIds = require('../../../../extra/exclusives/nintendoN64Exclusives.json').map(
  g => g.igdbId
);
const gcExIds = require('../../../../extra/exclusives/gamecubeExclusives.json').map(g => g.igdbId);
const switchExIds = require('../../../../extra/exclusives/nintendoSwitchExclusives.json').map(
  g => g.igdbId
);
const wiiExIds = require('../../../../extra/exclusives/nintendoWiiExclusives.json').map(
  g => g.igdbId
);
const wiiUExIds = require('../../../../extra/exclusives/nintendoWiiExclusives.json').map(
  g => g.igdbId
);
const n3dsExIds = require('../../../../extra/exclusives/nintendo3dsExclusives.json').map(
  g => g.igdbId
);
const gbaExIds = require('../../../../extra/exclusives/nintendoGameBoyAdvanceExclusives.json').map(
  g => g.igdbId
);
const genExIds = require('../../../../extra/exclusives/segaGenesisExclusives.json').map(
  g => g.igdbId
);
const s32xExIds = require('../../../../extra/exclusives/sega32xExclusives.json').map(g => g.igdbId);
const dcExIds = require('../../../../extra/exclusives/segaDreamcastExclusives.json').map(
  g => g.igdbId
);
const ssExIds = require('../../../../extra/exclusives/segaSaturnExclusives.json').map(
  g => g.igdbId
);
const ogxbExIds = require('../../../../extra/exclusives/microsoftXboxExclusives.json').map(
  g => g.igdbId
);
const xb360ExIds = require('../../../../extra/exclusives/xbox360Exclusives.json').map(
  g => g.igdbId
);
const xboneExIds = require('../../../../extra/exclusives/xboxOneExclusives.json').map(
  g => g.igdbId
);
const ps1ExIds = require('../../../../extra/exclusives/sonyPlaystationExclusives.json').map(
  g => g.igdbId
);
const ps2ExIds = require('../../../../extra/exclusives/sonyPlaystation2Exclusives.json').map(
  g => g.igdbId
);
const ps3ExIds = require('../../../../extra/exclusives/sonyPlaystation3Exclusives.json').map(
  g => g.igdbId
);
const ps4ExIds = require('../../../../extra/exclusives/sonyPlaystation4Exclusives.json').map(
  g => g.igdbId
);
const pspExIds = require('../../../../extra/exclusives/sonyPspExclusives.json').map(g => g.igdbId);
const dsExIds = require('../../../../extra/exclusives/nintendoDsExclusives.json').map(
  g => g.igdbId
);
const gbExIds = require('../../../../extra/exclusives/nintendoGameBoyExclusives.json').map(
  g => g.igdbId
);
const gbcExIds = require('../../../../extra/exclusives/nintendoGameBoyColorExclusives.json').map(
  g => g.igdbId
);
const r3doExIds = require('../../../../extra/exclusives/3doExclusives.json').map(g => g.igdbId);
const scdExIds = require('../../../../extra/exclusives/segaCdExclusives.json').map(g => g.igdbId);
const ggExIds = require('../../../../extra/exclusives/segaGameGearExclusives.json').map(
  g => g.igdbId
);
const tgExIds = require('../../../../extra/exclusives/turbografx16Exclusives.json').map(
  g => g.igdbId
);
const smsExIds = require('../../../../extra/exclusives/segaMasterSystemExclusives.json').map(
  g => g.igdbId
);
const mivExIds = require('../../../../extra/exclusives/intellivisionExclusives.json').map(
  g => g.igdbId
);
const nvbExIds = require('../../../../extra/exclusives/virtualBoyExclusives.json').map(
  g => g.igdbId
);

const games = db.games.find();
const launchOwned = {
  a2600Lt: [],
  a5200Lt: [],
  a7800Lt: [],
  aJagLt: [],
  nesLt: [],
  snesLt: [],
  n64Lt: [],
  gcLt: [],
  switchLt: [],
  wiiLt: [],
  wiiULt: [],
  gbaLt: [],
  genLt: [],
  s32xLt: [],
  dcLt: [],
  ssLt: [],
  ogxbLt: [],
  xb360Lt: [],
  xboneLt: [],
  ps1Lt: [],
  ps2Lt: [],
  ps3Lt: [],
  ps4Lt: [],
  pspLt: [],
  dsLt: [],
  gbLt: [],
  gbcLt: [],
  scdLt: [],
  ggLt: [],
  tgLt: [],
  smsLt: [],
  nvbLt: [],
  mivLt: [],
  r3doLt: [],
  n3dsLt: []
};

const exOwned = {
  a2600Ex: [],
  a5200Ex: [],
  a7800Ex: [],
  aJagEx: [],
  nesEx: [],
  snesEx: [],
  n64Ex: [],
  gcEx: [],
  switchEx: [],
  wiiEx: [],
  wiiUEx: [],
  n3dsEx: [],
  gbaEx: [],
  genEx: [],
  s32xEx: [],
  dcEx: [],
  ssEx: [],
  ogxbEx: [],
  xb360Ex: [],
  xboneEx: [],
  ps1Ex: [],
  ps2Ex: [],
  ps3Ex: [],
  ps4Ex: [],
  pspEx: [],
  dsEx: [],
  gbEx: [],
  gbcEx: [],
  r3doEx: [],
  scdEx: [],
  ggEx: [],
  tgEx: [],
  smsEx: [],
  mivEx: [],
  nvbEx: []
};

const igdbIdToFiles = {
  18: { launch: nesLtIds, exclusives: nesExIds, launchList: 'nesLt', exList: 'nesEx' }, //nes,
  19: { launch: snesLtIds, exclusives: snesExIds, launchList: 'snesLt', exList: 'snesEx' }, //snes,
  4: { launch: n64LtIds, exclusives: n64ExIds, launchList: 'n64Lt', exList: 'n64Ex' }, //n64,
  21: { launch: gcLtIds, exclusives: gcExIds, launchList: 'gcLt', exList: 'gcEx' }, //gc,
  130: { launch: switchLtIds, exclusives: switchExIds, launchList: 'switchLt', exList: 'switchEx' }, // Nintendo Switch
  5: { launch: wiiLtIds, exclusives: wiiExIds, launchList: 'wiiLt', exList: 'wiiEx' }, //wii,
  41: { launch: wiiULtIds, exclusives: wiiUExIds, launchList: 'wiiULt', exList: 'wiiUEx' }, //wiiU,
  37: { launch: n3dsLtIds, exclusives: n3dsExIds, launchList: 'n3dsLt', exList: 'n3dsEx' }, // Nintendo 3DS
  24: { launch: gbaLtIds, exclusives: gbaExIds, launchList: 'gbaLt', exList: 'gbaEx' }, // gba,
  29: { launch: genLtIds, exclusives: genExIds, launchList: 'genLt', exList: 'genEx' }, //gen,
  30: { launch: s32xLtIds, exclusives: s32xExIds, launchList: 's32xLt', exList: 's32xEx' }, //s32x,
  23: { launch: dcLtIds, exclusives: dcExIds, launchList: 'dcLt', exList: 'dcEx' }, //sDc,
  32: { launch: ssLtIds, exclusives: ssExIds, launchList: 'ssLt', exList: 'ssEx' }, //sat,
  11: { launch: ogxbLtIds, exclusives: ogxbExIds, launchList: 'ogxbLt', exList: 'ogxbEx' }, //xbox,
  12: { launch: xb360LtIds, exclusives: xb360ExIds, launchList: 'xb360Lt', exList: 'xb360Ex' }, //xb360,
  49: { launch: xboneLtIds, exclusives: xboneExIds, launchList: 'xboneLt', exList: 'xboneEx' }, //xbOne,
  7: { launch: ps1LtIds, exclusives: ps1ExIds, launchList: 'ps1Lt', exList: 'ps1Ex' }, //ps1,
  8: { launch: ps2LtIds, exclusives: ps2ExIds, launchList: 'ps2Lt', exList: 'ps2Ex' }, //ps2,
  9: { launch: ps3LtIds, exclusives: ps3ExIds, launchList: 'ps3Lt', exList: 'ps3Ex' }, // PS3
  48: { launch: ps4LtIds, exclusives: ps4ExIds, launchList: 'ps4Lt', exList: 'ps4Ex' }, // ps4
  38: { launch: pspLtIds, exclusives: pspExIds, launchList: 'pspLt', exList: 'pspEx' }, //psp,
  20: { launch: dsLtIds, exclusives: dsExIds, launchList: 'dsLt', exList: 'dsEx' }, //ds,
  33: { launch: gbLtIds, exclusives: gbExIds, launchList: 'gbLt', exList: 'gbEx' }, //gb,
  22: { launch: gbcLtIds, exclusives: gbcExIds, launchList: 'gbcLt', exList: 'gbcEx' }, //gbc,
  50: { launch: r3doLtIds, exclusives: r3doExIds, launchList: 'r3doLt', exList: 'r3doEx' }, // 3DO
  78: { launch: scdLtIds, exclusives: scdExIds, launchList: 'scdLt', exList: 'scdEx' }, //scd,
  35: { launch: ggLtIds, exclusives: ggExIds, launchList: 'ggLt', exList: 'ggEx' }, //sGg,
  86: { launch: tgLtIds, exclusives: tgExIds, launchList: 'tgLt', tgEx: 'tgEx' }, //tg16,
  59: { launch: atari2600Lt, exclusives: atari2600Ex, launchList: 'a2600Lt', exList: 'a2600Ex' },
  66: { launch: atari5200Lt, exclusives: atari5200Ex, launchList: 'a5200Lt', exList: 'a5200Ex' },
  60: { launch: atari7800Lt, exclusives: atari7800Ex, launchList: 'a7800Lt', exList: 'a7800Ex' },
  64: { launch: smsLtIds, exclusives: smsExIds, launchList: 'smsLt', exList: 'smsEx' }, //sms,
  67: { launch: mivLtIds, exclusives: mivExIds, launchList: 'mivLt', exList: 'mivEx' }, //miv,
  62: { launch: atariJagLt, exclusives: atariJagEx, launchList: 'jagLt', exList: 'aJagEx' },
  87: { launch: nvbLtIds, exclusives: nvbExIds, launchList: 'nvbLt', exList: 'nvbEx' }, //nvb
  6: { launch: [], exclusives: [] } //pc
};

games.forEach(game => {
  const extra = game.extraDataFull || [];
  if (extra?.length) {
    const id = game.id;
    const lists = igdbIdToFiles[game.consoleId.toString()];
    if (lists.launch?.indexOf(id) > 0 && launchOwned[lists?.launchList]?.indexOf(id) < 0) {
      launchOwned[lists.launchList].push(id);
    }
    if (lists.exclusives?.indexOf(id) > 0 && exOwned[lists?.exList]?.indexOf(id) < 0) {
      exOwned[lists.exList].push(id);
    }
  }
});

module.exports.getLaunchEx = async function () {
  const funData = await funExtraData();
  return [
    ...funData,
    {
      title: 'Atari 2600 launch titles',
      owned: launchOwned.a2600Lt.length,
      total: atari2600Lt.length,
      platformId: 59,
      dataSet: 'LT'
    },
    {
      owned: exOwned.a2600Ex.length,
      total: atari2600Ex.length,
      title: 'Atari 2600 exclusives',
      platformId: 59,
      dataSet: 'EX'
    },
    {
      title: 'Atari 5200 launch titles',
      owned: launchOwned.a5200Lt.length,
      total: atari5200Lt.length,
      platformId: 66,
      dataSet: 'LT'
    },
    {
      title: 'Atari 5200 exclusives',
      owned: exOwned.a5200Ex.length,
      total: atari5200Ex.length,
      platformId: 66,
      dataSet: 'EX'
    },
    {
      title: 'Atari 7800 launch titles',
      owned: launchOwned.a7800Lt.length,
      total: atari7800Lt.length,
      platformId: 60,
      dataSet: 'LT'
    },
    {
      title: 'Atari 7800 exclusives',
      owned: exOwned.a7800Ex.length,
      total: atari7800Ex.length,
      platformId: 60,
      dataSet: 'EX'
    },
    {
      title: 'Atari Jaguar launch titles',
      owned: launchOwned.aJagLt.length,
      total: atariJagLt.length,
      platformId: 62,
      dataSet: 'LT'
    },
    {
      title: 'Atari Jaguar exclusives',
      owned: exOwned.aJagEx.length,
      total: atariJagEx.length,
      platformId: 62,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo NES launch titles',
      owned: launchOwned.nesLt.length,
      total: nesLtIds.length,
      platformId: 18,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo NES exclusives',
      owned: exOwned.nesEx.length,
      total: nesExIds.length,
      platformId: 18,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo SNES launch titles',
      owned: launchOwned.snesLt.length,
      total: snesLtIds.length,
      platformId: 19,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo SNES exclusives',
      owned: exOwned.snesEx.length,
      total: snesExIds.length,
      platformId: 19,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo 64 launch titles',
      owned: launchOwned.n64Lt.length,
      total: n64LtIds.length,
      platformId: 4,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo 64 exclusives',
      owned: exOwned.n64Ex.length,
      total: n64ExIds.length,
      platformId: 4,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo GameCube launch titles',
      owned: launchOwned.gcLt.length,
      total: gcLtIds.length,
      platformId: 21,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo GameCube exclusives',
      owned: exOwned.gcEx.length,
      total: gcExIds.length,
      platformId: 21,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Wii launch titles',
      owned: launchOwned.wiiLt.length,
      total: wiiLtIds.length,
      platformId: 5,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Wii exclusives',
      owned: exOwned.wiiEx.length,
      total: wiiExIds.length,
      platformId: 5,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Wii U launch titles',
      owned: launchOwned.wiiULt.length,
      total: wiiULtIds.length,
      platformId: 41,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Wii U exclusives',
      owned: exOwned.wiiUEx.length,
      total: wiiUExIds.length,
      platformId: 41,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Switch launch titles',
      owned: launchOwned.switchLt.length,
      total: switchLtIds.length,
      platformId: 130,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Switch exclusives',
      owned: exOwned.switchEx.length,
      total: switchExIds.length,
      platformId: 130,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Game Boy launch titles',
      owned: launchOwned.gbLt.length,
      total: gbLtIds.length,
      platformId: 33,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Game Boy exclusives',
      owned: exOwned.gbEx.length,
      total: gbExIds.length,
      platformId: 33,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Virtual Boy launch titles',
      owned: launchOwned.nvbLt.length,
      total: nvbLtIds.length,
      platformId: 87,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Virtual Boy exclusives',
      owned: exOwned.nvbEx.length,
      total: nvbExIds.length,
      platformId: 87,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Game Boy Color launch titles',
      owned: launchOwned.gbcLt.length,
      total: gbcLtIds.length,
      platformId: 22,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Game Boy Color exclusives',
      owned: exOwned.gbcEx.length,
      total: gbcExIds.length,
      platformId: 22,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo Game Boy Advance launch titles',
      owned: launchOwned.gbaLt.length,
      total: gbaLtIds.length,
      platformId: 24,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo Game Boy advance exclusives',
      owned: exOwned.gbaEx.length,
      total: gbaExIds.length,
      platformId: 24,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo DS launch titles',
      owned: launchOwned.dsLt.length,
      total: dsLtIds.length,
      platformId: 20,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo DS exclusives',
      owned: exOwned.dsEx.length,
      total: dsExIds.length,
      platformId: 20,
      dataSet: 'EX'
    },
    {
      title: 'Nintendo 3DS launch titles',
      owned: launchOwned.n3dsLt.length,
      total: n3dsLtIds.length,
      platformId: 37,
      dataSet: 'LT'
    },
    {
      title: 'Nintendo 3DS exclusives',
      owned: exOwned.n3dsEx.length,
      total: n3dsExIds.length,
      platformId: 37,
      dataSet: 'EX'
    },
    {
      title: 'Sega Master System launch titles',
      owned: launchOwned.smsLt.length,
      total: smsLtIds.length,
      platformId: 64,
      dataSet: 'LT'
    },
    {
      title: 'Sega Master System exclusives',
      owned: exOwned.smsEx.length,
      total: smsExIds.length,
      platformId: 64,
      dataSet: 'EX'
    },
    {
      title: 'Sega Genesis launch titles',
      owned: launchOwned.genLt.length,
      total: genLtIds.length,
      platformId: 29,
      dataSet: 'LT'
    },
    {
      title: 'Sega Genesis exclusives',
      owned: exOwned.genEx.length,
      total: genExIds.length,
      platformId: 29,
      dataSet: 'EX'
    },
    {
      title: 'Sega 32X launch titles',
      owned: launchOwned.s32xLt.length,
      total: s32xLtIds.length,
      platformId: 30,
      dataSet: 'LT'
    },
    {
      title: 'Sega 32X exclusives',
      owned: exOwned.s32xEx.length,
      total: s32xExIds.length,
      platformId: 30,
      dataSet: 'EX'
    },
    {
      title: 'Sega CD launch titles',
      owned: launchOwned.scdLt.length,
      total: scdLtIds.length,
      platformId: 78,
      dataSet: 'LT'
    },
    {
      title: 'Sega CD exclusives',
      owned: exOwned.scdEx.length,
      total: scdExIds.length,
      platformId: 78,
      dataSet: 'EX'
    },
    {
      title: 'Sega Saturn launch titles',
      owned: launchOwned.ssLt.length,
      total: ssLtIds.length,
      platformId: 32,
      dataSet: 'LT'
    },
    {
      title: 'Sega Saturn exclusives',
      owned: exOwned.ssEx.length,
      total: ssExIds.length,
      platformId: 32,
      dataSet: 'EX'
    },
    {
      title: 'Sega Dreamcast launch titles',
      owned: launchOwned.dcLt.length,
      total: dcLtIds.length,
      platformId: 23,
      dataSet: 'LT'
    },
    {
      title: 'Sega Dreamcast exclusives',
      owned: exOwned.dcEx.length,
      total: dcExIds.length,
      platformId: 23,
      dataSet: 'EX'
    },
    {
      title: 'Sega Game Gear launch titles',
      owned: launchOwned.ggLt.length,
      total: ggLtIds.length,
      platformId: 35,
      dataSet: 'LT'
    },
    {
      title: 'Sega Game Gear exclusives',
      owned: exOwned.ggEx.length,
      total: ggExIds.length,
      platformId: 35,
      dataSet: 'EX'
    },

    {
      title: 'Microsoft Xbox launch titles',
      owned: launchOwned.ogxbLt.length,
      total: ogxbLtIds.length,
      platformId: 11,
      dataSet: 'LT'
    },
    {
      title: 'Microsoft Xbox exclusives',
      owned: exOwned.ogxbEx.length,
      total: ogxbExIds.length,
      platformId: 11,
      dataSet: 'EX'
    },
    {
      title: 'Microsoft Xbox 360 launch titles',
      owned: launchOwned.xb360Lt.length,
      total: xb360LtIds.length,
      platformId: 12,
      dataSet: 'LT'
    },
    {
      title: 'Microsoft Xbox 360 exclusives',
      owned: exOwned.xb360Ex.length,
      total: xb360ExIds.length,
      platformId: 12,
      dataSet: 'EX'
    },
    {
      title: 'Microsoft Xbox One launch titles',
      owned: launchOwned.xboneLt.length,
      total: xboneLtIds.length,
      platformId: 49,
      dataSet: 'LT'
    },
    {
      title: 'Microsoft Xbox One exclusives',
      owned: exOwned.xboneEx.length,
      total: xboneExIds.length,
      platformId: 49,
      dataSet: 'EX'
    },
    {
      title: 'Sony PlayStation launch titles',
      owned: launchOwned.ps1Lt.length,
      total: ps1LtIds.length,
      platformId: 7,
      dataSet: 'LT'
    },
    {
      title: 'Sony PlayStation exclusives',
      owned: exOwned.ps1Ex.length,
      total: ps1ExIds.length,
      platformId: 7,
      dataSet: 'EX'
    },
    {
      title: 'Sony PlayStation 2 launch titles',
      owned: launchOwned.ps2Lt.length,
      total: ps2LtIds.length,
      platformId: 8,
      dataSet: 'LT'
    },
    {
      title: 'Sony PlayStation 2 exclusives',
      owned: exOwned.ps2Ex.length,
      total: ps2ExIds.length,
      platformId: 8,
      dataSet: 'EX'
    },
    {
      title: 'Sony PlayStation 3 launch titles',
      owned: launchOwned.ps3Lt.length,
      total: ps3LtIds.length,
      platformId: 9,
      dataSet: 'LT'
    },
    {
      title: 'Sony PlayStation 3 exclusives',
      owned: exOwned.ps3Ex.length,
      total: ps3ExIds.length,
      platformId: 9,
      dataSet: 'EX'
    },
    {
      title: 'Sony PlayStation 4 launch titles',
      owned: launchOwned.ps4Lt.length,
      total: ps4LtIds.length,
      platformId: 48,
      dataSet: 'LT'
    },
    {
      title: 'Sony PlayStation 4 exclusives',
      owned: exOwned.ps4Ex.length,
      total: ps4ExIds.length,
      platformId: 48,
      dataSet: 'EX'
    },
    {
      title: 'Sony PlayStation Portable launch titles',
      owned: launchOwned.pspLt.length,
      total: pspLtIds.length,
      platformId: 38,
      dataSet: 'LT'
    },
    {
      title: 'Sony PlayStation Portable exclusives',
      owned: exOwned.pspEx.length,
      total: pspExIds.length,
      platformId: 38,
      dataSet: 'EX'
    },
    {
      title: 'REAL 3DO launch titles',
      owned: launchOwned.r3doLt.length,
      total: r3doLtIds.length,
      platformId: 50,
      dataSet: 'LT'
    },
    {
      title: 'REAL 3DO exclusives',
      owned: exOwned.r3doEx.length,
      total: r3doExIds.length,
      platformId: 50,
      dataSet: 'EX'
    },
    {
      title: 'NEC TurboGrafx-16 launch titles',
      owned: launchOwned.tgLt.length,
      total: tgLtIds.length,
      platformId: 86,
      dataSet: 'LT'
    },
    {
      title: 'NEC TurboGrafx-16 exclusives',
      owned: exOwned.tgEx.length,
      total: tgExIds.length,
      platformId: 86,
      dataSet: 'EX'
    },
    {
      title: 'Mattel Intellivision launch titles',
      owned: launchOwned.mivLt.length,
      total: mivLtIds.length,
      platformId: 67,
      dataSet: 'LT'
    },
    {
      title: 'Mattel Intellivision exclusives',
      owned: exOwned.mivEx.length,
      total: mivExIds.length,
      platformId: 67,
      dataSet: 'EX'
    }
  ];
};
