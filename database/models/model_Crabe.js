const { DataTypes } = require("sequelize");
//const Village = require("./model_Village");
const sequelize = require("../database");
const Village = require("./model_Village");

const Crabe = sequelize.define(
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
      references: { model: "Village", key: "id" },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Crabe;
