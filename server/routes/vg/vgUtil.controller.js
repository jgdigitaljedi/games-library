const gamesCrud = require('./vgCrud/gamesCrud.controller');
const platformsCrud = require('./vgCrud/consolesCrud.controller');
const _sortBy = require('lodash/sortBy');
const _flatten = require('lodash/flatten');
const _uniqBy = require('lodash/uniqBy');

module.exports.getPlatformArray = (req, res) => {
  try {
    const platforms = platformsCrud.getPlatforms();
    const formatted = _sortBy(
      platforms.map(p => ({ label: p.name, value: p.name })),
      'label'
    );
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: true, message: error });
  }
};

// this one will stay current if a platform was added and have ids
module.exports.getPlatformsWithId = (req, res) => {
  const platforms = platformsCrud.getPlatforms();
  if (platforms && platforms.length) {
    const platformsArr = _sortBy(
      _uniqBy(
        platforms.map(p => {
          return { name: p.name, id: p.id };
        }),
        'name'
      ),
      'name'
    );
    res.json(platformsArr);
  } else {
    res.json([]);
  }
};

module.exports.getEsrbArray = (req, res) => {
  const games = gamesCrud.getGames();
  if (games && games.length > 1) {
    const newRatings = _sortBy(
      _flatten(games.map(d => d.igdb.esrb || null).filter(d => d))
        .reduce((acc, g) => {
          if (!acc) {
            acc = [];
          }
          if (acc && acc.indexOf(g) === -1 && g) {
            acc.push(g);
          }
          return acc;
        }, [])
        .map(g => {
          return { label: g, value: g };
        }),
      'label'
    );
    newRatings.unshift({ label: 'NOT SET', value: '' });
    res.json(newRatings);
  } else {
    res.json([]);
  }
};

module.exports.getGenreArray = (req, res) => {
  const games = req.data || gamesCrud.getGames();
  if (games && games.length > 1) {
    const newGenres = _sortBy(
      _flatten(games.map(d => d.igdb.genres || null).filter(d => d))
        .reduce((acc, g) => {
          if (!acc) {
            acc = [];
          }
          if (acc && acc.indexOf(g) === -1 && g) {
            acc.push(g);
          }
          return acc;
        }, [])
        .map(g => {
          return { label: g, value: g };
        }),
      'label'
    );
    // newGenres.unshift({ label: 'NOT SET', value: '' });
    res.json(newGenres);
  } else {
    res.json([]);
  }
};

module.exports.getHowAcquiredArr = (req, res) => {
  const games = gamesCrud.getGames();
  if (games && games.length) {
    const howAcquired = games.reduce((acc, game) => {
      const ha = game?.howAcquired;
      if (ha && acc.indexOf(ha) < 0) {
        acc.push(ha);
      }
      return acc;
    }, []);
    res.json(howAcquired.sort());
  } else {
    res.json([]);
  }
};
