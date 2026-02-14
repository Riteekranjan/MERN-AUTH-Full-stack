import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoute.js';

const app = express();
const PORT = process.env.PORT || 5000
connectDB();

const allowedOrigin =['http://localhost:5174','https://mern-auth-frontend-riteekranjan.vercel.app/'];
app.use(express.json());
app.use(cookieParser());  
  
app.use(cors({origin:allowedOrigin, credentials:true}));




// API endpoint 
app.get('/',(req,res)=>{
    res.send("API is running  ");
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


