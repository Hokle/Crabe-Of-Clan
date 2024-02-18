const { SlashCommandBuilder } = require("@discordjs/builders");
const { Village } = global.sequelize.models;
const { embedError, EmbedUtils, EMBED_COLOR } = require("../../embeds");
const { MessageEmbed } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("villagenom")
    .setDescription("Modifier le nom du village")
    .addStringOption((option) =>
      option
        .setName("nouveau_nom")
        .setDescription("Nouveau nom du village")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const GUILD_ID = interaction.guild.id;
      const NEW_NAME = interaction.options.getString("nouveau_nom");

      const id_discord_user = interaction.user.id;
      const discord_server_id = interaction.channel.guild.id;
      const idVillage = await Village.findOne({
        where: {
          id_discord_user,
          discord_server_id,
        },
      });
      if (idVillage && /^[A-Za-z]+$/.test(NEW_NAME) && NEW_NAME.length <= 254) {
        await idVillage.update(
          {
            nom: NEW_NAME,
          },
          {
            where: {
              id_discord_user: interaction.user.id,
              discord_server_id: GUILD_ID,
            },
            limit: 1,
          }
        );
        console.log("avant embed");
        const embedVillage = new EmbedUtils({
          interaction,
          title: "Crabaggare",
          color: EMBED_COLOR.ORANGE,
          profilThumbnail: false,
        })
          .setTitle(`🦀 Village de ${interaction.user.username} 🦀`)
          .setColor("#00ff00")
          .setDescription(
            `Le village vient d'être renomé: \n 🔨 **${NEW_NAME}**`
          );
        console.log("après embed");
        interaction.reply({ embeds: [embedVillage.getEmbed()] });
      } else {
        const embed = new EmbedUtils({
          interaction,
          title: "Crabaggare",
          color: EMBED_COLOR.ORANGE,
          profilThumbnail: false,
        })
          .setTitle("🚨  %username%")
          .setColor("#ff0000")
          .setDescription(`Impossible de modifier le nom de ton village`);
        interaction.reply({ embeds: [embed.getEmbed()] });
      }
    } catch (error) {
      console.log(error);

      return interaction.reply({
        embeds: [embedError().getEmbed()],
      });
    }
  },
};
