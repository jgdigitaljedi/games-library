// Sega Genesis Team Player compatible title

module.exports.teamPlayerData = games => {
  return games.map(game => {
    const special = game.extraData;
    const tp = special && special.indexOf('Sega Genesis Team Player compatible title') >= 0;
    if (tp) {
      game.multiplayerNumber = 4;
      console.log('game.igdb.name', game.igdb.name);
    }
    return game;
  });
};
