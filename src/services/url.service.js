const piServer = process.env.REACT_APP_PISERVER;
console.log('piserver', piServer);

export default {
  prefix: piServer ? 'http://192.168.0.152:4001' : 'http://localhost:4001'
};
