const config = require('./info/info.json');
const commandDB = require('./db/commandDB.js');
const roleDB = require('./db/roleDB.js');
const gameDB = require('./db/gameDB.js');
const Discord = require('discord.js');
const Client = new Discord.Client();
const Chalk = require('chalk');

const version = "1.1.0";
const prefix = "!";
const helpPrefix = "?";

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The ready event must be called. If it is not called the rest of the events do not start emitting.
  DATE: 23/06/17
*/
Client.on('ready', () => {
  commandDB.createTable();
  roleDB.createTable();
  gameDB.createTable();
  const guild = Client.guilds.find('name', 'tsukle'); //Change this based on server.
  const channel = guild.channels.find('name', 'general');
  channel.send({embed: {
    color: 0xffff00,
    title: "Bot online!",
    description: `Hello!\nVersion: ${version}`,
    timestamp: new Date(),
    footer: {
      icon_url: Client.user.avatarURL,
      text: "Invite your friends!"
    }
  }});
  Client.user.setGame("?help", "https://twitch.tv/tsukle");
  Client.user.setUsername("tsukleBot");
});

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The guildMemberAdd event gets emitted when a new member joins the server/guild.
  DATE: 23/06/17
*/
Client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'new-members');
  const channel2 = member.guild.channels.find('name', 'welcome');
  if (!channel) return;
  channel.send({embed: {
    color: 0xffff00,
    author: {
      name: member.user.username,
      icon_url: member.user.avatarURL
    },
    thumbnail: {
      url: member.user.avatarURL
    },
    description: `Thanks for joining ${member}!. Check out ${channel2} for the rules!`,
    timestamp: new Date(),
    footer: {
      icon_url: Client.user.avatarURL,
      text: "Invite your friends!"
    }
  }});
});

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The presenceUpdate event emits when a users presence change, aka game changes(includes streaming) or online presence.
  DATE: 26/06/17
*/
Client.on('presenceUpdate', (oldMember, newMember) => {
  const announcementChannel = newMember.guild.channels.find('name', 'announcements');
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
        roleDB.findRoleByType("Twitch", role =>{
          streamRole = role.roleID;
          if(newMember.roles.has(streamRole)){
            announcementChannel.send({embed: {
              color: 0xffff00,
              author: {
                name: "Stream announcement!",
                icon_url: Client.user.avatarURL
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
          } else return;
        });
      }
      gameDB.currentGames(games => {
        for(i in games){
          if(game.name === games[i].gameTitle){
            let role = guild.roles.find("name", games[i].gameRole);
            if(!role) return;
            newMember.addRole(role).catch(console.error);
          }
        }
      });
    }
    else if(!game){
      clearRoles(newMember, gameRoleArray);
    }
  });
});

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The message event gets emitted when a message is sent in the server. It also gives us a list of properties to work with from the message.
  DATE: 23/06/17
*/
Client.on('message', message =>{
  if(message.author.bot) return;
  if(message.content.startsWith(prefix)){
    let command = message.content.split(" ")[0].slice(prefix.length);
    
    /*
      CommandsDB Commands
    */
    
    //Adding Commands | !addCommand <command> <role> response
    if(command === "addCommand" && message.member.user.id === message.member.guild.owner.id){
      let arguments = message.content.split("<").slice(1);
      let commandToAdd = arguments[0].split(">")[0];
      let roleToAdd = arguments[1].split(">")[0];
      let responseToAdd = arguments[1].split("> ").slice(1).join(" ");
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "New Command!",
            icon_url: Client.user.avatarURL
          },
          description: `${prefix}${commandToAdd} has been added to the database.`,
          timestamp: new Date(),
          footer: {
            text: `Use ${prefix}${commandToAdd}.`
          }
        }});
      commandDB.addCommand(commandToAdd, roleToAdd, responseToAdd);
    }

    //Deleting Commands | !delCommand commandName
    else if(command === "delCommand" && message.member.user.id === message.member.guild.owner.id){
      let commandToRemove = message.content.split(" ").slice(1)[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Removed Command!",
            icon_url: Client.user.avatarURL
          },
          description: `${prefix}${commandToRemove} has been removed from the database.`,
          timestamp: new Date(),
          footer: {
            text: `Bye bye.`
          }
        }});
      commandDB.removeCommand(commandToRemove);
    }

    /*
      RolesDB Commands
    */

    //Adding Roles | !addRole <roleName> <roleID> <roleType>
    if(command === "addRole" && message.member.user.id === message.member.guild.owner.id){
      let arguments = message.content.split("<").slice(1);
      let roleToAdd = arguments[0].split(">")[0];
      let roleIDToAdd = arguments[1].split(">")[0];
      let roleTypeToAdd = arguments[2].split(">")[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "New Role!",
            icon_url: Client.user.avatarURL
          },
          description: `${roleToAdd} - ${roleIDToAdd} - ${roleTypeToAdd} has been added to the database.`,
          timestamp: new Date(),
          footer: {
            text: `Role ${roleToAdd} added.`
          }
        }});
      roleDB.addRole(roleToAdd, roleIDToAdd, roleTypeToAdd);
    }

    //Deleting Commands | !delRole roleName
    else if(command === "delRole" && message.member.user.id === message.member.guild.owner.id){
      let roleToRemove = message.content.split(" ").slice(1)[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Removed Role!",
            icon_url: Client.user.avatarURL
          },
          description: `${roleToRemove} has been removed from the database.`,
          timestamp: new Date(),
          footer: {
            text: `Bye bye.`
          }
        }});
      roleDB.removeRole(roleToRemove);
    }

    //Updating Roles | !updateRole <currentRoleName> <newRoleName> <newRoleID> <newRoleType>
    if(command === "updateRole" && message.member.user.id === message.member.guild.owner.id){
      let arguments = message.content.split("<").slice(1);
      let currentRoleName = arguments[0].split(">")[0];
      let newRoleName = arguments[1].split(">")[0];
      let newRoleID = arguments[2].split(">")[0];
      let newRoleType = arguments[3].split(">")[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Updated Role!",
            icon_url: Client.user.avatarURL
          },
          description: `This role: ${currentRoleName} - has been updated to these values:\nName: ${newRoleName}\nID: ${newRoleID}\nType: ${newRoleType}`,
          timestamp: new Date(),
          footer: {
            text: `Role ${currentRoleName} updated.`
          }
        }});
      roleDB.updateRole(currentTitle, newTitle, newRole);
    }

    //Current Roles | !currentRoles
    else if(command === "currentRoles" && message.member.user.id === message.member.guild.owner.id){
      roleDB.currentRoles((roles) => {
        let roleList = "";
        for(i in roles){
          roleList = `${roleList}\n${roles[i]}`;
        }
        message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Current Games!",
            icon_url: Client.user.avatarURL
          },
          description: `${roleList}\n(${message.author})`,
          timestamp: new Date(),
          footer: {
            text: `Organising People!`
          }
        }});
      });
    }

    /*
      GamesDB Commands
    */

    //Adding Games | !addGame <gameTitle> <gameRole>
    if(command === "addGame" && message.member.user.id === message.member.guild.owner.id){
      let arguments = message.content.split("<").slice(1);
      let gameTitle = arguments[0].split(">")[0];
      let gameRole = arguments[1].split(">")[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "New Game!",
            icon_url: Client.user.avatarURL
          },
          description: `Game added: ${gameTitle}`,
          timestamp: new Date(),
          footer: {
            text: `Game ${gameTitle} added to the database.`
          }
        }});
      gameDB.addGame(gameTitle, gameRole);
    }

    //Updating Games | !updateGame <currentTitle> <newTitle> <newRole>
    if(command === "updateGame" && message.member.user.id === message.member.guild.owner.id){
      let arguments = message.content.split("<").slice(1);
      let currentTitle = arguments[0].split(">")[0];
      let newTitle = arguments[1].split(">")[0];
      let newRole = arguments[2].split(">")[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Updated Game!",
            icon_url: Client.user.avatarURL
          },
          description: `This game: ${currentTitle} - has been updated to these values:\nTitle: ${newTitle}\nRole: ${newRole}`,
          timestamp: new Date(),
          footer: {
            text: `Game ${currentTitle} updated.`
          }
        }});
      gameDB.updateGame(currentTitle, newTitle, newRole);
    }

    //Deleting Games | !delGame gameTitle
    else if(command === "delGame" && message.member.user.id === message.member.guild.owner.id){
      let gameTitle = message.content.split(" ").slice(1)[0];
      message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Removed Game!",
            icon_url: Client.user.avatarURL
          },
          description: `${gameTitle} has been removed from the database.`,
          timestamp: new Date(),
          footer: {
            text: `Bye bye.`
          }
        }});
      gameDB.removeGame(gameTitle);
    }

    //Current Games | !currentGames
    else if(command === "currentGames" && message.member.user.id === message.member.guild.owner.id){
      gameDB.currentGames((games) => {
        let gameList = "";
        for(i in games){
          gameList = `${gameList}\n${games[i]}`;
        }
        message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Current Games!",
            icon_url: Client.user.avatarURL
          },
          description: `${gameList}\n(${message.author})`,
          timestamp: new Date(),
          footer: {
            text: `Pew Pew!`
          }
        }});
      });
    }

    //Kick User.
    else if(command === "kick" && message.member.user.id === message.member.guild.owner.id){
      let kickee = message.mentions.users.first();
      message.guild.member(kickee).kick().catch(console.error);
    }

    //Message Purge.
    else if(command === "purge" && message.member.user.id === message.member.guild.owner.id){
      let argument = message.content.split(" ").slice(1)[0];
      let messageCount = parseInt(argument);
      if(messageCount === 1 || messageCount === 2){
        message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: `${prefix}${command}`,
            icon_url: Client.user.avatarURL
          },
          description: `Please use a number higher than 1 or 2.`,
          timestamp: new Date(),
          footer: {
            text: `More!`
          }
        }});
      }
      else{
        message.channel.fetchMessages({limit: messageCount}).then(messages => message.channel.bulkDelete(messages));
        message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: `${prefix}${command}`,
            icon_url: Client.user.avatarURL
          },
          description: `Purged ${messageCount} messages.`,
          timestamp: new Date(),
          footer: {
            text: `Later spam!`
          }
        }});
      }
    }

    //list Commands
    else if(command === "commands"){
      commandDB.currentCommands((commands) => {
        let commandList = "";
        for(i in commands){
          commandList = `${commandList}\n!${commands[i]}`;
        }
        message.channel.send({embed: {
          color: 0xffff00,
          author: {
            name: "Current Commands!",
            icon_url: Client.user.avatarURL
          },
          description: `${commandList}\n(${message.author})`,
          timestamp: new Date(),
          footer: {
            text: `Don't spam them!`
          }
        }});
      });
    }

    /*
      Other Commands
    */
    else{
      commandDB.findCommand(command, (result) =>{
        let guild = message.member.guild;
        if(result === null){
          return;
        }
        else{
          let userRole = guild.roles.find("name", result.role);
          if(!userRole && result.role !== "All"){
            return;
          }
          if(result.role === "All"){
            message.channel.send({embed: {
              color: 0xffff00,
              author: {
                name: `${prefix}${command}`,
                icon_url: Client.user.avatarURL
              },
              description: `${result.response} (${message.author})`,
              timestamp: new Date(),
              footer: {
                text: `You used a command!`
              }
            }});
          }
          else if(message.member.roles.has(userRole.id)){
            message.channel.send({embed: {
              color: 0xffff00,
              author: {
                name: `${prefix}${command}`,
                icon_url: Client.user.avatarURL
              },
              description: `${result.response} (${message.author})`,
              timestamp: new Date(),
              footer: {
                text: `You used a command!`
              }
            }});
          }
          else{
            message.channel.send({embed: {
              color: 0xffff00,
              author: {
                name: `Sorry about that.`,
                icon_url: Client.user.avatarURL
              },
              description: `It appears you don't have permission to use this command.`,
              timestamp: new Date(),
              footer: {
                text: `Sorry!`
              }
            }});
            return;
          }
        }
      });
    }
  }
  else if(message.content.startsWith(helpPrefix)){
    message.channel.send({embed: {
      color: 0xffff00,
      author: {
        name: `Need some help?`,
        icon_url: Client.user.avatarURL
      },
      thumbnail:{
        url: Client.user.avatarURL
      },
      description: `I'm tsukleBot. Created by ${message.member.guild.owner}, I serve the purpose of helping users in this discord server whether it be through my commands or other means.\n\nTo get you started I'll send you a list of my current commands too, if you want to see them again in the future just use !commands.`,
      timestamp: new Date(),
      footer: {
        text: `Hope I helped!`
      }
    }});
    commandDB.currentCommands((commands) => {
      let commandList = "";
      for(i in commands){
        commandList = `${commandList}\n!${commands[i]}`;
      }
      message.channel.send({embed: {
        color: 0xffff00,
        author: {
          name: "Current Commands!",
          icon_url: Client.user.avatarURL
        },
        description: `${commandList}\n(${message.author})`,
        timestamp: new Date(),
        footer: {
          text: `Don't spam them!`
        }
      }});
    });
  }
});

//Don't want to repeat code so I will call this when I need to clear roles on presence updates.
function clearRoles(newMember, roleArray){
  for(i in roleArray){
    if(newMember.roles.has(roleArray[i])){
      newMember.removeRole(roleArray[i]).catch(console.error);
      return;
    }
  } 
}

//This is the bot token that it uses to login.
Client.login(config.token);
