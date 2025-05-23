import dotenv from 'dotenv';
dotenv.config()
import express from "express";
import { connectDB } from "./db/config";
import { router } from "./routes";
import cors from "cors"
import { FRONDEND_URL, PORT } from './config';

const app  = express();

app.use(cors({
    origin:[`${FRONDEND_URL}`],
    methods:['POST','PUT','DELETE','GET'],
    credentials:true
}))
app.use(express.json());
app.use('/api/v1',router)



connectDB().then(()=>{
    app.listen(PORT || 3000,()=>{
        console.log("server is running");
    })
}).catch((err)=>{
    console.error(err)
})