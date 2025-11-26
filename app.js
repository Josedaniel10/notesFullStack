const config = require('./utils/config.js');
const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./controllers/user.js');
const noteRouter = require('./controllers/note.js');
const loginRouter = require('./controllers/login.js')
const middleware = require('./utils/middleware.js');
const API_NOTES = '/api/notes'
const API_USERS = '/api/users'
const API_LOGIN = '/api/login'
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

app.use(API_USERS, userRouter);
app.use(API_NOTES, noteRouter);
app.use(API_LOGIN, loginRouter);

app.use(middleware.unKonownEndpoint)
app.use(middleware.errorhandler);

module.exports = app