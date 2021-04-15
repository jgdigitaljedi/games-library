const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const tg = require('./results/turboEverdrive.json');
const sg = require('./results/megaEverdriveGames.json');
const s32x = require('./results/megaEverdrive32xGames.json');

const combined = [...tg, ...sg, ...s32x];

fs.writeFile(
  path.join(__dirname, '../../server/extra/everDrive.json'),
  JSON.stringify(combined),
  'utf8',
  error => {
    if (error) {
      console.log(chalk.red.bold('ERROR WRITING everdrive.json:', JSON.stringify(error)));
    } else {
      console.log(chalk.green('SUCCESSFULLY WROTE everdrive.json!'));
    }
  }
);
