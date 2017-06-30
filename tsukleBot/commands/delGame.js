const gameDB = require('../database/gameDB.js');

exports.run = function(message, args, client, config){
    let firstSplit = args.split("<").slice(1);
    let gameToRemove = firstSplit[0].split(">")[0];

      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Removed Game!",
            icon_url: client.user.avatarURL
          },
          description: `${gameToRemove} has been removed from the database.`,
          timestamp: new Date(),
          footer: {
            text: `Bye bye.`
          }
        }});
      gameDB.removeGame(gameToRemove);
}