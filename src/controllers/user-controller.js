const { google } = require('googleapis');
const User = require('../db/models/user-model');
const userService = require('../services/user-services');

exports.getEvents = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2();

  const events = await userService.getEvents(
    oauth2Client,
    req.user.accessToken
  );

};

exports.getDashboard = async (req, res) => {
  res.send(`Welcome ${req.user.profile.displayName}`);
};

exports.login = async (req, res) => {

  const { given_name, family_name, picture, email } = req.user.profile._json;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.redirect('/user/dashboard');
  }

  await User.create({ email, given_name, family_name, picture });

  res.redirect('/user/dashboard');
};
