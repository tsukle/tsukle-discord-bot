const reqEvent = (event) => require(`../events/${event}`);
const config = require('../config/config.json');

module.exports = client => {
    client.on('ready', () => reqEvent('ready')(client, config));
    client.on('disconnect', () => reqEvent('disconnect')(client, config));
    client.on('reconnecting', () => reqEvent('reconnecting')(client, config));
    client.on('guildMemberAdd', (member) => reqEvent('guildMemberAdd')(member, client, config));
    client.on('message', (message) => reqEvent('message')(message, client, config));
    client.on('presenceUpdate', (oldMember, newMember) => reqEvent('presenceUpdate')(oldMember, newMember, client, config));
};