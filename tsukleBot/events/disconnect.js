//Import Section
const chalk = require('chalk');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (client, config) => {
    console.log(chalkWarn(`${config.username} was disconnected at ${new Date()}`));
}