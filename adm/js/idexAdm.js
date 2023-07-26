var URLactual = window.location;
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
    //console.log(_datos);
    //console.log(urlBase+urlCont);
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
    let desc = '';
    if(jProducto[3].indexOf('"') > 0){
        desc = jProducto[3].replace(`"`,`PUL`);
    }else{
        desc = jProducto[3];
    }

    let _datos = {
        codigo       : jProducto[0],
        codprov      : jProducto[1],
        um           : jProducto[2],
        descripcion  : desc,
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

async function apiListMarcas(){
    let url       = urlBase+'listMarcas'; //Anidamos la url a la API seleccionada
    const headers = new Headers();//Creamos los heades que se necesitan
    headers.append('Content-Type', 'application/json');
    const options = {//Las carcateristicas que tendrán los heaaders
        method: 'GET',//Metodo a utilizar
        mode: 'cors',//Permitimos los cors
        headers: headers,
    };
    var solPeticion = [];//Variable donde guardaremos el json que nos responda
    solPeticion = await fetch(url, options)//Hacemos la peticion con la funcion fetch
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
                                    <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="listProd-tab" data-bs-toggle="tab" data-bs-target="#listProd-tab-pane" type="button" role="tab">Agregar productos</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="especial-tab" data-bs-toggle="tab" data-bs-target="#especial-tab-pane" type="button" role="tab">Productos especiales</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" onclick="listMarc()" id="listas-tab" data-bs-toggle="tab" data-bs-target="#listas-tab-pane" type="button" role="tab">Precios de lista</button>
                                        </li>
                                    </ul>
                                    <div class="tab-content mt-3" id="myTabContent">
                                        <div class="tab-pane fade show active" id="listProd-tab-pane" role="tabpanel" aria-labelledby="listProd-tab" tabindex="0">
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
                                        </div>
                                        <div class="tab-pane fade" id="especial-tab-pane" role="tabpanel" aria-labelledby="especial-tab" tabindex="0">
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
                                        </div>
                                        <div class="tab-pane fade" id="listas-tab-pane" role="tabpanel" aria-labelledby="listas-tab" tabindex="0">
                                            <div class="row g-0 text-end">
                                                <div class="col-sm-6 col-md-12">
                                                    <button type="button" class="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#modal-nuevoProv">Agregar Nuevo Proveedor</button>
                                                    <button type="button" class="btn btn-info" >Guardar Todo</button>
                                                </div>
                                            </div>
                                            <div id="tablaDiv"></div>
                                            <div class="row g-0 text-end">
                                                <div class="col-sm-6 col-md-12">
                                                    <button type="button" class="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#modal-nuevoProv">Agregar Nuevo Proveedor</button>
                                                    <button type="button" class="btn btn-info" >Guardar Todo</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                </div>`;

    document.getElementById('app').innerHTML = sVentanaAdm;
}

async function gNueProv(){
    datos = {
        proveedor : document.getElementById('mProveedor').value.trim(),
        lista1    : document.getElementById('mLista1').value.trim(),
        lista2    : document.getElementById('mLista2').value.trim(),
        lista3    : document.getElementById('mLista3').value.trim()
    }
    if(datos.proveedor != '' && datos.lista1 != '' && datos.lista2 != '' && datos.lista3 != ''){
        let res = await apiMasterPost(datos, 'nuevProv');
        if(res.status == 200){
            Swal.fire({
                icon: 'success',
                title: 'El proveedor <strong>'+datos.proveedor+'</strong> se guardó',
                showConfirmButton: false,
                timer: 1500
            });
            document.querySelector('#listas-tab').click();
            document.querySelector('#cerrarModalProv').click();
            document.getElementById('mProveedor').value = '';
            document.getElementById('mLista1').value    = '';
            document.getElementById('mLista2').value    = '';
            document.getElementById('mLista3').value    = '';
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'A ocudido un error',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Por favor llene todos los campos',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

async function listMarc(){
    document.getElementById('tablaDiv').innerHTML      = '';
    let sList = '';
    let jList = await apiListMarcas();
    var tablaDiv = document.getElementById("tablaDiv");
    var tabla = document.createElement("table");
    // Agrega el <canvas> al <div> utilizando appendChild
    tabla.id = 'tableList';
    tabla.classList.add('table');
    tabla.classList.add('table-hover');
    tablaDiv.appendChild(tabla);

    sList = sList + `   <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Proveedor</th>
                                <th scope="col">Lista 1</th>
                                <th scope="col">Lista 2</th>
                                <th scope="col">Lista 3</th>
                                <th scope="col">Función</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                    `;
    for(i = 0; i < jList.length; i++){
        sList = sList + `<tr>
                            <td scope="col">`+(i+1)+`</td>
                            <td scope="col">
                                <input id="inNameProv-`+jList[i].id+`" type="text" class="form-control border" placeholder="%" value="`+jList[i].nameComp+`">
                            </td>
                            <td scope="col">
                                %<input type="text" style="width: 150px; display: inline;" class="form-control border" placeholder="%" id="inList1-`+jList[i].id+`" value="`+jList[i].list1+`" onkeypress="return validarNumeros(event)">
                            </td>
                            <td scope="col">
                                %<input type="text" style="width: 150px; display: inline;" class="form-control border" placeholder="%" id="inList2-`+jList[i].id+`" value="`+jList[i].list2+`" onkeypress="return validarNumeros(event)">
                            </td>
                            <td scope="col">
                                %<input type="text" style="width: 150px; display: inline;" class="form-control border" placeholder="%" id="inList3-`+jList[i].id+`" value="`+jList[i].list3+`" onkeypress="return validarNumeros(event)">
                            </td>
                            <td scope="col">
                                <button type="button" class="btn btn-success" onclick="actProv(`+jList[i].id+`)"><i class="bi bi-cloud-arrow-up"></i></button>
                                <button type="button" class="btn btn-danger" onclick="eliminarProv(`+jList[i].id+`)"><i class="bi bi-trash3"></i></button>
                            </td>
                        </tr>
                    `;
    }
    sList = sList + `</tbody>`;

    document.getElementById('tableList').innerHTML      = sList;
}

function validarNumeros(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode !== 45 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

async function actProv(id){
    let prov = document.getElementById('inNameProv-'+id+'').value;
    Swal.fire({
        title: '¿Desea actualizar a <strong>'+prov+'</strong>?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, actualizar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let datos = {
                id     : id,
                prov   : document.getElementById('inNameProv-'+id+'').value.trim(),
                lista1 : document.getElementById('inList1-'+id+'').value.trim(),
                lista2 : document.getElementById('inList2-'+id+'').value.trim(),
                lista3 : document.getElementById('inList3-'+id+'').value.trim()
            }
            let res = await apiMasterPost(datos, 'actProv');
            if(res.status == 200){
                Swal.fire({
                    icon: 'success',
                    title: 'El proveedor <strong>'+datos.prov+'</strong> se actualizó con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                document.querySelector('#listas-tab').click();
            }
        }
    })
    
}

async function eliminarProv(id){
    let prov = document.getElementById('inNameProv-'+id+'').value;
    Swal.fire({
        title: '¿Desea eliminar a <strong>'+prov+'</strong>?',
        text: "Si se elimina no se podrá recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let datos = {
                id : id
            }
            let res = await apiMasterPost(datos, 'eliminarProv');
            if(res.status == 200){
                Swal.fire({
                    icon: 'success',
                    title: 'El proveedor <strong>'+prov+'</strong> se eliminó con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                document.querySelector('#listas-tab').click();
            }
        }
    })
    
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
    console.log("hola");
    console.log(jsonData[0]);
    // Lógica para verificar si los datos ya existen en la base de datos
    // Retorna true si los datos existen, o false si no existen
    let jsonArray = 0;
    let validar;
    jsonArray = Object.keys(jsonData).length;
    let resInv;
    //if(opc != 3)  resInv = await apiResetInvalido(jsonData.prov);
    for(i = 1; i < jsonArray; i++){
        console.log("codigo: ",jsonData[i].codigo," num: ",i);
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