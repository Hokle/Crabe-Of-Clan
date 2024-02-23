const { DataTypes } = require("sequelize");
//const Village = require("./model_Village");

module.exports = (sequelize) => {
  sequelize.define(
    "Batiment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(40),
        allowNull: true,
        validate: {
          notEmpty: true,
          isIn: [
            ["Muraille", "Tourelle", "Ferme", "Forge", "Hospital", "Mine"],
          ],
        },
      },
      niveau: {
        type: DataTypes.STRING,
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
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
