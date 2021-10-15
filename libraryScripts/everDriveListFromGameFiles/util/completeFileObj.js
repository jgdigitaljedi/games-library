const consoleIds = require('../../buildConsleIdList/consoleIds.json');

module.exports.returnWithConsoleName = id => {
  const consoleName = consoleIds.find(con => con.id === id).name;
  return { consoleId: id, consoleName };
};
