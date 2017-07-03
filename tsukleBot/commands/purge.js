exports.run = function(message, args, client, config, owner){
    if (owner === false) return;
    let firstSplit = args;
    let messageCount = parseInt(firstSplit) + 1;
    message.channel.fetchMessages({limit: messageCount}).then(messages => message.channel.bulkDelete(messages));
}