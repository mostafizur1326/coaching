const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  try {
    const connectionITC = await mongoose.connect(`${process.env.MONGODB_URI}/firstpack`);
    console.log(`MongoDB connected || DB HOST: ${connectionITC.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection FAILED:', error.message);
    throw error;
  }
};

module.exports = connectDB;