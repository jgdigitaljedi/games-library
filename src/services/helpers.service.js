export default {
  getTodayYMD: dateString => {
    const dSplit = dateString.split('-');
    return new Date(`${dSplit[1]}/${dSplit[2]}/${dSplit[0]}`);
  },
  resetGameForm: () => {
    return {
      igdb: {
        name: '',
        id: 9999,
        genres: [],
        total_rating: 0,
        total_rating_count: 0,
        first_release_date: '',
        developers: '',
        esrb: ''
      },
      gb: {
        aliases: '',
        guid: '',
        gbid: 9999,
        image: '',
        deck: '',
        platforms: ''
      },
      consoleName: '',
      consoleIgdbId: 9999,
      consoleGbid: 9999,
      consoleGbGuid: '',
      condition: 'none',
      case: 'none',
      pricePaid: '',
      physical: true,
      cib: false,
      multiplayerNumber: '',
      datePurchased: '',
      howAcquired: '',
      physicalDigital: ['physical'],
      notes: '',
      createdAt: '',
      updatedAt: '',
      _id: '',
      genres: '',
      compilation: null,
      name: '',
      image: '',
      description: '',
      newDatePurchased: new Date()
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
