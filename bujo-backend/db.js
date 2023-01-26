const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/";

const connectToMongo = async () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to mongo successfully");
  });
};

module.exports = connectToMongo;
