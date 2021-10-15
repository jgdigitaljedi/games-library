const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports.writeOut = async (results, fileName, errorRun) => {
  const cleaned = [],
    errors = [];
  results.forEach(result => {
    if (result.error) {
      errors.push(result);
    } else {
      cleaned.push(result);
    }
  });
  console.log(chalk.green(`Writing ${cleaned.length} results`));
  console.log(chalk.yellow(`Writing ${errors.length} errors`));

  // write results
  fs.writeFile(
    path.join(__dirname, `../results/${fileName}${errorRun || ''}`),
    JSON.stringify(cleaned, null, 2),
    err => {
      if (err) {
        err.forEach(error => {
          console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
        });
      }
    }
  );

  // write errors to another file so I can address them later
  fs.writeFile(
    path.join(__dirname, `../errors/errors${fileName}${errorRun || ''}`),
    JSON.stringify(errors, null, 2),
    err => {
      if (err) {
        err.forEach(error => {
          console.log(chalk.red.bold(JSON.stringify(error, null, 2)));
        });
      }
    }
  );
};
