const mongoose = require('mongoose');

let isConnected = false;
let isFallbackMode = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_career_builder';
  
  try {
    // Attempt Mongoose connection with a quick timeout so server doesn't hang if Mongo isn't running
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    isFallbackMode = false;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return { connected: true, fallback: false, host: conn.connection.host };
  } catch (error) {
    try {
      await mongoose.disconnect();
    } catch (_) {}
    console.warn(`[MongoDB Notice] Could not connect to MongoDB at ${mongoURI} (${error.message}).`);
    console.warn(`[Storage Engine] Activating high-reliability Local JSON Persistence Engine for full offline MERN functionality.`);
    isConnected = false;
    isFallbackMode = true;
    return { connected: false, fallback: true, error: error.message };
  }
};

const getDBStatus = () => ({
  isConnected,
  isFallbackMode,
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_career_builder',
});

module.exports = { connectDB, getDBStatus };
