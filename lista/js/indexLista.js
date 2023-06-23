let jProductosGlobal;
let jUsuarioGlobal;
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
    jUsuarioGlobal = jUsuario;
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
            confirmButtonColor: '#b68d2c',
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
                                        <td><input type="number" min="1" class="form-control border border-primary" id="inCantidad`+i+`" value="1" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"></td>
                                        <td><input type="text" class="form-control border border-primary" id="inCosto`+i+`" value="`+parseFloat(jProductos[i].lista).toFixed(2)+`" onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"></td>
                                        <td><button type="button" class="btn btn-outline-primary" onclick="agregarProd(`+i+`)"><i class="bi bi-plus"></i></button></td>
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
    //console.log(jListaProdGlobal);
    let objeto = {
        id          : jProductosGlobal[pos].id,
        codigo      : jProductosGlobal[pos].codigo,
        codprov     : jProductosGlobal[pos].codprov,
        descripcion : jProductosGlobal[pos].descripcion,
        emp         : jProductosGlobal[pos].emp,
        fechalista  : jProductosGlobal[pos].fechalista,
        industria   : jProductosGlobal[pos].industria,
        lista       : parseFloat(document.getElementById("inCosto"+pos+"").value),
        cantidad    : parseInt(document.getElementById("inCantidad"+pos+"").value),
        marca       : jProductosGlobal[pos].marca,
        mon         : jProductosGlobal[pos].mon,
        oferta      : jProductosGlobal[pos].oferta,
        prov        : jProductosGlobal[pos].prov,
        sat         : jProductosGlobal[pos].sat,
        um          : jProductosGlobal[pos].um
    }
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
}
let contLista = 0;
async function mostrarProdAgreg(){
    document.getElementById('tablaProductosPed').innerHTML = '';
    let contadorObjetos = 0;
    let sProductosList = '';
    Object.keys(jListaProdGlobal).forEach((clave) => {
        if (typeof jListaProdGlobal[clave] === "object") {
            contadorObjetos++;
        }
    });
    contLista = contadorObjetos;
    if(contadorObjetos > 0){
        let costoU = 0;
        for(i = 0; i < contadorObjetos; i++){
            costoU = parseFloat(jListaProdGlobal[i].lista).toFixed(4);
            sProductosList = sProductosList + `
                                <tr>
                                    <td scope="row">`+jListaProdGlobal[i].codigo+`</td>
                                    <td>`+jListaProdGlobal[i].codprov+`</td>
                                    <td>`+jListaProdGlobal[i].um+`</td>
                                    <td>`+jListaProdGlobal[i].descripcion+`</td>
                                    <td>`+jListaProdGlobal[i].prov+`</td>
                                    <td>`+jListaProdGlobal[i].fechalista+`</td>
                                    <td>`+jListaProdGlobal[i].cantidad+`</td>
                                    <td>$`+costoU+` `+jListaProdGlobal[i].mon+`</td>
                                    <td>$`+parseFloat(costoU*jListaProdGlobal[i].cantidad).toFixed(4)+` `+jListaProdGlobal[i].mon+`</td>
                                    <td><button type="button" class="btn btn-outline-primary" onclick="eliminarProd(`+i+`, '`+jListaProdGlobal[i].codigo+`')"><i class="bi bi-trash"></i></button></td>
                                </tr>
                                `;
        }
    }
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

async function generarPDF() {
    if(contLista > 0){
        var { value: text } = await Swal.fire({
            input: 'textarea',
            title: '¿Gusta agregar un comentario sobre el pedido',
            text: "Comentario sobre el pedido",
            inputPlaceholder: 'Ejemplo: Debe de ser entregado en puerta 4',
            inputAttributes: {
              'aria-label': 'Ejemplo'
            },
            showCancelButton: true
        })
          
        if (!text) {
            text = 'N/A';
        }
            var data = {
                encabezado: "Productos",
                imagen: "http://localhost/spfg/lista/img/head.jpg",
                footer: "http://localhost/spfg/lista/img/footer.png",
                background: "http://localhost/spfg/lista/img/background.png",
                tabla: jListaProdGlobal
            };
            //console.log(data);
            let base64Footer;
            let base64Background;
            obtenerBase64DesdeURL(data.footer, function(base64) {
                base64Footer = base64;
            })
            obtenerBase64DesdeURL(data.background, function(base64) {
                base64Background = base64;
            })
            // Convertir la imagen a base64
            obtenerBase64DesdeURL(data.imagen, function(base64) {
                // Crear contenido del PDF
                var fechaActual = new Date();
                var content = [
                    { image: base64, width: 520, alignment: "center",margin: [0, 0, 0, 0], },
                    {
                        table: {
                            widths: ["auto",60,"auto",100],
                            body: [
                                [{ text: "Folio:", bold: true }, { text: "1 " },{ text: "Fecha: ", bold: true }, { text: fechaActual.getDate() + "/" + fechaActual.toLocaleString('default', { month: 'long' }) + "/" + fechaActual.getFullYear() }],
                            ]
                        },
                        margin: [265, 10, 10, 0], 
                        alignment: "right",
                    },
                    {
                        table: {
                            widths: [80, 180,50, 180],
                            body: [
                                [{ text: "Razón Social:", bold: true }, { text: "1 " }, { text: "Nombre:", bold: true }, { text: jUsuarioGlobal.name }],
                                [{ text: "Atención a: ", bold: true },  { text: "1 " }, { text: "Tel:", bold: true }, { text: "33 1578 0535" }],
                                [{ text: "Departamento:", bold: true }, { text: "1 " }, { text: "Correo:", bold: true }, { text: "ventas17@proveedorferretero.net" }]
                            ]
                        },
                        margin: [0, 10, 0, 0]
                    },
                    {
                        table: {
                            widths: [518],
                            body: [
                                [{ text: "Comentario:", bold: true }],
                                [{ text: text}],
                            ]
                        },
                        margin: [0, 10, 0, 0], 
                    },
                    { text: "Productos", style: "subheader", margin: [0, 10, 0, 0] },
                    {
                        table: {
                            headerRows: 1,
                            widths: [80, 218, 25, 80, 80],
                            body: [
                                ["Código", "Descipción", "Cant","Costo U", "Costo T"]
                            ].concat(data.tabla.map(producto => [
                                producto.codigo,
                                producto.descripcion,
                                producto.cantidad,
                                "$ "+parseFloat(producto.lista).toFixed(2)+" "+producto.mon,
                                "$ "+parseFloat(producto.lista * producto.cantidad).toFixed(2)+" "+producto.mon
                            ]))
                        },
                        margin: [0, 0, 0, 0], // Establecer margen izquierdo, superior, derecho e inferior en 0
                        width: "100%" 
                    },
                    {
                        table: {
                            widths: ["auto", 102],
                            body: [
                                [{ text: "Subtotal:", bold: true }, { text: "$ "+parseFloat(calcularTotalPreciosTotales(data.tabla)).toFixed(2), bold: true }],
                                [{ text: "16% IVA: ", bold: true }, { text: "$ "+parseFloat(calcularTotalPreciosTotales(data.tabla) * 0.16).toFixed(2), bold: true }],
                                [{ text: "Total: ", bold: true }, { text: "$ "+parseFloat(calcularTotalPreciosTotales(data.tabla) * 1.16).toFixed(2), bold: true }]
                            ]
                        },
                        margin: [360, 10, 10, 0], 
                        alignment: "right",
                    },
                    { image: base64Footer, width: 520, alignment: "center",margin: [0, 0, 0, 0], }
                ];

                // Configuración del documento PDF
                var docDefinition = {
                    pageSize: 'LETTER',
                    content: content,
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true
                        },
                        subheader: {
                            fontSize: 12,
                            bold: true
                        }
                    }
                };

                // Generar el PDF
                pdfMake.createPdf(docDefinition).download("datos_productos.pdf");
            });
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'No se ha agregado nada a la cotización',
            showConfirmButton: false,
            timer: 2500
        })
    }
}

function limpiarBusqueda(){
    document.getElementById('tablaProductosS').innerHTML = '';
    document.getElementById('buscarProd').value = '';
}

function calcularTotalPreciosTotales(productos) {
    var total = 0;
    productos.forEach(producto => { 
        total += producto.lista * producto.cantidad;
    });
    return total;
}
function obtenerBase64DesdeURL(url, callback) {
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
