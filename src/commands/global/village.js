const { SlashCommandBuilder } = require("@discordjs/builders");
const Utilisateur = require("../../../database/models/model_Utilisateurs");
const Village = require("../../../database/models/model_Village");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("village")
    .setDescription(
      "Crée un utilisateur dans la base de données ou indique s'il existe déjà"
    ),
  async execute(interaction) {
    const discordUserId = interaction.user.id;
    const nameUser = interaction.user.username;
    Utilisateur.name = nameUser;

    try {
      let user = await Utilisateur.findOne({
        where: { Discord_id: discordUserId },
      });
      if (user) {
        let village = await Village.findOne({
          where: {
            id_discord_user: discordUserId,
            discord_server_id: interaction.guild.id,
          },
        });

        if (village) {
          await interaction.reply("Tu as déjà un village dans ce serveur");
        } else {
          await Village.create({
            id_discord_user: discordUserId,
            discord_server_id: interaction.guild.id,
          });

          await interaction.reply("Ton village est bien créé");
        }
      } else {
        await Utilisateur.create({ Discord_id: discordUserId, name: nameUser });
        await Village.create({
          id_discord_user: discordUserId,
          discord_server_id: interaction.guild.id,
        });
        await interaction.reply("Utilisateur créé dans la base de données");
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Une erreur s'est produite. Veuillez réessayer plus tard."
      );
    }
  },
};
