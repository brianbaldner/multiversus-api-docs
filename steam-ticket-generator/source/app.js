const SteamUser = require('steam-user');

var username = process.argv[2];
var password = process.argv[3];
var appid = Number(process.argv[4]);

const steamUser = new SteamUser();
			try {
				steamUser.logOn({ accountName: username, password });
			} catch (err) {
				throw new Error('Invalid Steam username or password provided!');
			}
			steamUser.on('loggedOn', async (details) => {
				const ticket = await steamUser.getEncryptedAppTicket(appid, null);

				console.log(ticket.encryptedAppTicket.toString('hex'));

                process.exit(1);
			});
