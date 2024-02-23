const { DataTypes } = require("sequelize");
//const Utilisateur = require("./model_Utilisateurs");
const sequelize = require("../database");

module.exports = (sequelize) => {
  sequelize.define(
    "Village",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      discord_server_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[A-Za-z0-9 ]{3,20}$/,
        },
      },
      coquillages: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      niveau: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      adoption_cmd: {
        type: "TIMESTAMP",
        allowNull: true,
      },
      id_discord_user: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      updatedAt: false,
      freezeTableName: true,
    }
  );
};
