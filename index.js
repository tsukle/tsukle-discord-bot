const config = require('./info.json');
//const badwords = require('./badwords.json');
const db = require('./database.js');
const Discord = require('discord.js');
const Client = new Discord.Client();
const Chalk = require('chalk');

const prefix = "!";

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The ready event must be called. If it is not called the rest of the events do not start emitting.
  DATE: 23/06/17
*/
Client.on('ready', () => {
  db.createTable();
  const guild = Client.guilds.find('name', 'tsukle');
  const channel = guild.channels.find('name', 'general');
  channel.send({embed: {
    color: 15253548,
    thumbnail: {
      url: Client.user.avatarURL
    },
    description: `Bot online.`,
    timestamp: new Date(),
    footer: {
      icon_url: Client.user.avatarURL,
      text: "Invite your friends!"
    }
  }});
  Client.user.setGame("!commands");
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
    color: 15253548,
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
  let Overwatch = guild.roles.find("name", "Playing Overwatch");
  let PUBG = guild.roles.find("name", "Playing PUBG");
  let CSGO = guild.roles.find("name", "Playing CSGO");
  let H1Z1 = guild.roles.find("name", "Playing H1Z1");
  let GTAV = guild.roles.find("name", "Playing GTA:V");
  let LOL = guild.roles.find("name", "Playing LOL");
  let Streamer = guild.roles.find("name", "Streamer");
  let Tsukle = guild.roles.find("name", "Tsukle");
  let roleArray = [Overwatch, PUBG, CSGO, H1Z1, GTAV, LOL];
  const announcementChannel = newMember.guild.channels.find('name', 'announcements');

  let game = newMember.user.presence.game;
  if(game){
    let stream = newMember.user.presence.game.streaming;
    if(stream === true){
      if(newMember.roles.has(Streamer.id) || newMember.roles.has(Tsukle.id)){
        announcementChannel.send({embed: {
          color: 15253548,
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
        newMember.addRole(Overwatch).catch(console.error);
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
      message.channel.send(`Adding command - ${commandToAdd} - to the database for the role - ${roleToAdd}`);
      db.addCommand(commandToAdd, roleToAdd, responseToAdd);
    }

    //Deleting Commands | !delCommand commandName
    else if(command === "delCommand" && message.member.user.id === message.member.guild.owner.id){
      let commandToRemove = message.content.split(" ").slice(1)[0];
      message.channel.send(`Removing command - ${commandToRemove} - from the database`);
      db.removeCommand(commandToRemove);
    }

    //list Commands
    else if(command === "commands"){
      db.currentCommands((result) => {
        let commandList = "";
        for(i in result){
          commandList = `${commandList}\n!` + result[i];
        }
        message.channel.send(`Current commands: ${commandList}\n(${message.author})`);
      });
    }

    /*
      Other Commands
    */
    else{
      db.findCommand(command, (result) =>{
        let guild = message.member.guild;
        let userRole = guild.roles.find("name", result.role);
        if(result === null){
          return;
        }
        else{
          if(result.role === "All"){
            message.channel.send(`${result.response} (${message.author})`);
          }
          else if(message.member.roles.has(userRole.id)){
            message.channel.send(`${result.response} (${message.author})`);
          }
          else{
            return;
          }
        }
      });
    }
  }
});

//This is the bot token that it uses to login.
Client.login(config.token);
