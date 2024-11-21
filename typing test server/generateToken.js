const { google } = require('googleapis');
const readline = require('readline');

// Replace with your own values from Google Cloud Console
const clientId = 'YOUR_GOOGLE_CLIENT_ID';
const clientSecret = 'YOUR_GOOGLE_CLIENT_SECRET';
const redirectUri = 'YOUR_REDIRECT_URI'; // e.g., 'http://localhost:3000/oauth2callback'

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Generate an authentication URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',  // Important: offline to get a refresh token
  scope: ['https://www.googleapis.com/auth/gmail.send'],  // The scope required to send emails
});

// Create a readline interface to get the authorization code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Authorize this app by visiting this url:', authUrl);

rl.question('Enter the code from that page here: ', async (code) => {
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received:', tokens);

    // The refresh token will be in the tokens object
    console.log('Refresh Token:', tokens.refresh_token);

    // Save the refresh token (You can store it in your .env file)
    rl.close();
  } catch (error) {
    console.error('Error while retrieving access token', error);
    rl.close();
  }
});
