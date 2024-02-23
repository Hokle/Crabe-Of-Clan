module.exports = (sequelize) => {
  const { Village, Crabe } = sequelize.models;

  Village.hasMany(Crabe, {
    foreignKey: "village_id",
    sourceKey: "id",
    as: "crabes",
  });

  Crabe.belongsTo(Village, {
    foreignKey: "village_id",
  });
};
