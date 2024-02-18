const sequelize = require("./database");
exports.showConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("[OK] : Database Connected");
  } catch (error) {
    console.log(`[Error] : ${error.message}`);
  }
};
