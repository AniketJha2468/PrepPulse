const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use('/api', routes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
