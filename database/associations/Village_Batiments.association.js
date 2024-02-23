module.exports = (sequelize) => {
  const { Village, Batiment } = sequelize.models;

  Village.hasMany(Batiment, {
    foreignKey: "village_id",
    sourceKey: "id",
    as: "batiments",
  });

  Batiment.belongsTo(Village, {
    foreignKey: "village_id",
  });
};
