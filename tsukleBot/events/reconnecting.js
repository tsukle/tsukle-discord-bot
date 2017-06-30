//Import Section
const chalk = require('chalk');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (client, config) => {
    console.log(chalkInfo(`${config.username} is reconnecting at ${new Date()}`));
}