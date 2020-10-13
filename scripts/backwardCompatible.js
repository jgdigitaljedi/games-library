const xb360ToOne = require('./bc/Xbox360ToXboxOne.json');
const xboxTo360 = require('./bc/XboxToXbox360.json');
const xboxToOne = require('./bc/XboxToXboxOne.json');

const backwardCompatible = {
  '7': [
    { consoleName: 'Sony PlayStation 2', consoleId: 8 },
    { consoleName: 'Sony PlayStation 3', consoleId: 9 }
  ],
  '5': [{ consoleName: 'Nintendo Wii U', consoleId: 41 }],
  '24': [
    { consoleName: 'Nintendo DS Lite', consoleId: 20 },
    { consoleName: 'Nintendo GameCube (Game Boy Player)', consoleId: 21 }
  ],
  '22': [
    { consoleName: 'Nintendo Game Boy Advance', consoleId: 24 },
    { consoleName: 'Nintendo GameCube (Game Boy Player)', consoleId: 21 }
  ],
  '33': [
    { consoleName: 'Nintendo Game Boy Advance', consoleId: 24 },
    { consoleName: 'Nintendo Game Boy Color', consoleId: 22 },
    { consoleName: 'Nintendo GameCube (Game Boy Player)', consoleId: 21 }
  ],
  '20': [{ consoleName: 'Nintendo 3DS', consoleId: 37 }],
  '59': [{ consoleName: 'Atari 7800', consoleId: 60 }]
};

const xb360ToOneIds = xb360ToOne.map(c => +c.igdbId);
const xbTo360Ids = xboxTo360.map(c => +c.igdbId);
const xbToOneIds = xboxToOne.map(c => +c.igdbId);

module.exports.bc = id => {
  return backwardCompatible[id.toString()] || [];
};

module.exports.xboxBcCheck = (id, og) => {
  if (og) {
    const toOneInd = xbToOneIds.indexOf(id);
    const to360Ind = xbTo360Ids.indexOf(id);
    const ogArr = [];
    if (toOneInd >= 0) {
      ogArr.push({ consoleId: 49, consoleName: 'Microsoft Xbox One' });
    }
    if (to360Ind >= 0) {
      ogArr.push({ consoleId: 12, consoleName: 'Microsoft Xbox 360' });
    }
    return ogArr;
  } else {
    const tsToOneInd = xb360ToOneIds.indexOf(id);
    return tsToOneInd >= 0 ? [{ consoleId: 49, consoleName: 'Microsoft Xbox One' }] : [];
  }
};
