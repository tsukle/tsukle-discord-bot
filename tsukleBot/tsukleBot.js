//Import section
const config = require('./config/config.json');
const Discord = require('discord.js');
const tsukleBot = new Discord.Client();

//Database imports and table creation.
const commandDB = require('./database/commandDB.js');
const gameDB = require('./database/gameDB.js');
const roleDB = require('./database/roleDB.js');
commandDB.createTable();
gameDB.createTable();
roleDB.createTable();

//Discord Event Loader
require('./util/eventLoader')(tsukleBot);

//Login (feed token)
tsukleBot.login(config.tokenDev);