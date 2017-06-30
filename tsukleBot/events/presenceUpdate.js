//Import Section
const chalk = require('chalk');
const roleDB = require('../database/roleDB.js');
const gameDB = require('../database/gameDB.js');

//Chalk pre-variables
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgRed.white;

module.exports = (oldMember, newMember, client, config) => {
    const botGameChannel = newMember.guild.channels.find('name', 'bot-game-suggestions');
    const announcementChannel = newMember.guild.channels.find('name', 'announcements');
    if(!botGameChannel){
        botGameChannel = newMember.guild.defaultChannel;
    }
    if(!announcementChannel){
        announcementChannel = newMember.guild.defaultChannel;
    }
    let guild = newMember.guild;
    let game = newMember.user.presence.game;

    roleDB.findRolesByType("Game", roles =>{
        let streamRole;
        let gameRoleArray = [];
        for(i in roles){
            gameRoleArray.push(roles[i].roleID);
        }
        if(game){
            clearRoles(newMember, gameRoleArray);
            if(game.streaming === true){
                console.log(`${newMember.user} is streaming. And an announcement can be made.`);
                roleDB.findRoleByType("Twitch", role =>{
                    streamRole = role.roleID;
                    if(newMember.roles.has(streamRole) || newMember.user.id === newMember.guild.ownerID){
                        if(!announcementChannel) return;
                        announcementChannel.send({embed: {
                            color: 0xffff00,
                            author: {
                                name: "Stream announcement!",
                                icon_url: client.user.avatarURL
                            },
                            thumbnail: {
                                url: newMember.user.avatarURL
                            },
                            description: `Hey! ${newMember.user} is streaming right now! Come join in: ${game.url}`,
                            timestamp: new Date(),
                            footer: {
                                text: "Have a good stream!"
                            }
                        }});
                        console.log(`${newMember.user} is streaming. And an announcement has been made.`);
                    } else return;
                });
            }
            else{
                gameDB.findGame(game.name, gameResult => {
                    if(gameResult === null){
                        if(!botGameChannel) return console.log("botGameChannel doesn't exist. Returning.");
                            botGameChannel.send({embed: {
                                color: 0xffff00,
                                author: {
                                    name: "Found something!",
                                    icon_url: client.user.avatarURL
                                },
                                description: `Someone is playing a game that isn't in my database!\nGame Title: ${game.name}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `You may want to add it to the database.`
                                }
                            }});
                        return;
                    }
                    let role = guild.roles.find("name", gameResult.gameRole);
                    if(!role) return console.log(`The role for game: ${gameResult.name}. Could not be found in the role table.`);
                    newMember.addRole(role).catch(console.error);
                });
            }
        }
        else if(!game){
            clearRoles(newMember, gameRoleArray);
        }
    });

    function clearRoles(newMember, roleArray){
        for(i in roleArray){
            if(newMember.roles.has(roleArray[i])){
                newMember.removeRole(roleArray[i]).catch(console.error);
            }
        } 
    }
}