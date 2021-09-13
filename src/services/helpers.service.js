export default {
  getTodayYMD: dateString => {
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
    return {
      id: null,
      alternative_name: '',
      category: '',
      generation: null,
      name: '',
      version: {
        id: null,
        name: ''
      },
      condition: null,
      box: false,
      manual: false,
      mods: '',
      notes: '',
      datePurchased: null,
      pricePaid: null,
      ghostConsole: false,
      createdAt: '',
      lastUpdated: '',
      howAcquired: '',
      updatedAt: '',
      connectivity: null,
      cpu: '',
      media: '',
      memory: '',
      output: '',
      os: null,
      logo: null,
      releaseDate: {
        date: null,
        region: ''
      }
    };
  },
  resetAccForm: () => {
    return {
      name: '',
      associatedConsole: {
        consoleName: '',
        consoleId: null
      },
      image: '',
      company: '',
      officialLicensed: false,
      quantity: 0,
      type: '',
      notes: '',
      pricePaid: null,
      purchaseDate: '',
      howAcquired: '',
      condition: '',
      box: false,
      cib: false,
      createdAt: '',
      updatedAt: '',
      gameEye: {
        platform: null,
        type: 'Peripheral',
        title: '',
        status: null,
        myValue: null
      }
    };
  },
  physicalDigitalBc: game => {
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
  physicalDigitalBcText: game => {
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

export const conditionOptionsArr = [
  { label: 'Excellent', value: 'Excellent' },
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
  { label: 'Poor', value: 'Poor' },
  { label: 'Other', value: 'Other' }
];

export const gameCaseSubTypes = [
  {
    label: 'Bitbox',
    value: 'bitbox',
    custom: true,
    original: false,
    none: false,
    consoleIds: [18, 19, 33, 22, 24, 4, 35, 30, 64, 29, 86]
  },
  {
    label: 'Universal Game Case',
    value: 'ugc',
    custom: true,
    original: false,
    none: false,
    consoleIds: [59, 66, 60, 62, 67, 4, 18, 30, 64, 29, 19, 87]
  },
  {
    label: 'DVD Case',
    value: 'dvd',
    custom: true,
    original: true,
    none: false,
    consoleIds: [50, 23, 21, 6, 7, 8, 9, 48, 78, 32, 5, 41, 11, 49, 86, 87, 64]
  },
  {
    label: 'CD Case',
    value: 'cd',
    custom: true,
    original: true,
    none: false,
    consoleIds: [50, 23, 21, 6, 7, 8, 9, 48, 78, 32, 5, 41, 11, 49, 86]
  },
  {
    label: '3DS/DS Case',
    value: 'ds',
    custom: true,
    original: true,
    none: false,
    consoleIds: [33, 24, 22, 37, 20, 35, 87]
  },
  { label: 'PSP Case', value: 'psp', custom: true, original: true, none: false, consoleIds: [38] },
  {
    label: 'Long Box',
    value: 'longbox',
    custom: true,
    original: true,
    none: false,
    consoleIds: [7, 78, 32]
  },
  {
    label: 'Cart Shell/Disc Sleeve',
    value: 'shell',
    custom: true,
    original: true,
    none: false,
    consoleIds: [18, 19]
  },
  {
    label: 'None/Loose',
    value: 'none',
    custom: true,
    original: true,
    none: true,
    consoleIds: [
      50, 59, 66, 60, 62, 23, 33, 24, 22, 67, 37, 4, 20, 18, 21, 130, 6, 7, 8, 9, 48, 38, 30, 78,
      35, 64, 29, 32, 19, 86, 5, 41, 11, 12, 49, 87
    ]
  },
  {
    label: 'Gen/32X/MS Case',
    value: 'sega',
    custom: false,
    original: true,
    none: false,
    consoleIds: [30, 64, 29]
  },
  {
    label: 'BluRay Case',
    value: 'bluray',
    custom: true,
    original: true,
    none: false,
    consoleIds: [50, 23, 21, 6, 7, 8, 9, 48, 78, 32, 5, 41, 11, 49, 86]
  },
  {
    label: 'Switch Case',
    value: 'switch',
    custom: false,
    original: true,
    none: false,
    consoleIds: [130]
  },
  {
    label: 'Xbox One Case',
    value: 'xbone',
    custom: false,
    original: true,
    none: false,
    consoleIds: [49]
  }
];

export const filterCaseTypesByMainType = (type, filteredTypes) => {
  return filteredTypes.filter(ct => ct[type]) || [];
};

export const filterCaseTypesByConsole = consoleId => {
  return gameCaseSubTypes.filter(t => t.consoleIds.indexOf(consoleId) >= 0) || [];
};

export const gameMediaType = [
  {
    label: 'Cartridge',
    value: 'cart',
    consoleIds: [59, 66, 60, 62, 33, 24, 22, 67, 37, 4, 20, 18, 130, 30, 35, 64, 29, 19]
  },
  { label: 'Disc', value: 'disc', consoleIds: [50, 21, 7, 8, 9, 48, 78, 32, 5, 41, 11, 12, 49] },
  { label: 'Card', value: 'card', consoleIds: [130, 64, 86] },
  { label: 'UMD', value: 'umd', consoleIds: [38] },
  { label: 'Digital', value: 'digital', consoleIds: [37, 20, 6, 8, 9, 48, 38, 5, 41, 11, 12, 49] },
  {
    label: 'Flashcart',
    value: 'flashcart',
    consoleIds: [59, 66, 60, 62, 33, 24, 22, 67, 37, 4, 20, 18, 130, 30, 35, 64, 29, 19, 86]
  },
  { label: 'ODE', value: 'ode', consoleIds: [21, 7, 8, 78, 32] }
];
