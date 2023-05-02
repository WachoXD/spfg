const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: false
    },
    autoConnect: false,
});

app.get('/', (req, res)=> {
    console.log("Hola");
});

app.get('/login', (req, res)=> {
    res.send("hola")
});

server.listen(3000, ()=>{
    console.log('Listening on *:3000');
});