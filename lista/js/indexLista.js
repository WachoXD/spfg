//const nodemailer = require('nodemailer');

let jProductosGlobal;
let jUsuarioGlobal;
let sFolioGlobal = 'N/A';
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
async function apiMasterPost(_datos, urlCont){
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
async function apiMasterGET(data, urlF){
    let url       = urlBase+urlF;
    const params  = new URLSearchParams(data);
    const apiUrl  = url + '?' + params;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
    method: 'GET',
    mode: 'cors',
    headers: headers,
    };
    var solPeticion = [];
    solPeticion = await fetch(apiUrl, options)
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
    //console.log(solPeticion);
    return solPeticion;
}

async function apiProductosSearch(producto, prov){   
    const data = {
        producto: producto,
        prov    : prov
    };
    return  await apiMasterGET(data, 'solProductosSearch');;
}

async function apiSearchCoti(folio){   
    const data = {
        folio: folio.toString()
    };
    return  await apiMasterGET(data, 'solCoti');;
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
    document.getElementById('selectProv').innerHTML = `
    <select class="form-select me-3 border border-primary" aria-label="Default select example" id="selectedProv">
        <option selected value="">Seleccione proveedor</option>
        <option value="TRUPER">TRUPER</option>
        <option value="BYP">BYP</option>
        <option value="AUSTROMEX">AUSTROMEX</option>
    </select>`;
    document.getElementById('btnBuscar').innerHTML = `
    <button type="button" class="btn btn-outline-primary" onclick="buscarCot()">
        <i class="bi bi-search"></i> Buscar cotización
    </button>
    <button type="button" class="btn btn-outline-primary me-2" onclick="buscarMisCot()">
        <i class="bi bi-archive"></i> Mis cotizaciones
    </button>`;
    jUsuarioGlobal = jUsuario;
}

async function buscarPd(){
    let verif    = 0;
    let producto = '';
    let porv     = '';
    prov         = document.getElementById('selectedProv').value;
    producto     = document.getElementById('buscarProd').value.trim();
    if(producto == '' && prov == ''){
        Swal.fire({
            title: '¿Está seguro/a de que quiere solicitar toda la lista?',
            text: "Esto puede provocar que el servicio se alente e incluso deje de funcionar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b68d2c',
            cancelButtonColor: '#d33',
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Si, traer todo'
        }).then((result) => {
            if (result.isConfirmed) {
                searchProduct(producto,prov,1);
            }
        })
    }else{
        searchProduct(producto,prov,1);
    }    
}

async function searchProduct(producto, prov, verif){
    if(verif == 1){
        loading(1);
        let sProductos = '';
        let jProductos;
        
        
        document.getElementById('tablaProductosS').innerHTML = '';
        
        jProductos = await apiProductosSearch(producto, prov);
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
                                        <td>`+new Date(jProductos[i].fechalista).toLocaleDateString()+`</td>
                                        <td><input type="number" min="1" class="form-control border border-primary" id="inCantidad`+i+`" value="1" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"></td>
                                        <td><input type="text" class="form-control border border-primary" id="inCosto`+i+`" value="`;
                if(jProductos[i].costo != 'COTIZAR' && jProductos[i].costo != null){
                    sProductos = sProductos + parseFloat(jProductos[i].costo).toFixed(2)
                }else{
                    sProductos = sProductos + "0"
                }
                sProductos = sProductos +`" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"></td>
                                        <td><button type="button" class="btn btn-outline-primary" onclick="agregarProd(`+i+`)"><i class="bi bi-plus"></i></button></td>
                                    </tr>
                                    `;
            }
            
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'No se encontró el producto <strong>'+producto+'<strong>',
                showConfirmButton: false,
                timer: 1500
            })
            document.getElementById('buscarProd').value = '';
            document.getElementById('buscarProd').focus();
        }
        jProductos = [];
        document.getElementById('tablaProductosS').innerHTML = sProductos;
        loading(2);
    }
}
let jListaProdGlobal = [];
async function agregarProd(pos){
    //console.log(jListaProdGlobal);
    let objeto = {
        id          : jProductosGlobal[pos].id,
        codigo      : ''+jProductosGlobal[pos].codigo+'',
        codprov     : ''+jProductosGlobal[pos].codprov+'',
        descripcion : ''+jProductosGlobal[pos].descripcion+'',
        emp         : ''+jProductosGlobal[pos].emp+'',
        fechalista  : ''+jProductosGlobal[pos].fechalista+'',
        especial    : jProductosGlobal[pos].especial,
        lista       : parseFloat(document.getElementById("inCosto"+pos+"").value),
        cantidad    : parseInt(document.getElementById("inCantidad"+pos+"").value),
        marca       : ''+jProductosGlobal[pos].marca+'',
        mon         : ''+jProductosGlobal[pos].mon+'',
        oferta      : ''+jProductosGlobal[pos].oferta+'',
        prov        : ''+jProductosGlobal[pos].prov+'',
        sat         : ''+jProductosGlobal[pos].sat+'',
        um          : ''+jProductosGlobal[pos].um+''
    }
    if(objeto.lista > 0){
        jListaProdGlobal.push(objeto);
        let json = JSON.stringify(jListaProdGlobal);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            background: 'rgba(182, 141, 44, 0.7)',
            color: '#fff',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        
        Toast.fire({
            icon: 'success',
            title: 'El pedido <strong>'+jProductosGlobal[pos].codigo+'</strong> se agregó'
        })
        mostrarProdAgreg();
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'El producto <strong>'+objeto.codigo+'</strong> no puede cobrarse en $0',
            showConfirmButton: false,
            timer: 1500
        })
        document.getElementById("inCosto"+pos+"").focus();
    }
    
}
let contLista = 0;
async function mostrarProdAgreg(){
    document.getElementById('tablaProductosPed').innerHTML = '';
    document.getElementById('btnBuscar').innerHTML         = '';
    document.getElementById('tablaTotal').innerHTML        = '';

    let contadorObjetos = 0;
    let sProductosList  = '';
    let sTablaTotal     = '';
    let sBotones        = '';
    var subTotal        = 0;
    let cantidadTotal   = 0;

    Object.keys(jListaProdGlobal).forEach((clave) => {
        if (typeof jListaProdGlobal[clave] === "object") {
            contadorObjetos++;
        }
    });
    contLista = contadorObjetos;
    if(contadorObjetos > 0){
        let costoU = 0;
        for(i = 0; i < contadorObjetos; i++){
            costoU         = parseFloat(jListaProdGlobal[i].lista).toFixed(4);
            subTotal      += costoU * 1;
            cantidadTotal += jListaProdGlobal[i].cantidad * 1;
            sProductosList = sProductosList + `
                                <tr>
                                    <td scope="row">`+jListaProdGlobal[i].codigo+`</td>
                                    <td>`+jListaProdGlobal[i].codprov+`</td>
                                    <td>`+jListaProdGlobal[i].um+`</td>
                                    <td>`+jListaProdGlobal[i].descripcion+`</td>
                                    <td>`+jListaProdGlobal[i].prov+`</td>
                                    <td>`+new Date(jListaProdGlobal[i].fechalista).toLocaleDateString()+`</td>
                                    <td>`+jListaProdGlobal[i].cantidad+`</td>
                                    <td>$`+costoU+` `+jListaProdGlobal[i].mon+`</td>
                                    <td>$`+parseFloat(costoU*jListaProdGlobal[i].cantidad).toFixed(4)+` `+jListaProdGlobal[i].mon+`</td>
                                    <td><button type="button" class="btn btn-outline-primary" onclick="eliminarProd(`+i+`, '`+jListaProdGlobal[i].codigo+`')"><i class="bi bi-trash"></i></button></td>
                                </tr>
                                `;
        }
    }
    sTablaTotal = sTablaTotal + `
    <table class="table table-hover border border-success table-bordered">
        <tr>
            <th scope="col" style="width: 120px;">Total de productos</th>
            <td style="width: 120px;">`+cantidadTotal+`</td>
        </tr>
        <tr>
            <th scope="col" style="width: 120px;">Subtotal</th>
            <td style="width: 120px;">$ `+parseFloat(subTotal).toFixed(4)+`</td>
        </tr>
        <tr>
            <th scope="col" style="width: 120px;">16% IVA</th>
            <td style="width: 120px;">$ `+parseFloat(subTotal*0.16).toFixed(4)+`</td>
        </tr>
        <tr>
            <th scope="col" style="width: 120px;">Total</th>
            <td style="width: 120px;">$ `+parseFloat(subTotal*1.16).toFixed(4)+`</td>
        </tr>
    </table>
    `;

    sBotones = sBotones + `
    <button type="button" class="btn btn-outline-primary me-2" onclick="buscarCot()">
        <i class="bi bi-search"></i> Buscar cotización
    </button>
    <button type="button" class="btn btn-outline-primary me-2" onclick="buscarMisCot()">
        <i class="bi bi-archive"></i> Mis cotizaciones
    </button>
    <button type="button" class="btn btn-success me-2" onclick="verificarCamposPDF()">
        <i class="bi bi-save"></i> Guardar
    </button>
    <button type="button" class="btn btn-danger me-3" onclick="eliminarCot()">
        <i class="bi bi-trash"></i> Eliminar Pedido
    </button>
    <span class="fs-4"> <strong>Folio:</strong> `+sFolioGlobal+`</span>
    `;
    document.getElementById('btnBuscar').innerHTML         = sBotones;
    document.getElementById('tablaTotal').innerHTML        = sTablaTotal;
    document.getElementById('tablaProductosPed').innerHTML = sProductosList;
}

async function eliminarProd(pos,prod){
    Swal.fire({
        title: '¿El producto <strong>'+prod+'</strong> se eliminará?',
        text: "Se eliminará el producto "+prod+" de la cotización",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Si, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            delete jListaProdGlobal[pos];
            jListaProdGlobal = jListaProdGlobal.filter(Boolean);
            mostrarProdAgreg();
            Swal.fire({
                icon: 'success',
                title: 'El pedido <strong>'+prod+'</strong> fue eliminado',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })  
}

async function verificarCamposPDF(opc){//Validamos que los campos no se encunetren vacios al querer imprimir
    //Guardamos los vaores de los inputs en un arreglo
    let cmp = [ document.getElementById('inRazon').value.trim(), document.getElementById('inAtencion').value.trim(), document.getElementById('telVend').value.trim(), document.getElementById('inDep').value.trim()];
    let res = 100; //Inicializamos una variable de respuesta en 100
    for(i = 0; i < cmp.length; i++){//Realizamos un for para iterar todos los inputas a validar
        if(cmp[i] == '') res = i;//Comparamos si el input actual se encuntra vaciío, si lo está se pone el valor de la posicion a la variable de respuesta
    }
    if(res != 100){//Validamos que el vlor sea difernte a 100 para revisar si encontró un valor vacio
        let txt = ["Razón social", "Atencón a", "Teléfono", "Departamento"];//Generamos un array con los nombres de los inputs
        Swal.fire({//Mensaje en modal
            icon: 'warning',
            title: 'Por favor llene el campo <strong>"'+txt[res]+'"</strong>',
            showConfirmButton: false,
            timer: 1500
        })
        console.log(jListaProdGlobal);
    }else{//Si no encontró inputs vacios se manda a llamar a la funcion y se le envia el array con los inputs
        if(contLista > 0){ //Verificamos que si existan productos agregados a la lista 
            let _datos = {
                productosJ   : JSON.stringify(jListaProdGlobal),
                nomV         : jUsuarioGlobal.name,
                telV         : cmp[2],
                emailV       : jUsuarioGlobal.email,
                razon        : cmp[0],
                atencion     : cmp[1],
                departamento : cmp[3],
                idUser       : jUsuarioGlobal.id,
                folio        : sFolioGlobal
            }
            let res;
            let resG;
            if(sFolioGlobal != 'N/A') res = await apiMasterPost(_datos, 'actCotizacion'); //Verificamos que se haya aagregado una cotización ya realizada patra actualizarla
            else res = await apiMasterPost(_datos, 'ingCotizacion'); //Sino creamos una nueva
            
            console.log("res",res);
            if(opc == 1) generarPDF(cmp, res.folio); // El 1 es que se va a imprimir
            else{
                sFolioGlobal = ""+res.folio+"";
                Swal.fire({
                    icon: 'success',
                    title: 'El folio <strong>'+sFolioGlobal+'</strong> a sido guardado',
                    showConfirmButton: false,
                    timer: 1500
                })
                mostrarProdAgreg(); 
            }
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'No se ha agregado nada a la cotización',
                showConfirmButton: false,
                timer: 2500
            })
        }
    }
}

async function generarPDF(cmp, folio) {//Generar un pdf con la cotización
    /* Posiciones de los campos de cmp para imprimir en el pdf
    0 -"Razón social" 
    1 -"Atencón a" 
    2 -"Teléfono"
    3 -"Departamento"
    */
    var { value: text } = await Swal.fire({//Preguntamos si se agrega un comentario a la cotización
        input: 'textarea',
        title: '¿Gusta agregar un comentario sobre el pedido?',
        text: "Comentario sobre el pedido",
        confirmButtonColor: "#b68d2c",
        confirmButtonText: 'Guardar comentario',
        inputPlaceholder: 'Ejemplo: Debe de ser entregado en puerta 4',
        inputAttributes: {
          'aria-label': 'Ejemplo'
        },
        showCancelButton: false,
        cancelButtonColor: "#dc3545"
    })
      
    if (!text) {//Verificamos si no se pone un comentario, si no lo tiene se pone N/A (No Aplica)
        text = 'N/A';
    }
    var data = {//Realizamos un objeto con los datos necesarios para el pdf
        encabezado: "Productos",
        imagen: "http://localhost/spfg/lista/img/head.jpg", //La ruta fisica de la imagen header a usar 
        footer: "http://localhost/spfg/lista/img/footer.png", //La ruta fisica de la imagen header a usar 
        background: "http://localhost/spfg/lista/img/background.png",
        tabla: jListaProdGlobal //Agregamos la lista que se ha generado con anterioridad
    };
    //console.log(data);
    let base64Footer;
    convertirImgB64(data.footer, function(base64) { //Llamos a la función para converitr una imagen a base 64 para utilizarlo en la libreria pdfmake
        base64Footer = base64; //Guardamos en una variable el resultado
    })
    // Convertir la imagen a base64
    convertirImgB64(data.imagen, function(base64) { //Volvemos a llamar la función para convertir una imagen a base 64 y realizar el pdf dentro de esta
        // Crear contenido del PDF
        var fechaActual = new Date();//Obtenemos la fecha actual
        var content = [//Este es la variable a contener en el pdf en orden como irán apareciendo
            { image: base64, width: 520, alignment: "center",margin: [0, 0, 0, 0], }, //Se agrega la imagen, el tamaño, alineación y el margen que tendrá
            {
                table: {//Se integra una tabla de folio y fecha
                    widths: ["auto",60,"auto",100],//La tabla tendrá 4 columnas y se ponen los tamaños de estas
                    body: [//El cuerpo de la tabla
                        [{ text: "Folio:", bold: true }, { text: folio },{ text: "Fecha: ", bold: true }, { text: fechaActual.getDate() + "/" + fechaActual.toLocaleString('default', { month: 'long' }) + "/" + fechaActual.getFullYear() }],
                    ]
                },
                style: "min",//El estilo qie se le de, como si fuese css
                margin: [275, 10, 10, 0], //Lo margenes que tendrá y posicion
                alignment: "right",//La alineacióon del texto
            },
            {
                table: {// Tabla de datos del vendedor y del cliente
                    widths: [75, 183,50, 175],
                    body: [
                        [{ text: "Razón Social:", bold: true }, { text: cmp[0] }, { text: "Nombre:", bold: true }, { text: jUsuarioGlobal.name, style: "min" }],
                        [{ text: "Atención a: ", bold: true },  { text: cmp[1] }, { text: "Tel:", bold: true }, { text: "33 1578 0535", style: "min" }],
                        [{ text: "Departamento:", bold: true }, { text: cmp[3] }, { text: "Correo:", bold: true }, { text: jUsuarioGlobal.email, style: "min" }]
                    ]
                },
                style: "tables",
                margin: [7, 10, 0, 0]
            },
            {
                table: { //Tabla de comentario
                    widths: [511],
                    body: [
                        [{ text: "Comentario:", bold: true }],
                        [{ text: text}],
                    ]
                },
                style: "min",
                margin: [7, 10, 0, 0], 
            },
            { text: "Productos", style: "subheader", margin: [7, 10, 0, 0] },
            {
                table: {//Es la tabla de productos
                    headerRows: 0,
                    widths: [80, 217, 25, 77, 77],
                    style: "ejem",
                    body: [
                        ["Código", "Descipción", "Cant","Costo U", "Costo T"]
                    ].concat(data.tabla.map(producto => [//Es dinamico con respecto lo que tiene la lista de pedidos
                        producto.codigo,//Se van agregando en orden como qqueremos que se manden
                        producto.descripcion,
                        producto.cantidad,
                        "$ "+parseFloat(producto.lista).toFixed(2)+" "+producto.mon,//Se agrega un caracter,, se convierte en float y se agrega el tipo de moneda
                        "$ "+parseFloat(producto.lista * producto.cantidad).toFixed(2)+" "+producto.mon //Se hace similar a la linea anterior pero se multiplica por la cantidad del miso productos
                    ]))
                },
                style: "tables",
                margin: [7, 0, 0, 0], // Establecer margen izquierdo, superior, derecho e inferior en 0
                width: "100%" 
            },
            {
                table: {// tabla de total
                    widths: ["auto", 102],
                    body: [
                        [{ text: "Subtotal:", bold: true }, { text: "$ "+parseFloat(precioTotal(data.tabla)).toFixed(2) }],//Se llama la función que suma el precio de todos los productos
                        [{ text: "16% IVA: ", bold: true }, { text: "$ "+parseFloat(precioTotal(data.tabla) * 0.16).toFixed(2) }],//Se llama la función que suma el precio de todos los productos y se multiplica por .16 para sacar solo el iva
                        [{ text: "Total: ",   bold: true }, { text: "$ "+parseFloat(precioTotal(data.tabla) * 1.16).toFixed(2) }]//Se llama la función que suma el precio de todos los productos y se multiplica por 1.16 que suma el total y el iva
                    ]
                },
                style: "min",
                margin: [365, 10, 10, 0], 
                alignment: "right",
            },
            { image: base64Footer, width: 520, alignment: "center",margin: [0, 10, 0, 0], }
        ];
        // Configuración del documento PDF
        var docDefinition = {
            pageSize: 'LETTER',//Tamaño de la hoja a hacer en pdf
            content: content,//El contenido que tendrá el archivo
            styles: {//Los estilos que deben de llavar en el pdf
                subheader: {
                    fontSize: 12,
                    bold: true
                },
                tables: {
                    fontSize: 11,
                    bold: false
                },
                min: {
                    fontSize: 10,
                    bold: false
                }
            }
        };
        // Generar el PDF
        pdfMake.createPdf(docDefinition).download(""+cmp[0]+"_cotización_folio_"+folio+".pdf");//Se crea el pdf con el nombre establecido.
    });
}

function limpiarBusqueda(){
    loading(1);
    document.getElementById('tablaProductosS').innerHTML  = '';
    document.getElementById('buscarProd').value           = '';
    document.getElementById('selectedProv').selectedIndex = 0;
    loading(2);
}

function precioTotal(productos) {
    var total = 0;
    productos.forEach(producto => { 
        total += producto.lista * producto.cantidad;
    });
    return total;
}

function convertirImgB64(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

async function buscarCot(){//Buscamos el folio de la cotización para mostrarla
    var { value: resCot } = await Swal.fire({//Creams el modal y solicitamos el folio
        title: 'Ingrese el folio',
        input: 'number',
        inputLabel: 'Ingrese el folio de cotización',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return '¡Por favor ingrese un folio!'//Si el input esta vacio manda mensaje de error
            }
        }
    })
      
    if (resCot) {//Una vez que se entró un folio
        let res = await apiSearchCoti(resCot); //Llamamos a la función para haceer la busqueda
        if(res.status == 0){//Si  no encuentra el folio mandamos un mensaje de erro
            Swal.fire({
                icon: 'warning',
                title: 'El número de folio <strong>'+resCot+'</strong> no existe',
                showConfirmButton: false,
                timer: 1500
            })
        }else{
            showJped(res[0]);//Si si lo encuentra, mandamos el json a la función para que este la muestre 
        }
    }
}

async function showJped(jPed){
    jListaProdGlobal = null;
    jListaProdGlobal = JSON.parse(jPed.productosJ);
    document.getElementById('inRazon').disabled    = true;

    document.getElementById('nomVend').value       = jPed.nomV;
    document.getElementById('correoVend').value    = jPed.emailV;
    document.getElementById('telVend').value       = jPed.telV;
    document.getElementById('inRazon').value       = jPed.razonS;
    document.getElementById('inAtencion').value    = jPed.nomAtencion;
    document.getElementById('inDep').value         = jPed.departamento;

    sFolioGlobal = jPed.folio;
    //console.log(jPed);
    mostrarProdAgreg();
}

async function eliminarCot(){
    if(sFolioGlobal != 'N/A'){
        Swal.fire({
            title: '¿Eliminar cotización <strong>'+sFolioGlobal+'</strong>?',
            text: "Si acepta eliminarla, esta ya no podrá recuperarse.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b68d2c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar pedido'
        }).then(async (result) => {
            if (result.isConfirmed) {
                loading(1);
                let data = {
                    folio : sFolioGlobal
                }
                let res = await apiMasterPost(data, 'eliminarCoti');
                limpiarTablas();
            }
        })
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Esta cotización no está guardada con un folio',
            showConfirmButton: false,
            timer: 2000
        })
    }
}

function nvoPed(){
    Swal.fire({
        title: 'Nuevo pedido',
        text: "Si tiene una cotización que no esté guardada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b68d2c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, nuevo pedido'
    }).then((result) => {
        if (result.isConfirmed) {
            loading(1);
            limpiarTablas();
        }
    })
}

function limpiarTablas(){
    document.getElementById('inRazon').disabled            = false;
    document.getElementById('nomVend').value               = jUsuarioGlobal.name;
    document.getElementById('correoVend').value            = jUsuarioGlobal.email;
    document.getElementById('telVend').value               = '';
    document.getElementById('inRazon').value               = '';
    document.getElementById('inAtencion').value            = '';
    document.getElementById('inDep').value                 = '';
    document.getElementById('tablaProductosPed').innerHTML = '';
    document.getElementById('tablaTotal').innerHTML        = '';
    jListaProdGlobal = [];
    sFolioGlobal = 'N/A';
    inicio(jUsuarioGlobal);
    loading(2);
}

async function enviarCorreo() {
    /*var destinatario = "ignacio.bacabustos@gmail.com";
    var asunto = "Asunto del correo";
    var mensaje = "Texto del correo";
    var archivoAdjunto = `C:/Users/Desarrollo PFG/Downloads/cotización-folio--3.pdf`;

    var enlaceMailto = "mailto:" + destinatario + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(mensaje);

    if (archivoAdjunto) {
      enlaceMailto += "&attachment=" + encodeURIComponent(archivoAdjunto);
    }

    window.location.href = enlaceMailto;*/
    var destinatario = "ignacio.bacabustos@gmail.com";
    var asunto = "Asunto del correo";
    var mensaje = "Texto del correo";
    var archivoAdjunto = "C:/Users/Desarrollo PFG/Downloads/cotización-folio--3.pdf";

    var params = {
        subject: asunto,
        body: mensaje,
    };

    if (archivoAdjunto) {
        params.attachments = [
            {
                name: "cotización-folio--3.pdf",
                data: archivoAdjunto,
            },
        ];
    }

    if (navigator.share && navigator.canShare(params)) {
        navigator.share(params)
            .catch(function (error) {
                console.error("Error al abrir el cliente de correo", error);
            });
    } else {
        console.error("La API de Web Share no es compatible o no se pueden compartir los datos especificados.");
    }
}