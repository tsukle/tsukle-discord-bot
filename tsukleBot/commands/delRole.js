const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config){
    let firstSplit = args.split("<").slice(1);
    let roleToRemove = firstSplit[0].split(">")[0];

    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "Removed Role!",
        icon_url: client.user.avatarURL
        },
        description: `${roleToRemove}: has been removed from the database.`,
        timestamp: new Date(),
        footer: {
        text: `Bye bye.`
        }
    }});
    roleDB.removeRole(roleToRemove);
}