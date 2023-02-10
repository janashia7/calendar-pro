const { default: axios } = require('axios');
const { google } = require('googleapis');
const schedule = require('node-schedule');
const User = require('../db/models/user-model');
const userService = require('../services/user-services');
require('dotenv').config();
const messagebird = require('messagebird').initClient(
  process.env.MESSAGEBIRD_API_KEY
);
const moment = require('moment');

exports.addReminder = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2();

  const { email } = req.user.profile._json;
  const { phone_number } = await User.findOne({ email, verified: true });

  let oldJob = null;

  schedule.scheduleJob('* * * * * *', async () => {
    console.log('Parent --------every seconds---------------------------');

    const events = await userService.addReminder(
      oauth2Client,
      req.user.accessToken
    );

    if (events.length !== 0) {
      const { dateTime, timeZone } = events[0].start;

      const msPerMinute = 60000;
      const minuteToSubtract = 14; // user minute reminder

      const fullMs = new Date(dateTime).valueOf();

      const dateWithSubtract = new Date(
        fullMs - minuteToSubtract * msPerMinute
      );

      const localDate = new Date(moment.utc(dateWithSubtract).local().format());

      if (oldJob) {
        oldJob.cancel();
      }

      oldJob = schedule.scheduleJob(
        {
          hour: localDate.getHours(),
          minute: localDate.getMinutes(),
          dayOfWeek: localDate.getDay(),
          date: localDate.getDate(),
          month: localDate.getMonth(),
          year: localDate.getFullYear(),
        },
        async () => {
          const message =
            "Hello, it's CalendarPro,\nDo you remember?\nThe event starts in " +
            minuteToSubtract +
            ' minute.';

          console.log(message);
          messagebird.messages.create(
            {
              originator: 'CalendarPro',
              recipients: [phone_number],
              body: message,
            },
            (err, response) => {
              if (err) {
                console.log(err);
              } else {
                console.log(response);
              }
            }
          );
        }
      );
    }
  });
};

exports.getDashboard = async (req, res) => {
  res.send(`Welcome ${req.user.profile.displayName}`);
};

exports.login = async (req, res) => {
  const { given_name, family_name, picture, email } = req.user.profile._json;

  const user = await User.findOne({ email });

  if (user && user.verified) {
    return res.redirect('/user/dashboard');
  } else if (user && !user.phone_number) {
    return res.json({ message: 'Please add phone number' });
  } else if (user && !user.verified) {
    return res.json({ message: 'Please verify phone number' });
  }
  await User.create({ email, given_name, family_name, picture });

  res.json({ message: 'Add and verify phone number' });
};

exports.sendCode = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2();
  const { phone_number } = req.body;
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');

  if (!phone_number) {
    return res.json({ message: 'Please input the number' });
  }

  await userService.addPhone(oauth2Client, token, phone_number);

  messagebird.verify.create(
    phone_number,
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
      await userService.verifyPhone(response.recipient);
      res.json(response);
    }
  });
};
