const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCrabeEmbed } = require("../crabe_utils");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { EmbedUtils, EMBED_COLOR } = require("../../embeds");

const { Utilisateur, Crabe, Village } = global.sequelize.models;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crabes")
    .setDescription("Affiche la liste de crabes appartenant à ton village")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("Choix de l'utilisateur")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser("utilisateur");
      const discordUserId = user.id;

      if (!discordUserId) return;

      let village = await Village.findOne({
        where: {
          id_discord_user: discordUserId,
          discord_server_id: interaction.guild.id,
        },
        include: [
          {
            model: Utilisateur,
          },
          {
            model: Crabe,
            as: "crabes",
          },
        ],
      });

      if (!village) {
        NoVillageError(interaction);
        return;
      }
      if (village.crabes.length === 0) {
        await interaction.reply("Aucun crabe trouvé pour votre village.");
        return;
      }

      displayEmbed(interaction, village);
    } catch (error) {
      NoVillageError(interaction);
      return;
    }
  },
};

async function displayEmbed(interaction, village) {
  let pageIndex = 0;
  const crabes = village.crabes;

  const getEmbed = () => {
    return getCrabeEmbed(
      crabes[pageIndex],
      village.Utilisateur.dataValues.name
    ).setFooter({ text: `Crabe ${pageIndex + 1}/${crabes.length}` });
  };

  const nextPage = async (i, buttons) => {
    const label = i.customId.split("-")[0];
    if (label === "Precedent") {
      pageIndex = pageIndex <= 0 ? crabes.length - 1 : pageIndex - 1;
    } else if (label === "Suivant") {
      pageIndex = pageIndex >= crabes.length - 1 ? 0 : pageIndex + 1;
    }
    enableOrDisableButton(buttons);

    await i
      .update({
        embeds: [getEmbed()],
        files: [
          `${__dirname}../../../../server/public/${crabes[pageIndex].nom}.png`,
        ], // Ajustez le chemin selon votre structure de fichiers
        components: [buttons],
      })
      .catch(async (error) => {
        console.error(
          "Erreur lors de la mise à jour de l'interaction :",
          error
        );
      });
  };

  const enableOrDisableButton = (buttons) => {
    if (pageIndex === crabes.length - 1) {
      buttons.components[1].setDisabled(true); // Désactive le bouton Suivant
    } else {
      buttons.components[1].setDisabled(false); // Active le bouton Suivant
    }
    if (pageIndex === 0) {
      buttons.components[0].setDisabled(true); // Désactive le bouton précédent
    } else {
      buttons.components[0].setDisabled(false); // Active le bouton précédent
    }
  };
  const crabesEmbeds = getEmbed();

  const buttons = getButtons();

  enableOrDisableButton(buttons);
  await interaction.reply({
    embeds: [crabesEmbeds],
    files: [
      __dirname + `../../../../server/public/${crabes[pageIndex].nom}.png`,
    ],
    components: [buttons],
  });
  listenButtonsEvent(interaction, nextPage, buttons);
}

function NoVillageError(interaction) {
  const embed2 = new EmbedUtils({
    interaction,
    title: "Commandes simples",
    color: EMBED_COLOR.ORANGE,
    profilThumbnail: false,
  })
    .setTitle(`🦀 Aucun village existant ! 🦀`)
    .setColor("#FFD700")
    .setDescription("Tu peux le faire à l'aide de la commande /village");
  interaction.reply({ embeds: [embed2.getEmbed()] });
}

function listenButtonsEvent(interaction, cb, buttons) {
  const filter = (i) =>
    (i.customId === buttons.components[0].data.custom_id ||
      i.customId === buttons.components[1].data.custom_id) &&
    i.user.id === interaction.user.id;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 150000,
  });

  collector.on("collect", (i) => {
    try {
      cb(i, buttons);
    } catch (error) {}
  });
}

function getButtons() {
  const previousButton = new ButtonBuilder()
    .setCustomId("Precedent-" + Date.now())
    .setLabel("Precedent")
    .setStyle(ButtonStyle.Secondary);

  const nextButton = new ButtonBuilder()
    .setCustomId("Suivant-" + Date.now())
    .setLabel("Suivant")
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder().addComponents(previousButton, nextButton);
}
