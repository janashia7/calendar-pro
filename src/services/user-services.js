const { google } = require('googleapis');
const User = require('../db/models/user-model');

exports.getEvents = async (client, token) => {
  client.setCredentials({
    access_token: token,
  });

  const calendar = google.calendar({ version: 'v3', auth: client });

  const resp = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return resp.data.items;
};

exports.addPhone = async (client, token, phone) => {
  const { email } = await client.getTokenInfo(token);

  await User.findOneAndUpdate({ email }, { phone_number: phone });
};

exports.verifyPhone = async (recipientPhone) => {
  const phone = '+' + recipientPhone;
  await User.findOneAndUpdate({ phone_number: phone }, { verified: true });
};
