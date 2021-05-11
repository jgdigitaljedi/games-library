const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const edMaster = require('../../server/extra/everDrive.json');
const gcLoader = require('../../server/extra/everDrives/gamecubeLoader.json');
const med32x = require('../../server/extra/everDrives/megaEverdrive32xGames.json');
const med = require('../../server/extra/everDrives/megaEverdriveGames.json');
const tged = require('../../server/extra/everDrives/turboEverdrive.json');

const supp = games => {
  return games.map(game => {
    game.vr = {
      vrOnly: false,
      vrCompatible: false
    };

    return game;
  });
};

const writeToFile = async (filePath, writable) => {
  try {
    await fs.writeFileSync(path.join(__dirname, `${filePath}.json`), writable);
    return { error: false, message: `Successfully wrote ${filePath}!` };
  } catch (error) {
    return await { error: true, message: error };
  }
};

const fileArr = [
  { file: 'edMaster', data: supp(edMaster) },
  { file: 'gcLoader', data: supp(gcLoader) },
  { file: 'med32x', data: supp(med32x) },
  { file: 'med', data: supp(med) },
  { file: 'tged', data: supp(tged) }
];

fileArr.forEach(async item => {
  const result = await writeToFile(item.file, JSON.stringify(item.data));
  if (result.error) {
    console.log(chalk.red.bold(result.message));
  } else {
    console.log(chalk.green(result.message));
  }
});
