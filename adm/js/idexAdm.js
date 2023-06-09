var URLactual = window.location;
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

//const XLSX = require('./xlsx.full.min');
function comprobarPermiso(){
    loading(1);
    // Crea una instancia del objeto URLSearchParams con la cadena de consulta de la URL actual
    const params = new URLSearchParams(window.location.search);

    // Obtiene el valor de un parámetro específico
    let dataValue = params.get('data');
    if(dataValue != null){
        try {
            const decodedString = atob(dataValue);
            //console.log(decodedString);
            const jUsuario = JSON.parse(decodedString);
            //console.log(jUsuario);

            if( typeof jUsuario === 'object'){
                loading(2);
                home(jUsuario);
            }
          } catch (error) {
            // Si se lanza una excepción, la decodificación falló
            loading(2);
            errorInic();
          }
        
    }else{
        errorInic();
    } 
}

function errorInic(){ //Mensaje de error que no se tienen los permisos
    Swal.fire({
        icon: 'error',
        title: 'No tienes permisos para ver esta área',
        imageUrl: 'https://cdn.memegenerator.es/imagenes/memes/thumb/31/30/31309968.jpg',
        showConfirmButton: false,
        timer: 3500
    })
    setTimeout(function(){
        location.href ="http://192.168.1.74:81/spfg/";
    },3500);
}

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

async function apiMasterPost(_datos, urlCont){ //Sintaxis de esta función let res = await apiMasterPost(json a mandar, api a enviar en string)
    console.log(_datos);
    console.log(urlCont);
    var res = await fetch(urlBase+urlCont, {
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
    //console.log("res.status ", res);
    return res;
}

async function apiResetInvalido(prov){
    let _datos = {
        prov : prov
    }
    let res = await apiMasterPost(_datos,'resetInvalido');
    return res;
}

async function apiAgregarProd(jProducto, opc){
    //El opc 0 es producto en general y el 1 es producto especial
    

    let _datos = {
        codigo       : jProducto[0],
        codprov      : jProducto[1],
        um           : jProducto[2],
        descripcion  : jProducto[3],
        especial     : opc,
        industria    : jProducto[4],
        mon          : jProducto[5],
        marca        : jProducto[6],
        prov         : jProducto[7],
        fechaLista   : jProducto[8],
        costo        : jProducto[9],
        emp          : jProducto[10],
        sat          : jProducto[11],
        oferta       : jProducto[12],
        invalido     : 1
    }
    let res = await apiMasterPost(_datos, 'agregarProd');
    return res;
}

async function apiAgregarPorcen(jData){
    let _datos = {
        marca  : jData[0],
        lista1 : jData[1],
        lista2 : jData[2],
    }

    let res = await apiMasterPost(_datos, 'agregarPorcen');
    console.log(_datos);
    return 200;
}

function atras(){
    window.history.back();
}

async function home(jUsuario){
    let sVentanaAdm = '';
    document.getElementById('app').innerHTML = '';
    sVentanaAdm = sVentanaAdm + `<nav class="navbar bg-body-tertiary mb-5"> <!--Inicio del nav-->
                                    <div class="container-fluid">
                                        <a class="navbar-brand ms-4" id="idLogo" onclick="atras()">
                                            <img src="../img/logo_web.45818d48.png" alt="PFG" width="160" height="70">
                                        </a>
                                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link active" id="home-tab" type="button" aria-controls="home-tab-pane" aria-selected="true" onclick="atras()">Inicio</button>
                                            </li>
                                        </ul>
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
                                </nav><!--Fin del nav-->`
    sVentanaAdm = sVentanaAdm + `<div class="container"> 
                                    <div class="card mb-3">
                                        <div class="card-header">
                                            Actualizar o agregar productos a las listas
                                        </div>
                                        <div class="card-body" id="listaAdm">
                                            <h5 class="card-title">Actualizar o agregar productos a las listas</h5>
                                            <p class="card-text">A la hora de ingresar las listas, por favor que sean en extensión <strong>.xlsm</strong> (<strong>Excel</strong>) y por proveedor, esto para evitar que el servidor tenga intermitencias.</p>
                                            <a class="btn btn-primary" onclick="productosGene(1)">Abrir</a>
                                        </div>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-header">
                                            Actualizar o agregar productos <strong>especiales</strong> a las listas
                                        </div>
                                        <div class="card-body" id="listaAdm">
                                            <h5 class="card-title">Actualizar o agregar productos <strong>especiales</strong> a las listas</h5>
                                            <p class="card-text">A la hora de ingresar las listas, por favor que sean en extensión <strong>.xlsm</strong> (<strong>Excel</strong>), esto para evitar que el servidor tenga intermitencias.</p>
                                            <a class="btn btn-primary" onclick="productosGene(2)">Abrir</a>
                                        </div>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-header">
                                            Actualizar el <strong>porcentaje</strong> a las 3 listas
                                        </div>
                                        <div class="card-body" id="listaAdm">
                                            <h5 class="card-title">Actualizar el <strong>porcentaje</strong> a las 3 listas</h5>
                                            <p class="card-text">A la hora de ingresar las listas, por favor que sean en extensión <strong>.xlsm</strong> (<strong>Excel</strong>), esto para evitar que el servidor tenga intermitencias.</p>
                                            <a class="btn btn-primary" onclick="productosGene(3)">Abrir</a>
                                        </div>
                                    </div>
                                </div>`;

    document.getElementById('app').innerHTML = sVentanaAdm;
}

async function productosGene(opc){
    let msg = [
        "",
        "Seleccionar archivo XLSX de los productos",
        "Seleccionar archivo XLSX de los productos especiales",
        "Seleccionar archivo XLSX de los porcentajes de listas"
    ]
    console.log(msg[opc]);
    Swal.fire({
        title: msg[opc],
        input: 'file',
        inputAttributes: {
            accept: '.xlsx'
        },
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        inputValidator: (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    const worksheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetName];

                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    //console.log(jsonData);
                    let resExist;
                    resExist = await productosEnBD(jsonData, opc); 

                    if(resExist != 500) resolve();
                    else reject();
                };
            
                reader.onerror = (error) => {
                    loading(2);
                    reject('Error al leer el archivo');
                };
                reader.readAsArrayBuffer(file);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            loading(2);
            const jsonData = result.value;
            //console.log(jsonData);
            Swal.fire('Se han subido los productos', '', 'success');
        }
    });
}

function convertirXLSXToJson(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            resolve(jsonData);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}
  
async function productosEnBD(jsonData, opc) {
    loading(1);
    // Lógica para verificar si los datos ya existen en la base de datos
    // Retorna true si los datos existen, o false si no existen
    let jsonArray = 0;
    let validar;
    jsonArray = Object.keys(jsonData).length;
    let resInv;
    if(opc != 3)  resInv = await apiResetInvalido(jsonData.prov);
    for(i = 1; i < jsonArray; i++){
        switch(opc){
            case 1: //Ingresa o actualiza pedidos
                validar = await apiAgregarProd(jsonData[i], 0);
                //console.log("validar ",validar," N ",i);      
            break;
            case 2://Ingresa o actualiza productos especiales
                validar = await apiAgregarProd(jsonData[i], 1);
            break;
            case 3://Ingresa o actualiza las marcas y porcentajes de lista
                validar = await apiAgregarPorcen(jsonData[i]);
            break;
        }
        if(validar.status != 200){
            i = jsonArray + 1;
            //console.log("Si entró ",i);
            return 500;
        } 
    }
} 