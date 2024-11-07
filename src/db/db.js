//require('dotenv').config();

const mongoose = require('mongoose');
const DB_NAME = require('../constants.js');

const connectDB =  async () => {
  try {
  const connectionITC = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  console.log(connectionITC.connection);
  console.log(`MongoDB connected || DB HOST: ${connectionITC.connection.host}`);
  } catch (error) {
    console.error('MongoDB database connection FAILED: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;