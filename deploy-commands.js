const { REST, Routes } = require('discord.js');
require('dotenv').config();

console.log(process.env.CLIENT_ID);
console.log(process.env.GUILD_ID);
console.log(process.env.DISCORD_TOKEN ? "TOKEN FOUND" : "NO TOKEN");

const commands = [
    require('./commands/leaderboard').data.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands },
        );

        console.log('Slash commands registered!');
    } catch (error) {
        console.error(error);
    }
})();