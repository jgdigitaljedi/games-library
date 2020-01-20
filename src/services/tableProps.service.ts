export default function(view: string) {
  const gamesCols = [
    { field: 'gb.image', header: 'Image' },
    { field: 'igdb.name', header: 'Name', sortable: true },
    { field: 'consoleName', header: 'Console', sortable: true },
    { field: 'multiplayerNumber', header: 'Players', sortable: true },
    { field: 'igdb.first_release_date', header: 'Release Date', sortable: true },
    { field: 'datePurchased', header: 'Purchase Date', sortable: true },
    { field: 'genres', header: 'Genres' },
    { field: 'igdb.esrb', header: 'ESRB', sortable: true },
    { field: 'howAcquired', header: 'How Acquired' },
    { field: 'igdb.total_rating', header: 'Rating', sortable: true },
    { field: 'howAcquired', header: 'How Acquired', sortable: true }
  ];
  let cols;
  switch (view) {
    case 'games':
      cols = gamesCols;
      break;
    case 'consoles':
      cols = [
        { field: 'gb.image', header: 'Image' },
        { field: 'igdb.name', header: 'Name', sortable: true },
        { field: 'gb.company', header: 'Company', sortable: true },
        { field: 'igdb.generation', header: 'Gen', sortable: true },
        { field: 'gb.original_price', header: 'Original Price', sortable: true },
        { field: 'gb.install_base', header: 'Units Sold' },
        { field: 'condition', header: 'Condition', sortable: true },
        { field: 'box', header: 'box', sortable: true },
        { field: 'datePurchased', header: 'Purchase Date', sortable: true },
        { field: 'purchasePrice', header: 'Purchase Price', sortable: true },
        { field: 'howAcquired', header: 'How Acquired', sortable: true }
      ];
      break;
    case 'accessories':
      cols = [
        { field: 'image', header: 'Image' },
        { field: 'name', header: 'Name', sortable: true },
        { field: 'company', header: 'Company', sortable: true },
        { field: 'forConsoleName', header: 'Console', sortable: true },
        { field: 'type', header: 'Type', sortable: true },
        { field: 'quantity', header: 'quantity' },
        { field: 'purchaseDate', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price' },
        { field: 'howAcquired', header: 'How Acquired', sortable: true }
      ];
      break;
    case 'clones':
      cols = [
        { field: 'image', header: 'Image' },
        { field: 'name', header: 'Name', sortable: true },
        { field: 'company', header: 'Company', sortable: true },
        { field: 'wireless', header: 'Wireless', sortable: true },
        { field: 'gamesIncludedAmount', header: 'Original Games', sortable: true },
        { field: 'gamesAddedNumber', header: 'Games Added', sortable: true },
        { field: 'hacked', header: 'Hacked', sortable: true },
        { field: 'datePurchased', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price' }
      ];
      break;
    case 'collectibles':
      cols = [
        { field: 'image', header: 'Image' },
        { field: 'name', header: 'Name', sortable: true },
        { field: 'company', header: 'Company', sortable: true },
        { field: 'type', header: 'Type', sortable: true },
        { field: 'quantity', header: 'Quantity' },
        { field: 'officialLicensed', header: 'Official', sortable: true },
        { field: 'purchaseDate', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price' },
        { field: 'howAcquired', header: 'How Acquired', sortable: true }
      ];
      break;
    case 'hardware':
      cols = [
        { field: 'image', header: 'Image' },
        { field: 'name', header: 'Name', sortable: true },
        { field: 'type', header: 'Type', sortable: true },
        { field: 'company', header: 'Company', sortable: true },
        { field: 'quantity', header: 'Quantity' },
        { field: 'purchaseDate', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price' },
        { field: 'howAcquired', header: 'How Acquired', sortable: true }
      ];
      break;
    default:
      cols = gamesCols;
      break;
  }
  return cols;
}
