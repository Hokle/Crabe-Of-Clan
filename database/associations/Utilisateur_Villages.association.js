module.exports = (sequelize) => {
  const { Utilisateur, Village } = sequelize.models;

  Utilisateur.hasMany(Village, {
    foreignKey: "id_discord_user",
    sourceKey: "Discord_id",
    as: "villages",
  });

  Village.belongsTo(Utilisateur, {
    foreignKey: "id_discord_user",
  });
};
