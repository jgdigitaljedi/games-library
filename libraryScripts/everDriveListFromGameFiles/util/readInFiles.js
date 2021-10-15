const fs = require('fs');

module.exports.readIn = async folderPath => {
  try {
    return await fs.readdirSync(folderPath);
  } catch (error) {
    Promise.resolve({ error: true, message: 'ERROR READING FILES AT PATH: ', folderPath });
  }
};
