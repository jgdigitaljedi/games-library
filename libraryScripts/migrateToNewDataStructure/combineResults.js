const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

(() => {
  let combined = [];
  let errors = [];
  fs.readdir(path.join(__dirname, './results'), (error, files) => {
    if (error) {
      console.log(chalk.red.bold('ERROR READING FILES***************'));
      console.log(chalk.red(error));
    } else {
      console.log('files', files);
      files.forEach((file, index) => {
        const contents = fs.readFileSync(path.join(__dirname, `./results/${file}`), {
          encoding: 'utf-8'
        });

        JSON.parse(contents).forEach((c) => {
          if (c.hasOwnProperty('error')) {
            errors.push(c);
          } else {
            combined.push(c);
          }
        });

        if (index === files.length - 1) {
          console.log(chalk.green.bold('TOTAL LENGTH IS ' + combined.length));
          fs.writeFile(
            path.join(__dirname, './masterResults.json'),
            JSON.stringify(combined),
            (error) => {
              if (error) {
                console.log(chalk.red.bold('ERROR WRITING TO MASTER RESULTS FILE***********'));
                console.log(chalk.red.bold(error));
              } else {
                console.log(chalk.green('SUCCESS MAKING MASTER LIST!'));
              }
            }
          );
          fs.writeFile(
            path.join(__dirname, './leftovers.json'),
            JSON.stringify(errors, null, 2),
            (error) => {
              if (error) {
                console.log(chalk.red.bold('ERROR WRITING TO LEFTOVERS FILE***********'));
                console.log(chalk.red.bold(error));
              } else {
                console.log(chalk.green('SUCCESS MAKING LEFTOVERS LIST!'));
              }
            }
          );
        }
      });
    }
  });
})();
