const gameDB = require('../database/gameDB.js');

exports.run = function(message, args, client, config){
    if (message.member.id !== message.guild.ownerID) return;
    gameDB.currentGames((games) => {
        let gameList = "";
        for(i in games){
            gameList = `${gameList}\n${games[i].gameTitle} - ${games[i].gameRole}`;
        }
        message.channel.send({embed: {
            color: 0xffff00,
            author: {
            name: "Current Games!",
            icon_url: client.user.avatarURL
            },
            description: `${gameList}\n(${message.author})`,
            timestamp: new Date(),
            footer: {
            text: `Pew Pew!`
            }
        }});
    });
}