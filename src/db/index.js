import mongoose from "mongoose";
import { DB_NAME} from "../constants.js";


const connectDB = async () => {
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected successfully to ${connectInstance.connection.host} \n`);
    }
    catch(error){
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
} 

export default connectDB;