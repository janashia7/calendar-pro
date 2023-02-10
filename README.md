# CalendarPro

CalendarPro is a Node.js based application for managing events in a user's calendar. The application makes use of the Google Calendar API and the messagebird API to send SMS reminders to the user before the start of an event.

## Features

- Retrieve events from Google Calendar
- Send SMS reminders to the user before the start of an event using MessageBird API
- She reminder can be set to X minutes before the start of the event, where X is a user-defined value

## Prerequisites

- Node.js
- NPM
- A Google account to access Google Calendar API
- A MessageBird account with access to the MessageBird API

## Installation

1. Clone the repository to your local machine
2. Run `npm install` to install the required packages
3. Set up a project in the Google Developers Console and enable the Google Calendar API
4. Create a MessageBird account and get your API key
5. Create a .env file in the root of your project and add the following environment variables:

```md
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
MESSAGEBIRD_API_KEY=<your_messagebird_api_key>
```

6. Run `npm start` to start the application
7. Open a web browser and go to http://localhost:5000 to access the application

## Usage

1. Sign in with your Google account to access your calendar
2. Add an event to your calendar
3. Set a reminder for the event by specifying the number of minutes before the start of the event
4. A SMS reminder will be sent to the user at the specified time before the start of the event

## Contributing

Contributions are welcome! If you would like to contribute to the project, please create a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or issues, please open an issue in the repository or contact the maintainer directly.