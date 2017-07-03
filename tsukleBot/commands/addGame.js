const gameDB = require('../database/gameDB.js');
const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = message.content.split("<").slice(1);
    let gameTitle = firstSplit[0].split(">")[0];
    let gameRole = firstSplit[1].split(">")[0];
    let roleExists = message.guild.roles.find("name", gameRole);
    if(roleExists){
        let random = Math.floor(Math.random() * 5000) + 1;
        gameRole = `${gameRole}${random}`;
    }
    message.guild.createRole({
        name: gameRole,
        color: 'BLUE',
        hoist: true,
        position: 10,
        permission: 103926849,
        mentionable: true
    })
    .then(role => {
        let roleIDToAdd = role.id
        let roleTypeToAdd = "Game"
        message.channel.send({embed: {
            color: 0xffff00,
            author: {
            name: "New Game Role Created!",
            icon_url: client.user.avatarURL
            },
            description: `${gameRole} - ${roleIDToAdd} - ${roleTypeToAdd}: has been created and added to the database.`,
            timestamp: new Date(),
            footer: {
            text: `Role ${gameRole} added to the database.`
            }
        }});
        roleDB.addRole(gameRole, roleIDToAdd, roleTypeToAdd);
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
    })
    .catch(console.error)
}