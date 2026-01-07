const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge';
  
  // Log connection attempt (without showing password)
  if (process.env.MONGO_URI) {
    const uriDisplay = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`Attempting to connect to MongoDB: ${uriDisplay}`);
  } else {
    console.log('No MONGO_URI found in .env, using default local connection');
  }
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased to 10s for Atlas connections
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\n⚠️  MongoDB is not running or not accessible.');
    console.error('Please ensure:');
    console.error('  1. MongoDB is installed and running locally, OR');
    console.error('  2. You have a MONGO_URI in your .env file pointing to MongoDB Atlas');
    console.error('\nTo use MongoDB Atlas:');
    console.error('  1. Create a .env file in the Main/server/ directory');
    console.error('  2. Add: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge');
    console.error('\nTo get your connection string from MongoDB Compass:');
    console.error('  1. Open MongoDB Compass');
    console.error('  2. Click on your connection');
    console.error('  3. Copy the connection string from the connection settings');
    process.exit(1);
  }
};

module.exports = connectDB;
