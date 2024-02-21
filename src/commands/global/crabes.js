const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCrabeEmbed } = require("../crabe_utils");
const Crabe = require("../../../database/models/model_Crabe");
const Village = require("../../../database/models/model_Village");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { EmbedUtils, EMBED_COLOR } = require("../../embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crabes")
    .setDescription("Affiche la liste de crabes appartenant à ton village"),
  async execute(interaction) {
    const discordUserId = interaction.user.id;
    let village = await Village.findOne({
      where: {
        id_discord_user: discordUserId,
        discord_server_id: interaction.guild.id,
      },
    });
    if (!village) {
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
      return;
    }
    const crabes = await Crabe.findAll({ where: { village_id: village.id } });
    if (crabes.length === 0) {
      await interaction.reply("Aucun crabe trouvé pour votre village.");
      return;
    }

    const crabesEmbeds = crabes.map((crabe) =>
      getCrabeEmbed(crabes[0].nom, crabe, interaction)
    );

    const buttons = getButtons();
    console.log(crabes[0].nom);
    await interaction.reply({
      embeds: [crabesEmbeds[0]],
      files: [__dirname + `../../../../server/public/${crabes[0].nom}.png`],
      components: [buttons],
    });

    listenButtonsEvent(interaction, crabes);
  },
};

function listenButtonsEvent(interaction, crabes) {
  crabes.sort((a, b) => b.niveau - a.niveau);
  let currentPageIndex = 0;
  const filter = (i) =>
    (i.customId === "Precedent" || i.customId === "Suivant") &&
    i.user.id === interaction.user.id;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 150000, // Ajustez le temps selon vos besoins
  });

  collector.on("collect", async (i) => {
    if (i.customId === "Precedent") {
      currentPageIndex =
        currentPageIndex <= 0 ? crabes.length - 1 : currentPageIndex - 1;
    } else if (i.customId === "Suivant") {
      currentPageIndex =
        currentPageIndex >= crabes.length - 1 ? 0 : currentPageIndex + 1;
    }

    // Définir 'crabe' avec le nouvel index AVANT d'essayer d'accéder à ses propriétés.
    const crabe = crabes[currentPageIndex];
    console.log(crabe);
    console.log(crabe.nom); // Maintenant 'crabe' est défini, donc cela devrait fonctionner.

    const embed = getCrabeEmbed(crabe.nom, crabe, interaction);

    await i
      .update({
        embeds: [embed],
        files: [`${__dirname}../../../../server/public/${crabe.nom}.png`], // Ajustez le chemin selon votre structure de fichiers
        components: [getButtons()],
      })
      .catch(async (error) => {
        console.error(
          "Erreur lors de la mise à jour de l'interaction :",
          error
        );
        // Notez que 'interaction.followUp' pourrait ne pas être ce que vous voulez ici si 'i.update' échoue,
        // car cela enverrait un nouveau message au lieu de mettre à jour le message existant.
      });
  });
}

function getButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("Precedent")
      .setLabel("Précédent")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("Suivant")
      .setLabel("Suivant")
      .setStyle(ButtonStyle.Primary)
  );
}
