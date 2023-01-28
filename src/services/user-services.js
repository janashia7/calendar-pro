const { google } = require("googleapis");

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
