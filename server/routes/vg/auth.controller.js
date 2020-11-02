const creds = {
  username: process.env.GAMES_LIBRARY_USERNAME,
  password: process.env.GAMES_LIBRARY_SECRET
};

module.exports.login = function (req, res) {
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
      key: process.env.GAMES_LIBRARY_REQUEST_HEADER
    });
  } else {
    res.status(401).json({
      error: true,
      message: 'Username or password is invalid!',
      key: null
    });
  }
};

module.exports.insecureMW = function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('request.headers', authHeader);
  if (authHeader) {
    if (authHeader === process.env.GAMES_LIBRARY_REQUEST_HEADER) {
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};
