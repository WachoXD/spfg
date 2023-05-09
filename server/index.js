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

var   express    = require('express');
var   app        = express();
const morgan     = require('morgan');
var   bodyParser = require('body-parser')
var   cors       = require('cors');
var   router     = express.Router();

 
//Configuraciones
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2)
 
//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/api', router);
 
var mysql = require('mysql');
/**
var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'spfg',
    user : 'pfg',
    password : '(fEnebs[i_HIskp-',
}); 
*/
var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'spfg',
    user : 'root',
    password : '',
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
router.post('/login', (req, res) => { 
    let email = req.body.email;
    let pass  = req.body.pass;
    //console.log("email: "+email+" pass: "+ pass);
    var resu = '';
    conexion.query("SELECT * FROM users WHERE email = ? AND password = ?",[email, pass], function (error, results, fields) {
        
        if(Object.keys(results).length === 0){
            res.json({
                "status": 400
            });
        }else{
            results.forEach(result => {
                res.json({
                    "status":       200,
                    "id":           result.id,
                    "email":        result.email,
                    "user_rol_id":  result.user_rol_id,
                    "name":         result.name,
                    "created_at":   result.create_at,
                    "if_update":    result.if_update
                });
            });
        }
        //res.send(results);
    });   
})

router.post('/changePass', (req, res) => { 
    let pass = req.body.newPass;
    let id   = req.body.id;
    let cambio = 1;
    let flag = 1;
    conexion.query("UPDATE `users` SET `password`= ?, `if_update`= ? WHERE `id`= ?" ,[pass, cambio, id], function (error, results, fields){
        if (error){
            flag = 0;
            throw error;
        }
        res.json({
            "status": '200',
            'echo': flag
        })
    });
    
});

//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});