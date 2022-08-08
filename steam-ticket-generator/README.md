# Steam Encrypted App Ticket Generator

Code credits: [Henrik3](https://github.com/Henrik-3) and [Multiversus.js](https://github.com/ElijahPepe/multiversus.js)

This program lets you generate the app ticket you need to get authenticated for the api. Download it, cmd to the folder it is downloaded in, and run `steam-ticket-generator username password 1818750`. This will generate the ticket you need in Step 1 of the auth flow.

Download: [Windows](https://raw.githubusercontent.com/brianbaldner/multiversus-api-docs/main/steam-ticket-generator/steam-ticket-generator.exe) [Linux](https://raw.githubusercontent.com/brianbaldner/multiversus-api-docs/main/steam-ticket-generator/steam-ticket-generator-linux)

## Troubleshooting: 
If it doesn't work,, try installing npm and installing the dependency: 

Windows: [Download](https://nodejs.org/dist/v16.16.0/node-v16.16.0-x64.msi)

Linux: `sudo apt-get install npm`

Install dependency: `npm install steam-user`