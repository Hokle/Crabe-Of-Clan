const { SlashCommandBuilder } = require("@discordjs/builders");
const Utilisateur = require("../../../database/models/model_Utilisateurs");
const Village = require("../../../database/models/model_Village");
const { EmbedUtils, EMBED_COLOR } = require("../../embeds");

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
          const embed = new EmbedUtils({
            interaction,
            title: "Déjà un village !",
            color: EMBED_COLOR.ORANGE,
            profilThumbnail: false,
          })
            .setTitle(`🦀 Tu as déjà un villag sur le server ! 🦀`)
            .setColor("#FFD700");

          await interaction.reply({ embeds: [embed.getEmbed()] });
        } else {
          await Village.create({
            id_discord_user: discordUserId,
            discord_server_id: interaction.guild.id,
          });

          const embed = new EmbedUtils({
            interaction,
            title: "Village crée !",
            color: EMBED_COLOR.ORANGE,
            profilThumbnail: false,
          })
            .setTitle(`🦀 Ton village est maintenant crée ! 🦀`)
            .setColor("#FFD700");

          await interaction.reply({ embeds: [embed.getEmbed()] });
        }
      } else {
        await Utilisateur.create({ Discord_id: discordUserId, name: nameUser });
        await Village.create({
          id_discord_user: discordUserId,
          discord_server_id: interaction.guild.id,
        });
        const embed = new EmbedUtils({
          interaction,
          title: "Village crée !",
          color: EMBED_COLOR.ORANGE,
          profilThumbnail: false,
        })
          .setTitle(`🦀 Ton village est maintenant crée ! 🦀`)
          .setColor("#FFD700");
        await interaction.reply({ embeds: [embed.getEmbed()] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Une erreur s'est produite. Veuillez réessayer plus tard."
      );
    }
  },
};
