const { Sequelize } = require("sequelize");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize(
  process.env.DATABASE_DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
["models", "associations"].map((paths) => {
  const fullPath = path.join(__dirname, paths);
  fs.readdirSync(fullPath).map((file) => {
    require(path.join(fullPath, file));
    console.log("[ADD] : ajout de la table", file);
  });
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`[OK] : Database synced success`);
  })
  .catch((error) => {
    console.error(`[Error] : Database not synced > ${error.message}`);
  });

global.sequelize = sequelize;
