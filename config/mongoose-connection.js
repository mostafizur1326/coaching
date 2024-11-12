const mongoose = require('mongoose');

const connectDB =  async () => {
  try {
  const connectionITC = await mongoose.connect(`${process.env.MONGODB_URI}/firstpack`);
  console.log(`MongoDB connected || DB HOST: ${connectionITC.connection.host}`);
  } catch (error) {
    console.error('MongoDB database connection FAILED: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;