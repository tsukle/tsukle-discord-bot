const info = require('./info.json');
const badwords = require('./badwords.json');
const Chalk = require('chalk');
const Discord = require('discord.js');
const Client = new Discord.Client();

//If these words are found an instant timeout is to be given.
const bannablewordlist = badwords.words;
const roles = {
        'Tsukle': '326831922774933504',
        'Administrators': '326832208486727680',
        'Moderators': '326832940979978241',
        'Spicy': '326831645481238531',
        'DedicatedFollower': '327108020112719872',
        'Timeout': '326924318325866496'
      };

//Ready Function (required)
Client.on('ready', () => {
  console.log("Bot is ready...");
  Client.user.setGame("!commands");
  Client.user.setUsername("tsukleBot");
});

// New user joins the server.
Client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'general');
  const channel2 = member.guild.channels.find('name', 'welcome');
  if (!channel) return;
  channel.send(`Hey ${member}!, welcome to the server. Check out ${channel2} for the rules!`);
});

// Message received.
Client.on('message', message =>{
  console.log(Chalk.blue.bgYellow(`${message.author.username}: ${message.content}`));
  for(i in bannablewordlist){
    if(message.content.toLowerCase().includes(bannablewordlist[i])){
      message.author.send(`You have been timed out for using a flagged word. Read the rules of the server and then message ${message.member.guild.owner} to get your roles back.`);
      message.member.guild.owner.send(`This user has been timed out for using a flagged word: ${message.author}`);
      message.member.removeRoles([roles.Spicy, roles.DedicatedFollower]);
      message.member.addRole(roles.Timeout);
      message.delete();
    }
  }

  if(message.content === "!twitch"){
    setTimeout(() =>{
      message.channel.send(`You can find me on Twitch over at: https://twitch.tv/tsukle ! (${message.author})`)
        .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${msg.author.username}`)))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!invite"){
    setTimeout(() => {
      message.channel.send(`Send this to your friends: https://discordapp.com/invite/QhdtEzu ! (${message.author})`)
        .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${msg.author.username}`)))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!twitter"){
    setTimeout(() => {
      message.channel.send(`Catch my tweets at: https://twitter.com/tsukle ! (${message.author})`)
        .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${msg.author.username}`)))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!website"){
    setTimeout(() => {
      message.channel.send(`Check out my website at: https://tsukle.com ! (${message.author})`)
        .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${msg.author.username}`)))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!twpy"){
    setTimeout(() => {
      message.channel.send(`Check out my twpy at: https://twpy.uk ! (${message.author})`)
        .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${msg.author.username}`)))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!commands"){
    setTimeout(() => {
      message.channel.send(`Commands:\n!twitch\n!twitter\n!website\n!twpy\n!invite\n(${message.author})`)
        .then(msg => console.log(Chalk.blue.bgYellow(`Replied to: ${msg.author.username}`)))
        .catch(console.error);
    }, 500);
  }
});

//This is the bot token that it uses to login.
Client.login(info.token);
