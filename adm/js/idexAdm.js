function comprobarPermiso(){
    // Crea una instancia del objeto URLSearchParams con la cadena de consulta de la URL actual
    const params = new URLSearchParams(window.location.search);

    // Obtiene el valor de un parámetro específico
    let dataValue = params.get('data');
    if(dataValue != null){
        try {
            const decodedString = atob(dataValue);
            console.log(decodedString);
            const jUsuario = JSON.parse(decodedString);
            console.log(jUsuario);

            if( typeof jUsuario === 'object'){
                home(jUsuario);
            }
          } catch (error) {
            // Si se lanza una excepción, la decodificación falló
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

async function home(jUsuario){
    let sVentanaAdm = '';
    document.getElementById('app').innerHTML = '';
    sVentanaAdm = sVentanaAdm + `<nav class="navbar bg-body-tertiary mb-5"> <!--Inicio del nav-->
                                    <div class="container-fluid">
                                        <a class="navbar-brand ms-4" href="#">
                                            <img src="../img/logo_web.45818d48.png" alt="PFG" width="160" height="70">
                                        </a>
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
                                            <a class="btn btn-primary" onclick="productosGene()">Abrir</a>
                                        </div>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-header">
                                            Actualizar o agregar productos <strong>especiales</strong> a las listas
                                        </div>
                                        <div class="card-body" id="listaAdm">
                                            <h5 class="card-title">Actualizar o agregar productos <strong>especiales</strong> a las listas</h5>
                                            <p class="card-text">A la hora de ingresar las listas, por favor que sean en extensión <strong>.xlsm</strong> (<strong>Excel</strong>), esto para evitar que el servidor tenga intermitencias.</p>
                                            <a class="btn btn-primary">Abrir</a>
                                        </div>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-header">
                                            Actualizar el <strong>porcentaje</strong> a las 3 listas
                                        </div>
                                        <div class="card-body" id="listaAdm">
                                            <h5 class="card-title">Actualizar el <strong>porcentaje</strong> a las 3 listas</h5>
                                            <p class="card-text">A la hora de ingresar las listas, por favor que sean en extensión <strong>.xlsm</strong> (<strong>Excel</strong>), esto para evitar que el servidor tenga intermitencias.</p>
                                            <a class="btn btn-primary">Abrir</a>
                                        </div>
                                    </div>
                                </div>`;

    document.getElementById('app').innerHTML = sVentanaAdm;
}

async function productosGene(){
    /*const { value: file } = await Swal.fire({
        title: 'Por favor seleccione el archivo .xlsm',
        input: 'file',
        inputAttributes: {
          'accept': '.xlsm/*',
          'aria-label': 'Se esta procesando el archivo'
        }
    })
    
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            Swal.fire({
                title: 'Your uploaded picture',
                imageUrl: e.target.result,
                imageAlt: 'The uploaded picture'
            })
        }
        reader.readAsDataURL(file)
    }*/
    /*Swal.fire({
        title: 'Seleccionar archivo XLSM',
        input: 'file',
        inputAttributes: {
          accept: '.xlsm'
        },
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        inputValidator: (file) => {
          return new Promise((resolve, reject) => {
            const allowedExtensions = /(\.xlsm)$/i;
            if (!allowedExtensions.test(file.name)) {
              reject('Solo se permiten archivos XLSM');
            } else {
              resolve();
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const file = result.value;
          // Aquí puedes realizar las operaciones necesarias con el archivo XLSM
          console.log(file);
        }
      });*/
      Swal.fire({
        title: 'Seleccionar archivo XLSM',
        input: 'file',
        inputAttributes: {
          accept: '.xlsm'
        },
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        inputValidator: (file) => {
          return new Promise((resolve, reject) => {
            const allowedExtensions = /(\.xlsm)$/i;
            if (!allowedExtensions.test(file.name)) {
              reject('Solo se permiten archivos XLSM');
            } else {
              resolve();
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const file = result.value;
          const reader = new FileReader();
      
          reader.onload = () => {
            const fileContent = reader.result;
            // Aquí puedes procesar el contenido del archivo
            // y convertirlo a JSON para realizar la consulta y actualización en la base de datos
            const jsonData = convertirXLSMToJson(fileContent);
            if (jsonData) {
              // Realizar consulta en la base de datos
              if (existeEnBD(jsonData)) {
                // Actualizar datos si se encuentra en la base de datos
                actualizarEnBD(jsonData);
                Swal.fire('Datos actualizados', '', 'success');
              } else {
                // Agregar datos si no se encuentran en la base de datos
                agregarEnBD(jsonData);
                Swal.fire('Datos agregados', '', 'success');
              }
            } else {
              Swal.fire('Error al convertir el archivo', '', 'error');
            }
          };
      
          reader.readAsText(file);
        }
      });
}

function convertirXLSMToJson(fileContent) {
    // Lógica para convertir el archivo XLSM a JSON
    // Aquí deberías utilizar una biblioteca o implementar tu propia lógica de conversión
    // y retornar el resultado en formato JSON
  }
  
  function existeEnBD(jsonData) {
    // Lógica para verificar si los datos ya existen en la base de datos
    // Retorna true si los datos existen, o false si no existen
  }
  
  function actualizarEnBD(jsonData) {
    // Lógica para actualizar los datos en la base de datos
    console.log(jsonData);
  }
  
  function agregarEnBD(jsonData) {
    // Lógica para agregar los datos a la base de datos
  }