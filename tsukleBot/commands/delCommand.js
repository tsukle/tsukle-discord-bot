const commandDB = require('../database/commandDB.js');

exports.run = function(message, args, client, config){
    if (message.member.id !== message.guild.ownerID) return;
    let firstSplit = args.split("<").slice(1);
    let commandToRemove = firstSplit[0].split(">")[0];

    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "Removed Command!",
        icon_url: client.user.avatarURL
        },
        description: `${config.prefix}${commandToRemove} has been removed from the database.`,
        timestamp: new Date(),
        footer: {
        text: `Bye bye.`
        }
    }});
    commandDB.removeCommand(commandToRemove);
}