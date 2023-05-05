/*
Esta pagia esta lo de la librería de axios
https://desarrolloweb.com/articulos/axios-ajax-cliente-http-javascript.html
*/

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
    var clave = "email"
    var clave = obtenerCookie(clave);
    if (clave != "") {
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

function iniciarSesion(){
    var email = document.getElementById('inpEmail').value;
    var pass  = document.getElementById('inpPass').value;
    if(email.includes("@") && email.includes(".")){
        if(pass != ''){
            loading(1);
            
            console.log("email: ",email," pass: ",pass);
            axios.get("http://192.168.1.74:5000/login", { //Se coloca la url de la api
                //axios.get("http://localhost:5000/login", {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                data: {
                    email: email.trim(),
                    pass: pass.trim()
                }
                }).then(function(res) {
                    if(res.status==200) {
                        console.log(res.data);
                    }
                    loading(2);
                })
                .catch(function(err) {
                    console.log(err);
                })
        }else{
            alert("Todos los campos deben de ser llenados")
        }
    }else{
        alert("Usuario o contraseña son incorrectos")
    }
    
    //Se llama a la api en get con axios
    /*axios.get("https://pokeapi.co/api/v2/pokemon/ditto", { //Se coloca la url de la api
        responseType: 'json' //Como lo va a regresar
      }).then(function(res) {//Si responde la api
        if(res.status==200) {//Verificamos que tenga codigo 200 de validacion
            console.log(res.data);//Manejo de datos en .data
        }
        console.log(res);//Todos los datos que envía el api
    })
    .catch(function(err) {//Si hay error en la petición
      console.log(err);//Manejo del error
    })*/
}