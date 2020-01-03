const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const chalk = require('chalk');
const winston = require('./config/logger');
const port = process.env.NODE_ENV === 'production' ? 3001 : 4001;
const logger = require('./config/logger');

const routes = require('./routes/index');

app.use(morgan('combined', { stream: winston.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet()); // only gonna be run on my home server in my private network, but most of my friends are devs or dev ops so can't be too careful

app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.logThis(err, req);
  res.status(404).json({ error: true, message: `${req.method}: ${req.url} is not a known route!` });
  // next(err);
});

app.listen(port, () => console.log(chalk.cyan(`app listening on port ${port}!`)));
