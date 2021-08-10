const fs = require('fs');
const path = require('path');
const moment = require('moment');
const accessories = require('./gameAcc.json');
const chalk = require('chalk');

/**"name": "Pro Controller",
    "forConsoleName": "Nintendo Switch",
    "forConsoledId": "",
    "image": "https://i5.walmartimages.com/asr/7a20f413-2f9e-46c9-9b5f-8cdb32d125cc_1.1f0a2f6313f2fb2cd3c42f4566f44506.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
    "company": "Nintendo",
    "officialLicensed": true,
    "quantity": "1",
    "type": "Controller",
    "notes": "",
    "pricePaid": "80",
    "purchaseDate": "2017-12-28",
    "howAcquired": "Best Buy",
    "createdAt": "11/21/2018 05:43 am",
    "updatedAt": "11/21/2018 05:43 am",
    "forConsoleId": 130,
    "_id": "ef0cabd07c064a4380658816f66124c4" */

function convert(acc) {
  return {
    name: acc.name,
    associatedConsole: {
      consoleName: acc.forConsoleName,
      consoleId: acc.forConsoleId
    },
    image: acc.image,
    company: acc.company,
    officialLicensed: acc.officialLicensed,
    quantity:
      typeof acc.quantity === 'string'
        ? parseInt(acc.quantity)
        : typeof acc.quantity === 'number'
        ? acc.quantity
        : 0,
    type: acc.type,
    notes: acc.notes,
    pricePaid:
      typeof acc.pricePaid === 'string'
        ? parseInt(acc.pricePaid)
        : typeof acc.pricePaid === 'number'
        ? acc.pricePaid
        : 0,
    purchaseDate: acc.purchaseDate ? moment(acc.purchaseDate).format('MM/DD/YYYY') : '',
    howAcquired: acc.howAcquired,
    condition: 'Good',
    box: false,
    cib: false,
    createdAt: acc.createdAt || '',
    updatedAt: acc.updatedAt || '',
    _id: acc._id
  };
}

(function () {
  const newAcc = accessories.map(item => convert(item));
  fs.writeFile(path.join(__dirname, './accOutput.json'), JSON.stringify(newAcc, null, 2), error => {
    if (error) {
      console.log(chalk.red.bold('ERROR WRITING', error));
    } else {
      console.log(chalk.green(`SUCCESSFULLY WROTE ${accessories.length} RESULTS!`));
    }
  });
})();
