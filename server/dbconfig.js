const mongoose = require("mongoose");

async function ConnectDb() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("connected to database");
  } catch (error) {
    console.log("error :", error);
  }
}

module.exports = ConnectDb;
