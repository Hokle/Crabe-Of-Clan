const { REST, Routes } = require("discord.js");

module.exports = (commands) => {
  const _REST = new REST({ version: "10" }).setToken(process.env.TOKEN);
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      const data = await _REST.put(
        Routes.applicationCommands(process.env.CLIENTID),
        {
          body: commands,
        }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
