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
//var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
if(URLactual.href.substring(0,28) == 'http://192.168.1.74:81/spfg/'){
    var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
}
if(URLactual.href.substring(0,28) == 'http://localhost/spfg/'){
    var urlBase     = 'http://localhost:5000/api/';//Url donde están las apis 
}
if(URLactual.href.substring(0,28) == 'http://187.188.181.242:81/spfg/'){
    var urlBase     = 'http://187.188.181.242:5000/api/';//Url donde están las apis 
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
                                                                        <input type='email' class='form-control' id='inpEmail' placeholder='ejemplo@proveedorferretero.net'>\
                                                                        <span class='input-group-text bi bi-person' id='basic-addon1'>\
                                                                        </span>\
                                                                    </div>\
                                                                    </div>\
                                                                    <div class='mb-3'>\
                                                                        <label for='exampleInputPassword1' class='form-label'>\Password</label>\
                                                                        <div class='input-group mb-3'>\
                                                                            <input type='password' class='form-control' id='inpPass' placeholder='*********'>\
                                                                            <span class='input-group-text bi bi-eye' id='basic-addon1'>\
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

function cerrarSesion(){
    window.location.reload();
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
                        home(json);
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
                                                                        <input type='password' class='form-control' id='newInpPass' placeholder='*********'>\
                                                                        <span class='input-group-text bi bi-eye' id='basic-addon1'>\
                                                                        </span>\
                                                                    </div>\
                                                                </div>\
                                                                <div class='mb-3'>\
                                                                    <label for='exampleInputPassword1' class='form-label'>Repetir nueva contraseña</label>\
                                                                    <div class='input-group mb-3'>\
                                                                        <input type='password' class='form-control' id='newRInpPass' placeholder='*********'>\
                                                                        <span class='input-group-text bi bi-eye' id='basic-addon1'>\
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

async function apiPedidos(id){
       
        const url = urlBase+'solPedidos';
        const data = {
            id: id,
        };
        const params = new URLSearchParams(data);
        const apiUrl = url + '?' + params;

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = {
        method: 'GET',
        mode: 'cors',
        headers: headers,
        };
        var solPedidos = [];
        solPedidos = await fetch(apiUrl, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud.');
            }
        })
        .then(function(json) {
            // Hacer algo con los datos recibidos
            return json;
        })
        .catch(error => {
            console.error(error);
        });
        return solPedidos;
}

async function apiUsuarios(){
    const url = urlBase+'usuarios';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solUsuaros = [];
    solUsuaros = await fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solUsuaros;
}

async function apiArea(){

    const url = urlBase+'area';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solArea = [];
    solArea = await fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solArea;
}

async function apiHistorial(orderId){
    const url = urlBase+'historial';
    const data = {
        orderid: orderId,
    };

    const params = new URLSearchParams(data);
    const apiUrl = url + '?' + params;
    //console.log(apiUrl)

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solHistorial = [];
    solHistorial = await fetch(apiUrl, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solHistorial;
}

async function apiUsuario(id){
    const url = urlBase+'perfil';
    const data = {
        id: id,
    };

    const params = new URLSearchParams(data);
    const apiUrl = url + '?' + params;
    //console.log(apiUrl)

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solHistorial = [];
    solHistorial = await fetch(apiUrl, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solHistorial;
}

async function apiActualizarPedido(reqDatos){
    let _datos = {
        area    : reqDatos.area,
        numOrder: reqDatos.numOrder,
        idUser  : reqDatos.idUser,
        idOrder : reqDatosidOrder
    }
    var res = fetch(urlBase+'actualizarPedido', {
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

async function apiAgregarPed(reqDatos){
    //console.log(reqDatos);
    let _datos = {
        area    : reqDatos.area,
        idUser  : reqDatos.userId,
        numOrder: reqDatos.numOrder
    }
    //console.log(_datos);
    var res = fetch(urlBase+'agregarPed', {
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
async function apiRechazarPed(reqDatos){
    let _datos = {
        acepted  : reqDatos.acepted,
        orderId  : reqDatos.orderId,
        msg: reqDatos.msg
    }
    var res = fetch(urlBase+'rechazarPed', {
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

async function apiAvanzaPedido(reqDatos){
    let _datos = {
        area    : reqDatos.area,
        numOrder: reqDatos.numOrder,
        idUser  : reqDatos.idUser,
        idOrder : reqDatos.idOrder
    }
    var res = await fetch(urlBase+'asignarPed', {
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

async function apiAceptarPed(reqDatos){
    let _datos = {
        orderId     : reqDatos.orderId,
        orderNumber : reqDatos.orderNumber,
        userId      : reqDatos.userId
    }
    var res = await fetch(urlBase+'aceptarPed', {
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

async function apiAceptados(id){  
    const url = urlBase+'solAceptados';
    const data = {
        id: id,
    };
    const params = new URLSearchParams(data);
    const apiUrl = url + '?' + params;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solPedidos = [];
    solPedidos = await fetch(apiUrl, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solPedidos;
}

async function apiAceptar(area){  
    loading(1);
    const url = urlBase+'solAceptar';
    const data = {
        area: area,
    };
    const params = new URLSearchParams(data);
    const apiUrl = url + '?' + params;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solPedidos = [];
    solPedidos = await fetch(apiUrl, options)
    .then(response => {
        if (response.ok) {
            loading(2);
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solPedidos;
}

async function apiSolTodPed(){
    document.getElementById('app').innerHTML = '';
    const url = urlBase+'solTodPed';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solTodPed = [];
    solTodPed = await fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la solicitud.');
        }
    })
    .then(function(json) {
        // Hacer algo con los datos recibidos
        return json;
    })
    .catch(error => {
        console.error(error);
    });
    return solTodPed;
}

async function apiRegAVentas(reqDatos){
    
}

async function recargar(){
    //console.log(userIdGlobal);
    let jUserHome = await apiUsuario(userIdGlobal);
    //console.log(jUserHome);
    if(jUserHome != null){
        home(jUserHome[0]);
    }
}

let jArea;
let jUsuarios;
let userIdGlobal;
async function home(jUsuario){
    let jPedidos        = await apiPedidos(jUsuario.id);
    let GlojArea        = await apiArea();
    let GlojUsuarios    = await apiUsuarios();
    let jAceptados      = await apiAceptados(jUsuario.id);
    let jAceptar        = await apiAceptar(jUsuario.user_rol_id);
    
    //console.log(jAceptar);
    jArea               = GlojArea;
    jUsuarios           = GlojUsuarios;
    let contadorObjetos = 0;
    userIdGlobal        = jUsuario.id;

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

    var sVentana = `<nav class="navbar bg-body-tertiary"> <!--Inicio del nav-->
                        <div class="container-fluid">
                            <a class="navbar-brand ms-4" href="#">
                                <img src="./img/logo_web.45818d48.png" alt="PFG" width="160" height="70">
                            </a>
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Pedidos</button>
                                </li>`;
    arGlobal = jUsuario.user_rol_id;
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 6){
        
        sVentana = sVentana + ` <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="btnModanNuevoP" data-bs-toggle="modal" data-bs-target="#modalTodPed" type="button" role="tab" aria-controls="pills-aceptar" aria-selected="false" onclick='tablaTodosAdm(`+jUsuario+`)'><i class="bi bi-plus-circle"></i> Nuevo Pedido</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="btnTodosP" data-bs-toggle="modal" data-bs-target="#modalTodPed" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onclick="tablaTodosAdm()" >Todos los Pedidos</button>
                                </li>
                                
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#permisos-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Permisos</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Roles</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" >Usuarios</button>
                                </li>`;
    }
    sVentana = sVentana + `</ul>
                            <div class="d-flex" role="search">
                                <div class="btn-group dropstart">
                                    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-person-circle"></i>  `+jUsuario.name+`
                                    </button>
                                    <ul class="dropdown-menu" id="dropPerfil">
                                        <li><a class="dropdown-item" data-bs-target="#modalTotal" data-bs-toggle="modal" onclick='modalView(`+jUsuario.id+`,0, 4)'> <i class="bi bi-person-bounding-box mr-2"></i> Perfil</a></li>
                                        <li><a class="dropdown-item" onclick="cerrarSesion()"><i class="bi bi-box-arrow-left"></i> Cerrar sesion</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav><!--Fin del nav-->
                    <div class="tab-content" id="myTabContent">
                        
                        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                            <!--Inicio del menu de los pedidos-->
                            <ul class="nav nav-pills mt-4 mb-3 justify-content-center" id="pills-tab" role="tablist">`
    if(jUsuario.user_rol_id == 3 || jUsuario.user_rol_id == 2 | jUsuario.user_rol_id == 0){
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
    if(jUsuario.user_rol_id != 3 && jUsuario.user_rol_id != 2 && jUsuario.user_rol_id != 0){
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
    if(jUsuario.user_rol_id == 3 || jUsuario.user_rol_id == 2 | jUsuario.user_rol_id == 0){
        sVentana = sVentana + `
                                        <!--Inicio de tabla de Todos-->
                                        <div class="tab-pane fade show active" id="pills-Todos" role="tabpanel" aria-labelledby="pills-Todos-tab" tabindex="0">
                                            <table class="table table-hover border">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">N° pedido</th>
                                                        <th scope="col">Estatus</th>
                                                        <th scope="col">Fecha de creación</th>
                                                        <th scope="col">Responsable</th>
                                                        <th scope="col">Área</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="table-group-divider" id="tablaTodos">`;

        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].who_id_created == jUsuario.id ){
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jPedidos[i].user_id){ responsable = jUsuarios[j].name;}
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jPedidos[i].ordernumber+`</th>
                                                        <td>`+jPedidos[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                    </tr>`
                }
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
                                                <th scope="col">Responsable</th>
                                                <th scope="col">Área</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody class="table-group-divider" id="tablaActivos><tr><th scope="row"></th></tr>`
        
        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].who_id_created == jUsuario.id ){
                    if(jPedidos[i].status == 'Activo'){
                        for(j = 0; j < contUsuarios; j++){
                            if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                        }
                        for(k = 0; k < contArea; k++){
                            if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                        }
                        sVentana = sVentana + `<tr>
                                                            <th scope="row">`+jPedidos[i].ordernumber+`</th>
                                                            <td>`+jPedidos[i].status+`</td>
                                                            <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                            <td>`+responsable+`</td>
                                                            <td>`+area+`</td>
                                                        </tr>`
                    }
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
                                                                <th scope="col">Responsable</th>
                                                                <th scope="col">Área</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="table-group-divider" id="tablaParciales">`
        
        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].who_id_created == jUsuario.id ){
                    if(jPedidos[i].status == 'Parcial'){
                        for(j = 0; j < contUsuarios; j++){
                            if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                        }
                        for(k = 0; k < contArea; k++){
                            if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                        }
                        sVentana = sVentana + `<tr>
                                                            <th scope="row">`+jPedidos[i].ordernumber+`</th>
                                                            <td>`+jPedidos[i].status+`</td>
                                                            <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                            <td>`+responsable+`</td>
                                                            <td>`+area+`</td>
                                                        </tr>`
                    }
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
                                                                <th scope="col">Responsable</th>
                                                                <th scope="col">Área</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="table-group-divider" id="tablaFinalizado">`

        if(contadorObjetos > 0){
            let responsable = '';
            let area = '';
            for(i=0; i < contadorObjetos; i++){
                if(jPedidos[i].who_id_created == jUsuario.id ){
                    if(jPedidos[i].status == 'Finalizado'){
                        for(j = 0; j < contUsuarios; j++){
                            if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                        }
                        for(k = 0; k < contArea; k++){
                            if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                        }
                        sVentana = sVentana + `<tr>
                                                            <th scope="row">`+jPedidos[i].ordernumber+`</th>
                                                            <td>`+jPedidos[i].status+`</td>
                                                            <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                            <td>`+responsable+`</td>
                                                            <td>`+area+`</td>
                                                        </tr>`
                    }
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
        sVentana = sVentana + `             <table class="table table-hover border border-info">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">N° pedido</th>
                                                            <th scope="col">Estatus</th>
                                                            <th scope="col">Fecha de creación</th>
                                                            <th scope="col">Responsable</th>
                                                            <th scope="col">Área</th>
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
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jAceptados[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; j < contArea; k++){
                        if(jArea[k].id == jAceptados[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jAceptados[i].ordernumber+`</th>
                                                        <td>`+jAceptados[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`, 1)'>`+new Date(jAceptados[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td>
                                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptados[i].id+`,`+jAceptados[i].ordernumber+`, 5)'>
                                                                <i class="bi bi-arrow-left-right"></i>
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
                                                <!-- Fin de la tabla Aceptados-->
                                                <!-- Inicio de la tabla por Aceptar-->
                                                <div class="tab-pane fade" id="pills-aceptar" role="tabpanel" aria-labelledby="pills-aceptar-tab" tabindex="0">
                                                    <table class="table table-hover border border-black">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">N° pedido</th>
                                                                <th scope="col">Estatus</th>
                                                                <th scope="col">Fecha de creación</th>
                                                                <th scope="col">Responsable</th>
                                                                <th scope="col">Área</th>
                                                                <th scope="col">Funciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="table-group-divider" id="tablaAceptar">`;

    if(contAceptar > 0){
        let responsable = '';
        let area = '';
        //console.log(jAceptar);
        for(i=0; i < contAceptar; i++){
            if(jAceptar[i].area_id == jUsuario.user_rol_id && jAceptar[i].acepted == 0){
                if(jAceptar[i].acepted == 0){
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jAceptar[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jAceptar[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jAceptar[i].ordernumber+`</th>
                                                        <td>`+jAceptar[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jAceptar[i].id+`,`+jAceptar[i].ordernumber+`, 1)'>`+new Date(jAceptar[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
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
                        <div class="tab-pane fade" id="home-tab-Todos" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                            <div class="container-xxl" >
                                
                            </div>
                        </div>
                    </div>`;
    document.getElementById('app').innerHTML = sVentana;
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 6){
       //let esperar = await tablaTodosAdm();
       //setTimeout(tablaTodosAdm, 5000);
    }
    loading(2);
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
    /*
    document.getElementById("btnModanNuevoP")
    .addEventListener("click", function(event) {
        alert("Submit button is clicked!");
        event.preventDefault();
    });
    */
}

async function tablaTodosAdm(jUsuarioTodo){ 

    /* Veremos esto el lunes xD
    // Simula un JSON con datos
    let jsonDatos = await apiSolTodPed();


    // Accede al elemento recién creado
    const miElemento = document.querySelector('#tablaTodoPedAb');

    // Borra el contenido actual del elemento
    miElemento.innerHTML = '';

    // Crea la tabla y sus elementos
    const tabla = document.createElement('table');
    const encabezado = document.createElement('thead');
    const cuerpo = document.createElement('tbody');

    // Crea el encabezado de la tabla
    const encabezadoFila = document.createElement('tr');
    encabezadoFila.innerHTML = '<th>Nombre</th><th>Edad</th>';
    encabezado.appendChild(encabezadoFila);

    // Itera sobre el JSON y crea las filas y celdas de datos
    jsonDatos.forEach(datos => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${datos.nombre}</td><td>${datos.edad}</td>`;
    cuerpo.appendChild(fila);
    });

    // Agrega el encabezado y el cuerpo a la tabla
    tabla.appendChild(encabezado);
    tabla.appendChild(cuerpo);

    // Agrega la tabla al elemento HTML deseado
    miElemento.appendChild(tabla);
    */


    /*document.getElementById('tablaTodoPed').innerHTML = '';

    
    let jTodos = await apiSolTodPed();
    console.log(jTodos);
    var sTablaTodosPed = '';
    let countTodosPed = 0;

    Object.keys(jTodos).forEach((clave) => {
        if (typeof jTodos[clave] === "object") {
            countTodosPed++;
        }
    });
    sTablaTodosPed = sTablaTodosPed + `<table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">N° pedido</th>
                                                    <th scope="col">Estatus</th>
                                                    <th scope="col">Fecha de creación</th>
                                                    <th scope="col">Responsable</th>
                                                    <th scope="col">Área</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tablaTodosAdmB">   `;
   // document.getElementById('tablaTodosAdmB').innerHTML = '';
    for(i = 0; i < countTodosPed; i++){
        sTablaTodosPed = sTablaTodosPed + `     <tr>
                                                    <th scope="row">`+jTodos[i].ordernumber+`</th>
                                                    <td>`+jTodos[i].status+`</td>
                                                    <td>`+jTodos[i].startdate+`</td>
                                                    <td>`+jTodos[i].user_id+`</td>
                                                    <td>`+jTodos[i].area_id+`</td>
                                                </tr>`;
    }

    sTablaTodosPed = sTablaTodosPed + `     </tbody>
                                        </table>`;
    document.getElementById('tablaTodoPed').innerHTML = sTablaTodosPed;
    //setTimeout(home(jUsuarioTodo), 5000);*/
}

async function aceptar(orderId, orderNumber, userId){
    let datos = {
        orderId     : orderId,
        orderNumber : orderNumber,
        userId      : userId
    }
    let resulP = await apiAceptarPed(datos);
    //console.log(resulP);
    if(resulP.status == 200){
        loading(2);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se ha creado el pedido',
            showConfirmButton: false,
            timer: 1500
        })
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

            Object.keys(jArea).forEach((clave) => {
                if (typeof jArea[clave] === "object") {
                    contArea++;
                }
            });
    switch(opc){
        case 1: //Modal de historial de pedidos 
            tamanomodal(0);
            let jHistorial = await apiHistorial(idOrder);
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

                for(i=0; i < contHistorial; i++){ 
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jHistorial[i].user_id)        responsable = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].acepted_by)     acepted     = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].canceled_by)    canceled    = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].asigned_id)     asigned     = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].rejected_by)    rechazado   = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jHistorial[i].area_id) area = jArea[k].name;
                    }  
                    if(jHistorial[i].rejected_by != null) sModalVentana = sModalVentana + `<tr class="table-danger">`; //Si es cancelado se pone en Rojo
                        else if(jHistorial[i].status == 'Parcial') sModalVentana = sModalVentana + `<tr class="table-warning">`; //Si es parcial se pone en naranja
                            else if(jHistorial[i].status == 'Finalizado') sModalVentana = sModalVentana + `<tr class="table-success">`; //Si es finalizado se pone en verde
                                else if(jHistorial[i].canceled_by != null) sModalVentana = sModalVentana + `<tr class="table-danger">`; //Si es cancelado se pone en Rojo
                                    else sModalVentana = sModalVentana + `<tr">`; //Si no es nimguno de los anteriores se pone de color por defecto
                    sModalVentana = sModalVentana + `<td scope="row">`+new Date(jHistorial[i].changed_date).toLocaleString()+`</td>
                                            <td>`+area+`</td>
                                            <td>`+responsable+`</td>`;
                    if(jHistorial[i].canceled_by != null) sModalVentana = sModalVentana + `<td>Cancelado por: <strong>`+canceled+`</strong></td>`;//Valida si esta cancelado
                    else if(jHistorial[i].acepted_by != null) sModalVentana = sModalVentana + `<td>Aceptado por: <strong>`+acepted+`</strong></td>`;//Valida si esta Aceptado
                        else if(jHistorial[i].asigned_to == 0) sModalVentana = sModalVentana + `<td>Asignado al area: <strong>`+area+`</strong></td>`;//Valida si esta Asignado
                            else if(jHistorial[i].rejected_by != null) sModalVentana = sModalVentana + `<td>Rechazado por: <strong>`+rechazado+`</strong></td>`;//Valida si esta Asignado
                                else sModalVentana = sModalVentana + `<td>Creado por <strong>`+responsable+`</strong></td>`;//Si no es niguna de las otras validaciones es creado el pedido
                    if(jHistorial[i].cancellation_details != null) sModalVentana = sModalVentana + `<td>`+jHistorial[i].cancellation_details+`</td>`;//Valida si tiene un mensaje el pedido
                    else sModalVentana = sModalVentana + `<td>N/A</td>`;//Si este no contiene un mensaje imprime N/A (No Aplica)
                    sModalVentana = sModalVentana + `</tr>`;                     
                }
            }                     
                                    
            sModalVentana = sModalVentana + `
                                    </tbody>
                                </table>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
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
            let jUserP = await apiUsuario(usuIdGlobal);
            //console.log(jUserP[0].name);
            sModalVentana = sModalVentana + `
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Agregar nuevo pedido</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrarMoNuevo"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="containerModal">
                                                    <div class="input-group mb-3">
                                                        <span class="input-group-text" id="inputGroup-sizing-default">Nuevo pedido</span>
                                                        <input type="int" class="form-control" id="nuevoPedidoInput" min="1" pattern="[0-9]+" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Ejemplo: 45055">
                                                    </div>
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
            let jUser = await apiUsuario(idOrder);
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
                                                    <img src="`+jUser[0].urlPic+`" class="rounded mx-auto d-block mb-3" alt="..." style="max-width: 300px;">
                                                    <div class="row g-0 ">
                                                        <div class="col-sm-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default">Nombre</span>
                                                                <input type="text" class="form-control me-2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" disabled value="`+jUser[0].name+`">
                                                            </div>
                                                        </div>
                                                        <div class="col-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default">Correo</span>
                                                                <input type="text" class="form-control me-2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" disabled value="`+jUser[0].email+`">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="container">
                                                    <div class="row g-0 ">
                                                        <div class="col-sm-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default">Área</span>
                                                                <input type="text" class="form-control me-2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" disabled value="`+area+`">
                                                            </div>
                                                        </div>
                                                        <div class="col-6 col-md-6">
                                                            <div class="input-group mb-3 me-2">
                                                                <span class="input-group-text" id="inputGroup-sizing-default">Fecha de creación</span>
                                                                <input type="text" class="form-control me-2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" disabled value="`+new Date(jUser[0].updated_at).toLocaleDateString()+`">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                                            </div>`;
            break;

        case 5://Modal asignar
            let jUserS = await apiUsuario(usuIdGlobal);
            //console.log(jUserS[0].name);
            let areaS        = '';
            console.log(jUserS);
            console.log("usuIdGlobal",usuIdGlobal,"arGlobal ",arGlobal, "orderNumber", orderNumber, "IdOrder", idOrder, "jUserS[0].id",jUserS.id);
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
                                                        </li>
                                                    </ul>
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
    }

    document.getElementById('modalInfo').innerHTML = sModalVentana;

}

async function nuevoPed(area, userId){

    loading(1);
    let datosP = {
        area    : area,
        userId  : userId,
        numOrder : document.getElementById('nuevoPedidoInput').value
    }
    let resultP = await apiAgregarPed(datosP);
    
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
            title: 'Ha ocurrido un error',
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
    let resulP = await apiRechazarPed(datosP);
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
        if(modMenu == 1){
            let selectArea = document.getElementById('selectedArea').value;
            //console.log(selectArea);
            let datos = {
                area    : selectArea,
                numOrder: numOrder,
                idUser  : idUser,
                idOrder : idOrder
            }
            let result = await apiAvanzaPedido(datos);
            if(result.status == 200){
                recargar();
                document.querySelector('#cerrarModal').click();
            }
        }
        if(modMenu == 2){
            let selectVendedor = document.getElementById('selectedVendedor').value;
            let msgRegVentas   = document.getElementById('msgRegVentas').value;
            let datos = {
                vendedor: selectVendedor,
                msg     : msgRegVentas,
                numOrder: numOrder,
                idUser  : idUser,
                idOrder : idOrder
            }
            let result = await apiRegAVentas(datos);
            if(result.status == 200){
                recargar();
                document.querySelector('#cerrarModal').click();
            }
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
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedVendedor" aria-label="Default select example">
                                        <option value="99" >Seleccione a un vendedor</option>`
            for(i = 0; i < contUsuarios; i++){
                if(jUsuarios[i].user_rol_id == 3){
                    sModalVentana = sModalVentana + `<option value="`+jUsuarios[i].id+`">`+jUsuarios[i].name+`</option>`;
                }
            }
            sModalVentana = sModalVentana +`</select>`;
            break;
        case 2:
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedArea" aria-label="Default select example">
                                        <option >Seleccione una área</option>`
            for(i = 0; i < contArea; i++){
                if(jArea[i].id != 3 && jArea[i].id != 0) sModalVentana = sModalVentana + `<option value="`+jArea[i].id+`">`+jArea[i].name+`</option>`;
            }
            sModalVentana = sModalVentana +`</select>`;
            
            break;
        
    }

    return sModalVentana;
    
}