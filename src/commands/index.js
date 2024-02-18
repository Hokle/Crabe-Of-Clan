const fs = require("fs");
const path = require("path");
const { execute } = require("./global/villagenom");

module.exports = (client) => {
  let commands = [];
  ["global"].map((folder) => {
    const commandsPath = path.join(__dirname, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[ATTENTION] Il manque à la commande ${filePath} une propriété "data" ou "execute" requise.`
        );
      }
    }

    if (process.argv.includes("--deploy-command"))
      require("./deploy-command")(commands);
  });
};
