const config = require('./info/info.json');
const commandDB = require('./db/commandDB.js');
const roleDB = require('./db/roleDB.js');
const Discord = require('discord.js');
const Client = new Discord.Client();
const Chalk = require('chalk');

const prefix = "!";
const helpPrefix = "?";

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The ready event must be called. If it is not called the rest of the events do not start emitting.
  DATE: 23/06/17
*/
Client.on('ready', () => {
  commandDB.createTable();
  const guild = Client.guilds.find('name', 'tsukle-dev');
  const channel = guild.channels.find('name', 'general');
  channel.send({embed: {
    color: 0xffff00,
    title: "Bot online!",
    description: `Hello!`,
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
  DATE: 24/06/17
*/
Client.on('presenceUpdate', (oldMember, newMember) => {
  let guild = newMember.guild;

  //Role List. THIS NEEDS TO BE DATABASED. THIS CODE IS UGLY AS FUCK.
  let OW = guild.roles.find("name", "Playing Overwatch");
  let PUBG = guild.roles.find("name", "Playing PUBG");
  let CSGO = guild.roles.find("name", "Playing CSGO");
  let H1Z1 = guild.roles.find("name", "Playing H1Z1");
  let GTAV = guild.roles.find("name", "Playing GTA:V");
  let LOL = guild.roles.find("name", "Playing LOL");
  let RS = guild.roles.find("name", "Playing Runescape");
  let MC = guild.roles.find("name", "Playing Minecraft");
  let HS = guild.roles.find("name", "Playing Hearthstone");
  let ARMA3 = guild.roles.find("name", "Playing ArmA 3");
  let ARMA2 = guild.roles.find("name", "Playing ArmA 2");
  let ARMA2OA = guild.roles.find("name", "Playing ArmA 2:OA");
  let roleArray = [OW, PUBG, CSGO, H1Z1, GTAV, LOL, RS, MC, HS, ARMA2, ARMA2OA, ARMA3];

  let Streamer = guild.roles.find("name", "Streamer");
  let Tsukle = guild.roles.find("name", "Tsukle");
  const announcementChannel = newMember.guild.channels.find('name', 'announcements');

  let game = newMember.user.presence.game;
  if(game){
    let stream = newMember.user.presence.game.streaming;
    if(stream === true){
      if(newMember.roles.has(Streamer.id) || newMember.roles.has(Tsukle.id)){
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
    }
    for(i in roleArray){
      if(newMember.roles.has(roleArray[i].id)){
        newMember.removeRole(roleArray[i]);
      }
    }
    switch (game.name){
      case "Overwatch":
        newMember.addRole(OW).catch(console.error);
        break;
      case "PUBG":
        newMember.addRole(PUBG).catch(console.error);
        break;
      case "Counter-Strike: Global Offensive":
        newMember.addRole(CSGO).catch(console.error);
        break;
      case "H1Z1: King of the Kill":
        newMember.addRole(H1Z1).catch(console.error);
        break;
      case "Grand Theft Auto V":
        newMember.addRole(GTAV).catch(console.error);
        break;
      case "League of Legends":
        newMember.addRole(LOL).catch(console.error);
        break;
      case "Runescape 3":
        newMember.addRole(RS).catch(console.error);
        break;
      case "Minecraft":
        newMember.addRole(MC).catch(console.error);
        break;
      case "Hearthstone":
        newMember.addRole(HS).catch(console.error);
        break;
      case "ArmA 2":
        newMember.addRole(ARMA2).catch(console.error);
        break;
      case "ArmA 2: Operation Arrowhead":
        newMember.addRole(ARMA2OA).catch(console.error);
        break;
      case "ArmA 3":
        newMember.addRole(ARMA3).catch(console.error);
        break;
      default:
        newMember.removeRoles(roleArray).catch(console.error);
    }
  }
  else if(!game){
    for(i in roleArray){
      if(newMember.roles.has(roleArray[i].id)){
        newMember.removeRole(roleArray[i]);
      }
    }
  }
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
      Owner Commands
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

//This is the bot token that it uses to login.
Client.login(config.tokenDev);
