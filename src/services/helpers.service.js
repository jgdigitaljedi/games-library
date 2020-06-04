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
      physicalDigital: 'physical',
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
  }
};
