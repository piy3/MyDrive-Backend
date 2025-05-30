import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './DB/connectDB.js';
import UserRouter from './routes/user.routes.js'
import { FolderRouter } from './routes/folder.routes.js';

const app = express();
const server= http.createServer(app);
dotenv.config();
const PORT =process.env.PORT ||  5000;

app.use(cors({ 
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); 

// app.use('/', (req, res) => {
//     const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
//     res.send(`Current IST Time: ${istTime}`);
// });

app.use('/api/v1/user',UserRouter);
app.use('/api/v1/folder',FolderRouter);

server.listen(PORT,()=>{
    console.log(`running on port:${PORT} `)
})

connectDB();