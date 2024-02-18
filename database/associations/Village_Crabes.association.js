module.exports = (sequelize) => {
  const Villages = require("../models/model_Village");
  const Crabes = require("../models/model_Crabe");

  Villages.hasMany(Crabes);
  Crabes.belongsTo(Villages, { foreignKey: "village_id" });
};
