export default function (view: string) {
  const gamesCols = [
    { field: 'image', header: 'Image' },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'consoleName', header: 'Console', sortable: true },
    { field: 'maxMultiplayer', header: 'Players', sortable: true },
    { field: 'first_release_date', header: 'Release Date', sortable: true },
    { field: 'purchaseDate', header: 'Purchase Date', sortable: true },
    { field: 'pricePaid', header: 'Purchase Price', sortable: true },
    { field: 'priceCharting.price', header: 'PC Price', sortable: true },
    { field: 'priceCharting.lastUpdated', header: 'PC Date', sortable: true },
    { field: 'case', header: 'Case/Box', sortable: true },
    { field: 'condition', header: 'Condition', sortable: true },
    { field: 'genresDisplay', header: 'Genres' },
    { field: 'esrb', header: 'ESRB', sortable: true },
    { field: 'howAcquired', header: 'How Acquired' },
    { field: 'notes', header: 'Notes', sortable: false }
  ];
  let cols;
  switch (view) {
    case 'games':
      cols = gamesCols;
      break;
    case 'consoles':
      cols = [
        { field: 'logo', header: 'Logo' },
        { field: 'name', header: 'Name', sortable: true },
        { field: 'generation', header: 'Gen', sortable: true },
        { field: 'releaseDate.date', header: 'Release Date', sortable: true },
        { field: 'manual', header: 'Manual', sortable: true, bool: true },
        { field: 'mods', header: 'Mods', sortable: true },
        { field: 'condition', header: 'Condition', sortable: true },
        { field: 'box', header: 'box', sortable: true, bool: true },
        { field: 'datePurchased', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price', sortable: true },
        { field: 'priceCharting.price', header: 'PC Price', sortable: true },
        { field: 'priceCharting.lastUpdated', header: 'PC Date', sortable: true },
        { field: 'howAcquired', header: 'How Acquired', sortable: true },
        { field: 'notes', header: 'Notes', sortable: true }
      ];
      break;
    case 'accessories':
      cols = [
        { field: 'image', header: 'Image' },
        { field: 'name', header: 'Name', sortable: true },
        { field: 'company', header: 'Company', sortable: true },
        { field: 'associatedConsole.consoleName', header: 'Console', sortable: true },
        { field: 'type', header: 'Type', sortable: true },
        { field: 'condition', header: 'Condition', sortable: true },
        { field: 'quantity', header: 'quantity' },
        { field: 'purchaseDate', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price' },
        { field: 'priceCharting.price', header: 'PC Price', sortable: true },
        { field: 'priceCharting.lastUpdated', header: 'PC Date', sortable: true },
        { field: 'howAcquired', header: 'How Acquired', sortable: true },
        { field: 'cib', header: 'CIB', sortable: true },
        { field: 'mods', header: 'Mods', sortable: false },
        { field: 'notes', header: 'Notes', sortable: false }
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
        { field: 'addons', header: 'Addons', sortable: true },
        { field: 'datePurchased', header: 'Purchase Date', sortable: true },
        { field: 'pricePaid', header: 'Purchase Price' },
        { field: 'priceCharting.price', header: 'PC Price', sortable: true },
        { field: 'priceCharting.lastUpdated', header: 'PC Date', sortable: true }
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
        { field: 'howAcquired', header: 'How Acquired', sortable: true },
        { field: 'priceCharting.price', header: 'PC Price', sortable: true },
        { field: 'priceCharting.lastUpdated', header: 'PC Date', sortable: true }
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
