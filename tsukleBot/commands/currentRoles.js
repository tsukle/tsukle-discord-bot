const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config, owner){
    message.channel.startTyping();
    setTimeout(() => {
        roleDB.currentRoles((roles) => {
            let roleList = "";
            for(i in roles){
                roleList = `${roleList}\n${roles[i]}`;
            }
            message.channel.send({embed: {
                color: 0xffff00,
                author: {
                name: "Current Roles!",
                icon_url: client.user.avatarURL
                },
                description: `${roleList}\n(${message.author})`,
                timestamp: new Date(),
                footer: {
                text: `Organising People!`
                }
            }});
        });
        message.channel.stopTyping();
    }, 1000);
}