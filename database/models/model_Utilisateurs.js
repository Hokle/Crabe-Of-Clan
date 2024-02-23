const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Utilisateur",
    {
      Discord_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
      },
      coquilles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
