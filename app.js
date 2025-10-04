const config = require('./utils/config.js');
const express = require('express');
const app = express();
const cors = require('cors');
const noteRouter = require('./controllers/note.js');
const middleware = require('./utils/middleware.js');
const URL_API = '/api/notes';
const mongoose = require('mongoose');
const logger = require('./utils/logger.js');

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch(err => logger.error("❌ Error connecting to MongoDB:", err))

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(middleware.requestLogger);

app.use(URL_API, noteRouter);

app.use(middleware.unKonownEndpoint)
app.use(middleware.errorhandler);

module.exports = app