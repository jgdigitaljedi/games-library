// I'm going for handheld only games so I'm ignoring the Switch since it plays on the TV when docked
const handheldsArr = [
  '37', // Nintendo 3DS
  '24', // GBA
  '38', // PSP
  '20', // Nintendo DS
  '33', // Game Boy
  '22', // Game Boy Color
  '35', // Game Gear
  '46', // Vita
  '379', // Game.com
  '61' // Lynx
];

const inHandheldsArr = (id, name) => {
  if (id) {
    return (
      handheldsArr.indexOf(id.toString()) >= 0 && name !== 'Nintendo GameCube (Game Boy Player)'
    );
  } else {
    return false;
  }
};

module.exports.isHandheld = (id, name) => {
  return inHandheldsArr(id, name);
};
