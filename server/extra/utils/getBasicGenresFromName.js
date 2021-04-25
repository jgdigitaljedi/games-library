const _uniq = require('lodash/uniq');

const keywords = {
  baseball: 'Baseball',
  mlb: 'Baseball',
  homerun: 'Baseball',
  soccer: 'Soccer',
  fifa: 'Soccer',
  mls: 'Soccer',
  racing: 'Racing',
  kart: 'Racing',
  nhra: 'Racing',
  bowling: 'Bowling',
  pba: 'Bowling',
  golf: 'Golf',
  pga: 'Golf',
  tennis: 'Tennis',
  wimbeldon: 'Tennis',
  basketball: 'Basketball',
  nba: 'Basketball',
  hockey: 'Hockey',
  nhl: 'Hockey',
  football: 'Football',
  nfl: 'Football',
  blitz: 'Football',
  madden: 'Football',
  fishing: 'Fishing',
  pool: 'Pool',
  billiards: 'Pool',
  pinball: 'Pinball',
  skateboarding: 'Skateboarding',
  skater: 'Skateboarding',
  skate: 'Skateboarding',
  snowboarding: 'Snowboarding',
  surfing: 'Surfing',
  surf: 'Surfing',
  party: 'Party',
  wrestling: 'Wrestling',
  wwe: 'Wrestling',
  wwf: 'Wrestling',
  wcw: 'Wrestling',
  guitar: 'Music',
  konga: 'Music',
  vr: 'VR'
};

module.exports.getBasicGenre = name => {
  const lc = name.toLowerCase();
  const lcSplit = lc.split(' ').map(n => n.trim());
  return _uniq(
    lcSplit
      .map(word => {
        if (keywords.hasOwnProperty(word)) {
          return keywords[word];
        }
        return null;
      })
      .filter(n => n)
  );
};
