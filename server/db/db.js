import mongoose from 'mongoose'; 
const DB_NAME = 'task_tracker_db';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
  } 
  catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;