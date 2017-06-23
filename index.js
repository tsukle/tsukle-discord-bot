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
      let command = message.content.split(" ").slice(1)[0];
      db.removeCommand(command);
    }

    /*
      @everyone Commands
    */
    if(command === "twitch"){
      setTimeout(() =>{
        message.channel.send(`You can find me on Twitch over at: https://twitch.tv/tsukle ! (${message.author})`)
          .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${message.author.username}`)))
          .catch(console.error);
      }, 500);
    }

    if(command === "twitter"){
      setTimeout(() => {
        message.channel.send(`Catch my tweets at: https://twitter.com/tsukle ! (${message.author})`)
          .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${message.author.username}`)))
          .catch(console.error);
      }, 500);
    }

    if(command === "website"){
      setTimeout(() => {
        message.channel.send(`Check out my website at: https://tsukle.com ! (${message.author})`)
          .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${message.author.username}`)))
          .catch(console.error);
      }, 500);
    }

    if(command === "twpy"){
      setTimeout(() => {
        message.channel.send(`Check out my twpy at: https://twpy.uk ! (${message.author})`)
          .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${message.author.username}`)))
          .catch(console.error);
      }, 500);
    }

    if(command === "invite"){
      setTimeout(() => {
        message.channel.send(`Send this to your friends: https://discordapp.com/invite/QhdtEzu ! (${message.author})`)
          .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${message.author.username}`)))
          .catch(console.error);
      }, 500);
    }

    if(command === "commands"){
      setTimeout(() => {
        message.channel.send(`Commands:\n!twitch\n!twitter\n!website\n!twpy\n!invite\n(${message.author})`)
          .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${message.author.username}`)))
          .catch(console.error);
      }, 500);
    }
  }
});

//This is the bot token that it uses to login.
Client.login(config.token);
