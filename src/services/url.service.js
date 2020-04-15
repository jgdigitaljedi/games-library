const piServer = process.env.REACT_APP_PISERVER;

export default {
  prefix: piServer ? 'http://ghome.help:4001' : 'http://localhost:4001',
  assets: piServer ? 'http://ghome.help/gameslib/' : ''
};
