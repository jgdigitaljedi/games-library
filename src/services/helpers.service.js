export default {
  getTodayYMD: (dateString) => {
    const dSplit = dateString.split('-');
    return new Date(`${dSplit[1]}/${dSplit[2]}/${dSplit[0]}`);
  },
  resetGameForm: () => {
    return {
      name: '',
      id: 9999,
      genres: [],
      total_rating: 0,
      first_release_date: '',
      esrb: '',
      videos: [],
      player_perspectives: [],
      story: '',
      consoleName: '',
      consoleId: 9999,
      condition: 'none',
      case: 'none',
      pricePaid: 0,
      physical: true,
      cib: false,
      maxMultiplayer: 1,
      multiplayer_modes: { offlinecoopmax: 1, offlinemax: 1, splitscreen: false },
      datePurchased: '',
      howAcquired: '',
      physicalDigital: ['physical'],
      notes: '',
      createdAt: '',
      updatedAt: '',
      image: '',
      description: '',
      manual: false,
      compilation: false,
      gamesService: {
        xbPass: false,
        xbGold: false,
        psPlus: false,
        primeFree: false,
        switchFree: false
      }
    };
  },
  resetPlatformForm: () => {
    return {};
  },
  physicalDigitalBc: (game) => {
    console.log('game', game);
    const which = game.physicalDigital;
    const everDrive = which.indexOf('EverDrive') >= 0;
    const phy = which.indexOf('physical') >= 0;
    const bc = which.indexOf('backwardComp') >= 0;
    const digi = which.indexOf('digital') >= 0;
    if (everDrive) {
      return 'everDrive';
    } else if (phy && bc && digi) {
      return 'trifecta';
    } else if (phy && digi) {
      return 'both-copies';
    } else if (phy && bc) {
      return 'backward-compatible';
    } else if (phy) {
      return 'physical-copy';
    } else if (digi) {
      return 'digital-copy';
    } else {
      return 'nope';
    }
  },
  physicalDigitalBcText: (game) => {
    const which = game.physicalDigital;
    const phy = which.indexOf('physical') >= 0;
    const bc = which.indexOf('backwardComp') >= 0;
    const digi = which.indexOf('digital') >= 0;
    const everDrive = which.indexOf('EverDrive') >= 0;
    if (everDrive) {
      return 'EverDrive';
    } else if (phy && bc && digi) {
      return 'All 3';
    } else if (phy && digi) {
      return 'Physical & Digital';
    } else if (phy && bc) {
      return 'Physical & BC';
    } else if (phy) {
      return 'Physical';
    } else if (digi) {
      return 'Digital';
    } else {
      return '';
    }
  }
};

export const consoleGenerationYears = {
  1: '1972 - 1984',
  2: '1976 - 1992',
  3: '1983 - 2003',
  4: '1987 - 2004',
  5: '1993 - 2005',
  6: '1998 - 2013',
  7: '2005 - 2017',
  8: '2012 - 2020',
  UNKNOWN: '???'
};

export const consoleGenerationNames = {
  1: 'First Gen',
  2: 'Second Gen',
  3: 'Third Gen',
  4: 'Fourth Gen',
  5: 'Fifth Gen',
  6: 'Sixth Gen',
  7: 'Seventh Gen',
  8: 'Eighth Gen',
  UNKNOWN: 'UNKNOWN'
};
