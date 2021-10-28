const games = require('../../../../db/games.json');
const platforms = require('../../../../db/consoles.json');
const Add = require('stringman-utils').precisionMathAdd;
const Sub = require('stringman-utils').precisionMathSubtract;

module.exports.getGameStats = () => {
  return games.reduce((acc, game, index) => {
    if (index === 0) {
      acc.totalSpent = 0;
      acc.totalValue = 0;
    }
    if (game.physical) {
      const paid = game.pricePaid ? parseFloat(game.pricePaid) : 0;
      const price = game.priceCharting?.price || 0;
      acc.totalSpent = Add(acc.totalSpent, paid);
      acc.totalValue = Add(acc.totalValue, price);
      if (!acc.hasOwnProperty(game.consoleName)) {
        acc[game.consoleName] = { spent: paid || 0, value: price || 0, diff: price - paid };
      } else if (paid || price) {
        acc[game.consoleName].spent = Add(acc[game.consoleName].spent, paid || 0);
        acc[game.consoleName].value = Add(acc[game.consoleName].value, price || 0);
        acc[game.consoleName].diff = Sub(acc[game.consoleName].value, acc[game.consoleName].spent);
      }
      if (index + 1 === games.length) {
        acc.totalDiff = Sub(acc.totalValue, acc.totalSpent);
      }
    }
    return acc;
  }, {});
};

module.exports.getPlatformStats = () => {
  try {
    const counters = {};
    return platforms.reduce((acc, platform, index) => {
      if (index === 0) {
        acc.totalSpent = 0;
        acc.totalValue = 0;
      }
      if (platform.hasOwnProperty('priceCharting')) {
        const paid = platform.pricePaid ? parseFloat(platform.pricePaid) : 0;
        const price = platform.priceCharting.price;
        acc.totalSpent = Add(acc.totalSpent, paid);
        acc.totalValue = Add(acc.totalValue, price);
        if (!acc.hasOwnProperty(platform.name)) {
          acc[platform.name] = { spent: paid || 0, value: price || 0, diff: price - paid };
          counters[platform.name] = 1;
        } else if (paid || price) {
          const newCount = counters[platform.name] + 1;
          counters[platform.name] = newCount;
          acc[`${platform.name} (${newCount})`] = {
            spent: paid || 0,
            value: price || 0,
            diff: price - paid
          };
        }
        if (index + 1 === platforms.length) {
          acc.totalDiff = Sub(acc.totalValue, acc.totalSpent);
        }
      }
      return acc;
    }, {});
  } catch (error) {
    return error;
  }
};
