const config = require('./info.json');
const badwords = require('./badwords.json');
const db = require('./database.js');
const Discord = require('discord.js');
const Client = new Discord.Client();
const Chalk = require('chalk');

const prefix = "!";
const bannablewordlist = badwords.words;
const roles = {
  'Tsukle': '326831922774933504',
  'Administrators': '326832208486727680',
  'Moderators': '326832940979978241',
  'Spicy': '326831645481238531',
  'DedicatedFollower': '327108020112719872',
  'Timeout': '326924318325866496'
};


/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The ready event must be called. If it is not called the rest of the events do not start emitting.
  DATE: 23/06/17
*/
Client.on('ready', () => {
  db.createTable();
  console.log("...");
  Client.user.setGame("!commands");
  Client.user.setUsername("tsukleBot");
});

/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The guildMemberAdd event gets emitted when a new member joins the server/guild.
  DATE: 23/06/17
*/
Client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'general');
  const channel2 = member.guild.channels.find('name', 'welcome');
  if (!channel) return;
  channel.send(`Hey ${member}!, welcome to the server. Check out ${channel2} for the rules!`);
});


/*
  AUTHOR: Emilis Tobulevicius
  DESCRIPTION: The presenceUpdate event emits when a users presence change, aka game changes or online presence.
  DATE: 24/06/17
*/
Client.on('presenceUpdate', (oldMember, newMember) => {
  console.log("fired");
  let guild = newMember.guild;
  let Overwatch = guild.roles.find("name", "Playing Overwatch");
  let PUBG = guild.roles.find("name", "Playing PUBG");
  let CSGO = guild.roles.find("name", "Playing CSGO");
  let H1Z1 = guild.roles.find("name", "Playing H1Z1");
  let GTAV = guild.roles.find("name", "Playing GTA:V");
  let LOL = guild.roles.find("name", "Playing LOL");
  let roleArray = [Overwatch, PUBG, CSGO, H1Z1, GTAV, LOL];

  let game = newMember.user.presence.game;

  if(game){
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

  //Check every message for banned words.
  for(i in bannablewordlist){
    if(message.content.toLowerCase().includes(bannablewordlist[i])){
      message.author.send(`You have been timed out for using a flagged word. Read the rules of the server and then message ${message.member.guild.owner} to get your roles back.`);
      message.member.guild.owner.send(`This user has been timed out for using a flagged word: ${message.author}`);
      message.member.removeRoles([roles.Spicy, roles.DedicatedFollower]);
      message.member.addRole(roles.Timeout);
      message.delete();
    }
  }

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
