const gameDB = require('../database/gameDB.js');
const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = message.content.split("<").slice(1);
    let gameTitle = firstSplit[0].split(">")[0];
    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "Ignoring game!",
        icon_url: client.user.avatarURL
        },
        description: `Game ignored: ${gameTitle}`,
        timestamp: new Date(),
        footer: {
        text: `Game ${gameTitle} is being ignored.`
        }
    }});
    gameDB.addGame(gameTitle, "None");
}