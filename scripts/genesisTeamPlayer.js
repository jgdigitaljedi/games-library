// Sega Genesis Team Player compatible title

module.exports.teamPlayerData = (games, detail) => {
  return games.map(game => {
    const special = game.extraData;
    const tp = special && special.indexOf(detail) >= 0;
    if (tp) {
      game.multiplayerNumber = 4;
    }
    return game;
  });
};
