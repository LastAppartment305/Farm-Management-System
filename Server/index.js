import express from 'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import cors from 'cors';

const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
});

//const __dirname=dirname(fileURLToPath(import.meta.url));

io.on('connection',(socket)=>{
    

    socket.on('emittingEvent',(msg)=>{
        
        io.emit('receivingEvent',msg);
    })
})

const PORT=5000;
server.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
})