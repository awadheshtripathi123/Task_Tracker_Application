import mongoose from 'mongoose'; 
// const DB_NAME = 'task_tracker_db';
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
  } 
  catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;

