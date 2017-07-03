const gameDB = require('../database/gameDB.js');

exports.run = function(message, args, client, config){
    if (message.member.id !== message.guild.ownerID) return;
    let firstSplit = args.split("<").slice(1);
    let currentTitle = firstSplit[0].split(">")[0];
    let newTitle = firstSplit[1].split(">")[0];
    let newRole = firstSplit[2].split(">")[0];
    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "Updated Game!",
        icon_url: client.user.avatarURL
        },
        description: `This game: ${currentTitle} - has been updated to these values:\nTitle: ${newTitle}\nRole: ${newRole}`,
        timestamp: new Date(),
        footer: {
        text: `Game ${currentTitle} updated.`
        }
    }});
    gameDB.updateGame(currentTitle, newTitle, newRole);
}