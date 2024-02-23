const { DataTypes } = require("sequelize");
//const Village = require("./model_Village");

module.exports = (sequelize) => {
  sequelize.define(
    "Crabe",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pv: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      niveau: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      niveau_pinces: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      niveau_carapace: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      village_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      travail: {
        type: DataTypes.ENUM(
          "Agriculteur",
          "Constructeur",
          "Soldat",
          "Explorateur",
          "Mineur"
        ),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
