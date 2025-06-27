import mongoose from "mongoose";
import { DATABASE_URL } from "../config";

export const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${DATABASE_URL}/brainly`)
        console.log("Database connected at host " +  connectionInstance.connection.host );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}