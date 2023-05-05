/*
Esta pagia esta lo de la librería de axios
https://desarrolloweb.com/articulos/axios-ajax-cliente-http-javascript.html
*/
var varGlobal = 0; //0 = login, 2 = cambio de contraseña, 3 = nuevo pedido,
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
            console.log("email: ",email," pass: ",pass);
            fetch('http://localhost:5000/api/login', {
                method: "POST",
                body: JSON.stringify(_datos),
                headers: {'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',}
            })
            .then(response => response.json()) 
            .then(function(json) {
                console.log(json);
                if(json.if_update != 0){

                }else{
                    changePasswordView(1, json.id);
                }
            })
            .catch(err => console.log(err));
        }else{
            alert("Todos los campos deben de ser llenados")
        }
    }else{
        alert("Usuario o contraseña son incorrectos")
    }
}

function changePasswordView(newU, id){
    varGlobal = 2;
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

function changePassword(id){
    var newPass = document.getElementById('newInpPass').value.trim();
    var rNePass = document.getElementById('newRInpPass').value.trim();

    if (newPass == rNePass){
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
            console.log(json);
            if(json.if_update != 0){

            }else{
                changePasswordView(1)
            }
        }
        )
        .catch(err => console.log(err));
    }
}