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
    let id   = req.query.id;
    conexion.query('SELECT * FROM orders WHERE who_id_created = '+id+'', (error, results, fields) => {
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

router.get('/solAceptados', (req,res) => { //Trae los que son solo aceptados por el usuario
    let id   = req.query.id;
    conexion.query('SELECT * FROM orders WHERE acepted = 1 AND user_id  = '+id+'', (error, results, fields) => {
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

router.get('/solAceptar', (req,res) => { //Solo muestra los que le van a mandar
    let area   = req.query.area;
    conexion.query('SELECT * FROM orders WHERE acepted = 0 AND area_id  = '+area+'', (error, results, fields) => {
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
    
    conexion.query(`UPDATE orders SET acepted='0',area_id=?,updated_at=? WHERE id = ?`,[ area, idUser, isOrder], function (error, results, fields) {
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            res.json({
                "status": 200,
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
    conexion.query(`UPDATE orders SET acepted='1',area_id=?,updated_at=? WHERE id = ?`,[area, idUser, isOrder], function (error, results, fields) {
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            res.json({
                "status": 200,
            });
        }
        //res.send(results);
    }); 
})

function actHistorial(reqDatos){
    let area        = reqDatos.area;
    let orderId     = reqDatos.idOrder;
    let idUser      = reqDatos.idUser;
    let aceptado    = reqDatos.acepted;
    let numOrder    = reqDatos.numOrder;

    var resu;
    conexion.query('SELECT id FROM orders WHERE ordernumber = ?',[numOrder], (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        //console.log(jsonData);
        resu = jsonData.id;
    });
    let sqlCon = '';
    switch(reqDatos.opc){
        /*
        1: Nuevo
        2: Avanza
        3: Aceptado
        4: Rechazado
        5: Parcial
        6: Finalizado
        */
        case 1:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`','`+orderId+`',NOW())`;
            break;
        case 2:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`','`+orderId+`',NOW())`;
            break;
        case 3:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, acepted_by, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`','`+orderId+`', '`+aceptado+`',NOW())`;
            break;
        case 4: 
            let msg    = reqDatos.acepted;
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, acepted_by, cancellation_details, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`','`+orderId+`', '`+aceptado+`', '`+msg+`', NOW())`;
            break;
        case 5:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, change_status_by, created_at) 
            VALUES ('Parcial', NOW(),'`+area+`','`+idUser+`','`+orderId+`','`+orderId+`', NOW())`;
            break;
        case 6:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, change_status_by, created_at) 
            VALUES ('Finalizado', NOW(),'`+area+`','`+idUser+`','`+orderId+`','`+orderId+`', NOW())`;
            break;
    }

    let res = conexion.query(sqlCon, function (error, results, fields) {
        if(error){
            throw error;
        }
        return 200;
    }); 
    return res;
}

router.post('/agregarPed', (req, res) => {
    let area        = req.body.area;
    let idUser      = req.body.idUser;
    let numOrder    = req.body.numOrder;
    console.log("Area: ",area);
    console.log("IdUser: ",idUser);
    console.log("numOrder ",numOrder);
    
    conexion.query(`INSERT INTO orders (ordernumber, status, acepted, startdate, area_id, user_id, who_id_created, before_area) VALUES ('`+numOrder+`', 'Activo', '1', NOW(), '`+area+`', '`+idUser+`', '`+idUser+`', '`+area+`');`, function (error, results, fields) {
        if (error) {
            console.error('Error al agregar el dato: ' + error.stack);
            res.sendStatus(500);
            return;
          }
      
        const id = results.insertId; // Obtener el ID del nuevo dato agregado
        let _datosHistorial = {
            opc      : 1,
            idOrder  : id,
            area     : area,
            idUser   : idUser,
            numOrder : numOrder,
            aceptado : 1
        }
        let resu = actHistorial(_datosHistorial);
        console.log(resu);
        if(resu==200){
            
        }
          console.log('Dato agregado con éxito. ID:', id);
          res.json({ 
            "status":       200,
           }); // Enviar el ID como respuesta en formato JSON
        
        /*
        if(Object.keys(results).length === 0){
            res.json({
                "status": 500
            });
        }else{
            let _datosHistorial = {
                opc      : 1,
                area     : area,
                idUser   : idUser,
                numOrder : numOrder,
            }
            let resu = actHistorial(_datosHistorial);
            if(resu.status==200){
                res.json({
                    "status":       200,
                });
            }
        }
        */
        //res.send(results); 
    }); 
    
})

//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});