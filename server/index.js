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

var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'spfg',
    user : 'pfg',
    password : '(fEnebs[i_HIskp-',
}); 

/*var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'spfg',
    user : 'root',
    password : '',
});*/

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
});
async function timeNow(){
    var today = new Date();
    return today;
}
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

router.get('/perfil', (req, res) => {
    let id   = req.query.id;
    //conexion.query('SELECT id, name, user_rol_id, email, created_at, updated_at, if_update, urlPic FROM users WHERE  id = '+id+'', (error, results, fields) => {
    conexion.query('SELECT * FROM users WHERE  id = '+id+'', (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        //console.log(jsonData);
        res.send(jsonData);
    });
    
});
router.get('/historial', (req, res) => {
    let orderid   = req.query.orderid;
    console.log("El order es: ",orderid);
    conexion.query('SELECT * FROM order_record WHERE  order_id = '+orderid+'', (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        //console.log(jsonData);
        res.send(jsonData);
    });
    
});//Seguir esta madre

router.get('/solPedidos', (req,res) => {
    conexion.query('SELECT * FROM orders', (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        //console.log(jsonData);
        res.send(jsonData);
    });
});

router.get('/usuarios', (req, res) => {
    conexion.query('SELECT id, name, user_rol_id FROM users', (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        res.send(jsonData);
    });
})

router.get('/area', (req, res) => {
    conexion.query('SELECT id, name FROM role', (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        res.send(jsonData);
    });
})
router.post('/actualizarPedido',(req, res)=>{
    let area        = req.body.area;
    let numOrder    = req.body.numOrder;
    let idUser      = req.body.idUser;
    let isOrder     = req.body.isOrder;
    //console.log("email: "+email+" pass: "+ pass);
    var resu = '';
    var time = timeNow();
    conexion.query(`UPDATE orders SET acepted='0',area_id=?,updated_at=? WHERE id = ?`,[ area, idUser, isOrder], function (error, results, fields) {
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            results.forEach(result => {
                res.json({
                    "status":       200,
                });
            });
        }
        //res.send(results);
    }); 
})
router.post('/rechazarPedido',(req, res)=>{
    let area        = req.body.area;
    let numOrder    = req.body.numOrder;
    let idUser      = req.body.idUser;
    let isOrder     = req.body.isOrder;
    //console.log("email: "+email+" pass: "+ pass);
    var resu = '';
    var time = timeNow();
    conexion.query(`UPDATE orders SET acepted='1',area_id=?,updated_at=? WHERE id = ?`,[area, idUser, isOrder], function (error, results, fields) {
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            results.forEach(result => {
                res.json({
                    "status":       200,
                });
            });
        }
        //res.send(results);
    }); 
})
router.post('/avanzaPed', (req, res) => { 
    let area        = req.body.area;
    let numOrder    = req.body.numOrder;
    let idUser      = req.body.idUser;
    let isOrder     = req.body.isOrder;
    //console.log("email: "+email+" pass: "+ pass);
    var resu = '';
    var time = timeNow();
    conexion.query(`INSERT INTO order_record(changed_date ,area_id, user_id, order_id) VALUES (?,?,?,?,)`,[time, area, idUser, isOrder], function (error, results, fields) {
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            results.forEach(result => {
                res.json({
                    "status": 200,
                });
            });
        }
        //res.send(results);
    });   
})

router.post('/agregarPed', (req, res) => {
    let today       =  timeNow();
    let area        = req.body.area;
    let idUser      = req.body.idUser;
    let numOrder    = req.body.numOrder;
    conexion.query(`INSERT INTO orders(ordernumber, status, acepted, startdate, area_id, user_id, created_at, updated_at, who_id_created, before_area) 
    VALUES (?,'Activo','1',?,?,?,?,?,?,?)`,[numOrder, today, area, idUser, today, today, today, idUser,area], function (error, results, fields) {
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            results.forEach(result => {
                res.json({
                    "status":       200,
                });
            });
        }
        //res.send(results); 
    }); 
})

//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});