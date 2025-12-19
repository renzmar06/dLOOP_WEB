import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb+srv://renzmarr06_db_user:EbTynF0OhLWL1nbi@cycleiqcluster.5lgkwbk.mongodb.net/dloop';

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}