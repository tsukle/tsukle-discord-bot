//Import Section
const chalk = require('chalk');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (client, config) => {
    console.log(chalkInfo('Online.'));
    client.user.setUsername(config.username).catch(console.error);
    client.user.setGame("?help | !currentCommands", "https://twitch.tv/tsukle");
}