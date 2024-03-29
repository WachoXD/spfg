/*
Esta pagia esta lo de la librería de axios
https://desarrolloweb.com/articulos/axios-ajax-cliente-http-javascript.html
*/
var URLactual = window.location;
//alert(URLactual);
var varGlobal     = 0; //0 = login, 2 = cambio de contraseña, 3 = nuevo pedido,
var idGlobal      = 0;
var today         = new Date(); // Iniciamos la fecha actual
var arGlobal      = 0;
var modMenu       = 1;
var usuIdGlobal   = 0;
var todoModGlobal = 0;
let jUsuarioGlobal;
let jPedidosGlobal;
//var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
if(URLactual.href.substring(0,28) == 'http://192.168.1.74:81/spfg/'){
    var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
    var urlPrin     = 'http://192.168.1.74:81/'
}
if(URLactual.href.substring(0,22) == 'http://localhost/spfg/'){
    var urlBase     = 'http://localhost:5000/api/';//Url donde están las apis 
    var urlPrin     = 'http://localhost/'
}
if(URLactual.href.substring(0,28) == 'http://187.188.181.242:81/spfg/'){
    var urlBase     = 'http://187.188.181.242:5000/api/';//Url donde están las apis 
    var urlPrin     = 'http://187.188.181.242/'
}
//alert(urlBase)

//Crear cookies 
function crearCookie(clave, valor, diasexpiracion) {
    var d = new Date();
    d.setTime(d.getTime() + (diasexpiracion * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = clave + "=" + valor + "; " + expires;
}
//Obtener los datos de una cookie
function obtenerCookie(clave) {
    var name = clave + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
//Comprobar si existe o fue creada la cookie
function comprobarCookie() {
    document.getElementById('app').innerHTML = '';
    var clave = "email"
    var clave = obtenerCookie(clave);
    if (clave != "") {
        varGlobal = 1;
        // La cookie existe. 
    } else {
        // La cookie no existe. 
        document.getElementById('app').innerHTML = "<div class='m-0 vh100 row justify-content-center align-items-center mt-5' >\
                                                        <div class='col-auto mt-5'>\
                                                            <div class='card mt-5' style='width: 28rem; background: rgba(0, 0, 0, 0.3);'>\
                                                                <img src='./img/logo_web.45818d48.png' class='card-img-top' alt='PFG'>\
                                                                <div class='card-body'>\
                                                                    <div class='mb-3'>\
                                                                    <label for='exampleInputEmail1' class='form-label'>\Correo</label>\
                                                                    <div class='input-group mb-3'>\
                                                                        <input type='email' autofocus class='form-control' id='inpEmail' placeholder='ejemplo@proveedorferretero.net'>\
                                                                        <span class='input-group-text bi bi-person' id='basic-addon1'>\
                                                                        </span>\
                                                                    </div>\
                                                                    </div>\
                                                                    <div class='mb-3'>\
                                                                        <label for='exampleInputPassword1' class='form-label'>\Password</label>\
                                                                        <div class='input-group mb-3'>\
                                                                            <input type='password' class='form-control' id='inpPass' placeholder='*********'>\
                                                                            <span class='input-group-text bi bi-eye' style='cursor:pointer;' onclick='showPass(0)' id='passlogin'>\
                                                                            </span>\
                                                                        </div>\
                                                                    </div>\
                                                                    <button onclick='iniciarSesion()' class='btn btn-primary '>\
                                                                    <i class='bi bi-box-arrow-in-right'></i> Iniciar sesión</button>\
                                                                </div>\
                                                            </div>\
                                                        </div>\
                                                    </div>";
        loading(2);
    }
}

function showPass(opc) {
    let inp = ['inpPass','newInpPass','newRInpPass'];
    let btnEye = ['passlogin','btnPass1','btnPass2'];
    var input = document.getElementById(inp[opc]);
    var eye   = document.getElementById(btnEye[opc]);
  
    if (input.type === 'password') {
        input.type = 'text';
        input.placeholder = 'Contraseña';
        eye.className = '';
        eye.classList.add('input-group-text', 'bi', 'bi-eye-slash', 'bg-primary-subtle');
    } else {
        input.type = 'password';
        input.placeholder = '*********';
        eye.className = '';
        eye.classList.add('input-group-text', 'bi', 'bi-eye');
    }
  }

//Para reconocer el enter en el formulario
window.addEventListener("keydown", (e) => {
    if(e.keyCode===13){
        switch(varGlobal){
            case 0:
                iniciarSesion();
                break;
            case 2:
                changePassword(idGlobal);
                break;
            case 3:
                document.querySelector('#btnNuevoPed').click();
                break;

        }
        
    }
})
//Funcion para mostrar el simbolo de carga 
/*
    1 = cargando
    2 = listo
*/
function loading(carga){
    /*
    1 = a cargando
    2 = a listo
    */
    if (carga == 1){
        document.getElementById("loader").style.display = "block";
    }else{
        document.getElementById("loader").style.display = "none";
    }
}

//Función de iniciar sesión al llenar los datos
function iniciarSesion(){
    var email = document.getElementById('inpEmail').value.trim();
    var pass  = document.getElementById('inpPass').value.trim();
    if(email.includes("@") && email.includes(".")){
        if(pass != ''){
            loading(1);
            let _datos = {
                email: email,
                pass: pass
            }
            //console.log("email: ",email," pass: ",pass);
            fetch(urlBase+'login', {
                method: "POST",
                body: JSON.stringify(_datos),
                headers: {'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',}
            })
            .then(response => response.json()) 
            .then(function(json) {
                //console.log(json.status);
                if(json.status == 400){
                    loading(2);
                    alert("Usuario no existe");
                }else{
                    if(json.if_update != 0){
                        //console.log(json);
                        jUsuarioGlobal = json;
                        inicio();
                        //home();
                    }else{
                        changePasswordView(1, json.id);
                    }
                }
            })
            .catch(err => console.log(err));
        }else{
            Swal.fire({
                
                icon: 'warning',
                title: 'Por favor llene los campos',
                showConfirmButton: false,
                timer: 1500
            })
            comprobarCookie();

        }
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Usuario y/o contraseñas incorrectas',
            showConfirmButton: false,
            timer: 1500
        })
           comprobarCookie();
    }
}

function recargaForzadaConCtrlF5() {
    // Crear un evento de teclas presionadas para "Ctrl + F5"
    location.reload();
}
//Notificaciones, que al chile no se si jalan y los puse el 4 de mayo
function notificacion(jNotifi){
    document.getElementById('app').innerHTML = `<div class="toast-container position-fixed bottom-0 end-0 p-3" id="notificacion" style="background: rgba(`+jNotifi.r+`, `+jNotifi.g+`, `+jNotifi.b+`, 0.3);">
                <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                    <strong class="me-auto">`+jNotifi.type+`</strong>
                    <small>`+jNotifi.time+`</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                    `+jNotifi.msg+`
                    </div>
                </div>
                </div>`;

    setTimeout(function(){
        document.getElementById("notificacion").remove();
    },3000);
}
//Función para cambiar la contraseña al iniciar sesión y no se ha cambiado la contraseña 
function changePasswordView(newU, id){
    varGlobal = 2;
    idGlobal  = id;
    
    document.getElementById('app').innerHTML = '';
    loading(2);
    if(newU == 1){
        Swal.fire(
            'Cambio de contraseña',
            'Por favor cambie su contraseña',
            'info'
          )
    }
    document.getElementById('app').innerHTML = "<div class='m-0 vh100 row justify-content-center align-items-center mt-5' >\
                                                    <div class='col-auto mt-5'>\
                                                        <div class='card mt-5' style='width: 28rem; background: rgba(0, 0, 0, 0.3);'>\
                                                            <img src='./img/logo_web.45818d48.png' class='card-img-top' alt='PFG'>\
                                                            <div class='card-body'>\
                                                                <div class='mb-3'>\
                                                                    <label for='exampleInputPassword1' class='form-label'>Nueva contraseña</label>\
                                                                    <div class='input-group mb-3'>\
                                                                        <input type='password' autofocus class='form-control' id='newInpPass' placeholder='*********'>\
                                                                        <span class='input-group-text bi bi-eye' id='btnPass1' style='cursor:pointer;' onclick='showPass(1)'>\
                                                                        </span>\
                                                                    </div>\
                                                                </div>\
                                                                <div class='mb-3'>\
                                                                    <label for='exampleInputPassword1' class='form-label'>Repetir nueva contraseña</label>\
                                                                    <div class='input-group mb-3'>\
                                                                        <input type='password' class='form-control' id='newRInpPass' placeholder='*********'>\
                                                                        <span class='input-group-text bi bi-eye' id='btnPass2' style='cursor:pointer;' onclick='showPass(2)'>\
                                                                        </span>\
                                                                    </div>\
                                                                </div>\
                                                                <button onclick='changePassword("+id+")' class='btn btn-primary '>\
                                                                <i class='bi bi-arrow-repeat'></i> Cambiar contraseña</button>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>";
}

/*Funciones de solicitud de datos a APIs */
function changePassword(id){
    var newPass = document.getElementById('newInpPass').value.trim();
    var rNePass = document.getElementById('newRInpPass').value.trim();
    
    if(newPass != '' && rNePass != ''){
        if (newPass == rNePass){
            loading(1);
            let _datos = {
                newPass: newPass,
                id: id
            }
            var res = fetch(urlBase+'changePass', {
                method: "POST",
                body: JSON.stringify(_datos),
                headers: {'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',}
            })
            .then(response => response.json()) 
            .then(function(json) {
                loading(2);
                Swal.fire('Por favor Inicie sesión con la nueva contraseña')
                varGlobal = 0;
                comprobarCookie();
            }
            )
            .catch(err => console.log(err));
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Las contraseñas deben de coincidir',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Por favor llene los campos',
            showConfirmButton: false,
            timer: 1500
        })
    }
}

async function apiMasterPost(_datos, urlCont){
    //sintaxis 
    //return await apiMasterPost(«Objeto con los datos a enviar», «Api a solicitar, sin /»)
    var res = fetch(urlBase+urlCont, {
        method: "POST",
        body: JSON.stringify(_datos),
        headers: {'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',}
    })
    .then(response => response.json()) 
    .then(function(json) {
        return json;
    })
    .catch(err => console.log(err));

    return res;
}

async function apiMasterGET(data, urlF){ //API "master" en GET a utilizar para todas las solicitaciones en get
    /*sintaxis 
        return await apiMasterGET(«Objeto con los datos a enviar», «Api a solicitar, sin /»)
        NOTA: Si la api GET a solicitar no se necesitan datos, crea un objeto vacio y envialo como la sintxis
        EJEMPLO de objeto vacio:
        let data = {
            id:''
        }
    */
    let url       = urlBase+urlF; //Anidamos la url a la API seleccionada
    const params  = new URLSearchParams(data);//Convertimos el objeto a parametros get
    const apiUrl  = url + '?' + params; //Los anidamos a la url ya creada
    const headers = new Headers();//Creamos los heades que se necesitan
    headers.append('Content-Type', 'application/json');
    const options = {//Las carcateristicas que tendrán los heaaders
        method: 'GET',//Metodo a utilizar
        mode: 'cors',//Permitimos los cors
        headers: headers,
    };
    var solPeticion = [];//Variable donde guardaremos el json que nos responda
    solPeticion = await fetch(apiUrl, options)//Hacemos la peticion con la funcion fetch
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        //Regresamos a la variable solPeticion el son que nos regresó
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    //console.log(solPeticion);
    return solPeticion;
}

async function apiActualizarPedido(reqDatos){
    let _datos = {
        area    : reqDatos.area,
        numOrder: reqDatos.numOrder,
        idUser  : reqDatos.idUser,
        idOrder : reqDatos.idOrder
    }
    let res = await apiMasterPost(_datos, 'actualizarPedido');
    return res;
}

async function apiActuaHistorial(reqDatos){
    let _datos = {
        status       : reqDatos.status,
        area         : reqDatos.area,
        orderId      : reqDatos.orderId,
        idUser       : reqDatos.idUser,
        canceled     : reqDatos.canceled,
        acepted      : reqDatos.acepted,
        changeStatus : reqDatos.acepted,
        msg          : reqDatos.msg,
    }
    let resActu = await apiActualizarPedido(_datos);
    if(resActu[0].status == 200){
        var res2 = fetch(urlBase+'avanzaPed', {
            method: "POST",
            body: JSON.stringify(_datos),
            headers: {'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',}
        })
        .then(response => response.json()) 
        .then(function(json) {
            return json;
        })
        .catch(err => console.log(err));
    }else{
        loading(2);
        alert("Ocurrió un error al asignar")
    }

    return res2;
}

async function recargar(){
    //console.log(userIdGlobal);
    let datos = { id: userIdGlobal }
    let jUserHome = await apiMasterGET(datos, 'perfil');
    //console.log(jUserHome);
    if(jUserHome != null){
        home();
    }
}

let jArea;
let jUsuarios;
let userIdGlobal;

let incrementoR = 0;
let jEncode;

let cargaTodo = 0;
async function inicio(){
    let jUsuario = jUsuarioGlobal;

    var sVentanaNav = `<nav class="navbar bg-body-tertiary border-bottom" id="topNav"> <!--Inicio del nav-->
                        <div class="container-fluid">
                            <a class="navbar-brand ms-4" id="idLogo" href="`+URLactual+`">
                                <img src="./img/logo_web.45818d48.png" alt="PFG" width="160" height="70">
                            </a>
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" onclick="noRecMenu(0)"><i class="bi bi-123"></i> Pedidos</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="home-tab"  type="button" role="tab" onclick="pestanaNva(1)"><i class="bi bi-card-checklist"></i> Lista</button>
                                </li>`;
    arGlobal = jUsuario.user_rol_id;
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2){//Para mostrar el boton para actualizar lista, solo aparecen para sistemas y administrador
        
        sVentanaNav = sVentanaNav + ` <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="btnTodosP" type="button" role="tab" onclick="pestanaNva(2)" >Actualizar lista</button>
                                </li>`
    }
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 6){//Botones para ver usuarios, solo lo ven admin, sistemas y administrativos
        
        sVentanaNav = sVentanaNav + ` <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#permisos-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onclick="noRecMenu(100)">Permisos</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false" onclick="noRecMenu(100)">Roles</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#users-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" onclick="noRecMenu(100)">Usuarios</button>
                                </li>`;
    }
    sVentanaNav = sVentanaNav + `</ul>
                            <div class="d-flex" role="search">
                                <div class="btn-group dropstart">
                                    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-person-circle"></i>  `+jUsuario.name+`
                                    </button>
                                    <ul class="dropdown-menu" id="dropPerfil">
                                        <li><a class="dropdown-item" data-bs-target="#modalTotal" data-bs-toggle="modal" onclick='modalView(`+jUsuario.id+`,0, 4)'> <i class="bi bi-person-bounding-box mr-2"></i> Perfil</a></li>
                                        <li><a class="dropdown-item" onclick="recPag()"><i class="bi bi-box-arrow-left"></i> Cerrar sesion</a></li>
                                        <li><a class="dropdown-item" onclick='infoVers(`+jUsuario.id+`, "`+jUsuario.version+`")'><i class="bi bi-git"></i> <span id="versionT">v `+jUsuario.version+`</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav><!--Fin del nav-->`;
    document.getElementById('navIni').innerHTML = sVentanaNav;
    await home()
}

async function infoVers(id, oldVersion){
    let datos = {oldVersion : oldVersion};
    let jResVer = await apiMasterGET(datos, 'solInfoVersion');
    Swal.fire({
        title   : '<strong><i class="bi bi-git"></i> <u>'+jResVer[0].nVers+'</u></strong>',
        icon    : 'info',
        html    : '<p class="text-break text-justify">'+jResVer[0].details+'</p>',
        showCloseButton   : true,
        showCancelButton  : true,
        focusConfirm      : false,
        confirmButtonText : 'Buscar actualización',
        cancelButtonText  : 'Cancelar'
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let resVer = await apiMasterGET(datos, 'solVersion');
            let resComp = compVers(resVer[0].version, jResVer[0].nVers);
            if(resComp > 0){
                //console.log('El usuario aceptó la alerta');
                let datosActVer = {
                    id      : id,
                    version : resVer[0].version
                }
                let resActVer = await apiMasterGET(datosActVer, 'actVer');
                Swal.fire({
                    icon: 'success',
                    title: 'Se actualizó a la versión '+datos.version,
                    text: "Será necesario iniciar sesión",
                    showConfirmButton: false,
                    timer: 3500
                }).then(function() {
                    recPag();
                });
            }else{
                Swal.fire('Ya tienes la versión actualizada', '', 'info');
            }
        }
    })
}

async function home(){
    let jUsuario = jUsuarioGlobal;
    let jPedidos;
    let datosPed = { id : jUsuario.id };
    let datosSinD = {id:''};
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 6){
        jPedidos        = await apiMasterGET(datosSinD, 'solTodPed');
        jPedidosGlobal = jPedidos;
    }else{
        jPedidos        = await apiMasterGET(datosPed, 'solPedidos');
    }
    let dataArea = { area: jUsuario.user_rol_id };
    let GlojArea        = await apiMasterGET(datosSinD, 'area');
    let GlojUsuarios    = await apiMasterGET(datosSinD, 'usuarios');
    let jAceptados      = await apiMasterGET(datosPed, 'solAceptados');
    let jAceptar        = await apiMasterGET(dataArea, 'solAceptar');
    let fechaActual     = new Date();
    
    //console.log(jAceptar);
    jArea               = GlojArea;
    jUsuarios           = GlojUsuarios;
    //console.log(jUsuarios.length);
    let contadorObjetos = 0;
    userIdGlobal        = jUsuario.id;

    const jsonString = JSON.stringify(jUsuario);
    jEncode = btoa(jsonString);
    //console.log(jEncode);

    Object.keys(jPedidos).forEach((clave) => {
        if (typeof jPedidos[clave] === "object") {
            contadorObjetos++;
        }
    });
    let contUsuarios = 0;

    Object.keys(jUsuarios).forEach((clave) => {
        if (typeof jUsuarios[clave] === "object") {
            contUsuarios++;
        }
    });

    let contArea = 0;

    Object.keys(jArea).forEach((clave) => {
        if (typeof jArea[clave] === "object") {
            contArea++;
        }
    });
    let contAceptados = 0;

    Object.keys(jAceptados).forEach((clave) => {
        if (typeof jAceptados[clave] === "object") {
            contAceptados++;
        }
    });

    let contAceptar = 0;

    Object.keys(jAceptar).forEach((clave) => {
        if (typeof jAceptar[clave] === "object") {
            contAceptar++;
        }
    });
    usuIdGlobal = jUsuario.id;
    //console.log("usuIdGlobal",usuIdGlobal," jUsuario.id ",jUsuario.id);
    document.getElementById('app').innerHTML = '';
    var sVentana = '';
    sVentana = sVentana +`
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">`;
    if(jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 6){
        sVentana = sVentana +`
                            <div class="floating-container">
                                <div class="floating-button"><i class="bi bi-bar-chart-line"></i></div>
                                <div class="element-container">
                                    <a style="cursor: pointer;" onclick="viewGrafica(0)" id="grafGeneral" data-bs-toggle="modal" data-bs-target="#modalTotal"> 
                                        <span class="float-element tooltip-left">
                                            <i class="bi bi-clipboard2-data"></i>
                                        </span>
                                    </a>
                                    <span class="float-element" style="cursor: pointer;" onclick="viewGrafica(1)" id="grafGeneral" data-bs-toggle="modal" data-bs-target="#modalTotal">
                                        <i class="bi bi-buildings-fill"></i>
                                    </span>
                                    <span class="float-element" style="cursor: pointer;" onclick="viewGrafica(2)" id="grafGeneral" data-bs-toggle="modal" data-bs-target="#modalTotal">
                                        <i class="bi bi-clipboard2-pulse"></i>
                                    </span>
                                </div>
                            </div> `;
    }
    sVentana = sVentana +`<!--Inicio del menu de los pedidos-->
                            <ul class="nav nav-pills mt-4 mb-3 justify-content-center" id="pills-tab" role="tablist">`
    if(jUsuario.user_rol_id == 3 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 6){
        sVentana = sVentana +`  <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="pills-Todos-tab" data-bs-toggle="pill" data-bs-target="#pills-Todos" type="button" role="tab" aria-controls="pills-Todos" aria-selected="true"><i class="bi bi-list-nested"></i> Todos</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-activos-tab" data-bs-toggle="pill" data-bs-target="#pills-activos" type="button" role="tab" aria-controls="pills-activos" aria-selected="false"><i class="bi bi-stopwatch"></i> Activos</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-parciales-tab" data-bs-toggle="pill" data-bs-target="#pills-parciales" type="button" role="tab" aria-controls="pills-parciales" aria-selected="false"><i class="bi bi-slash-circle"></i> Parciales</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-finalizados-tab" data-bs-toggle="pill" data-bs-target="#pills-finalizados" type="button" role="tab" aria-controls="pills-finalizados" aria-selected="false"><i class="bi bi-emoji-smile"></i> Finalizados</button>
                                </li>`
    }
    if(jUsuario.user_rol_id != 3 && jUsuario.user_rol_id != 2 && jUsuario.user_rol_id != 0 && jUsuario.user_rol_id != 6){
        sVentana = sVentana +`  <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="pills-aceptados-tab" data-bs-toggle="pill" data-bs-target="#pills-aceptados" type="button" role="tab" aria-controls="pills-aceptados" aria-selected="false"><i class="bi bi-check2-circle"></i> Aceptados</button>
                                </li>`;
    }else{
        sVentana = sVentana +`  <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-aceptados-tab" data-bs-toggle="pill" data-bs-target="#pills-aceptados" type="button" role="tab" aria-controls="pills-aceptados" aria-selected="false"><i class="bi bi-check2-circle"></i> Aceptados</button>
                                </li>`;
    }

    if(jAceptar > 0 ){
        sVentana = sVentana + ` <li class="nav-item" role="presentation" >
                                    <button class="nav-link" style="background: red" id="pills-aceptar-tab" data-bs-toggle="pill" data-bs-target="#pills-aceptar" type="button" role="tab" aria-controls="pills-aceptar" aria-selected="false"><i class="bi bi-bell"></i> Por aceptar</button>
                                </li>`;   
    }else{
        sVentana = sVentana + ` <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-aceptar-tab" data-bs-toggle="pill" data-bs-target="#pills-aceptar" type="button" role="tab" aria-controls="pills-aceptar" aria-selected="false"><i class="bi bi-bell"></i> Por aceptar</button>
                                </li>`;  
    }
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 3){
        sVentana = sVentana + `<li class="nav-item" role="presentation">
                                    <button class="nav-link" id="btnModanNuevoP" data-bs-toggle="modal" data-bs-target="#modalTotal" type="button" role="tab" aria-controls="pills-aceptar" aria-selected="false" onclick='modalView(0,0, 3)'><i class="bi bi-plus-circle"></i> Nuevo Pedido</button>
                                </li>`;
    }
    sVentana = sVentana + `     <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="btnModanNuevoP" type="button" role="tab" aria-controls="pills-aceptar" aria-selected="false" onclick='recargar()'><i class="bi bi-arrow-clockwise"></i> Actualizar</button>
                                </li>
                            </ul>
                            <!--Fin del menu de los pedidos-->
                            
                            <!--Inicio de tablas-->
                                <div class="container-xxl">
                                    
                                    <div class="tab-content" id="pills-tabContent">`
    if(jUsuario.user_rol_id == 3 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 6){
        sVentana = sVentana + `
                                        <!--Inicio de tabla de Todos-->
                                        <div class="tab-pane fade show active" id="pills-Todos" role="tabpanel" aria-labelledby="pills-Todos-tab" tabindex="0">
                                                                                
                                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <div class="input-group align-items-end mb-3" style="width: 30%;">
                                                    <span class="input-group-text" id="basic-search" style="background: rgba(182, 141, 44, 0.7);"><i class="bi bi-search"></i></span>
                                                    <input type="text" id="searchTerm" class="form-control" onkeyup="doSearch(1)" min=0 placeholder="Buscar pedido" aria-label="Username" aria-describedby="basic-addon1" maxlength="9">
                                                </div>
                                            </div>
                                            
                                            <table class="table table-hover border" id="tablaTodosT">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">N° pedido</th>
                                                        <th scope="col">Estatus</th>
                                                        <th scope="col">Fecha de creación</th>
                                                        <th scope="col">Área envío</th>
                                                        <th scope="col">Responsable</th>
                                                        <th scope="col">Área</th>
                                                        <th scope="col">Tiempo</th>`;
        if(jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 0){
            sVentana = sVentana + `                     <th scope="col">Funciones</th>`;
        }
        sVentana = sVentana + `                     </tr>
                                                </thead>
                                                <tbody class="table-group-divider" id="tablaTodos">`;

        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            let diferenciaMs;
            let dias;
            let horas;
            let minutos;
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].updated_at != null) diferenciaMs = fechaActual - new Date(jPedidos[i].updated_at);
                else diferenciaMs = fechaActual - new Date(jPedidos[i].startdate);
                //console.log("diferenciaMs ",diferenciaMs);
                dias    = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
                horas   = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
                //console.log("dias ", dias," horas ", horas, " minutos ",minutos);
                for(j = 0; j < contUsuarios; j++){
                    if(jUsuarios[j].id == jPedidos[i].user_id){ responsable = jUsuarios[j].name;}
                }
                for(k = 0; k < contArea; k++){
                    if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                }
                sVentana = sVentana + `         <tr>
                                                    <th scope="row">`+jPedidos[i].company+` `+jPedidos[i].ordernumber+`</th>
                                                    <td `;
                if(jPedidos[i].status == "Finalizado"){
                    sVentana = sVentana + `               style="background: rgba(32, 211, 59 , 0.4);"`;
                }else if(jPedidos[i].status == "Parcial"){
                    sVentana = sVentana + `               style="background: rgba(232, 165, 30 , 0.4);"`;
                }else if(jPedidos[i].status == "Cancelado"){
                    sVentana = sVentana + `               style="background: rgba(232, 30, 30 , 0.4);"`;
                };
                sVentana = sVentana + `                  >`+jPedidos[i].status+`</td>
                                                    <td><button type="button" class="btn btn-outline-primary" style="width: 100px;" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                    <td>`+jPedidos[i].cd_area+`</td>
                                                    <td>`+responsable+`</td>
                                                    <td>`+area+`</td>
                                                    <td `;
                if(jPedidos[i].status != "Cancelado" && jPedidos[i].status != "Finalizado"){
                    if(dias >= 1){//Valides de horas del pedido
                        sVentana = sVentana + `             style="background: rgba(245, 0, 0, 0.8); font-weight: bold;"`;
                    }else if(horas >= 2 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 130, 0, 0.8);"`;
                    }else if(horas == 1 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 197, 0, 0.8);"`;
                    }
                    sVentana = sVentana + `             >±`+dias+` d `+horas+`h `+minutos+` m</td>`;
                }else{
                    sVentana = sVentana + `             > `+jPedidos[i].status+`</td>`;
                }
                
                //if(jPedidos[i].status == "Finalizado")
                if(jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 0){//Funciones de administrador y sistemas para todo lo de los pedidos 
                    sVentana = sVentana + `         <td>`;
                    if(jPedidos[i].status != "Finalizado" && jPedidos[i].status != "Cancelado"){ //Si es diferente a Finalizado y Cancelado aparecerán estas opciones
                        sVentana = sVentana +`          <button type="button" class="btn btn-info" onclick='editarPedView(`+i+`, `+jUsuario.id+`)'>
                                                            <i class="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 5)'>
                                                            <i class="bi bi-arrow-left-right"></i>
                                                        </button>`;
                        if(jPedidos[i].status != 'Parcial'){
                            sVentana = sVentana +`      <button type="button" class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='parcialView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`,`+jPedidos[i].area_id+`,`+jUsuario.id+`)'>
                                                            <i class="bi bi-columns-gap"></i>
                                                        </button>`;
                        }
                        
                        sVentana = sVentana +`          <button type="button" class="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='finalizarView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`,`+jUsuario.id+`)'>
                                                            <i class="bi bi-inbox"></i>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='cancelarView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`,`+jUsuario.id+`)'>
                                                            <i class="bi bi-x-octagon"></i>
                                                        </button>`;
                    }
                    
                    sVentana = sVentana +`              <button type="button" class="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='eliminarView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`)'>
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </td>`;
                }
                sVentana = sVentana + `
                                                </tr>`
            }
        }
        
        
        sVentana = sVentana + `</tbody>
                                    </table>
                                </div>
                                <!--Fin de tabla de Todos-->
                                <!--Inicio de tabla de Activos-->
                                <div class="tab-pane fade" id="pills-activos" role="tabpanel" aria-labelledby="pills-activos-tab" tabindex="0">
                                    <table class="table table-hover border border-success">
                                        <thead>
                                            <tr>
                                                <th scope="col">N° pedido</th>
                                                <th scope="col">Estatus</th>
                                                <th scope="col">Fecha de creación</th>
                                                <th scope="col">Área envío</th>
                                                <th scope="col">Responsable</th>
                                                <th scope="col">Área</th>
                                                <th scope="col">Tiempo</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody class="table-group-divider" id="tablaActivos><tr><th scope="row"></th></tr>`
        
        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].status == 'Activo'){
                    if(jPedidos[i].updated_at != null) diferenciaMs = fechaActual - new Date(jPedidos[i].updated_at);
                    else diferenciaMs = fechaActual - new Date(jPedidos[i].startdate);
                    //console.log("diferenciaMs ",diferenciaMs);
                    dias    = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
                    horas   = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jPedidos[i].company+` `+jPedidos[i].ordernumber+`</th>
                                                        <td>`+jPedidos[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+jPedidos[i].cd_area+`</td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td `;
                    if(dias >= 1){//Valides de horas del pedido
                        sVentana = sVentana + `             style="background: rgba(245, 0, 0, 0.8); font-weight: bold;"`;
                    }else if(horas >= 2 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 130, 0, 0.8);"`;
                    }else if(horas == 1 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 197, 0, 0.8);"`;
                    }
                    sVentana = sVentana + `             >±`+dias+` d `+horas+`h `+minutos+` m</td>
                                                    </tr>`;
                }
            }
        }

        sVentana = sVentana + `</tbody>
                                                    </table>
                                                </div>
                                                <!--Fin de tabla de Activos-->
                                                <!-- Inicio de la tabla Parciales-->
                                                <div class="tab-pane fade" id="pills-parciales" role="tabpanel" aria-labelledby="pills-parciales-tab" tabindex="0">
                                                    <table class="table table-hover border border-warning">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">N° pedido</th>
                                                                <th scope="col">Estatus</th>
                                                                <th scope="col">Fecha de creación</th>
                                                                <th scope="col">Área envío</th>
                                                                <th scope="col">Responsable</th>
                                                                <th scope="col">Área</th>
                                                                <th scope="col">Tiempo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="table-group-divider" id="tablaParciales">`
        
        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].status == 'Parcial'){
                    if(jPedidos[i].updated_at != null) diferenciaMs = fechaActual - new Date(jPedidos[i].updated_at);
                    else diferenciaMs = fechaActual - new Date(jPedidos[i].startdate);
                    //console.log("diferenciaMs ",diferenciaMs);
                    dias    = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
                    horas   = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `         <tr>
                                                        <th scope="row">`+jPedidos[i].company+` `+jPedidos[i].ordernumber+`</th>
                                                        <td>`+jPedidos[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+jPedidos[i].cd_area+`</td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td `;
                    if(dias >= 1){//Valides de horas del pedido
                        sVentana = sVentana + `             style="background: rgba(245, 0, 0, 0.8); font-weight: bold;"`;
                    }else if(horas >= 2 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 130, 0, 0.8);"`;
                    }else if(horas == 1 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 197, 0, 0.8);"`;
                    }
                    sVentana = sVentana + `             >±`+dias+` d `+horas+`h `+minutos+` m</td>
                                                    </tr>`;
                }
            }
        }
 
        sVentana = sVentana + `</tbody>
                                                    </table>
                                                </div>
                                                <!-- Fin de la tabla Parciales-->
                                                <!-- Inicio de la tabla Finalizados-->
                                                <div class="tab-pane fade" id="pills-finalizados" role="tabpanel" aria-labelledby="pills-finalizados-tab" tabindex="0">
                                                    <table class="table table-hover border border-danger">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">N° pedido</th>
                                                                <th scope="col">Estatus</th>
                                                                <th scope="col">Fecha de creación</th>
                                                                <th scope="col">Área envío</th>
                                                                <th scope="col">Responsable</th>
                                                                <th scope="col">Área</th>
                                                                <th scope="col">Tiempo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="table-group-divider" id="tablaFinalizado">`

        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].status == 'Finalizado'){
                    if(jPedidos[i].updated_at != null) diferenciaMs = fechaActual - new Date(jPedidos[i].updated_at);
                    else diferenciaMs = fechaActual - new Date(jPedidos[i].startdate);
                    //console.log("diferenciaMs ",diferenciaMs);
                    dias    = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
                    horas   = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + ` <tr>
                                                <th scope="row">`+jPedidos[i].company+` `+jPedidos[i].ordernumber+`</th>
                                                <td>`+jPedidos[i].status+`</td>
                                                <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                <td>`+jPedidos[i].cd_area+`</td>
                                                <td>`+responsable+`</td>
                                                <td>`+area+`</td>
                                                <td> `+jPedidos[i].status+`
                                                </td>
                                            </tr>`;
                }
            }
        }

        sVentana = sVentana + `</tbody>
                                                    </table>
                                                </div>
                                                <!-- Fin de la tabla Finalizados-->`
    }
    if(jUsuario.user_rol_id != 3 && jUsuario.user_rol_id != 2 && jUsuario.user_rol_id != 0){
                 sVentana = sVentana + `
                                            <!-- Inicio de la tabla Aceptados-->
                                            <div class="tab-pane fade show active" id="pills-aceptados" role="tabpanel" aria-labelledby="pills-aceptados-tab" tabindex="0">`;
    }else{
        sVentana = sVentana + `
                                            <!-- Inicio de la tabla Aceptados-->
                                            <div class="tab-pane fade" id="pills-aceptados" role="tabpanel" aria-labelledby="pills-aceptados-tab" tabindex="0">`
    }
        sVentana = sVentana + `             
                                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <div class="input-group align-items-end mb-3" style="width: 30%;">
                                                    <span class="input-group-text" id="basic-search" style="background: rgba(182, 141, 44, 0.7);"><i class="bi bi-search"></i></span>
                                                    <input type="text" id="searchAceptados" class="form-control" onkeyup="doSearch(3)" min=0 placeholder="Buscar pedido" aria-label="Username" aria-describedby="basic-addon1" maxlength="9">
                                                </div>
                                            </div>
                                            <table class="table table-hover border border-info" id="tablaAceptado">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">N° pedido</th>
                                                            <th scope="col">Estatus</th>
                                                            <th scope="col">Fecha de creación</th>
                                                            <th scope="col">Área envío</th>
                                                            <th scope="col">Responsable</th>
                                                            <th scope="col">Área</th>
                                                            <th scope="col">Tiempo</th>
                                                            <th scope="col">Funciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="table-group-divider" id="tablaAceptado">`;
    if(contAceptados > 0){
        let responsable = '';
        let area = '';
        for(i=0; i < contAceptados; i++){
            if(jAceptados[i].user_id == jUsuario.id && jAceptados[i].acepted == 1){
                if(jAceptados[i].acepted == 1){
                    if(jAceptados[i].updated_at != null) diferenciaMs = fechaActual - new Date(jAceptados[i].updated_at);
                    else diferenciaMs = fechaActual - new Date(jAceptados[i].startdate);
                    //console.log("diferenciaMs ",diferenciaMs);
                    dias    = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
                    horas   = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jAceptados[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; j < contArea; k++){
                        if(jArea[k].id == jAceptados[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jAceptados[i].company+` `+jAceptados[i].ordernumber+`</th>
                                                        <td>`+jAceptados[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`, 1)'>`+new Date(jAceptados[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+jAceptados[i].cd_area+`</td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td `;
                    if(dias >= 1){//Valides de horas del pedido
                        sVentana = sVentana + `             style="background: rgba(245, 0, 0, 0.8); font-weight: bold;"`;
                    }else if(horas >= 2 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 130, 0, 0.8);"`;
                    }else if(horas == 1 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 197, 0, 0.8);"`;
                    }
                    sVentana = sVentana + `             >±`+dias+` d `+horas+`h `+minutos+` m</td>;
                                                        <td>
                                                            <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`, 5)'>
                                                                <i class="bi bi-arrow-left-right"></i>
                                                            </button>`;
                    if(jUsuario.user_rol_id == 5){
                        if(jAceptados[i].status != 'Parcial'){
                            sVentana = sVentana +`
                                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='parcialView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`,`+jAceptados[i].area_id+`,`+jUsuario.id+`)'>
                                                                <i class="bi bi-columns-gap"></i>
                                                            </button>
                                                            `;
                        }
                        sVentana = sVentana +`              
                                                            <button type="button" class="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='finalizarView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`,`+jUsuario.id+`)'>
                                                                <i class="bi bi-inbox"></i>
                                                            </button>`;
                        
                        sVentana = sVentana +`
                                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='cancelarView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`,`+jUsuario.id+`)'>
                                                                <i class="bi bi-x-octagon"></i>
                                                            </button>`;
                    }                                      
                    if(jUsuario.user_rol_id == 7){
                        if(jAceptados[i].status != 'Parcial'){
                            sVentana = sVentana +`          <button type="button" class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='parcialView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`,`+jAceptados[i].area_id+`,`+jUsuario.id+`)'>
                                                                <i class="bi bi-columns-gap"></i>
                                                            </button>`;
                        }
                        if(jAceptados[i].status != 'Finalizado'){
                            sVentana = sVentana +`          <button type="button" class="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Parcial" onclick='parcialView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`,`+jAceptados[i].area_id+`,`+jUsuario.id+`)'>
                                                                <i class="bi bi-inbox"></i>
                                                            </button>`;
                        }
                    }
                    sVentana = sVentana +`
                                                        </td>
                                                    </tr>`
                }
            }
        }
    }

    sVentana = sVentana + `</tbody>
                                                    </table>
                                                </div>
                                                <!-- Fin de la tabla Aceptados-->
                                                <!-- Inicio de la tabla por Aceptar-->
                                                <div class="tab-pane fade" id="pills-aceptar" role="tabpanel" aria-labelledby="pills-aceptar-tab" tabindex="0">
                                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                                        <div class="input-group align-items-end mb-3" style="width: 30%;">
                                                            <span class="input-group-text" id="basic-search" style="background: rgba(182, 141, 44, 0.7);"><i class="bi bi-search"></i></span>
                                                            <input type="text" id="searchPorAceptar" class="form-control" onkeyup="doSearch(2)" min=0 placeholder="Buscar pedido" aria-label="Username" aria-describedby="basic-addon1" maxlength="9">
                                                        </div>
                                                    </div>
                                                    <table class="table table-hover border border-black" id="tablaAceptar">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">N° pedido</th>
                                                                <th scope="col">Estatus</th>
                                                                <th scope="col">Fecha de creación</th>
                                                                <th scope="col">Área envío</th>
                                                                <th scope="col">Responsable</th>
                                                                <th scope="col">Área</th>
                                                                <th scope="col">Tiempo</th>
                                                                <th scope="col">Funciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="table-group-divider" >`;

    if(contAceptar > 0){
        let responsable = '';
        let area = '';
        //console.log(jAceptar);
        for(i=0; i < contAceptar; i++){
            if(jAceptar[i].area_id == jUsuario.user_rol_id && jAceptar[i].acepted == 0){
                if(jAceptar[i].acepted == 0){
                    if(jAceptar[i].updated_at != null) diferenciaMs = fechaActual - new Date(jAceptar[i].updated_at);
                    else diferenciaMs = fechaActual - new Date(jAceptar[i].startdate);
                    //console.log("diferenciaMs ",diferenciaMs);
                    dias    = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
                    horas   = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jAceptar[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jAceptar[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jAceptar[i].company+` `+jAceptar[i].ordernumber+`</th>
                                                        <td>`+jAceptar[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptar[i].id+`,`+jAceptar[i].ordernumber+`, 1)'>`+new Date(jAceptar[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+jAceptar[i].cd_area+`</td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td `;
                    if(dias >= 1){//Valides de horas del pedido
                        sVentana = sVentana + `             style="background: rgba(245, 0, 0, 0.8); font-weight: bold;"`;
                    }else if(horas >= 2 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 130, 0, 0.8);"`;
                    }else if(horas == 1 && dias == 0){
                        sVentana = sVentana + `             style="background: rgba(245, 197, 0, 0.8);"`;
                    }
                    sVentana = sVentana + `             >±`+dias+` d `+horas+`h `+minutos+` m</td>
                                                        <td>
                                                            <button type="button" class="btn btn-outline-primary" onclick='aceptar(`+jAceptar[i].id+`,`+jAceptar[i].ordernumber+`,`+jUsuario.id+`) '>
                                                                <i class="bi bi-check-lg"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptar[i].id+`,`+jAceptar[i].ordernumber+`, 2,`+jUsuario.id+`)'>
                                                                <i class="bi bi-x-lg"></i>
                                                            </button>
                                                        </td>
                                                    </tr>`
                }
            }
        }
    }

    sVentana = sVentana + `</tbody>
                                        </table>
                                    </div>
                        </div>
                    </div>
                    </div>
                        <div class="tab-pane fade" id="users-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                            <div class="container-xxl mt-3" >
                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <div class="input-group align-items-end mb-3" style="width: 30%;">
                                        <span class="input-group-text" id="basic-search" style="background: rgba(182, 141, 44, 0.7);"><i class="bi bi-search"></i></span>
                                        <input type="text" id="searchUser" class="form-control border border-primary" onkeyup="doSearch(4)" placeholder="Buscar usuario">
                                    </div>
                                </div>
                                <table class="table table-hover border border-primary" id="tablaUserT">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="border-end border-primary">#</th>
                                            <th scope="col" class="border-end border-primary">Nombre</th>
                                            <th scope="col" class="border-end border-primary">Correo</th>
                                            <th scope="col" class="border-end border-primary">Area</th>
                                            <th scope="col">Funciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
    for(i = 0; i < jUsuarios.length; i++){
        for(k = 0; k < contArea; k++){
            if(jArea[k].id == jUsuarios[i].user_rol_id) area = jArea[k].name;
        }
        sVentana = sVentana +`
                                        <tr>
                                            <td scope="row">`+(i+1)+`</th>
                                            <td>`+jUsuarios[i].name+`</td>
                                            <td>`+jUsuarios[i].email+`</td>
                                            <td>`+area+`</td>
                                            <td>
                                                <button type="button" class="btn btn-primary me-2" onclick="optionUser(0, `+i+`, '`+jUsuarios[i].name+`')"><i class="bi bi-arrow-clockwise"></i></button>`;
        if(jUsuarios[i].user_rol_id != 0){
            sVentana = sVentana +           `
                                                <button type="button" class="btn btn-info me-2" onclick="viewEditUser(`+i+`)" data-bs-toggle="modal" data-bs-target="#modalTotal"><i class="bi bi-pencil-square"></i></button>
                                                <button type="button" class="btn btn-danger" onclick="optionUser(1, `+i+`, '`+jUsuarios[i].name+`')"><i class="bi bi-trash3"></i></button>`;
        }else{
            if(jUsuario.user_rol_id == 0){
                sVentana = sVentana +           `
                                                <button type="button" class="btn btn-info me-2" onclick="viewEditUser(`+i+`)" data-bs-toggle="modal" data-bs-target="#modalTotal"><i class="bi bi-pencil-square"></i></button>
                                                <button type="button" class="btn btn-danger" onclick="optionUser(1, `+i+`, '`+jUsuarios[i].name+`')"><i class="bi bi-trash3"></i></button>`;
            }else sVentana = sVentana + `Los Admin no se pueden editar`
        }
        sVentana = sVentana +           `   </td>
                                        </tr>`;
    }
    
    sVentana = sVentana +`
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <!--/div> Este es un ejemplo de donde van el tap del menu principal, debe de ir hasta el final de acá
                        <div class="tab-pane fade" id="users-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                            <div class="container-xxl" >
                                
                            </div>
                        </div>
                    </div-->
                    <div class="container-xl mb-2">
                        <div class="text-end">
                            <span id="versionB" style="font-weight: bold; cursor: pointer" onclick="recPag()">v `+jUsuario.version+`</span></a>
                        </div>
                    </div>`;
    document.getElementById('app').innerHTML = sVentana;
    let datosVer = {
        id : ''
    };
    let resVer = await apiMasterGET(datosVer, 'solVersion');
    if(resVer[0].version != jUsuario.version){
        noRecMenu(100);
        Swal.fire({
            title: 'Actualizar a versión '+resVer[0].version,
            text: 'Actualmente tienes la version '+jUsuario.version+'',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            backdrop: 'static', // Evitar cierre dando clic afuera
            allowOutsideClick: false, // Deshabilitar cierre dando clic afuera
            allowEscapeKey: false, // Deshabilitar cierre con tecla "Esc"
        }).then(async (result) => {
            // Aquí puedes agregar cualquier acción después de que el usuario acepte la alerta
            console.log('El usuario aceptó la alerta');
            let datosActVer = {
                id      : jUsuario.id,
                version : resVer[0].version
            }
            let resActVer = await apiMasterGET(datosActVer, 'actVer');

            noRecMenu(0);
            recPag();
        });
    }
    if(cargaTodo == 0){
        cargaTodo = 1;
        let resul = recargarTodo(jUsuario.user_rol_id);
    }
    
    loading(2);
    return 1;
}

function recPag(){
    location.reload();
}

let iNoRecMenu = 0;
function noRecMenu(opc){
    iNoRecMenu = opc;
}

async function optionUser(opc, i, name){
    msgTitle = ['¿Desea restablecer la contraseña de <strong>'+name+'</strong>?', '¿Desea eliminar al usuario <strong>'+name+'</strong>?'];
    msgTitle2= ['La contraseña se restableció a <strong>pfg2023</strong>', 'El usuario a sido eliminado']
    mstText  = ["Se restablecerá a la contraseña inicial", "Si se elimina no se podrá recuperar"];
    msgBtn   = ['Si, restablecerla', 'Si, eliminarlo'];
    Swal.fire({
        title: msgTitle[opc],
        text: mstText[opc],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: msgBtn[opc]
    }).then(async (result) => {
        if (result.isConfirmed) {
            let datos = {
                id : jUsuarios[i].id
            }
            let res;
            if(opc == 0) res = await apiMasterPost(datos, 'resetPassUser');
            else res = await apiMasterPost(datos, 'deleteUser');
            if(res.status == 200){
                Swal.fire({
                    icon: 'success',
                    title: msgTitle2[opc],
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    })
}

async function viewGrafica(opc){
    let sModalVentana = '';
    var fechaActual = new Date();
    let hoy = fechaActual.getFullYear()+"-"+(fechaActual.getMonth() + 1).toString().padStart(2, "0")+"-"+fechaActual.getDate().toString().padStart(2, "0");
    tamanomodal(0);
    sModalVentana = sModalVentana + `
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Mostrar gráficas generales</strong></h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrarModal"></button>
                                    </div>
                                    <div class="modal-body" id="modal-body-chart">
                                        
                                            <div class="border-bottom">
                                                <label for="start">De: </label>

                                                <input type="date" class="mb-2" id="startDate" name="trip-start"
                                                    value="`+hoy+`"
                                                    min="2023-01-01" max="`+hoy+`">

                                                <label for="start"> a:</label>

                                                <input type="date" id="finishDate" name="trip-start"
                                                    value="`+hoy+`"
                                                    min="2023-01-01" max="`+hoy+`">`;
    if(opc == 0){
        sModalVentana = sModalVentana + `
                                                <div class="form-check form-check-inline ms-2">
                                                    <input class="form-check-input" type="radio" name="rAceptados" id="rAceptados1" value="1" checked>
                                                    <label class="form-check-label" for="rAceptados1">Aceptados</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="rAceptados" id="rAceptados2" value="0">
                                                    <label class="form-check-label" for="rAceptados2">Sin aceptar</label>
                                                </div>`;
    }
    if(opc ==  1){
        sModalVentana = sModalVentana + `
                                                <select class="form-select border border-black" style="width: 200px; display: inline" id="seAreaChart">
                                                    <option selected value="1000">Seleccione una área</option>`;
        for(i = 0; i < (jArea.length-2); i++){
            sModalVentana = sModalVentana + `        <option value="`+jArea[i].id+`">`+jArea[i].name+`</option>`;
        }
        sModalVentana = sModalVentana + `        </select>`;
    }
    if(opc == 2){
        sModalVentana = sModalVentana + `
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="rEmpresaM" id="rEmpresaM1" value="P" checked>
            <label class="form-check-label" for="rEmpresaM1">Proveedor</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="rEmpresaM" id="rEmpresaM2" value="M">
            <label class="form-check-label" for="rEmpresaM2">María Raquel</label>
        </div>`;
    }
    sModalVentana = sModalVentana + `            <button type="button" class="btn btn-primary mb-2" onclick="genGraf(`+opc+`)"><i class="bi bi-pie-chart"></i> Generar gráfica</button>
                                            </div>
                                            <div class="row g-0">
                                                <div class="col-sm-6 col-md-8" style="width:600px; height: 600px;" id="divgrafGeneral"></div>
                                                <div class="col-6 col-md-4 overflow-auto" id="divInfGeneral" data-bs-spy="scroll " data-bs-smooth-scroll="true"></div>
                                            </div>
                                        
                                    </div>
                                    <div class="modal-footer" id="modal-footer-chart">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    </div>`;
    document.getElementById('modalInfo').innerHTML = sModalVentana;
    //document.querySelector('#cerrarModal').click();
}
let resChart;
async function genGraf(opc){
    //console.log(opc);
    let _datos = {
        startDate  : document.getElementById('startDate').value.trim(),
        finishDate : document.getElementById('finishDate').value.trim() + " 23:59:59"
    }
    if(opc == 0){
        var x = document.getElementsByName("rAceptados");
        let resCheck;
        for (i = 0; i < x.length; i++) {
            if(x[i].checked == true ){
                resCheck = x[i].value;
            }
        }
        _datos.acepted = resCheck;
    }
    if(opc == 1) {
        _datos.area    = document.getElementById('seAreaChart').value;
        
    }
    if(opc == 2) {
        var x = document.getElementsByName("rEmpresaM");
        let resCheck = '';
        for (i = 0; i < x.length; i++) {
            if(x[i].checked == true ){
                resCheck = x[i].value;
            }
        }
        _datos.company = resCheck;
    }
    switch(opc){
        case 0:
            if (_datos.startDate > _datos.finishDate) {
                Swal.fire({
                    icon: 'warning',
                    title: 'La fecha inicial no puede ser mayor a la final',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
            break;
        case 1:
            if (_datos.startDate > _datos.finishDate) {
                Swal.fire({
                    icon: 'warning',
                    title: 'La fecha inicial no puede ser mayor a la final',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }else{
                if(_datos.area == 1000){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Por favor seleccione un área',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
            }
            break;
        case 2:
            if (_datos.startDate > _datos.finishDate) {
                Swal.fire({
                    icon: 'warning',
                    title: 'La fecha inicial no puede ser mayor a la final',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
            break;
    }
    let sApi = ['grafGeneral', 'grafArea', 'grafPed'];
    let res  = await apiMasterGET(_datos, sApi[opc]);
    let sInfoGraf;
    var suma = 0;
    
    //console.log(_datos.finishDate);
    document.getElementById('divgrafGeneral').innerHTML     = '';
    document.getElementById('divInfGeneral').innerHTML      = '';
    document.getElementById('modal-footer-chart').innerHTML = '';
    var graficaDiv = document.getElementById("divgrafGeneral");
    // Datos para la gráfica de ejemplo
    var datos = {
        datasets: [
            {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
            }
        ]
    };
    resChart            = res;
    
    sInfoGraf = `   <p class="text-center fs-2">Datos</p>`;
    for(i = 0; i < res.length; i++){
        var color = gColorHexClar();
        resChart[i].startDate  = _datos.startDate;
        resChart[i].finishDate = _datos.finishDate;
        resChart[i].color      = color;
        suma = suma + res[i].cantidad;
        
        datos.datasets[0].backgroundColor.push(color);
        datos.datasets[0].hoverBackgroundColor.push(color);
        datos.datasets[0].data.push(res[i].cantidad);
        sInfoGraf = sInfoGraf + `
                    <div class="row g-0 mb-2 ">
                        <div class="col-sm-3 col-md-6 text-center rounded-4" style="background-color: `+datos.datasets[0].backgroundColor[i]+`;">
                            <p class="text-start fs-4 ms-2"> `+res[i].name+` </p>
                        </div>
                        <div class="col-6 col-md-5 ms-2">
                            <p class="text-start fs-4 ">`+res[i].cantidad+` pedidos</p>
                        </div>
                    </div>`;
    }
    sInfoGraf = sInfoGraf + `
                    <div class="row g-0 mb-2 ">
                        <div class="col-sm-6 col-md-6 text-center rounded-4">
                            <p class="text-start fs-4 ms-2">Promedio/área:</p>
                        </div>
                        <div class="col-6  col-md-5 ms-2">
                            <p class="text-start fs-4"> `+parseFloat(suma/res.length).toFixed(2)+` pedidos</p>
                        </div>
                    </div>
                    <div class="row g-0 mb-2 ">
                        <div class="col-sm-6 col-md-6 text-center rounded-4">
                            <p class="text-start fs-4 ms-2">Total:</p>
                        </div>
                        <div class="col-6 col-md-5 ms-2">
                            <p class="text-start fs-4"> `+suma+` pedidos</p>
                        </div>
                    </div>`;

    document.getElementById('divInfGeneral').innerHTML  = sInfoGraf;
    let sFooterMo = `   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="imprimirGraf(`+opc+`)">Imprimir</button>`;
    document.getElementById('modal-footer-chart').innerHTML = sFooterMo;
    // Crea el elemento <canvas> con el ancho y alto especificados
    var canvas = document.createElement("canvas");
    canvas.width = 250;
    canvas.height = 250;

    // Agrega el <canvas> al <div> utilizando appendChild
    graficaDiv.appendChild(canvas);

    // Crea el contexto para el gráfico
    var ctx = canvas.getContext("2d");
    //console.log("Ventas",res.ventas,"Compras", "Almacén", res.almacen, "Facturación", "CyC");
    
    // Crea la gráfica de pie
    var grafica = new Chart(ctx, {
        type: "doughnut",
        data: datos
    });
    
    resChart.suma       = suma;
}

function gColorHexClar() {
    const r = Math.floor(Math.random() * 200) + 55; // Componente rojo (valores entre 55 y 255)
    const g = Math.floor(Math.random() * 200) + 55; // Componente verde (valores entre 55 y 255)
    const b = Math.floor(Math.random() * 200) + 55; // Componente azul (valores entre 55 y 255)
  
    // Convertir los componentes RGB a formato hex
    const hexColor = rgbToHex(r, g, b);
    return hexColor;
}
  
  // Función para convertir RGB a hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

async function imprimirGraf(opc){
    loading(1);
    let nameId = "divgrafGeneral";
    let jTable = {
        body: [
            [
                /*{
                    text: 'Ventas', fillColor: '#ff6384'
                },*/
            ],
            [
                /*'resChart.ventas,*/
            ]
        ],
        alignment: "center",
        margin: [10, 100, 0, 0], 
    };
    for (i = 0; i < resChart.length; i++){
        jTable.body[0].push(JSON.parse('{"text": "'+resChart[i].name+'", "fillColor": "'+resChart[i].color+'"}'));
        //console.log(resChart[i].name," ",resChart[i].cantidad);
        jTable.body[1].push(resChart[i].cantidad)
    }    
    jTable.body[0].push(JSON.parse('{"text": "Prom", "fillColor": "#e0e0e0"}'));
    jTable.body[0].push(JSON.parse('{"text": "Total", "fillColor": "#e0e0e0"}'));
    jTable.body[1].push(parseFloat(resChart.suma/resChart.length).toFixed(2));
    jTable.body[1].push(resChart.suma);
    //console.log(jTable.body[0]);
    var contentElement = document.getElementById(nameId);
    // Capturar una imagen de la etiqueta HTML utilizando html2canvas
    html2canvas(contentElement).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');
        var content = [ 
            {
                text: 'Pedidos PFG de la fecha '+resChart[0].startDate+' a '+resChart[0].finishDate,
                alignment: "center",
                fontSize: 18,
			    bold: true,
                margin: [0, 0, 0, 30],
            }, 
            {
                table: jTable
            },
            {
                image: imgData,
                width: 300,
                margin: [0, 50, 0, 0],
                alignment: "center",
            },
        ];
        // Crear el contenido del PDF con la imagen capturada y la tabla
        var docDefinition = {
            pageOrientation: 'landscape',
            pageSize: 'LETTER',//Tamaño de la hoja a hacer en pdf
            content: content,
        };
        // Generar y descargar el archivo PDF utilizando pdfmake
        pdfMake.createPdf(docDefinition).download('archivo.pdf');
        loading(2);
    });

}

async function viewEditUser(i){
    jUsuarios[i]
    let sModalVentana = '';
    tamanomodal(1);
    sModalVentana = sModalVentana + `
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar usuario</strong></h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrarModal"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="input-group mb-3 border">
                                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-person-circle"></i></span>
                                            <input type="text" class="form-control" id="inEdNom" placeholder="Nombre de usuario" value="`+jUsuarios[i].name+`">
                                        </div>
                                        <div class="input-group mb-3 border">
                                            <span class="input-group-text" id="basic-addon1">@</span>
                                            <input type="email" class="form-control" placeholder="Correo" id="inEdEmail" value="`+jUsuarios[i].email+`">
                                        </div>
                                        <div class="input-group mb-3 border">
                                            <select class="form-select" id="selEdArea">
                                                <option selected value="1000">Selecciona un área</option>`
    for(i = 0; i < (jArea.length-2); i++){
        sModalVentana = sModalVentana +        `<option value="`+jArea[i].id+`">`+jArea[i].name+`</option>
        `
    }
    sModalVentana = sModalVentana + `       </select>
                                        </div>
                                        `;
    sModalVentana = sModalVentana +`</div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                        <button type="button" class="btn btn-primary" onclick="editUser(`+jUsuarios[i].id+`)">Aceptar</button>
                                    </div>`;
    document.getElementById('modalInfo').innerHTML = sModalVentana;
}

async function editUser(id){
    let datos = {
        id    : id,
        nom   : document.getElementById('inEdNom').value.trim(),
        email : document.getElementById('inEdEmail').value.trim(),
        area  : document.getElementById('selEdArea').value,
    }
    if(datos.nom != '' && datos.email != '' && datos.area != 1000){
        let res = await apiMasterPost(datos, 'actUser');
        if(res.status == 200){
            Swal.fire({
                icon: 'success',
                title: 'El usuario <strong>'+datos.email+'</strong> a sido actualizado',
                showConfirmButton: false,
                timer: 1500
            })
            document.querySelector('#cerrarModal').click();
        }
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Por favor llene todos los campos',
            showConfirmButton: false,
            timer: 1500
        })
    }
}

async function recargarTodo(rol){
    setTimeout(async () => {
        if(noRecargar == 0){
            if((rol == 0 || rol == 2 || rol == 6) && iNoRecMenu == 0){
                //let esperar = await tablaTodosAdm();
                let = await home();
            }
            recargarTodo(rol);
        }
      }, 60000);
}

let noRecargar = 0;
function doSearch(opc){
    var tableReg;
    var searchText;
    switch(opc){
        case 1:
            tableReg      = document.getElementById('tablaTodosT');
            searchText    = document.getElementById('searchTerm').value.toLowerCase();
            break;
        case 2:
            tableReg      = document.getElementById('tablaAceptar');
            searchText    = document.getElementById('searchPorAceptar').value.toLowerCase();
            break;
        case 3:
            tableReg      = document.getElementById('tablaAceptado');
            searchText    = document.getElementById('searchAceptados').value.toLowerCase();
            break;
        case 4:
            tableReg      = document.getElementById('tablaUserT');
            searchText    = document.getElementById('searchUser').value.toLowerCase();
            break;
    }
    noRecargar          = searchText.length;
    let total           = 0;
    // Recorremos todas las filas con contenido de la tabla
    for (let i = 1; i < tableReg.rows.length; i++) {
        // Si el td tiene la clase "noSearch" no se busca en su cntenido
        if (tableReg.rows[i].classList.contains("noSearch")) {
            continue;
        }
        let found = false;
        const cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
        // Recorremos todas las celdas
        for (let j = 0; j < cellsOfRow.length && !found; j++) {
            const compareWith = cellsOfRow[j].innerHTML.toLowerCase();
            // Buscamos el texto en el contenido de la celda
            if (searchText.length == 0 || compareWith.indexOf(searchText) > -1) {
                found = true;
                total++;
            }
        }
        if (found) {
            tableReg.rows[i].style.display = '';
        } else {
            // si no ha encontrado ninguna coincidencia, esconde la
            // fila de la tabla
            tableReg.rows[i].style.display = 'none';
        }
    }
    // mostramos las coincidencias
    const lastTR = tableReg.rows[tableReg.rows.length - 1];
    const td = lastTR.querySelector("td");
    lastTR.classList.remove("hide", "red");
    if (searchText == "") {
        lastTR.classList.add("hide");
    } else if (total) {
        //td.innerHTML = "Se ha encontrado " + total + " coincidencia" + ((total > 1) ? "s" : "");
    } else {
        lastTR.classList.add("red");
        td.innerHTML = "No se han encontrado coincidencias";
    }
    if(opc == 1){
        if(noRecargar == 0){
            home();
        }
    }

}

async function parcialView(idOrder, ordernumber, area, idUser){
    let sMensaje = '¿El pedido '+ordernumber+' está en parcial?'
    Swal.fire({
        title: sMensaje,
        text: "Revisa con preacución que el pedido se va a PARCIAL",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Si, a parcial'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let _reqDatos = {
                orderId     : idOrder,
                ordernumber : ordernumber,
                area_id     : area,
                idUser      : idUser
            }
            console.log(_reqDatos);
            let resParcial = await apiMasterPost(_reqDatos, 'parcialPed');
            console.log(resParcial);
            if(resParcial.status == 200){
                Swal.fire(
                    '¡Exito!',
                    'El pedido '+ordernumber+' se ha ido a parcial',
                    'success'
                )
            }else{
                Swal.fire(
                    '¡Error!',
                    'El pedido '+ordernumber+' no se ha ido a parcial',
                    'error'
                )
            }
            recargar();
        }
    })
}

async function finalizarView(idOrder, ordernumber, idUser){
    let sMensaje = '¿El pedido '+ordernumber+' está finalizado?'
    Swal.fire({
        title: sMensaje,
        text: "Revisa con precaución que el pedido este FINALIZADO",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Si, finalizar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let _reqDatos = {
                idOrder     : idOrder,
                idUser      : idUser
            }
            //console.log(_reqDatos);
            let resParcial = await apiMasterPost(_reqDatos, 'finalizarPed');
            console.log(resParcial);
            if(resParcial.status == 200){
                Swal.fire(
                    '¡Exito!',
                    'El pedido '+ordernumber+' se ha ido a finalizado',
                    'success'
                )
            }else{
                Swal.fire(
                    '¡Error!',
                    'El pedido '+ordernumber+' no se ha podido finalizar',
                    'error'
                )
            }
            recargar();
        }
    })
}

async function cancelarView(idOrder, ordernumber, idUser){
    let sMensaje = '¿El pedido '+ordernumber+' se cancelará?'
    Swal.fire({
        title: sMensaje,
        text: "Revisa con precaución que el pedido este CANCELADO",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        cancelButtonText: "Salir",
        confirmButtonText: 'Si, cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let _reqDatos = {
                idOrder     : idOrder,
                area_id     : 100,
                idUser      : idUser
            }
            //console.log(_reqDatos);
            let resParcial = await apiMasterPost(_reqDatos, 'cancelarPed');
            console.log(resParcial);
            if(resParcial.status == 200){
                Swal.fire(
                    '¡Exito!',
                    'El pedido '+ordernumber+' se ha cancelado',
                    'success'
                )
            }else{
                Swal.fire(
                    '¡Error!',
                    'El pedido '+ordernumber+' no se ha cancelado',
                    'error'
                )
            }
            recargar();
        }
    })
}

async function eliminarView(idOrder, ordernumber){
    let sMensaje = '¿El pedido '+ordernumber+' será eliminado?'
    Swal.fire({
        title: sMensaje,
        text: "Revisa con precaución el pedido. Si se elimina no se podrá recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Si, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let _reqDatos = {
                idOrder     : idOrder,
            }
            let resParcial = await apiMasterPost(_reqDatos, 'eliminarPed');
            //console.log(resParcial);
            if(resParcial.status == 200){
                Swal.fire(
                    '¡Exito!',
                    'El pedido '+ordernumber+' ha sido eliminado',
                    'success'
                )
            }else{
                Swal.fire(
                    '¡Error!',
                    'El pedido '+ordernumber+' no se ha podido eliminar',
                    'error'
                )
            }
            recargar();
        }
    })
}

async function editarPedView(pos, idUSer){
    //console.log(jPedidosGlobal[pos]);
    let sHtml = '';
    if(jPedidosGlobal[pos].company == "P"){
        sHtml = `<div class="form-check form-check-inline mt-3">
                    <input class="form-check-input" type="radio" name="radioCmp" id="inlineRadio1" value="P" checked>
                    <label class="form-check-label" for="inlineRadio1">Proveedor</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="radioCmp" id="inlineRadio2" value="M">
                    <label class="form-check-label" for="inlineRadio2">Maria Raquel</label>
                </div>`;
    }else{
        sHtml = `<div class="form-check form-check-inline mt-3">
                    <input class="form-check-input" type="radio" name="radioCmp" id="inlineRadio1" value="P">
                    <label class="form-check-label" for="inlineRadio1">Proveedor</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="radioCmp" id="inlineRadio2" value="M" checked>
                    <label class="form-check-label" for="inlineRadio2">Maria Raquel</label>
                </div>`;
    }
    sHtml = sHtml + `       
                <div class="form-floating mt-3">
                    <input type="text" class="form-control" id="changeOrderNumber" name="" value="`+jPedidosGlobal[pos].ordernumber+`" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;">
                    <label for="floatingPassword">Número de orden </label>
                </div>
                <div class="form-floating mt-3">
                    <select class="form-select border border-primary" id="selArEnviEd">
                        <option selected value="1000">Seleccione el área de envío</option>
                        <option value="Foraneo">Foraneo</option>
                        <option value="Paquetería">Paquetería</option>
                        <option value="Recoge en almacén">Recoge en almacén</option>
                        <option value="El Salto">El Salto</option>
                        <option value="San Pedro Tlaquepaque">San Pedro Tlaquepaque</option>
                        <option value="Tlajomulco de Zuñiga">Tlajomulco de Zuñiga</option>
                        <option value="Zapopan">Zapopan</option>
                        <option value="Tonalá">Tonalá</option>
                        <option value="Zona industrial">Zona industrial</option>
                    </select>
                    <label for="floatingSelect">Área de envío</label>
                </div>
            `;
    Swal.fire({
        title: 'Modificar el pedido <strong>'+jPedidosGlobal[pos].ordernumber+'</strong>',
        html:   sHtml,
        icon:  'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Si, modificar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            var cmp     = document.getElementsByName("radioCmp");
            var orderN  = document.getElementById("changeOrderNumber").value;
            var sArea   = document.getElementById("selArEnviEd").value;
            for (i = 0; i < cmp.length; i++) {
                if(cmp[i].checked == true ){
                    resCheck = cmp[i].value;
                }
            }
            let _reqDatos = {
                idUser         : idUSer,
                idOrder        : jPedidosGlobal[pos].id,
                company        : resCheck, 
                ordernumber    : orderN,
                cd_area        : sArea,
                oldOrderNumber : jPedidosGlobal[pos].ordernumber,
                oldCompany     : jPedidosGlobal[pos].company,
                area           : jPedidosGlobal[pos].area_id,
                acepted        : jPedidosGlobal[pos].acepted,
            }
            let resParcial = await apiMasterPost(_reqDatos, 'modificarPed');
            //console.log(resParcial);
            if(resParcial.status == 200){
                Swal.fire(
                    '¡Exito!',
                    'El pedido se ha modificado el pedido',
                    'success'
                )
            }else{
                Swal.fire(
                    '¡Error!',
                    resParcial.msg,
                    'error'
                )
                console.log(resParcial);
            }
            recargar();
        }
    })
}

let tModal = 0;
function tamanomodal(vswitch){
    //vswitch en 0 significa que es para que regerse a su tamaño real
    //vSwitch en 1 significa que sigue en nuevo pedido sin cambiar tamaño 
    if(vswitch == 1) tModal = 0;
    if(vswitch == 0) tModal = 1;
    if(tModal != 1){
        document.getElementById('modalClass').classList.remove('modal-xl');
        tModal = 1;
    }else{
        document.getElementById('modalClass').classList.add('modal-xl');
        tModal = 0;
    }
}

async function pestanaNva(opc){
    switch(opc){
        case 1:
            //let url ="http://192.168.1.74:81/spfg/lista/?data="+jEncode+"";
            let url = urlPrin + "spfg/lista/?data=" + jEncode+"";
            window.open(url, '_blank');
            break;
        case 2:
            location.href = urlPrin + "spfg/adm/?data=" + jEncode + "";
            break;
    }
    
}

async function aceptar(orderId, orderNumber, userId){
    let datos = {
        orderId     : orderId,
        orderNumber : orderNumber,
        userId      : userId
    }
    let resulP = await apiMasterPost(datos, 'aceptarPed');
    //console.log(resulP);
    if(resulP.status == 200){
        loading(2);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'El pedido <strong>'+orderNumber+'</strong> a sido aceptado'
          })
        /*Swal.fire({
            icon: 'success',
            title: 'Se ha creado el pedido',
            showConfirmButton: false,
            timer: 1500
        })*/
    }else{
        loading(2);
        Swal.fire({
            icon: 'success',
            title: 'No se pudo agregar el nuevo pedido',
            showConfirmButton: false,
            timer: 1500
        })
    }
    recargar();
}

async function modalView(idOrder, orderNumber, opc, userId){
    //El numOrder es el numéro de orden que manda
    /*El opc es la opción a elegir:
    las opciones son; 
    1: historial
    2: Rechazar pedido
    3: Agregar pedido
    4: Perfil
    */
    document.getElementById('modalInfo').innerHTML = '';
    var sModalVentana = '';
    let contArea = 0;
    let datosUsu = { id: 0 }

    Object.keys(jArea).forEach((clave) => {
        if (typeof jArea[clave] === "object") {
            contArea++;
        }
    });
    switch(opc){
        case 1: //Modal de historial de pedidos 
            tamanomodal(0);
            let datos     = {
                idOrder : idOrder
            }
            let jHistorial    = await apiMasterGET(datos, 'historial');
            let jHora         = await apiMasterGET(datos, 'horaOrder');
            //console.log(jHora[0].id);
            let contHistorial = 0;

            Object.keys(jHistorial).forEach((clave) => {
                if (typeof jHistorial[clave] === "object") {
                    contHistorial++;
                }
            });

            let contUsuarios = 0;

            Object.keys(jUsuarios).forEach((clave) => {
                if (typeof jUsuarios[clave] === "object") {
                    contUsuarios++;
                }
            });

            sModalVentana = `<div class="modal-header" >
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Historial del pedido: <strong>`+orderNumber+`</strong> <span class="ms-5 fs-6">Movimientos: `+contHistorial+`</span></h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Fecha de operación</th>
                                            <th scope="col">Área</th>
                                            <th scope="col">Responsable</th>
                                            <th scope="col">Operacion</th>
                                            <th scope="col">Comentario</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
            if(contHistorial > 0){
                let responsable = '';
                let area        = '';
                let acepted     = '';
                let canceled    = '';
                let asigned     = '';
                let rechazado   = '';
                let finalizado  = '';
                let modificado  = '';
                let regreso     = '';
                let asigado     = '';
                
                for(i=0; i < contHistorial; i++){ 
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jHistorial[i].user_id)        responsable = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].acepted_by)     acepted     = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].canceled_by)    canceled    = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].asigned_id)     asigned     = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].rejected_by)    rechazado   = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].finished_by)    finalizado  = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].modificed_by)   modificado  = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].return_by)      regreso     = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].redirect_by)    asigado     = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jHistorial[i].area_id) area = jArea[k].name;
                    }  
                    if(jHistorial[i].rejected_by != null) sModalVentana = sModalVentana + `<tr class="table-danger">`; //Si es cancelado se pone en Rojo
                        else if(jHistorial[i].status == 'Parcial') sModalVentana = sModalVentana + `<tr class="table-warning">`; //Si es parcial se pone en naranja
                            else if(jHistorial[i].status == 'Finalizado') sModalVentana = sModalVentana + `<tr class="table-success">`; //Si es finalizado se pone en verde
                                else if(jHistorial[i].canceled_by != null) sModalVentana = sModalVentana + `<tr class="table-danger">`; //Si es cancelado se pone en Rojo
                                    else if(jHistorial[i].modificed_by != null) sModalVentana = sModalVentana + `<tr class="table-info">`; //Si es cancelado se pone en Rojo
                                        else sModalVentana = sModalVentana + `<tr">`; //Si no es nimguno de los anteriores se pone de color por defecto
                    sModalVentana = sModalVentana + `<td scope="row">`+new Date(jHistorial[i].changed_date).toLocaleString()+`</td>
                                            <td>`+area+`</td>
                                            <td>`+responsable+`</td>`;
                    if(jHistorial[i].canceled_by != null) sModalVentana = sModalVentana + `<td>Cancelado por: <strong>`+canceled+`</strong></td>`;//Valida si esta cancelado
                    else if(jHistorial[i].acepted_by != null) sModalVentana = sModalVentana + `<td>Aceptado por: <strong>`+acepted+`</strong></td>`;//Valida si esta Aceptado
                        else if(jHistorial[i].asigned_to == 0) sModalVentana = sModalVentana + `<td>Asignado al area: <strong>`+area+`</strong></td>`;//Valida si esta Asignado
                            else if(jHistorial[i].rejected_by != null) sModalVentana = sModalVentana + `<td>Rechazado por: <strong>`+rechazado+`</strong></td>`;//Valida si esta Asignado
                                else if(jHistorial[i].partially_by != null) sModalVentana = sModalVentana + `<td>Parcial por <strong>`+responsable+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido
                                    else if(jHistorial[i].finished_by != null) sModalVentana = sModalVentana + `<td>Finalizado por <strong>`+finalizado+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido
                                        else if(jHistorial[i].modificed_by != null) sModalVentana = sModalVentana + `<td>Modificado por <strong>`+modificado+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido
                                            else if(jHistorial[i].return_by != null) sModalVentana = sModalVentana + `<td>Regresó a ventas por: <strong>`+regreso+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido
                                                else if(jHistorial[i].redirect_by != null) sModalVentana = sModalVentana + `<td>Se asignó por: <strong>`+asigado+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido    
                                                    else sModalVentana = sModalVentana + `<td>Creado por <strong>`+responsable+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido
                    if(jHistorial[i].cancellation_details != null) sModalVentana = sModalVentana + `<td>`+jHistorial[i].cancellation_details+`</td>`;//Valida si tiene un mensaje el pedido
                    else sModalVentana = sModalVentana + `<td>N/A</td>`;//Si este no contiene un mensaje imprime N/A (No Aplica)
                    sModalVentana = sModalVentana + `</tr>`;                     
                }
            }
            let fechaActual     = new Date();
            let fechaProd;
            if(jHora[0].updated_at != null){
                fechaProd = new Date(jHora[0].updated_at); 
            }else {
                fechaProd = new Date(jHora[0].startdate);
            }
            let diferenciaMs = fechaActual - fechaProd;
            //console.log("diferenciaMs ",diferenciaMs);
            let dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
            let horas = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));                 
                                    
            sModalVentana = sModalVentana + `
                                    </tbody>
                                </table>
                            </div>
                            <div class="">
                                <div class="content-xl">
                                    <div class="row g-0 mb-2 ms-2 me-2 border-top">
                                        <div class="col-sm-6 col-md-7 text-start mt-2">
                                            <span`;
            if(dias >= 1){//Valides de horas del pedido
                sModalVentana = sModalVentana + `             style="background: rgba(245, 0, 0, 0.8); font-weight: bold;"`;
            }else if(horas >= 2 && dias == 0){
                sModalVentana = sModalVentana + `             style="background: rgba(245, 130, 0, 0.8);"`;
            }else if(horas == 1 && dias == 0){
                sModalVentana = sModalVentana + `             style="background: rgba(245, 197, 0, 0.8);"`;
            }
            sModalVentana = sModalVentana + ` class="fs-3 rounded">&nbsp;±`+dias+` días `+horas+`hrs `+minutos+` min&nbsp;</span> <span class="fs-4"> en este proceso</span>`;

            sModalVentana = sModalVentana +`
                                        </div>
                                        <div class="col-6 col-md-5 text-end mt-2">
                                            <button type="button" class="btn btn-danger text-end" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
            
                                

            
            break;
        case 2: // Modal para rechazo
            tamanomodal(0);
            sModalVentana = sModalVentana + `
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Rechazar pedido: <strong>`+orderNumber+`</strong></h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" id="cerrarModal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <p class="text-center fs-3 mb-4">¿Desea cancelar el pedido <strong>`+orderNumber+`</strong>?</p>
                                                <div class="mb-3">
                                                    <label for="exampleFormControlTextarea1" class="form-label">Comentario del rechazo</label>
                                                    <textarea class="form-control" id="msmRechazo" rows="3" style="min-height: 100px; max-height: 400px;"></textarea>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                <button type="button" class="btn btn-primary" onclick="rechazar(`+idOrder+`,`+userId+`)">Aceptar</button>
                                            </div>`;
            break;
        case 3://Modal para nuevo pedido
            varGlobal = 3;
            tamanomodal(1);
            datosUsu.id = usuIdGlobal;
            let jUserP = await apiMasterGET(datosUsu, 'perfil');
        
            //console.log(jUserP[0].name);
            sModalVentana = sModalVentana + `
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Agregar nuevo pedido</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrarMoNuevo"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="containerModal">
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="radioEmp" id="inlineRadio1" value="P" checked>
                                                        <label class="form-check-label" for="inlineRadio1">Proveedor</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="radioEmp" id="inlineRadio2" value="M">
                                                        <label class="form-check-label" for="inlineRadio2">Maria Raquel</label>
                                                    </div>
                                                    
                                                    <div class="input-group mb-3 mt-3">
                                                        <span class="input-group-text border border-primary" id="inputGroup-sizing-default">Nuevo pedido</span>
                                                        <input type="int" class="form-control border border-primary" autofocus id="nuevoPedidoInput" min="9000" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;" placeholder="Ejemplo: 45055">
                                                    </div>
                                                    <select class="form-select border border-primary" aria-label="Default select example" id="selArEnvi">
                                                        <option selected value="1000">Seleccione el área de envío</option>
                                                        <option value="Foraneo">Foraneo</option>
                                                        <option value="Paquetería">Paquetería</option>
                                                        <option value="Recoge en almacen">Recoge en almacén</option>
                                                        <option value="El Salto">El Salto</option>
                                                        <option value="San Pedro Tlaquepaque">San Pedro Tlaquepaque</option>
                                                        <option value="Tlajomulco de Zuñiga">Tlajomulco de Zuñiga</option>
                                                        <option value="Zapopan">Zapopan</option>
                                                        <option value="Tonalá">Tonalá</option>
                                                        <option value="Zona industrial">Zona industrial</option>
                                                    </select>
                                                </div>
                                          
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                <button type="button" class="btn btn-primary" id="btnNuevoPed" onclick="nuevoPed(`+jUserP[0].user_rol_id+`,`+jUserP[0].id+`)">Aceptar</button>
                                            </div>`;
            break;
        
        case 4: //Modal para perfil
            tamanomodal(0);
            //Aquí el idOrder recibe un json del usuario y ahí se usará con ese nombre
            datosUsu.id = idOrder;
            let jUser = await apiMasterGET(datosUsu, 'perfil');
            //console.log(jUser[0].name);
            let area        = '';
            for(k = 0; k < contArea; k++){
                if(jArea[k].id == jUser[0].user_rol_id) area = jArea[k].name;
            } 
            sModalVentana = sModalVentana + `<div class="modal-header" >
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Perfil: <strong>`+jUser[0].name+`</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="container">
                                                    <img src="`+jUser[0].urlPic+`" class="rounded mx-auto d-block mb-3" style="max-width: 300px;">
                                                    <div class="row g-0 ">
                                                        <div class="col-sm-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default" style="width: 150px">Nombre</span>
                                                                <input type="text" class="form-control me-2" disabled value="`+jUser[0].name+`">
                                                            </div>
                                                        </div>
                                                        <div class="col-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default" style="width: 150px">Correo</span>
                                                                <input id="emailProf" type="text" class="form-control" disabled value="`+jUser[0].email+`">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="container">
                                                    <div class="row g-0 ">
                                                        <div class="col-sm-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default" style="width: 150px">Área</span>
                                                                <input type="text" class="form-control me-2" disabled value="`+area+`">
                                                            </div>
                                                        </div>
                                                        <div class="col-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default" style="width: 150px">Fecha de creación</span>
                                                                <input type="text" class="form-control me-2" disabled value="`+new Date(jUser[0].updated_at).toLocaleDateString()+`">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;
                if(jUser[0].user_rol_id == 0){
                    sModalVentana = sModalVentana + `
                                                <div class="container border-top border-2 border-black" style="max-height: 220px;">
                                                    <div class="row g-0 text-center mt-3 mb-3">
                                                        <div class="col-sm-6 col-md-10">
                                                            <div class="row g-0 text-center">
                                                                <div class="col-sm-6 col-md-4">
                                                                    <div class="input-group mb-3 me-2">
                                                                        <span class="input-group-text border border-primary" id="inputGroup-sizing-default">Versión</span>
                                                                        <input type="text" class="form-control me-2 border border-primary" id="inVersion" value="`+jUser[0].version+`" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;">
                                                                    </div>
                                                                </div>
                                                                <div class="col-6 col-md-8">
                                                                    <div class="form-floating">
                                                                        <textarea class="form-control border border-primary" placeholder="Versión" id="txtDatos" style="max-height: 200px; min-height:50px;"></textarea>
                                                                        <label for="floatingTextarea">Datos de versión</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6 col-md-2">
                                                            <button type="button" class="btn btn-primary" onclick='actVers("`+jUser[0].version+`", `+jUser[0].id+`)'>Actualizar versión</button>
                                                        </div>
                                                    </div>
                                                </div>
                    `;
                }
                    sModalVentana = sModalVentana +`
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                                            </div>`;
            break;

        case 5://Modal asignar
            tamanomodal(1);
            //let jUserS = await apiUsuario(usuIdGlobal);
            datosUsu.id = usuIdGlobal;
            let jUserS  = await apiMasterGET(datosUsu, 'perfil');
            //console.log(jUserS[0].name);
            let areaS        = '';
            //console.log(jUserS);
            //console.log("usuIdGlobal",usuIdGlobal,"arGlobal ",arGlobal, "orderNumber", orderNumber, "IdOrder", idOrder, "jUserS[0].id",jUserS.id);
            sModalVentana = sModalVentana + `
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Reasignar pedido: <strong>`+orderNumber+`</strong></h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrarModal"></button>
                                            </div>
                                            <div class="modal-body">`;
            if(arGlobal == 0 || arGlobal == 2 || arGlobal == 1){
                sModalVentana = sModalVentana +`<div class="container">
                                                    <span>¿El pedido <strong>`+orderNumber+`</strong> se ira de regreso a ventas?</span>
                                                    <ul class="nav nav-pills mb-3 mt-3" id="pills-tab" role="tablist">
                                                        <li class="nav-item" role="presentation">
                                                            <button class="nav-link active" onclick="segPedido(1,0,0)" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-no" type="button" role="tab" aria-controls="pills-home" aria-selected="true">No</button>
                                                        </li>
                                                        <li class="nav-item" role="presentation">
                                                            <button class="nav-link" onclick="segPedido(2,0,0)" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-si" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Si</button>
                                                        </li>`
            if(arGlobal == 0 || arGlobal == 2){
                sModalVentana = sModalVentana +`        <li class="nav-item" role="presentation">
                                                            <button class="nav-link" onclick="segPedido(3,0,0)" id="pills-user-tab" data-bs-toggle="pill" data-bs-target="#pills-todosUsuarios" type="button" role="tab" aria-controls="pills-user" aria-selected="false">Todos los usuarios</button>
                                                        </li>`
            }
            sModalVentana = sModalVentana + `       </ul>
                                                    <div class="tab-content" id="pills-tabContent">
                                                        <div class="tab-pane fade show active" id="pills-no" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">`;
                                                            sModalVentana = sModalVentana + asignarModalOpc(2);
                                                            sModalVentana = sModalVentana + `                                          
                                                        </div>
                                                        <div class="tab-pane fade" id="pills-si" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">`;
                                                            sModalVentana = sModalVentana + asignarModalOpc(1);
                                                            sModalVentana = sModalVentana + `
                                                            <label for="floatingTextarea" class="mt-3">Comentarios</label>  
                                                            <textarea class="form-control mt-3" style="max-height: 200px; min-height: 150px;" placeholder="Comentario de regreso a ventas" id="msgRegVentas"></textarea>
                                                        </div>
                                                        <div class="tab-pane fade" id="pills-todosUsuarios" role="tabpanel" aria-labelledby="pills-user-tab" tabindex="0">`;
                                                            sModalVentana = sModalVentana + asignarModalOpc(3);
                                                            sModalVentana = sModalVentana + `                                          
                                                        </div>
                                                    </div>
                                                </div>`;
            }else{
                sModalVentana = sModalVentana + asignarModalOpc(2);
            }
            sModalVentana = sModalVentana +`</div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                <button type="button" class="btn btn-primary" onclick="segPedido(0,`+orderNumber+`,`+jUserS[0].id+`,`+idOrder+`)">Aceptar</button>
                                            </div>`;
            break;
        case 6:
            
            break;
    }
    document.getElementById('modalInfo').innerHTML = sModalVentana;
    if(opc == 3){
        document.getElementById('nuevoPedidoInput').focus();
    }
}

function compVers(nVer, oVer) {
    const v1 = nVer.split('.').map(Number);
    const v2 = oVer.split('.').map(Number);
    //console.log("v1: ",v1," v2: ",v2);
  
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = i < v1.length ? v1[i] : 0;
      const num2 = i < v2.length ? v2[i] : 0;
  
      if (num1 > num2) {
        return 1; // nVer es mayor que oVer
      } else if (num1 < num2) {
        return -1; // nVer es menor que oVer
      }
    }
  
    return 0; // versiones son iguales
  }

async function actVers(versOrld, id){
    let datos = {
        version : document.getElementById("inVersion").value.trim(),
        datosV  : document.getElementById("txtDatos").value.trim(),
    }
    if(datos.version != '' && datos.datosV != ''){
        let resV = compVers(datos.version, versOrld);
        console.log("resV: ",resV);
        if(resV == 1){
            let res = await apiMasterPost(datos, 'actVersion');
            console.log(res);
            if(res.status == 200){
                let datosActVer = {
                    id      : id,
                    version : datos.version
                }
                let resActVer = await apiMasterGET(datosActVer, 'actVer');
                Swal.fire({
                    icon: 'success',
                    title: 'Se actualizó a la versión '+datos.version,
                    text: "Será necesario iniciar sesión",
                    showConfirmButton: false,
                    timer: 3500
                }).then(function() {
                    location.reload();
                });
            }
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'La versión debe ser mayor a la actual',
                showConfirmButton: false,
                timer: 3500
            })
        }
    }
}

async function nuevoPed(area, userId){

    var x = document.getElementsByName("radioEmp");
    let resCheck = '';
    for (i = 0; i < x.length; i++) {
    	if(x[i].checked == true ){
            resCheck = x[i].value;
        }
    }
    loading(1);
    let numOrder = document.getElementById('nuevoPedidoInput').value.trim();
    let cd_area  = document.getElementById('selArEnvi').value;
    if(numOrder != '' && cd_area != '1000'){
        let datosP = {
            area     : area,
            userId   : userId,
            numOrder : numOrder,
            cd_area  : cd_area,
            emp      : resCheck
        }
        //console.log(datosP);
        //console.log(datosP);
        let resultP = await apiMasterPost(datosP, 'agregarPed');
        console.log(resultP);
        
        if(resultP.status == 200){
            recargar();
            loading(2);
            document.querySelector('#cerrarMoNuevo').click();
            document.querySelector('#cerrarMoNuevo').click();
            Swal.fire({
                icon: 'success',
                title: 'Se ha creado el pedido',
                showConfirmButton: false,
                timer: 1500
            })
        }else{
            loading(2);
            document.querySelector('#cerrarMoNuevo').click();
            Swal.fire({
                icon: 'warning',
                title: 'El N° de pedido '+numOrder+' ya existe',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }else{
        loading(2);
        document.querySelector("#nuevoPedidoInput").focus();
        Swal.fire({
            icon: 'warning',
            title: 'Por favor llene los campos',
            showConfirmButton: false,
            timer: 1500
        })
    }
}
async function rechazar(orderId, acepted){
    //console.log("Lo rechaza ",acepted);
    let datosP = {
        acepted  : acepted,
        orderId  : orderId,
        msg      : document.getElementById('msmRechazo').value
    }
    let resulP = await apiMasterPost(datosP, 'rechazarPed');
    if(resulP.status == 200){
        recargar();
        loading(2);
        document.querySelector('#cerrarModal').click();
    }else{
        loading(2);
        recargar();
        alert("No se pudo agregar el nuevo pedido")
    }
}

async function segPedido(opcM, numOrder, idUser, idOrder){
    //console.log("opcM ",opcM);
    if(opcM != 0){ modMenu = opcM;}
    else{
        let datos;
        let result;
        switch(modMenu){
            case 1:
                let selectArea = document.getElementById('selectedArea').value;
                //console.log(selectArea);
                datos = {
                    area    : selectArea,
                    numOrder: numOrder,
                    idUser  : idUser,
                    idOrder : idOrder
                }
                if(selectArea != 0){
                    result = await apiMasterPost(datos, 'asignarPed');
                    if(result.status == 200){
                        recargar();
                        document.querySelector('#cerrarModal').click();
                    }
                }else{
                    Swal.fire({
                        icon: 'warning',
                        title: 'Por favor seleccione una área',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    document.getElementById("selectedArea").focus();
                }
            break;
            case 2:
                let selectVendedor = document.getElementById('selectedVendedor').value;
                let msgRegVentas   = document.getElementById('msgRegVentas').value;
                datos = {
                    vendedor: selectVendedor,
                    msg     : msgRegVentas,
                    numOrder: numOrder,
                    idUser  : idUser,
                    idOrder : idOrder
                }
                if(selectVendedor != 0){
                    if(msgRegVentas != ''){
                        result = await apiMasterPost(datos, 'regresarVent');
                        if(result.status == 200){
                            recargar();
                            document.querySelector('#cerrarModal').click();
                        }
                    }else{
                        Swal.fire({
                            icon: 'warning',
                            title: 'Por favor ingrese el detalle porque regresa el pedido al vendedor',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        document.getElementById("msgRegVentas").focus();
                    }
                }else{
                    Swal.fire({
                        icon: 'warning',
                        title: 'Por favor seleccione a un vendedor',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    document.getElementById("selectedVendedor").focus();
                }
            break;
            case 3:
                let selectUsuario = document.getElementById('selectedUsuario').value;
                //console.log(selectArea);
                datos = {
                    user    : selectUsuario,
                    numOrder: numOrder,
                    idUser  : idUser,
                    idOrder : idOrder
                }
                if(selectUsuario != 0){
                    //result = await apiAsignarDir(datos);
                    result = await apiMasterPost(datos,'asignarDir');

                    if(result.status == 200){
                        recargar();
                        document.querySelector('#cerrarModal').click();
                    }
                }else{
                    Swal.fire({
                        icon: 'warning',
                        title: 'Por favor seleccione a un usuario',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    document.getElementById("selectedUsuario").focus();
                }
            break;
        }
    }
}

function asignarModalOpc(opc){//Asignar la vista del modal con respecto al area del usuario en el modal de asignar
    //opc 1: regreso a ventas
    //opc 2: seguir el proceso
    let contUsuarios = 0;
    Object.keys(jUsuarios).forEach((clave) => {
        if (typeof jUsuarios[clave] === "object") {
            contUsuarios++;
        }
    }); 
    let contArea = 0;
    Object.keys(jArea).forEach((clave) => {
        if (typeof jArea[clave] === "object") {
            contArea++;
        }
    }); 
    let sModalVentana = '';
    switch(opc){
        case 1:
            //Caso para ver a los vendedores
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedVendedor" aria-label="Default select example">
                                        <option value="0" >Seleccione a un vendedor</option>`
            for(i = 0; i < contUsuarios; i++){
                if(jUsuarios[i].user_rol_id == 3){//validamos que los que se van a mostrar sean unicamente del área de vendedores
                    sModalVentana = sModalVentana + `<option value="`+jUsuarios[i].id+`">`+jUsuarios[i].name+`</option>`;
                }
            }
            sModalVentana = sModalVentana +`</select>`;
            break;
        case 2:
            //Caso para mostrar las áreas
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedArea" aria-label="Default select example">
                                        <option value="0">Seleccione una área</option>`
            for(i = 0; i < contArea; i++){//Iniciamos un ciclo para mostrar las áreas
                if(jArea[i].id != 3 && jArea[i].id != 0 && jArea[i].id != 100 && jArea[i].id != 101 && jArea[i].id != 7 && jArea[i].id != 6) sModalVentana = sModalVentana + `<option value="`+jArea[i].id+`">`+jArea[i].name+`</option>`; //Se valida para que el áre administrador, ventas y Cancelado se muestren
            }
            sModalVentana = sModalVentana +`</select>`;
            break;
        case 3:
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedUsuario" aria-label="Default select example">
                                        <option value="0">Seleccione a un usuario a asignar el pedido</option>`
            for(i = 0; i < contUsuarios; i++){
                sModalVentana = sModalVentana + `<option value="`+jUsuarios[i].id+`">`+jUsuarios[i].name+`</option>`;
            }
            sModalVentana = sModalVentana +`</select>`;
            break;
    }
    return sModalVentana;
}
//Mostrar y usar el botón para ir arriba
window.onscroll = function() {myFunction()};

function myFunction() {
    if (document.documentElement.scrollTop > 50) {
        $("#goup").css("display", "block");
    } else {
        $("#goup").css("display", "none");
    }
}
