const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

(() => {
  fs.readFile(path.join(__dirname, './finalResultsUnverified.json'), (err, data) => {
    if (err) {
      console.log(chalk.red.bold('ERROR READING FINALRESULTSMINUSMISSING'));
    } else {
      const results = JSON.parse(data);
      fs.readFile(path.join(__dirname, './straggler.json'), (error, moreData) => {
        if (error) {
          console.log(chalk.red.bold('ERROR READING NOIDSRESULTS'));
        } else {
          const leftovers = JSON.parse(moreData);
          const cArr = [...results, ...leftovers];
          console.log(chalk.cyan('length', cArr.length));
          const combined = JSON.stringify(cArr);
          fs.writeFile(path.join(__dirname, './finalResultsUnverified2.json'), combined, (e) => {
            if (e) {
              console.log(chalk.red.bold('ERROR WRITING FINAL RESULTS', e));
            }
          });
        }
      });
    }
  });
})();
