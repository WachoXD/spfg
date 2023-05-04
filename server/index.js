/*const express = require('express');
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
    res.json{
        "title": "Hola"
    }
});

server.listen(3000, ()=>{
    console.log('Listening on *:3000');
});*/

const express = require('express');
const app = express();
var cors = require('cors');
const morgan=require('morgan');
 
//Configuraciones
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2)
 
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
 
var mysql = require('mysql');
var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'spfg',
    user : 'pfg',
    password : '(fEnebs[i_HIskp-',
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
});

//Nuestro primer WS Get
app.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo"
        }
    );
})

app.get('/login', (req, res) => {   

    res.json(
        {
            "Title": "Hola login"
        }
    );
})
 
//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});