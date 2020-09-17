// I'm going for handheld only games so I'm ignoring the Switch since it plays on the TV when docked
const handheldsArr = [
  '37', // Nintendo 3DS
  '24', // GBA
  '38', // PSP
  '20', // Nintendo DS
  '33', // Game Boy
  '22', // Game Boy Color
  '35' // Game Gear
];

const inHandheldsArr = (id, name) => {
  return handheldsArr.indexOf(id.toString()) >= 0 && name !== 'Nintendo GameCube (Game Boy Player)';
};

module.exports.isHandheld = game => {
  const hands = game.consoleArr.map(con => inHandheldsArr(con.consoleId, con.consoleName));
  if (game.consoleIgdbId === 24) {
    console.log('asdasdasda', hands);
  }
  return hands.filter(res => res).length > 0;
};
