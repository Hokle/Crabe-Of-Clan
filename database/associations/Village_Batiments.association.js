module.exports = (sequelize) => {
  const Villages = require("../models/model_Village");
  const Batiments = require("../models/model_Batiment");

  Villages.hasMany(Batiments);
  Batiments.belongsTo(Villages);
};
