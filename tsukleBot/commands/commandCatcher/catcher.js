commandDB = require('../../database/commandDB.js');

exports.run = function(message, command, args, client, config){
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
                    name: `${config.prefix}${command}`,
                    icon_url: client.user.avatarURL
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
                    name: `${config.prefix}${command}`,
                    icon_url: client.user.avatarURL
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
                    icon_url: client.user.avatarURL
                    },
                    description: `It appears you don't have permission to use this command.`,
                    timestamp: new Date(),
                    footer: {
                    text: `Sorry!`
                    }
                }});
            }
        }
    });
}