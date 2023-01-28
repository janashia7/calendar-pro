const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, CB_URL } = process.env;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CB_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      const res = { accessToken, refreshToken, profile };
      return done(null, res);
    }
  )
);
