const session = require('express-session');
const express = require('express');
const passport = require('passport');
const { google } = require('googleapis');
const user = require('./src/routes/user-routes');
const mongoose = require('mongoose');
const userController = require('./src/controllers/user-controller');
require('./src/auth/passport');
require('dotenv').config();

const app = express();

const { CLIENT_ID, CLIENT_SECRET, CB_URL } = process.env;

app.use(express.json());
app.use(
  session({
    secret: 'key1',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5000;

app.use('/user', user);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
  }),
  userController.login
);

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URI, () => console.log('db connected'));

app.listen(port, () => console.log('server running on port' + port));
