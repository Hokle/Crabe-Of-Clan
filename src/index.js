const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { showConnection } = require("../database/databseUtil.js");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
require("./commands/")(client);
require("./events/")(client);

showConnection();

client.login(process.env.TOKEN);
