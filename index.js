const info = require('./info.json');
const Discord = require('discord.js');
const Client = new Discord.Client();

const bannablewordlist = ["nigger", "faggot", "nigga", "paki", "nigg3r", "n1gg3r", "n1gger", "cunt", "dyke", "dyk3"];
const roles = {
        'Tsukle': '326831922774933504',
        'Administrators': '326832208486727680',
        'Moderators': '326832940979978241',
        'Spicy': '326831645481238531',
        'Timeout': '326924318325866496'
      };

//Ready Funytion (required)
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
  console.log(`${message.author.username}: ${message.content}`);

  for(i in bannablewordlist){
    if(message.content.toLowerCase().includes(bannablewordlist[i])){
      message.author.send(`Please refrain from using words that can be seen as highly offensive.\nYou have been timed out on the server. Message ${message.member.guild.owner} to get your roles back.`);
      message.member.guild.owner.send(`New Timeout: ${message.author}`);
      message.member.removeRoles([roles.Spicy]);
      message.member.addRole(roles.Timeout);
      message.delete();
    }
  }

  if(message.content === "!twitch"){
    setTimeout(() =>{
      message.channel.send(`You can find me on Twitch over at: https://twitch.tv/tsukle ! (${message.author})`)
        .then(msg => console.log(`Replied to: ${msg.author.username}`))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!invite"){
    setTimeout(() => {
      message.channel.send(`Send this to your friends: https://discordapp.com/invite/QhdtEzu ! (${message.author})`)
        .then(msg => console.log(`Replied to: ${msg.author.username}`))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!twitter"){
    setTimeout(() => {
      message.channel.send(`Catch my tweets at: https://twitter.com/tsukle ! (${message.author})`)
        .then(msg => console.log(`Replied to: ${msg.author.username}`))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!website"){
    setTimeout(() => {
      message.channel.send(`Check out my website at: https://tsukle.com ! (${message.author})`)
        .then(msg => console.log(`Replied to: ${msg.author.username}`))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!twpy"){
    setTimeout(() => {
      message.channel.send(`Check out my twpy at: https://twpy.uk ! (${message.author})`)
        .then(msg => console.log(`Replied to: ${msg.author.username}`))
        .catch(console.error);
    }, 500);
  }

  if(message.content === "!commands"){
    setTimeout(() => {
      message.channel.send(`Commands:\n!twitch\n!twitter\n!website\n!twpy\n!invite\n(${message.author})`)
        .then(msg => console.log(`Replied to: ${msg.author.username}`))
        .catch(console.error);
    }, 500);
  }
});

//This is the bot token that it uses to login.
Client.login(info.token);
