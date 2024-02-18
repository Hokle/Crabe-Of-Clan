module.exports = (sequelize) => {
  const Utilisateur = require("../models/model_Utilisateur");
  const Village = require("../models/model_Village");

  Utilisateur.hasMany(Village);
  Village.belongsTo(Utilisateur);
};
