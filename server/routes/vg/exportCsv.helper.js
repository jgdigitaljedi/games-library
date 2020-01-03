module.exports.getKeys = function (which) {
  switch (which) {
    case 'consoles':
      return [
        'igdb.name',
        'igdb.version',
        'igdb.generation',
        'gb.company',
        'gb.install_base',
        'gb.original_price',
        'gb.online_support',
        'ghostConsole',
        'condition',
        'connectedBy',
        'upscaler',
        'datePurchased',
        'purchasePrice',
        'howAcquired',
        'box',
        'mods',
        'storage',
        'unit',
        'createdAt',
        'updatedAt'
      ];
    case 'clones':
      return [
        'name',
        'company',
        'consolesEmulated',
        'controllerNumber',
        'wireless',
        'takesOriginalControllers',
        'maxPlayers',
        'addons',
        'connectedBy',
        'upscaler',
        'hd',
        'gamesIncludedAmount',
        'hacked',
        'gamesAddedNumber',
        'datePurchased',
        'pricePaid',
        'createdAt',
        'updatedAt'
      ];
    case 'games':
      return [
        'igdb.name',
        'consoleName',
        'igdb.genres',
        'igdb.esrb',
        'igdb.first_release_date',
        'igdb.total_rating',
        'itgb.total_rating_count',
        'physical',
        'case',
        'condition',
        'howAcquired',
        'pricePaid',
        'datePurchased',
        'multiplayerNumber',
        'pirated',
        'notes',
        'createdAt',
        'updatedAt'
      ];
    case 'collectibles':
      return [
        'name',
        'company',
        'officialLicensed',
        'type',
        'assConCleaned',
        'associatedGame',
        'character',
        'quantity',
        'purchaseDate',
        'pricedPaid',
        'howAcquired',
        'createdAt',
        'updatedAt'
      ];
    case 'general':
      return [
        'name',
        'company',
        'type',
        'conCleaned',
        'quantity',
        'purchaseDate',
        'pricePaid',
        'howAcquired',
        'notes',
        'createdAt',
        'updatedAt'
      ];
    case 'accessories':
      return [
        'name',
        'company',
        'officialLicensed',
        'forConsoleName',
        'type',
        'quantity',
        'purchaseDate',
        'pricePaid',
        'howAcquired',
        'notes',
        'createdAt',
        'updatedAt',
      ];
    default:
      return [];
  }
};

module.exports.getHeaderLine = function (which) {
  switch (which) {
    case 'games':
      return `Name,Console,Genres,ESRB,Release Date,User Rating,Ratings Count,Physical Copy,Case,Condition,How Acquired,Price Paid,Date Acquired,Num Players,Pirated,Notes,Date Added,Date Updated\n`;
    case 'consoles':
      return 'Name,Version,Generation,Company,Units Sold,Original Price,Online Support,Ghost,Condition,Connected By,Upscaler,Date Purchased,Purchase Price,How Acquired,Box,Mods,Storage,Unit,Date Added,Last Updated\n';
    case 'clones':
      return 'Name,Company,Consoles Emulated,# Controller,Wireless?,Original Con. Works?,Max # Players,Addons,Connected By,Upscaler?,HD Output,# Games Included,Hacked?,# Games Added,Date Purchased,Price Paid,Date Added,Last Updated\n';
    case 'collectibles':
      return 'Name,Company,Official/Licensed,Type,Associated Console,Associated Game,Character,Quantity,Date Purchased,Purchase Price,How Acquired,Date Added,Last Updated\n';
    case 'general':
      return 'Name,Company,Type,Used By Console,Quantity,Date Purchased,Price Paid,How Acquired,Notes,Date Added,Last Updated\n';
    case 'accessories':
      return 'Name,Company,Official/Licensed,For Console,Type,Quantity,Date Purchased,Price Paid,How Acquired,Notes,Date Added,Last Updated\n';
    default:
      return '';
  }
};
