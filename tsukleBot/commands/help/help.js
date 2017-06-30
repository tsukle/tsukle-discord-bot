const commandDB = require('../../database/commandDB.js');

exports.run = function(message, client, config){
    message.channel.send({embed: {
      color: 0xffff00,
      author: {
        name: `Need some help?`,
        icon_url: client.user.avatarURL
      },
      thumbnail:{
        url: client.user.avatarURL
      },
      description: `I'm tsukleBot. Created by ${message.member.guild.owner}, I serve the purpose of helping users in this discord server whether it be through my commands or other means.\n\nTo get you started I'll send you a list of my current commands too, if you want to see them again in the future just use !currentCommands.`,
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
          icon_url: client.user.avatarURL
        },
        description: `${commandList}\n(${message.author})`,
        timestamp: new Date(),
        footer: {
          text: `Don't spam them!`
        }
      }});
    });
}