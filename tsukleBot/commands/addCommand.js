const commandDB = require('../database/commandDB.js');

exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = args.split("<").slice(1);
    let commandToAdd = firstSplit[0].split(">")[0];
    let roleToAdd = firstSplit[1].split(">")[0];
    let responseToAdd = firstSplit[2].split(">")[0];

    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "New Command!",
        icon_url: client.user.avatarURL
        },
        description: `${config.prefix}${commandToAdd} has been added to the database.`,
        timestamp: new Date(),
        footer: {
        text: `Use ${config.prefix}${commandToAdd}.`
        }
    }});
    commandDB.addCommand(commandToAdd, roleToAdd, responseToAdd);
}