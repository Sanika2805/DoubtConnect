const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doubtconnect';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Make sure MongoDB is running, or put your Atlas URL in server/.env');
    process.exit(1);
  }
}

module.exports = connectDB;
