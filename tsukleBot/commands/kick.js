exports.run = function(message, args, client, config){
    if (message.member.id !== message.guild.ownerID) return;
    let kickee = message.mentions.users.first();
    message.guild.member(kickee).kick().catch(console.error);
}