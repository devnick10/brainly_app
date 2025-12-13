import mongoose from "mongoose";
import { config } from "../config/config";
const DATABASE_URL = config.get("DATABASE_URL");

export const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${DATABASE_URL}/brainly`)
        console.log("Database connected at host " +  connectionInstance.connection.host );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}