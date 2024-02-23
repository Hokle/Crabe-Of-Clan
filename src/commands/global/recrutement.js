const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { Village, Crabe } = global.sequelize.models;
const { EmbedUtils, EMBED_COLOR } = require("../../embeds");
const { getCrabeEmbed } = require("../crabe_utils");

function rdm(high) {
  return Math.floor(Math.random() * high) + 1;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recrutement")
    .setDescription("Tente de recruter un crabe dans ton armée"),
  async execute(interaction) {
    try {
      const id_discord_user = interaction.user.id;
      const discord_server_id = interaction.channel.guild.id;
      const idVillage = await Village.findOne({
        where: {
          id_discord_user,
          discord_server_id,
        },
      });
      if (idVillage) {
        const dateActuelleMoins1Heure = new Date(Date.now() - 60 * 60 * 1000);
        if (
          idVillage.dataValues.adoption_cmd == null ||
          idVillage.dataValues.adoption_cmd < dateActuelleMoins1Heure
        ) {
          idVillage.update(
            {
              adoption_cmd: new Date(),
            },
            {
              where: {
                id_discord_user: interaction.user.id,
                discord_server_id: interaction.guild.id,
              },
              limit: 1,
            }
          );
          const response = await axios.get(
            "http://localhost:3000/random-image"
          );
          const nomCrabe = response.data.image.replace(".png", "");
          const metier = getRandomMetier();
          const newCrabe = await Crabe.create({
            nom: nomCrabe,
            pv: rdm(100),
            village_id: idVillage.dataValues.id,
            travail: metier,
          });

          const embed = getCrabeEmbed(newCrabe, interaction.user.username);
          await interaction.reply({
            embeds: [embed],
            files: [__dirname + `../../../../server/public/${nomCrabe}.png`],
          });
        } else {
          const NOW = new Date(Date.now()).getTime();
          const DISPO_DANS =
            new Date(idVillage.dataValues.adoption_cmd).getTime() +
            60 * 60 * 1000 -
            NOW;
          const date = DISPO_DANS + NOW;

          const embed3 = new EmbedUtils({
            interaction,
            title: "Commandes simples",
            color: EMBED_COLOR.ORANGE,
            profilThumbnail: false,
          })
            .setTitle(`🦀 Tu ne peux pas encore recruter de crabe ! 🦀`)
            .setColor("#FFD700")
            .setDescription(
              "Patiente encore un peu pour la commande. \n Tu pourras la faire <t:" +
                Math.floor(date / 1000) +
                ":R>"
            );
          await interaction.reply({ embeds: [embed3.getEmbed()] });
          const message = await interaction.fetchReply();
          setTimeout(() => {
            message.delete();
          }, 60000); // Le message sera supprimé après 6 secondes
        }
      } else {
        const embed2 = new EmbedUtils({
          interaction,
          title: "Commandes simples",
          color: EMBED_COLOR.ORANGE,
          profilThumbnail: false,
        })
          .setTitle(`🦀 Tu n'as pas encore créer de village ! 🦀`)
          .setColor("#FFD700")
          .setDescription("Tu peux le faire à l'aide de la commande /village");
        await interaction.reply({ embeds: [embed2.getEmbed()] });
      }
    } catch (error) {
      console.error(error);
    }
  },
};

function getRandomMetier() {
  const listeMetier = [
    "Agriculteur",
    "Constructeur",
    "Soldat",
    "Explorateur",
    "Mineur",
  ];
  const index = Math.floor(Math.random() * listeMetier.length);
  return listeMetier[index];
}
