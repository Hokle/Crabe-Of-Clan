const { EmbedUtils, EMBED_COLOR } = require("../embeds");

function getCrabeEmbed(nomCrabe, crabe, interaction) {
  const embed = new EmbedUtils({
    title: "Commandes simples",
    color: EMBED_COLOR.ORANGE,
    profilThumbnail: false,
  })
    .setTitle(`🦀 ${capitalizeFirstLetter(nomCrabe)} 🦀`)
    .setColor("#FFD700")
    .addFields(
      {
        "🍼 Niveau": crabe.dataValues.niveau + "",
        "💖 Vie": crabe.dataValues.pv + "",
        "🗡️ Pinces": crabe.dataValues.niveau_pinces + "",
        "🛡️ Carapaces": crabe.dataValues.niveau_carapace + "",
        "🏛️ Travaille": "Aucun",
        "👨‍🦲 Appartient": interaction.user.username,
      },
      [0, 1, 2, 3, 4, 5]
    )

    .setImage(`attachment://${nomCrabe}.png`);
  return embed.getEmbed();
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replaceAll("_", " ");
}
module.exports = { getCrabeEmbed };
