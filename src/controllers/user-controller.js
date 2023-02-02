const { google } = require('googleapis');
const User = require('../db/models/user-model');
const userService = require('../services/user-services');
const messagebird = require('messagebird').initClient(
  'sBQnHtWDHnK7Y9OHfdvpAy3C8'
);

exports.getEvents = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2();

  const events = await userService.getEvents(
    oauth2Client,
    req.user.accessToken
  );

  res.json(events);
};

exports.getDashboard = async (req, res) => {
  res.send(`Welcome ${req.user.profile.displayName}`);
};

exports.login = async (req, res) => {
  const { given_name, family_name, picture, email } = req.user.profile._json;

  const user = await User.findOne({ email });

  if (user && user.phone_number) {
    return res.redirect('/user/dashboard');
  } else if (user && !user.phone_number) {
    return res.redirect('/user/add_number');
  }

  await User.create({ email, given_name, family_name, picture });

  res.redirect('/user/add-number');
};

exports.sendCode = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2();
  const { number } = req.body;
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');

  const { email } = await oauth2Client.getTokenInfo(token);

  if (!number) {
    return res.json({ message: 'Please input the number' });
  }

  messagebird.verify.create(
    number,
    {
      originator: 'CalendarPro',
      template: 'Your verification code is %token.',
    },
    (err, response) => {
      if (err) {
        res.json({ error: err.errors[0].description });
      } else {
        res.json({ id: response.id });
      }
    }
  );
};

exports.verify = async (req, res) => {
  const { id, token } = req.body;

  messagebird.verify.verify(id, token, async (err, response) => {
    if (err) {
      res.json({ error: err.errors[0].description, id });
    } else {
      await User.updateOne({ email });
      res.json(response);
    }
  });
};
