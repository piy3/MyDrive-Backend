import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser';

const app = express();
const server= http.createServer(app);
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/', (req, res) => {
    const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    res.send(`Current IST Time: ${istTime}`);
});
  

server.listen(PORT,()=>{
    console.log(`running on port:${PORT} `)
})