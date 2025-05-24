import dotenv from 'dotenv';
dotenv.config()
import cors from "cors";
import express from "express";
import { FRONDEND_URL, PORT, verifyEnvironmentVariables } from './config';
import { connectDB } from "./db/config";
import { userRouter } from './routes/user';

const app  = express();

app.use(cors({
    origin:[`${FRONDEND_URL}`],
    methods:['POST','PUT','DELETE','GET'],
    credentials:true
}))
app.use(express.json());
app.use('/api/v1',userRouter)



connectDB().then(()=>{
    verifyEnvironmentVariables()
    app.listen(PORT || 3000,()=>{
        console.log("server is running");
    })
}).catch((err)=>{
    console.error(err)
})