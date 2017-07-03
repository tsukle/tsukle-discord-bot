const roleDB = require('../database/roleDB.js');

exports.run = function(message, args, client, config){
    if (message.member.id !== message.guild.ownerID) return;
    let firstSplit = args.split("<").slice(1);
    let currentRoleName = firstSplit[0].split(">")[0];
    let newRoleName = firstSplit[1].split(">")[0];
    let newRoleID = firstSplit[2].split(">")[0];
    let newRoleType = firstSplit[3].split(">")[0];
    message.channel.send({embed: {
        color: 0xffff00,
        author: {
        name: "Updated Role!",
        icon_url: client.user.avatarURL
        },
        description: `This role: ${currentRoleName} - has been updated to these values:\nName: ${newRoleName}\nID: ${newRoleID}\nType: ${newRoleType}`,
        timestamp: new Date(),
        footer: {
        text: `Role ${currentRoleName} updated.`
        }
    }});
    roleDB.updateRole(currentRoleName, newRoleName, newRoleID, newRoleType);
}