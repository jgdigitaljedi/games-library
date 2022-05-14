const db = require('../../../../db');

function getId(game) {
  const id = game?.consoleId;
  if (!id) {
    return null;
  }
  if (typeof id === 'number') {
    return id.toString();
  }
  return id;
}

module.exports.getPlatformGamesStats = function () {
  const games = db.games.find();
  try {
    const pgamesData = games.reduce((acc, game) => {
      const id = getId(game);
      if (id) {
        if (!acc[id]) {
          acc[id] = {
            total: 1,
            highestPaid: {
              id: game.id,
              name: game.name,
              pricePaid: parseFloat(game.pricePaid) || 0
            },
            highestValue: {
              id: game.id,
              name: game.name,
              value: game.priceCharting?.price || 0
            }
          };
        } else {
          acc[id].total++;
          if (game.pricePaid && parseFloat(game.pricePaid) > acc[id].highestPaid.pricePaid) {
            acc[id].highestPaid = {
              id: game.id,
              name: game.name,
              pricePaid: parseFloat(game.pricePaid)
            };
          }
          if (game.priceCharting?.price && game.priceCharting.price > acc[id].highestValue.value) {
            acc[id].highestValue = {
              id: game.id,
              name: game.name,
              value: game.priceCharting.price
            };
          }
        }
      }
      return acc;
    }, {});
    return pgamesData;
  } catch (error) {
    return { error: true, message: error };
  }
};
