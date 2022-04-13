const db = require('../../../../db');

// TODO: get list for Nintendo 3DS launch titles
// TODO: get list for REAL 3DO launch titles
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
  nvbLt: []
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
  smsEx: []
};

const igdbIdToFiles = {
  18: { launch: nesLtIds, exclusives: nesExIds, launchList: 'nesLt', exList: 'nesEx' }, //nes,
  19: { launch: snesLtIds, exclusives: snesExIds, launchList: 'snesLt', exList: 'snesEx' }, //snes,
  4: { launch: n64LtIds, exclusives: n64ExIds, launchList: 'n64Lt', exList: 'n64Ex' }, //n64,
  21: { launch: gcLtIds, exclusives: gcExIds, launchList: 'gcLt', exList: 'gcEx' }, //gc,
  130: { launch: switchLtIds, exclusives: switchExIds, launchList: 'switchLt', exList: 'switchEx' }, // Nintendo Switch
  5: { launch: wiiLtIds, exclusives: wiiExIds, launchList: 'wiiLt', exList: 'wiiEx' }, //wii,
  41: { launch: wiiULtIds, exclusives: wiiUExIds, launchList: 'wiiULt', exList: 'wiiUEx' }, //wiiU,
  37: { launch: [], exclusives: n3dsExIds, launchList: '', exList: 'n3dsEx' }, // Nintendo 3DS
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
  50: { launch: [], exclusives: r3doExIds, launchList: '', exList: 'r3doEx' }, // 3DO
  78: { launch: scdLtIds, exclusives: scdExIds, launchList: 'scdLt', exList: 'scdEx' }, //scd,
  35: { launch: ggLtIds, exclusives: ggExIds, launchList: 'ggLt', exList: 'ggEx' }, //sGg,
  86: { launch: tgLtIds, exclusives: tgExIds, launchList: 'tgLt', tgEx: 'tgEx' }, //tg16,
  59: { launch: atari2600Lt, exclusives: atari2600Ex, launchList: 'a2600Lt', exList: 'a2600Ex' },
  66: { launch: atari5200Lt, exclusives: atari5200Ex, launchList: 'a5200Lt', exList: 'a5200Ex' },
  60: { launch: atari7800Lt, exclusives: atari7800Ex, launchList: 'a7800Lt', exList: 'a7800Ex' },
  64: { launch: smsLtIds, exclusives: smsExIds, launchList: 'smsLt', exList: 'smsEx' }, //sms,
  67: { launch: [], exclusives: [] }, //miv,
  62: { launch: atariJagLt, exclusives: atariJagEx, launchList: 'jagLt', exList: 'aJagEx' },
  87: { launch: [], exclusives: [] }, //nvb
  6: { launch: nvbLtIds, exclusives: [], launchList: 'nvbLt', exList: '' } //pc
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

module.exports.getLaunchEx = function () {
  return [
    {
      con: 'Atari 2600',
      launchOwned: launchOwned.a2600Lt.length,
      launchTotal: atari2600Lt.length,
      exOwned: exOwned.a2600Ex.length,
      exTotal: atari2600Ex.length
    },
    {
      con: 'Atari 5200',
      launchOwned: launchOwned.a5200Lt.length,
      launchTotal: atari5200Lt.length,
      exOwned: exOwned.a5200Ex.length,
      exTotal: atari5200Ex.length
    },
    {
      con: 'Atari 7800',
      launchOwned: launchOwned.a7800Lt.length,
      launchTotal: atari7800Lt.length,
      exOwned: exOwned.a7800Ex.length,
      exTotal: atari7800Ex.length
    },
    {
      con: 'Atari Jaguar',
      launchOwned: launchOwned.aJagLt.length,
      launchTotal: atariJagLt.length,
      exOwned: exOwned.aJagEx.length,
      exTotal: atariJagEx.length
    },
    {
      con: 'Nintendo Entertainment System (NES)',
      launchOwned: launchOwned.nesLt.length,
      launchTotal: nesLtIds.length,
      exOwned: exOwned.nesEx.length,
      exTotal: nesExIds.length
    },
    {
      con: 'Super Nintendo Entertainment System (SNES)',
      launchOwned: launchOwned.snesLt.length,
      launchTotal: snesLtIds.length,
      exOwned: exOwned.snesEx.length,
      exTotal: snesExIds.length
    },
    {
      con: 'Nintendo 64 (N64)',
      launchOwned: launchOwned.n64Lt.length,
      launchTotal: n64LtIds.length,
      exOwned: exOwned.n64Ex.length,
      exTotal: n64ExIds.length
    },
    {
      con: 'Nintendo GameCube',
      launchOwned: launchOwned.gcLt.length,
      launchTotal: gcLtIds.length,
      exOwned: exOwned.gcEx.length,
      exTotal: gcExIds.length
    },
    {
      con: 'Nintendo Switch',
      launchOwned: launchOwned.switchLt.length,
      launchTotal: switchLtIds.length,
      exOwned: exOwned.switchEx.length,
      exTotal: switchExIds.length
    },
    {
      con: 'Nintendo Wii',
      launchOwned: launchOwned.wiiLt.length,
      launchTotal: wiiLtIds.length,
      exOwned: exOwned.wiiEx.length,
      exTotal: wiiExIds.length
    },
    {
      con: 'Nintendo Wii U',
      launchOwned: launchOwned.wiiULt.length,
      launchTotal: wiiULtIds.length,
      exOwned: exOwned.wiiUEx.length,
      exTotal: wiiUExIds.length
    },
    {
      con: 'Nintendo 3DS',
      launchOwned: 0,
      launchTotal: 0,
      exOwned: exOwned.n3dsEx.length,
      exTotal: n3dsExIds.length
    },
    {
      con: 'Nintendo Game Boy Advance',
      launchOwned: launchOwned.gbaLt.length,
      launchTotal: gbaLtIds.length,
      exOwned: exOwned.gbaEx.length,
      exTotal: gbaExIds.length
    },
    {
      con: 'Sega Mega Drive/Genesis',
      launchOwned: launchOwned.genLt.length,
      launchTotal: genLtIds.length,
      exOwned: exOwned.genEx.length,
      exTotal: genExIds.length
    },
    {
      con: 'Sega 32X',
      launchOwned: launchOwned.s32xLt.length,
      launchTotal: s32xLtIds.length,
      exOwned: exOwned.s32xEx.length,
      exTotal: s32xExIds.length
    },
    {
      con: 'Sega Dreamcast',
      launchOwned: launchOwned.dcLt.length,
      launchTotal: dcLtIds.length,
      exOwned: exOwned.dcEx.length,
      exTotal: dcExIds.length
    },
    {
      con: 'Sega Saturn',
      launchOwned: launchOwned.ssLt.length,
      launchTotal: ssLtIds.length,
      exOwned: exOwned.ssEx.length,
      exTotal: ssExIds.length
    },
    {
      con: 'Microsoft Xbox',
      launchOwned: launchOwned.ogxbLt.length,
      launchTotal: ogxbLtIds.length,
      exOwned: exOwned.ogxbEx.length,
      exTotal: ogxbExIds.length
    },
    {
      con: 'Microsoft Xbox 360',
      launchOwned: launchOwned.xb360Lt.length,
      launchTotal: xb360LtIds.length,
      exOwned: exOwned.xb360Ex.length,
      exTotal: xb360ExIds.length
    },
    {
      con: 'Microsoft Xbox One',
      launchOwned: launchOwned.xboneLt.length,
      launchTotal: xboneLtIds.length,
      exOwned: exOwned.xboneEx.length,
      exTotal: xboneExIds.length
    },
    {
      con: 'Sony PlayStation',
      launchOwned: launchOwned.ps1Lt.length,
      launchTotal: ps1LtIds.length,
      exOwned: exOwned.ps1Ex.length,
      exTotal: ps1ExIds.length
    },
    {
      con: 'Sony PlayStation 2',
      launchOwned: launchOwned.ps2Lt.length,
      launchTotal: ps2LtIds.length,
      exOwned: exOwned.ps2Ex.length,
      exTotal: ps2ExIds.length
    },
    {
      con: 'Sony PlayStation 3',
      launchOwned: launchOwned.ps3Lt.length,
      launchTotal: ps3LtIds.length,
      exOwned: exOwned.ps3Ex.length,
      exTotal: ps3ExIds.length
    },
    {
      con: 'Sony PlayStation 4',
      launchOwned: launchOwned.ps4Lt.length,
      launchTotal: ps4LtIds.length,
      exOwned: exOwned.ps4Ex.length,
      exTotal: ps4ExIds.length
    },
    {
      con: 'Sony PlayStation Portable',
      launchOwned: launchOwned.pspLt.length,
      launchTotal: pspLtIds.length,
      exOwned: exOwned.pspEx.length,
      exTotal: pspExIds.length
    },
    {
      con: 'Nintendo DS',
      launchOwned: launchOwned.dsLt.length,
      launchTotal: dsLtIds.length,
      exOwned: exOwned.dsEx.length,
      exTotal: dsExIds.length
    },
    {
      con: 'Nintendo Game Boy',
      launchOwned: launchOwned.gbLt.length,
      launchTotal: gbLtIds.length,
      exOwned: exOwned.gbEx.length,
      exTotal: gbExIds.length
    },
    {
      con: 'Nintendo Game Boy Color',
      launchOwned: launchOwned.gbcLt.length,
      launchTotal: gbcLtIds.length,
      exOwned: exOwned.gbcEx.length,
      exTotal: gbcExIds.length
    },
    {
      con: 'REAL 3DO',
      launchOwned: 0,
      launchTotal: 0,
      exOwned: exOwned.r3doEx.length,
      exTotal: r3doExIds.length
    },
    {
      con: 'Sega CD',
      launchOwned: launchOwned.scdLt.length,
      launchTotal: scdLtIds.length,
      exOwned: exOwned.scdEx.length,
      exTotal: scdExIds.length
    },
    {
      con: 'Sega Game Gear',
      launchOwned: launchOwned.ggLt.length,
      launchTotal: ggLtIds.length,
      exOwned: exOwned.ggEx.length,
      exTotal: ggExIds.length
    },
    {
      con: 'NEC TurboGrafx-16',
      launchOwned: launchOwned.tgLt.length,
      launchTotal: tgLtIds.length,
      exOwned: exOwned.tgEx.length,
      exTotal: tgExIds.length
    },
    {
      con: 'Sega Master System',
      launchOwned: launchOwned.smsLt.length,
      launchTotal: smsLtIds.length,
      exOwned: exOwned.smsEx.length,
      exTotal: smsExIds.length
    },
    {
      con: 'Nintendo Virtual Boy',
      launchOwned: launchOwned.nvbLt.length,
      launchTotal: nvbLtIds.length,
      exOwned: 0,
      exTotal: 0
    }
  ];
};
