const { EmbedUtils, EMBED_COLOR } = require("../embeds");

function getCrabeEmbed(crabe, username) {
  const embed = new EmbedUtils({
    title: "Commandes simples",
    color: EMBED_COLOR.ORANGE,
    profilThumbnail: false,
  })
    .setTitle(`🦀 ${capitalizeFirstLetter(crabe.dataValues.nom)} 🦀`)
    .setColor("#FFD700")
    .addFields(
      {
        "🍼 Niveau": crabe.dataValues.niveau + "",
        "💖 Vie": crabe.dataValues.pv + "",
        "🗡️ Pinces": crabe.dataValues.niveau_pinces + "",
        "🛡️ Carapaces": crabe.dataValues.niveau_carapace + "",
        "🏛️ Travaille": crabe.dataValues.travail + "",
        "👨‍🦲 Appartient": username,
      },
      [0, 1, 2, 3, 4, 5]
    )

    .setImage(`attachment://${crabe.dataValues.nom}.png`);
  return embed.getEmbed();
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replaceAll("_", " ");
}
module.exports = { getCrabeEmbed };
