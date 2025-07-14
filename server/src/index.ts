
import cors from "cors";
import express from "express";
import { FRONDEND_URL, NODE_ENV, PORT, verifyEnvironmentVariables } from './config';
import { connectDB } from "./db/config";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { contentRouter } from "./routes/brain.route";
import { userRouter } from './routes/user.route';

const app  = express();

app.use(cors({
    origin:[`${FRONDEND_URL}`],
    methods:['POST','PUT','DELETE','GET'],
    credentials:true
}))

if(NODE_ENV==="development"){
    app.use(morgan('dev'))
}

app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({extended:true,limit:"10kb"}));

app.use('/api/v1/user',userRouter)
app.use('/api/v1/brain',contentRouter)

// health check 

app.get('/',(req,res)=>{
    res.status(200).json({message:"server is healthy"})
})

// error handler
app.use(errorHandler)

connectDB().then(()=>{
    verifyEnvironmentVariables()
    app.listen(PORT || 3000,()=>{
        console.log("server is running at PORT || " + PORT);
    })
}).catch((err)=>{
    console.error(err)
})