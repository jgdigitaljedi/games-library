const db = require('../../../../db');
const _sortBy = require('lodash/sortBy');
const Add = require('stringman-utils').precisionMathAdd;
const Sub = require('stringman-utils').precisionMathSubtract;
const Divide = require('stringman-utils').precisionMathDivide;

module.exports.getGameStats = () => {
  const games = db.games.find();
  return games.reduce((acc, game, index) => {
    if (index === 0) {
      acc.totalSpent = 0;
      acc.totalValue = 0;
      acc.totalCount = 0;
      acc.averageValue = 0;
    }
    if (game.physical) {
      const paid = game.pricePaid ? parseFloat(game.pricePaid) : 0;
      const price = game.priceCharting?.price || 0;
      acc.totalSpent = Add(acc.totalSpent, paid);
      acc.totalValue = Add(acc.totalValue, price);
      acc.totalCount++;
      if (!acc.hasOwnProperty(game.consoleName)) {
        acc[game.consoleName] = {
          spent: paid || 0,
          value: price || 0,
          diff: price - paid,
          count: 1
        };
      } else if (paid || price) {
        acc[game.consoleName].spent = Add(acc[game.consoleName].spent, paid || 0);
        acc[game.consoleName].value = Add(acc[game.consoleName].value, price || 0);
        acc[game.consoleName].diff = Sub(acc[game.consoleName].value, acc[game.consoleName].spent);
        acc[game.consoleName].count++;
      }
    }
    if (index + 1 === games.length) {
      acc.totalDiff = Sub(acc.totalValue, acc.totalSpent);
      console.log('acc.totalValue', acc.totalValue);
      console.log('acc.totalCount', acc.totalCount);
      acc.averageValue = Divide(acc.totalValue, acc.totalCount);
    }
    return acc;
  }, {});
};

module.exports.getPlatformStats = () => {
  try {
    const platforms = db.consoles.find();
    const counters = {};
    return platforms.reduce((acc, platform, index) => {
      if (index === 0) {
        acc.totalSpent = 0;
        acc.totalValue = 0;
        acc.averageValue = 0;
        acc.totalCount = platforms.length;
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
          acc.averageValue = Divide(acc.totalValue, platforms.length);
        }
      }
      return acc;
    }, {});
  } catch (error) {
    return error;
  }
};

module.exports.getAccStats = () => {
  const accessories = db.gameAcc.find();
  return accessories.reduce((acc, accessory, index) => {
    if (index === 0) {
      acc.totalSpent = 0;
      acc.totalValue = 0;
      acc.totalCount = 0;
      acc.averageValue = 0;
    }
    if (accessory.hasOwnProperty('priceCharting')) {
      const paid = accessory.pricePaid ? parseFloat(accessory.pricePaid) : 0;
      const price = accessory.priceCharting?.price || 0;
      acc.totalSpent = Add(acc.totalSpent, paid);
      acc.totalValue = Add(acc.totalValue, price);
      const accConsole = accessory?.associatedConsole?.consoleName || null;
      const accQuantity =
        typeof accessory?.quantity === 'string'
          ? parseInt(accessory.quantity) || 1
          : accessory.quantity || 1;
      if (!acc.hasOwnProperty(accConsole)) {
        acc.totalCount += accQuantity;
        acc[accConsole] = {
          spent: paid || 0,
          value: price || 0,
          diff: price - paid,
          count: accQuantity
        };
      } else if (paid || price) {
        acc.totalCount += accQuantity;
        acc[accConsole].spent = Add(acc[accConsole].spent, paid || 0);
        acc[accConsole].value = Add(acc[accConsole].value, price || 0);
        acc[accConsole].diff = Sub(acc[accConsole].value, acc[accConsole].spent);
        acc[accConsole].count += accQuantity;
      }
      if (index + 1 === accessories.length) {
        acc.totalDiff = Sub(acc.totalValue, acc.totalSpent);
        acc.averageValue = Divide(acc.totalValue, acc.totalCount);
      }
    }
    return acc;
  }, {});
};

module.exports.getClonesStats = () => {
  try {
    const clones = db.clones.find();
    const counters = {};
    return clones.reduce((acc, clone, index) => {
      if (index === 0) {
        acc.totalSpent = 0;
        acc.totalValue = 0;
        acc.totalCount = 0;
        acc.averageValue = 0;
      }
      if (clone.hasOwnProperty('priceCharting')) {
        const paid = clone.pricePaid ? parseFloat(clone.pricePaid) : 0;
        const price = clone.priceCharting.price;
        acc.totalSpent = Add(acc.totalSpent, paid);
        acc.totalValue = Add(acc.totalValue, price);
        acc.totalCount++;
        if (!acc.hasOwnProperty(clone.name)) {
          acc[clone.name] = { spent: paid || 0, value: price || 0, diff: price - paid };
          counters[clone.name] = 1;
        } else if (paid || price) {
          const newCount = counters[clone.name] + 1;
          counters[clone.name] = newCount;
          acc[`${clone.name} (${newCount})`] = {
            spent: paid || 0,
            value: price || 0,
            diff: price - paid
          };
        }
        if (index + 1 === clones.length) {
          acc.totalDiff = Sub(acc.totalValue, acc.totalSpent);
          acc.averageValue = Divide(acc.totalValue, clones.length);
        }
      }
      return acc;
    }, {});
  } catch (error) {
    return error;
  }
};

module.exports.getMostValuableGames = () => {
  return _sortBy(db.games.find(), 'priceCharting.price', null)
    .reverse()
    .filter(d => d?.priceCharting?.price)
    .slice(0, 5);
};

module.exports.getMostValuableConsoles = () => {
  return _sortBy(db.consoles.find(), 'priceCharting.price', null)
    .reverse()
    .filter(d => d?.priceCharting?.price)
    .slice(0, 5);
};
