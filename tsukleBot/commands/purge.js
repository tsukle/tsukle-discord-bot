exports.run = function(message, args, client, config){
    if (message.member.id !== message.guild.ownerID) return;
    let firstSplit = args;
    let messageCount = parseInt(firstSplit) + 1;
    message.channel.fetchMessages({limit: messageCount}).then(messages => message.channel.bulkDelete(messages));
}