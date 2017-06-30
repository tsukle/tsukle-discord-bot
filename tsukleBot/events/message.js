//Import Section
const chalk = require('chalk');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (message, client, config) => {
    if(message.author.bot) return;

    if(message.content.startsWith(config.prefix)){
        const command = message.content.split(' ')[0].slice(config.prefix.length);
        const fullMessage = message.content.split(' ');
        const removeCommand = fullMessage.shift();
        const args = fullMessage.join(' ');

        try{
            let commandFile = require(`../commands/${command}`);
            commandFile.run(message, args, client, config);
        } catch(e){
            let catcher = require('../commands/commandCatcher/catcher'); //This is for db commands.
            catcher.run(message, command, args, client, config);
        }
    }
    else if(message.content.startsWith(config.prefixHelp)){
        const command = message.content.split(' ')[0].slice(config.prefix.length);

        try{
            let commandFile = require(`../commands/help/${command}`);
            commandFile.run(message, client, config);
        } catch(e){
            return;
        }
    }
}