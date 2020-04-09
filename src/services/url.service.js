export default {
  games:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:4001/api/vg/games'
      : 'http://localhost:4001/api/games'
};
