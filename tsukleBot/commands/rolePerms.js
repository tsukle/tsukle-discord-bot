const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = args.split("<").slice(1);
    let roleToAdd = firstSplit[0].split(">")[0];
    let role = message.guild.roles.find("name", roleToAdd);
    let permissionSet = role.permissions;

    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "Permission Set!",
        icon_url: client.user.avatarURL
        },
        description: `${permissionSet}`,
        timestamp: new Date(),
        footer: {
        text: `${permissionSet}`
        }
    }});
}