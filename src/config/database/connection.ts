import mongoose,{ConnectOptions} from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

 
export const databaseConnection = async (): Promise<void> => {
    try {
      await mongoose.connect(process.env.MONGO_SECRET as string);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB", error);
      throw error
    }
  };

  

export default databaseConnection
