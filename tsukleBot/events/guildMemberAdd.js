//Import Section
const chalk = require('chalk');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (member, client, config) => {
    const channel = member.guild.channels.find('name', 'new-members');
    if (!channel){
        channel = member.guild.defaultChannel;
    }
    else{
        channel.send({embed: {
            color: 0xffff00,
            author: {
            name: member.user.username,
            icon_url: member.user.avatarURL
            },
            thumbnail: {
            url: member.user.avatarURL
            },
            description: `Thanks for joining ${member.user}!.`.toString(),
            timestamp: new Date(),
            footer: {
            icon_url: client.user.avatarURL,
            text: "Invite your friends!"
            }
        }});
    }
}