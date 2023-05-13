/*
Esta pagia esta lo de la librería de axios
https://desarrolloweb.com/articulos/axios-ajax-cliente-http-javascript.html
*/
var varGlobal = 0; //0 = login, 2 = cambio de contraseña, 3 = nuevo pedido,
var idGlobal = 0;
var today = new Date(); // Iniciamos la fecha actual
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
            fetch('http://localhost:5000/api/login', {
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

function notificacion(jNotifi){
    document.getElementById('body').innerHTML = `<div class="toast-container position-fixed bottom-0 end-0 p-3" id="notificacion" style="background: rgba(`+jNotifi.color.r+`, `+jNotifi.color.g+`, `+jNotifi.color.b+`, 0.3);">
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
async function apiPedidos(){
       
        const url = 'http://localhost:5000/api/solPedidos';
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
    const url = 'http://localhost:5000/api/usuarios';
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

    const url = 'http://localhost:5000/api/area';
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

async function apiHistorial(orderNum){
    const url = 'http://localhost:5000/api/historial?ordernum=' + orderNum;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solHistorial = [];
    solHistorial = await fetch(url, options)
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

async function home(jUsuario){
    let jPedidos    = await apiPedidos();
    let jUsuarios   = await apiUsuarios();
    let jArea       = await apiArea();
    console.log("jPedidos");
    console.log(jPedidos);
    console.log("jUsuarios");
    console.log(jUsuarios);
    console.log("jArea");
    console.log(jArea);
    let contadorObjetos = 0;

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
                                        <li><a class="dropdown-item" > <i class="bi bi-person-bounding-box mr-2"></i> Perfil</a></li>
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
                                                    <td>`+jPedidos[i].startdate.slice(0, 10)+`</td>
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
                                                        <td>`+jPedidos[i].startdate.slice(0, 10)+`</td>
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
                                                        <td>`+jPedidos[i].startdate.slice(0, 10)+`</td>
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
                                                        <td>`+jPedidos[i].startdate.slice(0, 10)+`</td>
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
                                                        <td>`+jPedidos[i].startdate.slice(0, 10)+`</td>
                                                        <td>`+responsable+`</td>
                                                        <td>`+area+`</td>
                                                        <td>
                                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalAsignar">
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
                                                    <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalTotal" onclick='modalView(`+jPedidos[i].ordernumber+`, 1)'>`+jPedidos[i].startdate.slice(0, 10)+`</button></td>
                                                    <td>`+responsable+`</td>
                                                    <td>`+area+`</td>
                                                    <td>
                                                        <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalAsignar" >
                                                            <i class="bi bi-check-lg"></i>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalRechazar">
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
            var res = fetch('http://localhost:5000/api/changePass', {
                method: "POST",
                body: JSON.stringify(_datos),
                headers: {'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',}
            })
            .then(response => response.json()) 
            .then(function(json) {
                loading(2);
                alert("Por favor Inicie sesión con la nueva contraseña");
                iniciarSesion();
            }
            )
            .catch(err => console.log(err));
        }else{
            alert("Las contraseñas deben cincidir");
        }
    }else{
        alert("Por favor llene los campos");
    }
}

async function modalView(numOrder, opc){
    //El numOrder es el numéro de orden que manda
    /*El opc es la opción a elegir:
    las opciones son; 
    1: historial
    2: Rechazar pedido
    3: Agregar pedido
    */

}