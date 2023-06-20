let jProductosGlobal;
var URLactual = window.location;
//var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
if(URLactual.href.substring(0,28) == 'http://192.168.1.74:81/spfg/'){
    var urlBase     = 'http://192.168.1.74:5000/api/';//Url donde están las apis 
}
if(URLactual.href.substring(0,22) == 'http://localhost/spfg/'){
    var urlBase     = 'http://localhost:5000/api/';//Url donde están las apis 
}
if(URLactual.href.substring(0,28) == 'http://187.188.181.242:81/spfg/'){
    var urlBase     = 'http://187.188.181.242:5000/api/';//Url donde están las apis 
}

//APIs
async function apiProductosSearch(producto){   
    const url = urlBase+'solProductosSearch';
    const data = {
        producto: producto,
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
    var solProducto = [];
    solProducto = await fetch(apiUrl, options)
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
    //console.log(solProducto);
    return solProducto;
}
//Fin APIs
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
                if(jUsuario.user_rol_id != 0 && jUsuario.user_rol_id != 3 && jUsuario.user_rol_id != 2){
                    errorInic();
                }else{
                    //console.log(jUsuario);
                    inicio(jUsuario);
                } 
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
        //location.href ="http://192.168.1.74:81/spfg/";
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

async function inicio(jUsuario){
    $("#nomUser").text(jUsuario.name);
    $("#nomVend").val(jUsuario.name);
    $("#correoVend").val(jUsuario.email);
}

async function searchProduct(){
    let verif = 0;
    let producto = '';
    producto = document.getElementById('buscarProd').value.trim();
    if(producto == ''){
        Swal.fire({
            title: '¿Esta seguro/a de que quiere solicitar toda la lista?',
            text: "Esto puede provocar que el servicio se alente e incluso deje de funcionar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Si, traer todo'
        }).then((result) => {
            if (result.isConfirmed) {
                verif = 1;
            }
        })
    }else{
        verif = 1;
    }
    
    if(verif == 1){
        loading(1);
        let sProductos = '';
        let jProductos;
        
        
        document.getElementById('tablaProductosS').innerHTML = '';
        
        jProductos = await apiProductosSearch(producto);
        jProductosGlobal = jProductos;
        let contadorObjetos = 0;
        Object.keys(jProductos).forEach((clave) => {
            if (typeof jProductos[clave] === "object") {
                contadorObjetos++;
            }
        });
        if(contadorObjetos > 0){
            for(i = 0; i < contadorObjetos; i++){
                sProductos = sProductos + `
                                    <tr>
                                        <td scope="row">`+jProductos[i].codigo+`</td>
                                        <td>`+jProductos[i].codprov+`</td>
                                        <td>`+jProductos[i].um+`</td>
                                        <td>`+jProductos[i].descripcion+`</td>
                                        <td>`+jProductos[i].prov+`</td>
                                        <td>`+jProductos[i].fechalista+`</td>
                                        <td><input type="text" class="form-control border border-primary" id="inCosto`+i+`" value="`+parseFloat(jProductos[i].lista).toFixed(2)+`" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"></td>
                                        <td><button type="button" class="btn btn-outline-primary"><i class="bi bi-plus" onclick="agregarProd(`+i+`)"></i></button></td>
                                    </tr>
                                    `;
            }
            
        }

        document.getElementById('tablaProductosS').innerHTML = sProductos;
        loading(2);
    }
}
let jListaProdGlobal = [];
async function agregarProd(pos){
    console.log(jListaProdGlobal);
    let objeto = {
        id          : jProductosGlobal[pos].id,
        codigo      : jProductosGlobal[pos].codigo,
        codprov     : jProductosGlobal[pos].codprov,
        descripcion : jProductosGlobal[pos].descripcion,
        emp         : jProductosGlobal[pos].emp,
        fechalista  : jProductosGlobal[pos].fechalista,
        industria   : jProductosGlobal[pos].industria,
        lista       : document.getElementById("inCosto"+pos+"").value,
        marca       : jProductosGlobal[pos].marca,
        mon         : jProductosGlobal[pos].mon,
        oferta      : jProductosGlobal[pos].oferta,
        prov        : jProductosGlobal[pos].prov,
        sat         : jProductosGlobal[pos].sat,
        um          : jProductosGlobal[pos].um
    }
    jListaProdGlobal.push(objeto);
    let json = JSON.stringify(jListaProdGlobal);
    mostrarProdAgreg();
}

async function mostrarProdAgreg(){
    document.getElementById('tablaProductosPed').innerHTML = '';
    let contadorObjetos = 0;
    let sProductosList = '';
    Object.keys(jListaProdGlobal).forEach((clave) => {
        if (typeof jListaProdGlobal[clave] === "object") {
            contadorObjetos++;
        }
    });
    if(contadorObjetos > 0){
        for(i = 0; i < contadorObjetos; i++){
            sProductosList = sProductosList + `
                                <tr>
                                    <td scope="row">`+jListaProdGlobal[i].codigo+`</td>
                                    <td>`+jListaProdGlobal[i].codprov+`</td>
                                    <td>`+jListaProdGlobal[i].um+`</td>
                                    <td>`+jListaProdGlobal[i].descripcion+`</td>
                                    <td>`+jListaProdGlobal[i].prov+`</td>
                                    <td>`+jListaProdGlobal[i].fechalista+`</td>
                                    <td>`+parseFloat(jListaProdGlobal[i].lista).toFixed(4)+`</td>
                                    <td><button type="button" class="btn btn-outline-primary"><i class="bi bi-plus" onclick="agregarProd(`+i+`)"></i></button></td>
                                </tr>
                                `;
        }
    }
    document.getElementById('tablaProductosPed').innerHTML = sProductosList;

}