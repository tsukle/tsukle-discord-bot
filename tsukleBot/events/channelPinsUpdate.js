//Import Section
const chalk = require('chalk');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (channel, time, client, config) => {
    channel.send({embed: {
        color: 0xffff00,
        author: {
            name: "New Pinned Message!",
            icon_url: client.user.avatarURL
        },
        description: `This channel has a new pinned message, make sure to check it out!`,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
            text: "Invite your friends!"
        }
    }});
}