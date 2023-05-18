/*
Esta pagia esta lo de la librería de axios
https://desarrolloweb.com/articulos/axios-ajax-cliente-http-javascript.html
*/
var varGlobal   = 0; //0 = login, 2 = cambio de contraseña, 3 = nuevo pedido,
var idGlobal    = 0;
var today       = new Date(); // Iniciamos la fecha actual
var arGlobal    = 0;
var modMenu     = 1;
var usuIdGlobal = 0;
var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
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
                console.log(json.status);
                if(json.status == 400){
                    loading(2);
                    alert("Usuario no existe");
                }else{
                    if(json.if_update != 0){
                        console.log(json);
                        home(json);
                    }else{
                        changePasswordView(1, json.id);
                    }
                }
            })
            .catch(err => console.log(err));
        }else{
            var hoy = today.toLocaleString();
            var jNotificacion = {
                "type": "Error",
                "color": [{
                    "r": 237, 
                    "g": 32,
                    "b": 32
                }],
                "time": hoy,
                "msg": "Por favor llene los campos"
            }
            notificacion(jNotificacion);

        }
    }else{
        var hoy = today.toLocaleString();
            var jNotificacion = {
                "type": "Error",
                "color": [{
                    "r": 237, 
                    "g": 32,
                    "b": 32
                }],
                "time":  hoy,
                "msg": "Usuario o contraseña son incorrectos"
            }
            notificacion(jNotificacion);
    }
}
//Notificaciones, que al chile no se si jalan y los puse el 4 de mayo
function notificacion(jNotifi){
    document.getElementById('app').innerHTML = `<div class="toast-container position-fixed bottom-0 end-0 p-3" id="notificacion" style="background: rgba(`+jNotifi.color.r+`, `+jNotifi.color.g+`, `+jNotifi.color.b+`, 0.3);">
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
        alert("Por favor cambié su contraseña.")
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
                alert("Por favor Inicie sesión con la nueva contraseña");
                varGlobal = 0;
                comprobarCookie();
            }
            )
            .catch(err => console.log(err));
        }else{
            alert("Las contraseñas deben coincidir");
        }
    }else{
        alert("Por favor llene los campos");
    }
}

async function apiPedidos(){
       
        const url = urlBase+'solPedidos';
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = {
        method: 'GET',
        mode: 'cors',
        headers: headers,
        };
        var solPedidos = [];
        solPedidos = await fetch(url, options)
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

    let _datos = {
        area    : reqDatos.area,
        idUser  : reqDatos.idUser,
        numOrder: reqDatos.numOrder
    }
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

async function apiAvanzaPedido(reqDatos){
    loading(1);
    let _datos = {
        area    : reqDatos.area,
        numOrder: reqDatos.numOrder,
        idUser  : reqDatos.idUser,
        idOrder : reqDatosidOrder
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
            loading(2);
            document.querySelector('#cerrarMoAsig').click();
        })
        .catch(err => console.log(err));
    }else{
        loading(2);
        alert("Ocurrió un error al asignar")
    }
}

async function apiRegAVentas(reqDatos){
    
}

async function recargar(){
    console.log(userIdGlobal);
    let jUserHome = await apiUsuario(userIdGlobal);
    console.log(jUserHome);
    if(jUserHome != null){
        home(jUserHome[0]);
    }
}

let jArea;
let jUsuarios;
let userIdGlobal;
async function home(jUsuario){
    let jPedidos        = await apiPedidos();
    let GlojArea        = await apiArea();
    let GlojUsuarios    = await apiUsuarios();
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
    if(jUsuario.user_rol_id == 0 || jUsuario.user_rol_id == 2 || jUsuario.user_rol_id == 6){
        arGlobal = jUsuario.user_rol_id;
        sVentana = sVentana + `<li class="nav-item" role="presentation">
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
                                        <li><a class="dropdown-item" ><i class="bi bi-box-arrow-left"></i> Cerrar sesion</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </nav><!--Fin del nav-->
                        <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                            <!--Inicio del menu de los pedidos-->
                            <ul class="nav nav-pills mt-4 mb-3 justify-content-center" id="pills-tab" role="tablist">
                                <li class="nav-item" role="presentation">
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
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-aceptados-tab" data-bs-toggle="pill" data-bs-target="#pills-aceptados" type="button" role="tab" aria-controls="pills-aceptados" aria-selected="false"><i class="bi bi-check2-circle"></i> Aceptados</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-aceptar-tab" data-bs-toggle="pill" data-bs-target="#pills-aceptar" type="button" role="tab" aria-controls="pills-aceptar" aria-selected="false"><i class="bi bi-bell"></i> Por aceptar</button>
                                </li>`;
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
                                <div class="tab-content" id="pills-tabContent">
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
    usuIdGlobal = jUsuario.id;
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
                                            <!-- Fin de la tabla Finalizados-->
                                            <!-- Inicio de la tabla Aceptados-->
                                            <div class="tab-pane fade" id="pills-aceptados" role="tabpanel" aria-labelledby="pills-aceptados-tab" tabindex="0">
                                                <table class="table table-hover border border-info">
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
    if(contadorObjetos > 0){
        let responsable = '';
        let area = '';
        for(i=0; i < contadorObjetos; i++){
            if(jPedidos[i].user_id == jUsuario.id && jPedidos[i].acepted == 1){
                if(jPedidos[i].acepted == 1){
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jPedidos[i].user_id) responsable = jUsuarios[j].name;
                    }
                    for(k = 0; j < contArea; k++){
                        if(jArea[k].id == jPedidos[i].area_id) area = jArea[k].name;
                    }
                    sVentana = sVentana + `<tr>
                                                        <th scope="row">`+jPedidos[i].ordernumber+`</th>
                                                        <td>`+jPedidos[i].status+`</td>
                                                        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 1)'>`+new Date(jPedidos[i].startdate).toLocaleDateString()+`</button></td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td>
                                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 5)'>
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

    if(contadorObjetos > 0){
        let responsable = '';
        let area = '';
        for(i=0; i < contadorObjetos; i++){
            if(jPedidos[i].area_id == jUsuario.user_rol_id && jPedidos[i].acepted == 0){
                if(jPedidos[i].acepted == 0){
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
                                                        <td>
                                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalAsignar" >
                                                                <i class="bi bi-check-lg"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].id+`,`+jPedidos[i].ordernumber+`, 2)'>
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

                                    </div>`;
    document.getElementById('app').innerHTML = sVentana;
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


async function modalView(idOrder, orderNumber, opc){
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

                for(i=0; i < contHistorial; i++){ 
                    for(j = 0; j < contUsuarios; j++){
                        if(jUsuarios[j].id == jHistorial[i].user_id)        responsable = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].acepted_by)     acepted     = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].canceled_by)    canceled    = jUsuarios[j].name;
                        if(jUsuarios[j].id == jHistorial[i].asigned_id)     asigned     = jUsuarios[j].name;
                    }
                    for(k = 0; k < contArea; k++){
                        if(jArea[k].id == jHistorial[i].area_id) area = jArea[k].name;
                    }  
                    if(jHistorial[i].canceled_by != null) sModalVentana = sModalVentana + `<tr class="table-danger">`; //Si es cancelado se pone en Rojo
                        else if(jHistorial[i].status == 'Parcial') sModalVentana = sModalVentana + `<tr class="table-warning">`; //Si es parcial se pone en naranja
                            else if(jHistorial[i].status == 'Finalizado') sModalVentana = sModalVentana + `<tr class="table-success">`; //Si es finalizado se pone en verde
                            else sModalVentana = sModalVentana + `<tr">`; //Si no es nimguno de los anteriores se pone de color por defecto
                    sModalVentana = sModalVentana + `<td scope="row">`+new Date(jHistorial[i].changed_date).toLocaleString()+`</td>
                                            <td>`+area+`</td>
                                            <td>`+responsable+`</td>`;
                    if(jHistorial[i].canceled_by != null) sModalVentana = sModalVentana + `<td>Rechazado por: <strong>`+canceled+`</strong></td>`;
                    else if(jHistorial[i].acepted_by != null) sModalVentana = sModalVentana + `<td>Aceptado por: <strong>`+acepted+`</strong></td>`;
                        else if(jHistorial[i].asigned_by != null) sModalVentana = sModalVentana + `<td>Asignado a: <strong>`+asigned+`</strong></td>`;
                            else sModalVentana = sModalVentana + `<td>None</td>`;
                    if(jHistorial[i].cancellation_details != null) sModalVentana = sModalVentana + `<td>`+jHistorial[i].cancellation_details+`</td>`;
                    else sModalVentana = sModalVentana + `<td>Sin comentarios</td>`;
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
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <p class="text-center fs-3 mb-4">¿Desea cancelar el pedido <strong>`+orderNumber+`</strong>?</p>
                                                <div class="mb-3">
                                                    <label for="exampleFormControlTextarea1" class="form-label">Comentario del rechazo</label>
                                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" style="min-height: 100px; max-height: 400px;"></textarea>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                <button type="button" class="btn btn-primary">Aceptar</button>
                                            </div>`;
            break;
        case 3://Modal para nuevo pedido
            tamanomodal(1);
            let jUserP = await apiUsuario(usuIdGlobal);
            console.log(jUserP[0].name);
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
                                                <button type="button" class="btn btn-primary" onclick="nuevoPed(`+jUserP[0].user_rol_id+`,`+jUserP[0].id+`)">Aceptar</button>
                                            </div>`;
            break;
        
        case 4: //Modal para perfil
            tamanomodal(0);
            //Aquí el idOrder recibe un json del usuario y ahí se usará con ese nombre
            let jUser = await apiUsuario(idOrder);
            console.log(jUser[0].name);
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

        case 5:
            let jUserS = await apiUsuario(usuIdGlobal);
            console.log(jUserS[0].name);
            let areaS        = '';
            sModalVentana = sModalVentana + `
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Reasignar pedido: <strong>`+orderNumber+`</strong></h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="cerrarMoAsig"></button>
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
    let resulP = await apiAgregarPed(datosP);
    if(resulP[0].status == 200){
        recargar();
        loading(2);
        document.querySelector('#cerrarMoNuevo').click();
    }else{
        loading(2);
        alert("No se pudo agregar el nuevo pedido")
    }
}

async function segPedido(opcM, numOrder, idUser, idOrder){
    
    if(opcM != 0) modMenu = opcM
    else{
        if(modMenu == 1){
            let selectArea = document.getElementById('selectedArea');
            let datos = {
                area    : selectArea,
                numOrder: numOrder,
                idUser  : idUser,
                idOrder : idOrder
            }
            let result = await apiAvanzaPedido(datos);
            if(result[0].status == 200){
                recargar();
            }
        }
        if(modMenu == 2){
            let selectVendedor = document.getElementById('selectedVendedor');
            let msgRegVentas   = document.getElementById('msgRegVentas');
            let datos = {
                vendedor: selectVendedor,
                msg     : msgRegVentas,
                numOrder: numOrder,
                idUser  : idUser,
                idOrder : idOrder
            }
            let result = await apiRegAVentas(datos);
            if(result[0].status == 200){
                recargar();
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
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedArea" aria-label="Default select example">
                                        <option selected>Seleccione a un vendedor</option>`
            for(i = 0; i < contUsuarios; i++){
                if(jUsuarios[i].user_rol_id == 3){
                    sModalVentana = sModalVentana + `<option value="`+jUsuarios[i].id+`">`+jUsuarios[i].name+`</option>`;
                }
            }
            sModalVentana = sModalVentana +`</select>`;
            break;
        case 2:
            sModalVentana = sModalVentana + `<select class="form-select" id="selectedVendedor" aria-label="Default select example">
                                        <option selected>Seleccione una área</option>`
            for(i = 0; i < contArea; i++){
                sModalVentana = sModalVentana + `<option value="`+jArea[i].id+`">`+jArea[i].name+`</option>`;
            }
            sModalVentana = sModalVentana +`</select>`;
            
            break;
        
    }

    return sModalVentana;
    
}