exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let kickee = message.mentions.users.first();
    message.guild.member(kickee).kick().catch(console.error);
}