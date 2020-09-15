const consoleLocationList = {
  '18': 'upstairs', //nes,
  '19': 'upstairs', //snes
  '4': 'upstairs', // n64
  '21': 'upstairs', // gc
  '130': 'downstairs', // Nintendo Switch
  '5': 'both', // wii
  '41': 'downstairs', // wiiU
  '37': 'both', // Nintendo 3DS
  '24': 'both', // GBA
  '29': 'upstairs', // Genesis
  '30': 'upstairs', // 32X
  '23': 'upstairs', // Dreamcast
  '32': 'upstairs', // Saturn
  '11': 'upstairs', // Xbox
  '12': 'downstairs', // Xbox 360
  '49': 'downstairs', // Xbox One
  '7': 'both', // PlayStation
  '8': 'upstairs', // PS2
  '9': 'downstairs', // PS3
  '48': 'downstairs', // ps4
  '38': 'both', // PSP
  '20': 'both', // Nintendo DS
  '33': 'both', // Game Boy
  '22': 'both', // Game Boy Color
  '50': 'upstairs', // 3DO
  '78': 'upstairs', // Sega CD
  '35': 'both', // Game Gear
  '86': 'upstairs', // TurboGrafx-16
  '59': 'upstairs', // Atari 2600
  '6': 'both', //pc
  '66': 'upstairs', // Atari 5200
  '60': 'upstairs' // Atari 7800
};

module.exports.getLocation = id => {
  return consoleLocationList[id.toString()];
};
