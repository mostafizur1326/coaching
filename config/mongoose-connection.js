const mongoose = require('mongoose');
const dbgr = require('debug')('app: app');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  try {
    const connectionITC = await mongoose.connect(`${process.env.MONGODB_URI}/stec`);
    dbgr(`MongoDB connected`);
  } catch (error) {
    dbgr('MongoDB connection FAILED:', error.message);
    throw error;
  }
};

module.exports = connectDB;