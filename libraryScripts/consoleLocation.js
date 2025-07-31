// prettier-ignore
const consoleLocationList = {
  '18': 'game room', //nes,
  '19': 'game room', //snes
  '4': 'game room', // n64
  '21': 'game room', // gc
  '130': 'game room', // Nintendo Switch
  '5': 'both', // wii
  '41': 'game room', // wiiU
  '37': 'both', // Nintendo 3DS
  '24': 'both', // GBA
  '29': 'game room', // Genesis
  '30': 'game room', // 32X
  '23': 'game room', // Dreamcast
  '32': 'game room', // Saturn
  '11': 'both', // Xbox
  '12': 'game room', // Xbox 360
  '49': 'game room', // Xbox One
  '7': 'both', // PlayStation
  '8': 'game room', // PS2
  '9': 'game room', // PS3
  '48': 'game room', // ps4
  '38': 'both', // PSP
  '20': 'both', // Nintendo DS
  '33': 'both', // Game Boy
  '22': 'both', // Game Boy Color
  '50': 'game room', // 3DO
  '78': 'game room', // Sega CD
  '35': 'both', // Game Gear
  '86': 'game room', // TurboGrafx-16
  '59': 'game room', // Atari 2600
  '6': 'game room', //pc
  '66': 'game room', // Atari 5200
  '60': 'game room', // Atari 7800
  '62': 'game room', // Atari Jaguar
  '67': 'game room', // IntelliVision
  '64': 'game room', // Master System
  '87': 'both', // virtual boy
  '379': 'both', // Game.com
  '46': 'both', // Vita
  '61': 'both', // lynx
  '508': 'living room', // Nintendo Switch 2
  '80': 'game room', // Neo Geo Pocket
};

module.exports.getLocation = (id) => {
  console.log('location', consoleLocationList[id.toString()]);
  return consoleLocationList[id.toString()];
};
