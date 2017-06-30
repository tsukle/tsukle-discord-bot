exports.run = function(message, args, client, config){
    let kickee = message.mentions.users.first();
    message.guild.member(kickee).kick().catch(console.error);
}