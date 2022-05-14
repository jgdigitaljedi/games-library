const db = require('../../../../db');
const pmAdd = require('stringman-utils').precisionMathAdd;

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
            totalPaid: parseFloat(game.pricePaid) || 0,
            totalValue: parseFloat(game.priceCharting?.price) || 0,
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
          acc[id].totalPaid = pmAdd(acc[id].totalPaid, game.pricePaid || 0);
          acc[id].totalValue = pmAdd(acc[id].totalValue, game.priceCharting?.price || 0);
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
