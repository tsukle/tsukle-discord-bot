const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = args.split("<").slice(1);
    let roleToAdd = firstSplit[0].split(">")[0];
    let roleIDToAdd = firstSplit[1].split(">")[0];
    let roleTypeToAdd = firstSplit[2].split(">")[0];
    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "New Role!",
        icon_url: client.user.avatarURL
        },
        description: `${roleToAdd} - ${roleIDToAdd} - ${roleTypeToAdd}: has been added to the database.`,
        timestamp: new Date(),
        footer: {
        text: `Role ${roleToAdd} added.`
        }
    }});
    roleDB.addRole(roleToAdd, roleIDToAdd, roleTypeToAdd);
}