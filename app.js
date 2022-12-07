require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const routes = require('./routes');
// Middlewares
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
// Port
const { PORT = 3000, NODE_ENV, DB_NAME } = process.env;

const app = express();
app.use(cors);

mongoose.connect(NODE_ENV === 'production' ? DB_NAME : 'mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.use(routes);
app.use(errorLogger);
// Error handler npm celebrate
app.use(errors());

// Central Error Handler
app.use(error);

app.listen(PORT, () => {
  console.log(`Server working on ${PORT} port`);
});
