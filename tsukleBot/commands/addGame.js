const gameDB = require('../database/gameDB.js');

exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = message.content.split("<").slice(1);
    let gameTitle = firstSplit[0].split(">")[0];
    let gameRole = firstSplit[1].split(">")[0];
    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "New Game!",
        icon_url: client.user.avatarURL
        },
        description: `Game added: ${gameTitle}`,
        timestamp: new Date(),
        footer: {
        text: `Game ${gameTitle} added to the database.`
        }
    }});
    gameDB.addGame(gameTitle, gameRole);
}