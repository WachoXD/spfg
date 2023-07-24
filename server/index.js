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

var   express                = require('express');
var   app                    = express();
const morgan                 = require('morgan');
var   bodyParser             = require('body-parser')
var   cors                   = require('cors');
const { spawn }              = require('child_process');
var   router                 = express.Router();
const winston                = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

 
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


/*
const logger = winston.createLogger({
    level: 'error', // Nivel de registro: error
    format: winston.format.simple(), // Formato del mensaje de error
    transports: [
        new winston.transports.Console(), // Salida de la consola
        new winstonDailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        }) // Archivo de registro diario
    ]
});
*/
var db_config = {
    host: 'localhost',
    user: 'pfg',
    password: '(fEnebs[i_HIskp-',
    database: 'spfg'
};
/*var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spfg'
};*/
  
  var conexion;
  
  function handleDisconnect() {
    conexion = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    conexion.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    conexion.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
  }
  
  handleDisconnect();
  function reinicio(){
    process.on('ER_DUP_ENTRY', (error) => {
        console.error('Se produjo un error:', error);
    
        // Reinicia el servicio de nodemon
        const nodemonProcess = spawn('nodemon', ['index.js'], {
            stdio: 'inherit',
        });
        
        // Cierra el proceso actual
        process.exit(1);
    });
  }

//Nuestro primer WS Get
app.get('/', (req, res) => {
    let img = [  "","https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2FCastlevaniarealm%2Fposts%2Fc%25C3%25B3rtese-el-pelo-gay-%25C3%25BAnete-al-grupocastlevania-realm%2F1285234034947983%2F&psig=AOvVaw2cPoRW6K8bh8W5no4DlBhs&ust=1685484348421000&source=images&cd=vfe&ved=0CA4QjRxqFwoTCMCH-pa3m_8CFQAAAAAdAAAAABAD",
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwradio.com.mx%2Fradio%2F2017%2F05%2F31%2Fdeportes%2F1496248133_037699.html&psig=AOvVaw1XdV8hYBAGgVVrfTPU6fiM&ust=1685484409888000&source=images&cd=vfe&ved=0CA4QjRxqFwoTCLC66be3m_8CFQAAAAAdAAAAABAI",
                "https://i.ytimg.com/vi/fuG-gNV2oDM/maxresdefault.jpg"
            ]
    //logger.log("error", "Hello, Winston!");
    const numeroAlAzar = Math.floor(Math.random() * 2) + 1;  
    console.log("numeroAlAzar ",numeroAlAzar);
    let sVista = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>¿?</title>
        </head>
        <body>
        <br><br><br>
            <center><h1>Ya Gonzalo</h1><br><img src="`+img[numeroAlAzar]+`" width="900px" alt="Miloco"></center>
            <META HTTP-EQUIV="REFRESH" CONTENT="5;URL=http://192.168.1.74:81/spfg/"> 
        </body>
    </html>`
    res.send(sVista);
})

router.post('/login', (req, res) => { 
    let email = req.body.email;
    let pass  = req.body.pass;
    console.log("email: "+email);
    var resu = '';
    conexion.query("SELECT * FROM users WHERE email = ? AND password = ?",[email, pass], function (error, results, fields) {
        
        if(Object.keys(results).length === 0){
            res.json({
                "status": 400
            });
        }else{

            results.forEach(result => {
                res.json({
                    "status"        : 200,
                    "id"            : result.id,
                    "email"         : result.email,
                    "user_rol_id"   : result.user_rol_id,
                    "name"          : result.name,
                    "created_at"    : result.create_at,
                    "if_update"     : result.if_update,
                    "version"       : result.version
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

router.post('/resetPassUser', (req, res) => {
    let id     = req.body.id;
    let pass   = 'pfg2023';
    let cambio = 0;
    conexion.query("UPDATE `users` SET `password`= ?, `if_update`= ? WHERE `id`= ?" ,[pass, cambio, id], function (error, results, fields){
        if (error){
            throw error;
        }
        res.json({
            "status": '200'
        })
    });
});

router.post('/actUser', (req, res) =>{
    let nom   = req.body.nom;
    let email = req.body.email;
    let area  = req.body.area;
    
    conexion.query("UPDATE `users` SET `name`='"+nom+"',`user_rol_id`='"+area+"',`updated_at`= NOW() WHERE `email` = '"+email+"'", function (error, results) {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status": '200'
        });
    });
});

router.post('/deleteUser', (req, res) => {
    let id = req.body.id;
    conexion.query("DELETE FROM users WHERE `users`.`id` = "+id+"", function (error, results, fields){
        if (error){
            throw error;
        }
        res.json({
            "status": '200'
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

router.get("/horaOrder", (req, res) => {
    let idOrder = req.query.idOrder;
    //console.log(idOrder);
    conexion.query("SELECT `id`, `startdate`, `updated_at` FROM `orders` WHERE `id` = '"+idOrder+"'", (error, results, fields) => {
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
    let orderid   = req.query.idOrder;
    //console.log("El order es: ",orderid);
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

router.get('/solVersion', (req, res) => {
    conexion.query("SELECT * FROM info WHERE `id` = '1'", function(error,results){
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

router.get('/actVer', (req, res) => {
    let id      = req.query.id;
    let version = req.query.version;
    conexion.query("UPDATE `users` SET `version` = '"+version+"' WHERE `id` = '"+id+"'", function(error, results){
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status" : 200
        })
    });
});

router.get('/solPedidos', (req,res) => {
    let id   = req.query.id;
    conexion.query('SELECT * FROM orders WHERE who_id_created = '+id+' ORDER BY id DESC', (error, results, fields) => {
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
    conexion.query("SELECT * FROM orders WHERE `acepted` = '0' AND `area_id`  = '"+area+"'", (error, results, fields) => {
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
    conexion.query('SELECT id, name, user_rol_id, email FROM users ORDER BY user_rol_id ASC', (error, results, fields) => {
        if (error) {
          console.error('Error al ejecutar la consulta: ', error);
          throw error;
        }
        // Convertir los resultados en formato JSON
        const jsonData = JSON.stringify(results);
        res.send(jsonData);
    });
})

router.get('/solTodPed', (req, res) => {
    conexion.query('SELECT * FROM orders ORDER BY id DESC', (error, results, fields) => {
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
    let idOrder     = req.body.idOrder;
    //console.log("email: "+email+" pass: "+ pass);
    
    conexion.query(`UPDATE orders SET acepted='0',area_id=?,updated_at=? WHERE id = ?`,[ area, idUser, idOrder], function (error, results, fields) {
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

router.post('/parcialPed' ,(req, res)=>{
    let numOrder    = req.body.numOrder;
    let orderId     = req.body.orderId;
    //console.log("Api orderId ",orderId);
    conexion.query(`UPDATE orders SET status = 'Parcial' WHERE id = ?`,[orderId], function (error, results, fields) {
        if(error){
            console.log(error);
            res.json({
                "status": 500
            });
        }else{
            let datosRes = {
                area        : req.body.area_id,
                orderId     : req.body.orderId,
                idUser      : req.body.idUser,
                opc         : 5,
            }
            //console.log(datosRes);
            let resultado = actHistorial(datosRes);
            res.json({
                "status": 200,
            });
        }
        //res.send(results);
    });
})

router.post('/aceptarPed', (req, res) => {
    let userId      = req.body.userId;
    let orderId     = req.body.orderId;
    let acepted     = userId;
    var resu = '';
    //console.log("El usuario: ",userId," la orden: ",orderId);
    conexion.query("UPDATE orders SET `acepted` = '1', `user_id` = '"+userId+"', `updated_at` = NOW(), `before_area` = `area_id`,  `before_user` = '"+userId+"'  WHERE id = '"+orderId+"'", function (error, results, fields) {
        if (error) {
            throw error;
        }
        //console.log(results);  
        conexion.query('SELECT id, ordernumber, user_id, area_id, acepted FROM orders WHERE id = ?',[orderId], (error, results, fields) => {
            if (error) {
              console.error('Error al ejecutar la consulta: ', error);
              throw error;
            }
            // Convertir los resultados en formato JSON
            const jsonData = JSON.stringify(results);
            let resul = JSON.parse(jsonData);
            let datosRes = {
                opc         : 3,
                area        : resul[0].area_id,
                orderId     : resul[0].id,
                idUser      : resul[0].user_id,
                acepted     : acepted,
                numOrder    : resul[0].ordernumber,
            }
            //console.log("DatosRes");
            //console.log(datosRes);
            //resu = jsonData.id;
            let resultado = actHistorial(datosRes);
            //console.log(resultado);
            if( resultado == 200){
                res.json({ 
                    "status":       200,
                }); 
            }
        });
        //const id = results.insertId; // Obtener el ID del nuevo dato agregado
        //res.send(results);
    });
})

router.post('/asignarPed', (req, res) => {
    let area        = req.body.area;
    let orderId     = req.body.idOrder;
    let acepted     = req.body.idUser;
    let before_user = acepted;
    //console.log("El area es: ", area);
    var resu = '';
    conexion.query("UPDATE orders SET `acepted` = '0', `before_user` = '"+before_user+"', `updated_at` = NOW(), `area_id` = '"+area+"'  WHERE id = '"+orderId+"'", function (error, results, fields) {
        if (error) {
            console.log(error.code);
            throw error;
        }
        //console.log(results);  
        conexion.query('SELECT id, ordernumber, user_id, area_id, acepted FROM orders WHERE id = ?',[orderId], (error, results, fields) => {
            if (error) {
              console.error('Error al ejecutar la consulta: ', error);
              throw error;
            }
            // Convertir los resultados en formato JSON
            const jsonData = JSON.stringify(results);
            let resul = JSON.parse(jsonData);
            let datosRes = {
                opc         : 2,
                area        : resul[0].area_id,
                orderId     : resul[0].id,
                idUser      : resul[0].user_id,
                acepted     : acepted,
                numOrder    : resul[0].ordernumber,
            }
            //console.log("DatosRes");
            //console.log(datosRes);
            //resu = jsonData.id;
            let resultado = actHistorial(datosRes);
            //console.log(resultado);
            if( resultado == 200){
                res.json({ 
                    "status":       200,
                }); 
            }
        });
        //const id = results.insertId; // Obtener el ID del nuevo dato agregado
        //res.send(results);
    });
})

router.post('/rechazarPed',(req, res)=>{
    let acepted     = req.body.acepted;
    let orderId     = req.body.orderId;
    let msg         = req.body.msg;
    //console.log("email: "+email+" pass: "+ pass);
    var resu = '';
    conexion.query("UPDATE orders SET `acepted` = '1', `area_id` = `before_area`, `user_id` = `before_user`, `updated_at` = NOW() WHERE id = '"+orderId+"'", function (error, results, fields) {
        if (error) {
            console.log(error.code);
            throw error;
        }
        //console.log(results);  
        conexion.query('SELECT id, ordernumber, user_id, area_id, acepted FROM orders WHERE id = ?',[orderId], (error, results, fields) => {
            if (error) {
              console.error('Error al ejecutar la consulta: ', error);
              throw error;
            }
            // Convertir los resultados en formato JSON
            const jsonData = JSON.stringify(results);
            let resul = JSON.parse(jsonData);
            let datosRes = {
                opc         : 4,
                area        : resul[0].area_id,
                orderId     : resul[0].id,
                idUser      : resul[0].user_id,
                acepted     : acepted,
                numOrder    : resul[0].ordernumber,
                msg         : msg,
            }
            //console.log("DatosRes");
            //console.log(datosRes);
            //resu = jsonData.id;
            let resultado = actHistorial(datosRes);
            //console.log(resultado);
            if( resultado == 200){
                res.json({ 
                    "status":       200,
                }); 
            }
        });
        //const id = results.insertId; // Obtener el ID del nuevo dato agregado
        //res.send(results);
    }); 
})

router.post('/finalizarPed', (req, res) => {
    let idUser      = req.body.idUser;
    let idOrder     = req.body.idOrder;
    conexion.query("UPDATE orders SET `status` = 'Finalizado', `acepted` = '0', `area_id` = '101', `user_id` = '"+idUser+"', `updated_at` = NOW() WHERE id = '"+idOrder+"'", function (error, results, fields) {
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            const jsonData = JSON.stringify(results);
            let resul = JSON.parse(jsonData);
            console.log(resul);
            let datosRes = {
                opc         : 6,
                area        : 101,
                orderId     : idOrder,
                idUser      : idUser,
                acepted     : 0,
                msg         : 'El pedido ha sido finalizado',
            }
            let resultado = actHistorial(datosRes);
            //console.log(resultado);
            if( resultado == 200){
                res.json({ 
                    "status":       200,
                }); 
            }
        }
    });

})

router.post('/eliminarPed', (req, res) => {
    let idOrder     = req.body.idOrder;
    conexion.query("DELETE FROM orders WHERE orders.id = '"+idOrder+"'", function (error, results, fields){
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            conexion.query("DELETE FROM order_record WHERE `order_record`.`order_id` = '"+idOrder+"'", function (error, results, fields){
                if (error) {
                    console.log(error.code);
                    throw error;
                }else{
                    res.json({ 
                        "status":       200,
                    }); 
                }
            })
            
        }
    })
})

router.post('/cancelarPed', (req, res) => {
    let idOrder     = req.body.idOrder;
    let ordernumber = req.body.ordernumber;
    let area_id     = req.body.area_id;
    let idUser      = req.body.idUser;
    conexion.query("UPDATE orders SET `status` = 'Cancelado', `acepted` = '0', `area_id` = '100', `user_id` = '"+idUser+"', `updated_at` = NOW() WHERE id = '"+idOrder+"'", function (error, results, fields) {
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            const jsonData = JSON.stringify(results);
            let resul = JSON.parse(jsonData);
            console.log(resul);
            let datosRes = {
                opc         : 7,
                area        : 100,
                orderId     : idOrder,
                idUser      : idUser,
                acepted     : 0,
                msg         : 'El pedido ha sido cancelado',
            }
            let resultado = actHistorial(datosRes);
            //console.log(resultado);
            if( resultado == 200){
                res.json({ 
                    "status":       200,
                }); 
            }
        }
    });
})

router.post('/modificarPed', (req, res) => {
    let area           = req.body.area;
    let acepted        = req.body.acepted;
    let idUser         = req.body.idUser;
    let idOrder        = req.body.idOrder;
    let cd_area        = req.body.cd_area;
    let company        = req.body.company;    
    let ordernumber    = req.body.ordernumber;
    let oldOrderNumber = req.body.oldOrderNumber;
    let oldCompany     = req.body.oldCompany;
    //console.log("area ",area," acepted ",acepted," idUser ", idUser, " idOrder ",idOrder, " company ",company," ordernumber ",ordernumber," oldOrderNumber ",oldOrderNumber," oldCompany ",oldCompany);


    conexion.query("SELECT id FROM `orders` WHERE `company` = '"+company+"' AND `ordernumber` = '"+ordernumber+"'", (error, results) => {
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            if (results.length > 0) {
                console.log("Result: ",results.length);
                res.json({
                    "status":       500,
                    "msg"   : "El producto <strong>"+company+" "+ordernumber+"</strong> ya existe"
                })
            }else{
                conexion.query("UPDATE `orders` SET `company`='"+company+"', `cd_area` = '"+cd_area+"',`ordernumber`='"+ordernumber+"' WHERE `id` = '"+idOrder+"'", function (error, results, fields) {
                    if (error) {
                        console.log(error.code);
                        throw error;
                    }else{
                        let datosRes = {
                            opc         : 8,
                            area        : area,
                            orderId     : idOrder,
                            idUser      : idUser,
                            acepted     : acepted,
                            msg         : 'El pedido ha sido modificado de N° '+oldOrderNumber+' a N° '+ordernumber+' y de '+oldCompany+' a '+company+'',
                        }
                        let resultado = actHistorial(datosRes);
                        res.json({ 
                            "status":  200,
                        });
                    }
                });
            }   
        }
    });   
})

router.post('/regresarVent', (req, res) => {
    let vendedor = req.body.vendedor;
    let msg      = req.body.msg;
    let numOrder = req.body.numOrder;
    let idUser   = req.body.idUser;
    let idOrder  = req.body.idOrder;
    conexion.query("UPDATE `orders` SET  `acepted`='1',`area_id`='3',`user_id`='"+vendedor+"',`updated_at`= NOW() WHERE `id`='"+idOrder+"'", (error, results) => {
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            let _datos = {
                opc      : 9,
                acepted  : idUser,
                msg      : msg     ,
                numOrder : numOrder,
                idUser   : vendedor,
                orderId  : idOrder ,
                area     : 3
            }
            let resHist = actHistorial(_datos);
            res.json({ 
                "status":  200,
            });
        }
    });
});

router.post('/asignarDir', (req, res) => {
    let user     = req.body.user;
    let numOrder = req.body.numOrder;
    let idUser   = req.body.idUser;
    let idOrder  = req.body.idOrder;

    conexion.query("SELECT `user_rol_id` FROM `users` WHERE `id` = '"+user+"'", (error, results) => {
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            let area = results[0].user_rol_id;
            conexion.query("UPDATE `orders` SET  `acepted`='1',`area_id`='"+area+"',`user_id`='"+user+"',`updated_at`= NOW() WHERE `id`='"+idOrder+"'", (error, results) => {
                if (error) {
                    console.log(error.code);
                    throw error;
                }else{
                    let _datos = {
                        area     : area,
                        opc      : 10,
                        acepted  : idUser,
                        numOrder : numOrder,
                        idUser   : user,
                        orderId  : idOrder ,
                    }
                    let resHist = actHistorial(_datos);
                    res.json({ 
                        "status":  200,
                    });
                }
            });
            
        }
    });
});

function actHistorial(reqDatos){

    let area        = reqDatos.area;
    let orderId     = reqDatos.orderId;
    let idUser      = reqDatos.idUser;
    let aceptado    = reqDatos.acepted;
    let numOrder    = reqDatos.numOrder;
    let msg         = reqDatos.msg;
    var resu;
    let sqlCon = '';
    console.log("aceptado ",aceptado);
    switch(reqDatos.opc){
        /*
        1: Nuevo
        2: Avanza
        3: Aceptado
        4: Rechazado
        5: Parcial
        6: Finalizado
        7: Cancelado
        8: Modificar
        9: Se regresa a ventas
        */
        case 1:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id,    user_id,       order_id,       created_at) 
            VALUES (                            'Activo', NOW(),    '`+area+`', '`+idUser+`',   '`+orderId+`',  NOW())`;
            break;
        case 2:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, asigned_to, order_id, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`', '0','`+orderId+`',NOW())`;
            break;
        case 3:
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, acepted_by, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`','`+orderId+`', '`+aceptado+`',NOW())`;
            break;
        case 4: 
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id, user_id, order_id, rejected_by, cancellation_details, created_at) 
            VALUES ('Activo', NOW(),'`+area+`','`+idUser+`','`+orderId+`', '`+aceptado+`', '`+msg+`', NOW())`;
            break;
        case 5:
            sqlCon = `INSERT INTO order_record(status,  changed_date, area_id,       user_id,        order_id,       changed_status_by,  	partially_by, created_at ) 
            VALUES (                           'Parcial', NOW(),       '`+area+`',    '`+idUser+`',    '`+orderId+`',    '`+idUser+`',       '`+idUser+`', NOW())`
            break;
        case 6:
            sqlCon = `INSERT INTO order_record(status,      changed_date, area_id,  user_id,        order_id,   changed_status_by,   cancellation_details,  	finished_by, created_at) 
            VALUES (                        'Finalizado',    NOW(),     '`+area+`','`+idUser+`','`+orderId+`',  '`+idUser+`',      '`+msg+`',              '`+idUser+`',     NOW())`;
            break;
        case 7:
            sqlCon = `INSERT INTO order_record(status,      changed_date, area_id,  user_id,        order_id,   changed_status_by,   cancellation_details,  	canceled_by, created_at) 
            VALUES (                        'Cancelado',    NOW(),     '`+area+`','`+idUser+`','`+orderId+`',  '`+idUser+`',      '`+msg+`',              '`+idUser+`',     NOW())`;
            break;
        case 8:
            sqlCon = `INSERT INTO order_record(status,      changed_date, area_id,  user_id,        order_id,   changed_status_by,   cancellation_details,  	modificed_by, created_at) 
            VALUES (                        'Modificado',    NOW(),     '`+area+`','`+idUser+`','`+orderId+`',  '`+idUser+`',      '`+msg+`',              '`+idUser+`',     NOW())`;
            break;
        case 9: 
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id,   user_id,        order_id,    	return_by,    cancellation_details, created_at) 
            VALUES                          ('Regreso', NOW(),      '`+area+`','`+idUser+`','`+orderId+`', '`+aceptado+`', '`+msg+`',               NOW())`;
            break;
        case 10: 
            sqlCon = `INSERT INTO order_record(status, changed_date, area_id,   user_id,        order_id,    	redirect_by,  created_at) 
            VALUES                          ('Asignado', NOW(),      '`+area+`','`+idUser+`','`+orderId+`', '`+aceptado+`',  NOW())`;
            break;
    }

    let res = conexion.query(sqlCon, function (error, results, fields) {
        if(error){
            
            console.log("error");
            console.log(error.code);
            
            throw error;
            return 500;
        }
        console.log("No error");
        return 200;
    });
    return 200;
}

router.post('/agregarPed', (req, res) => {
    let area        = req.body.area;
    let idUser      = req.body.userId;
    let numOrder    = req.body.numOrder;
    let cd_area     = req.body.cd_area;
    let emp         = req.body.emp;
    console.log("Area: ",area," IdUser: ",idUser," numOrder ",numOrder, " cd_area: ",cd_area," emp", emp);
    
    conexion.query("SELECT id FROM orders WHERE company = '"+emp+"' AND ordernumber = '"+numOrder+"'", (error, results) => {
        if (error) {
            console.log(error.code);
            throw error;
        }else{
            if (results.length > 0) {
                res.json({
                    "status":       500,
                })
            }else{
                conexion.query(`INSERT INTO orders (company, ordernumber, cd_area, status, acepted, startdate, area_id, user_id, who_id_created, before_area) VALUES ('`+emp+`', '`+numOrder+`', '`+cd_area+`', 'Activo', '1', NOW(), '`+area+`', '`+idUser+`', '`+idUser+`', '`+area+`')`, function (error, results, fields) {
                    /*
                    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                        handleDisconnect();                         // lost due to either server restart, or a
                    } else {                                      // connnection idle timeout (the wait_timeout
                        throw err;                                  // server variable configures this)
                    }
                    */
                // Captura los errores no capturados
            
                    if(error){
                        if (error.code === 'ER_DUP_ENTRY') {
                            reinicio();
                            handleDisconnect();
                            res.json({ 
                                "status":       500,
                            });
                            return;
                        }
                        console.log("El error es: ", error);
                    }else{
                        
                        const id = results.insertId; // Obtener el ID del nuevo dato agregado
                        let _datosHistorial = {
                            opc      : 1,
                            area     : area,
                            orderId  : id,
                            idUser   : idUser,
                            numOrder : numOrder,
                            aceptado : 1
                        }
                        let resu = actHistorial(_datosHistorial);
                        //console.log(resu);
                        if(resu==200){
                            
                        }
                        //console.log('Dato agregado con éxito. ID:', id);
                        res.json({ 
                            "status":       200,
                        }); // Enviar el ID como respuesta en formato JSON
                    }
                }); 
            }
        }
    })  
})

async function realizarConsulta() {
    conexion.query('SELECT nombre, email, area FROM usuarios', function (error, results, fields) {
        if (error) throw error;
        
        // Construir el JSON array para los datos de esta consulta
        const jsonArray = results.map(user => {
            return {
                nombre: user.nombre,
                email: user.email,
                area: user.area
            };
        });
      
        // Agregar el JSON array al JSON de resultados
        jsonResultados.datos = jsonResultados.datos.concat(jsonArray);
      
        // Verificar si se han completado todas las consultas
        if (jsonResultados.datos.length / 3 === nCon) {
            // Todas las consultas han sido completadas
            console.log(jsonResultados); // Mostrar los resultados en la consola
            return 200;
        } else {
          // Todavía hay consultas pendientes, realizar la siguiente consulta
            realizarConsulta();
        }
    });
}

router.get('/grafArea', async (req, res) => {
    let startDate  = req.query.startDate;
    let finishDate = req.query.finishDate;
    let area       = req.query.area;
    let jOrders;
    conexion.query("SELECT * FROM orders WHERE area_id = '"+area+"' AND startdate BETWEEN '"+startDate+"' AND '"+finishDate+"' ", (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        jOrders = results;
        conexion.query('SELECT id, name, user_rol_id, email FROM users WHERE user_rol_id = '+area+'', async (error, results, fields) => {
            if (error) {
              console.error('Error al ejecutar la consulta: ', error);
              throw error;
            }
            let jRes;
            var objetos = [];
            let contador = 0;
            for(j = 0; j  < results.length; j++){
                for(i = 0; i < jOrders.length; i++){
                    if (jOrders[i].user_id === results[j].id) { contador++; }
                }
                jRes = '{"cantidad":'+contador+', "name":"'+results[j].name+'"}';
                var objeto = JSON.parse(jRes);
                objetos.push(objeto);
                contador = 0;
            }
            res.send(objetos);
        });
    });
});

router.get('/grafPed', (req, res) => {
    let startDate  = req.query.startDate;
    let finishDate = req.query.finishDate;
    let company    = req.query.company;
    conexion.query(
        "SELECT * FROM orders WHERE company = '"+company+"' AND startdate BETWEEN '"+startDate+"' AND '"+finishDate+"' ", 
        function (error, results) {
            if (error) {
                console.error('Error al ejecutar la consulta: ', error);
                throw error;
              }
            var objetos    = [];
            let jRes;
            let status =["Activo", "Finalizado", "Parcial", "Cancelado"];
            
            for(i = 0; i < status.length; i++){
                let resu = 0;
                for(j = 0; j < results.length; j++){
                    if(results[j].status == status[i]) resu++;
                }
                jRes = '{"cantidad":'+resu+', "name":"'+status[i]+'"}';
                var objeto = JSON.parse(jRes);
                objetos.push(objeto);
            }
            //console.log(objetos);
            res.send(objetos);
        }
    );
});

router.get('/grafGeneral', (req, res) => {
    let startDate  = req.query.startDate;
    let finishDate = req.query.finishDate;
    let resD = 0;
    let jRes;
    var objetos = [];
    let datos = {
        status      : 0,
        ventas      : 0,
        compras     : 0,
        almacen     : 0,
        cyc         : 0,
        facturacion : 0,
        sistemas    : 0 
    }
    conexion.query(//compras
        "SELECT COUNT(*) AS cantidad FROM orders WHERE (area_id = '1') AND (startdate BETWEEN '"+startDate+"' AND '"+finishDate+"')",
        function (error, results, fields) {
            if (error) throw error;
            jRes = '{"cantidad":'+results[0].cantidad+', "name":"Compras"}';
            var objeto = JSON.parse(jRes);
            objetos.push(objeto);
            //datos.compras = results[0].cantidad;
            //resD += 1;
        }
    );
    
    conexion.query(//Sistemas
        "SELECT COUNT(*) AS cantidad FROM orders WHERE (area_id = '2') AND (startdate BETWEEN '"+startDate+"' AND '"+finishDate+"')",
        function (error, results, fields) {
            if (error) throw error;
            jRes = '{"cantidad":'+results[0].cantidad+', "name":"Sistemas"}';
            var objeto = JSON.parse(jRes);
            objetos.push(objeto);
            //datos.sistemas = results[0].cantidad;
            //resD += 1;
        }
    );
    
    conexion.query(//Ventas
        "SELECT COUNT(*) AS cantidad FROM orders WHERE (area_id = '3') AND (startdate BETWEEN '"+startDate+"' AND '"+finishDate+"')",
        function (error, results, fields) {
            if (error) throw error;
            jRes = '{"cantidad":'+results[0].cantidad+', "name":"Ventas"}';
            var objeto = JSON.parse(jRes);
            objetos.push(objeto);
            //datos.ventas = results[0].cantidad;
            //resD += 1;
        }
    );

    conexion.query(//Almacén
        "SELECT COUNT(*) AS cantidad FROM orders WHERE (area_id = '4') AND (startdate BETWEEN '"+startDate+"' AND '"+finishDate+"')",
        function (error, results, fields) {
            if (error) throw error;
            jRes = '{"cantidad":'+results[0].cantidad+', "name":"Almacén"}';
            var objeto = JSON.parse(jRes);
            objetos.push(objeto);
            //datos.almacen = results[0].cantidad;
            //resD += 1;
        }
    );

    conexion.query(//Facturación
        "SELECT COUNT(*) AS cantidad FROM orders WHERE (area_id = '5') AND (startdate BETWEEN '"+startDate+"' AND '"+finishDate+"')",
        function (error, results, fields) {
            if (error) throw error;
            jRes = '{"cantidad":'+results[0].cantidad+', "name":"Facturación"}';
            var objeto = JSON.parse(jRes);
            objetos.push(objeto);
            //datos.facturacion = results[0].cantidad;
            //resD += 1;
        }
    );

    conexion.query(//CyC
        "SELECT COUNT(*) AS cantidad FROM orders WHERE (area_id = '3') AND (startdate BETWEEN '"+startDate+"' AND '"+finishDate+"')",
        function (error, results, fields) {
            if (error) throw error;
            jRes = '{"cantidad":'+results[0].cantidad+', "name":"CyC"}';
            var objeto = JSON.parse(jRes);
            objetos.push(objeto);
            //datos.cyc = results[0].cantidad;
            //resD += 1;
            //datos.status = resD;
            console.log(objetos);
            res.send(objetos);
        }
    );
    
});


///////////////////////////////////////////////////////  Apis de adm ///////////////////////////
router.get('/pm', (req, res) => {
    conexion.query("SELECT * FROM orders WHERE company = ''", (error, results) => {
        if (error) {
            console.error('Error al verificar el producto:', error);
        } else{
            console.log(results.length);
            for(i = 0; i < results.length; i++){
                if(results[i].ordernumber < 40000){
                    conexion.query("UPDATE `orders` SET `company`='M' WHERE `ordernumber`= "+results[i].ordernumber+"",(error, results) => {
                        if (error) {
                            console.error('Error al verificar el producto:', error);
                        }
                    })
                }else{
                    conexion.query("UPDATE `orders` SET `company`='P' WHERE `ordernumber`= "+results[i].ordernumber+"",(error, results) => {
                        if (error) {
                            console.error('Error al verificar el producto:', error);
                        }
                    })
                }
                console.log(i);
            }
            console.log("Ya terminó");
        }
    })
})

router.get('/actInvalido', (req, res) =>{
    conexion.query("UPDATE `productos` SET `invalido`='0'",(error, results) =>{
        if (error) {
            console.error('Error al actualizar el invalido a 0:', error);
        }
    });
})

router.post('/agregarProd', (req, res) => {
    //console.log(req.body);
    let codigo       = req.body.codigo;
    let codprov      = req.body.codprov;
    let um           = req.body.um;
    let descripcion  = req.body.descripcion;
    let especial     = req.body.especial;
    let costo        = req.body.costo;
    let mon          = req.body.mon;
    let prov         = req.body.prov;
    let marca        = req.body.marca;
    let fechaLista   = req.body.fechaLista;
    let emp          = req.body.emp;
    let sat          = req.body.sat;
    let oferta       = req.body.oferta;
    let invalido     = req.body.invalido;
    // Consulta para verificar si el producto existe
    
    const consulta = `SELECT id FROM productos WHERE codigo = '`+codigo+`'`;

    conexion.query(consulta, (error, results) => {
        if (error) {
            console.error('Error al verificar el producto:', error);
        } else {
            if (results.length > 0) {
              // El producto existe, realizar la actualización
                conexion.query("UPDATE `productos` SET `um`='"+um+"',`descripcion`='"+descripcion+"',`especial` = '"+especial+"' ,`costo`='"+costo+"',`fechalista`= NOW(), `invalido`='"+invalido+"' WHERE `codigo`='"+codigo+"'",(error, results) =>{
                    if (error) {
                        console.error('Error al actualizar el producto:', error);
                    } else{
                        res.json({
                            "status" : 200
                        })
                    }
                })
            } else {
              // El producto no existe, realizar la inserción
              conexion.query(`INSERT INTO productos(codigo,       codprov,        um,     descripcion,       especial,     costo,       mon,      prov,      marca,      fechalista,     emp,       sat,        oferta,      invalido) 
              VALUES (                            '`+codigo+`','`+codprov+`', '`+um+`','`+descripcion+`', '`+especial+`' , '`+costo+`','`+mon+`','`+prov+`','`+marca+`',NOW(),'`+emp+`','`+sat+`','`+oferta+`','`+invalido+`')`,(error, results) =>{
                  if (error) {
                      console.error('Error al ingresar el producto:', error);
                  } else{
                      res.json({
                          "status" : 200
                      })
                  }
              })
            }
        }
    });
});

router.post('/resetInvalido', (req, results) => {
    let prov       = req.body.prov;
    let sQuery    = "";
    //if(opc == 0){
        sQuery = "UPDATE `productos` SET `invalido`='0' WHERE `prov` = '"+prov+"'; "
    /*
    }else{
        sQuery = "UPDATE `productos` SET `invalido`='0' WHERE `especial` = (1); "
    }
    */
    conexion.query(sQuery,(error, results) =>{
        if (error) {
            console.error('Error al resetear el invalido el producto:', error);
        } else{
            res.json({
                "status" : 200
            })
        }
    })
});

router.post('/agregarPorcen', (req, results) => {
    let marca  = req.body.marca;
    let lista1 = req.body.lista1;
    let lista2 = req.body.lista2;
    let lista3 = req.body.lista3;
    sQuery = `INSERT INTO proveedores( marca,   lista1,         lista2,     lista3) 
    VALUES (                        '`+marca+`','`+lista1+`','`+lista2+`','`+lista3+`') `;
    conexion.query(sQuery,(error, results) =>{
        if (error) {
            console.error('Error al resetear el invalido el producto:', error);
        } else{
            res.json({
                "status" : 200
            })
        }
    })
});

router.get('/listMarcas', (req, res) => {
    conexion.query("SELECT * FROM `list`", (error, results) =>{
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

router.post('/nuevProv', (req, res) => {
    let prov = req.body.proveedor;
    let list1 = req.body.lista1;
    let list2 = req.body.lista2;
    let list3 = req.body.lista3;
    conexion.query("INSERT INTO `list` (`id`, `nameComp`, `list1`, `list2`, `list3`) VALUES (NULL, '"+prov+"', '"+list1+"', '"+list2+"', '"+list3+"')",  (error, results) => {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status":200
        })
    });
});

router.post('/eliminarProv', (req, res) => {
    let id = req.body.id;
    conexion.query("DELETE FROM `list` WHERE `list`.`id` = "+id+"", (error, results) => {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status":200
        })
    });
});

router.post('/actProv', (req, res) => {
    let id    = req.body.id;
    let prov  = req.body.prov;
    let list1 = req.body.lista1;
    let list2 = req.body.lista2;
    let list3 = req.body.lista3;

    conexion.query("UPDATE `list` SET `nameComp`='"+prov+"',`list1`='"+list1+"',`list2`='"+list2+"',`list3`='"+list3+"' WHERE `id`='"+id+"'", (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status": 200
        });
    });
});

/////////////////////////////////// APIs de lista de productos /////////////////////////////
router.get('/solProductosSearch', (req, res) => {
    let producto   = req.query.producto;
    let prov       = req.query.prov;
    //console.log("El order es: ",orderid);
    conexion.query("SELECT * FROM `productos` WHERE `prov` LIKE '%"+prov+"%' AND (`codigo` LIKE '%"+producto+"%' OR `codprov` LIKE '%"+producto+"%' OR `descripcion` LIKE '%"+producto+"%');", (error, results, fields) => {
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

router.get('/solCoti', (req, res) =>{
    let folio = req.query.folio;
    conexion.query("SELECT * FROM `pedidos` WHERE `folio` = '"+folio+"'", (error, results) => {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }else{
            if(results.length > 0){
                const jsonData = JSON.stringify(results);
                //console.log(jsonData);
                res.send(jsonData);
            }else{
                res.json({
                    "status": 0
                });
            }
        }
    });
});

router.get('/sMisCoti', (req, res)  => {
    let id = req.query.id;
    conexion.query("SELECT id, nomV, startdate, id_user, razonS, nomAtencion, folio FROM `pedidos` WHERE `id_user` = '"+id+"'", (error, results) => {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        if(results.length > 0){
            const jsonData = JSON.stringify(results);
            //console.log(jsonData);
            res.send(jsonData);
        }else{
            res.json({
                "status": 400
            });
        }
    });
});



router.post('/ingCotizacion', (req, res) => {//Ingresar cotización a la bd
    let productosJ   = req.body.productosJ;
    let nomV         = req.body.nomV;
    let telV         = req.body.telV;
    let emailV       = req.body.emailV;
    let razon        = req.body.razon;
    let atencion     = req.body.atencion;
    let departamento = req.body.departamento;
    let idUser       = req.body.idUser;
    conexion.query("SELECT `folio` FROM `pedidos` ORDER BY `id` DESC LIMIT 1", (error, results) => {//Solicitamos el ultimo registro ingresado el dato de folio y se suma 1 para la siguien cotización
        if (error) {
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        let folio = 0;
        
        folio = (results[0].folio +1) * 1;
        //console.log("folio: ",folio," results: ",results[0].folio);
        let sQuery = `INSERT INTO pedidos( productosJ,        nomV,      telV,     emailV,     razonS,     nomAtencion,  departamento,            folio, id_user,       startdate) 
                      VALUES             ('`+productosJ+`','`+nomV+`','`+telV+`','`+emailV+`','`+razon+`','`+atencion+`','`+departamento+`', '`+folio+`', '`+idUser+`', NOW())`;
        conexion.query(sQuery, (error, results) => {
            if (error) {
                console.error('Error al ejecutar la consulta: ', error);
                throw error;
            }
            res.json({
                "status" : 200,
                "folio"  : folio
            })
        });
    });
});

router.post('/actCotizacion', (req, res) => {
    let productosJ = req.body.productosJ;
    let folio      = req.body.folio;

    conexion.query("UPDATE `pedidos` SET `productosJ`='"+productosJ+"' WHERE `folio`='"+folio+"'", (error, results) => {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status" : 200,
            "folio"  : folio
        })
    });
});

router.post('/eliminarCoti', (req, res) => {
    let folio = req. body.folio;
    conexion.query("DELETE FROM pedidos WHERE `pedidos`.`folio` = '"+folio+"'", (error, results) => {
        if(error){
            console.error('Error al ejecutar la consulta: ', error);
            throw error;
        }
        res.json({
            "status" : 200,
        })
    });
});


//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});