const creds = {
  username: process.env.GAMES_LIBRARY_USERNAME,
  password: process.env.GAMES_LIBRARY_SECRET
};

module.exports.login = function (req, res) {
  console.log('asdasd', req.body);
  if (
    req.body &&
    req.body.password &&
    req.body.password === creds.password &&
    req.body.username &&
    req.body.username === creds.username
  ) {
    res.json({
      error: false,
      message: 'Welcome, Joey!',
      key: 'dasdhuaoisuhsoiufbdpwiiy4h82hrpw8adfbp8' // @TODO: make this generated
    });
  } else {
    res.status(403).json({
      error: true,
      message: 'Username or Password is incorrect!',
      key: ''
    });
  }
};
