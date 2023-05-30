//Este archivo no sirve para nada


/*

`<nav class="navbar bg-body-tertiary"> <!--Inicio del nav-->
    <div class="container-fluid">
        <a class="navbar-brand ms-4" href="#">
            <img src="./img/logo_web.45818d48.png" alt="PFG" width="160" height="70">
          </a>
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Pedidos</button>
            </li>``
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#permisos-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Permisos</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Roles</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" >Usuarios</button>
            </li>
        </ul>

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
                        <tbody class="table-group-divider" id="tablaTodos"> ``
                            <tr>
                                <th scope="row ">1</th>
                                <td>Activo</td>
                                <td>23/03/2023</td>
                                <td>Ignacio</td>
                                <td>Ventas</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>23/03/2023</td>
                                <td>Ignacio</td>
                                <td>Ventas</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td >Activo</td>
                                <td>23/03/2023</td>
                                <td>Ignacio</td>
                                <td>Ventas</td>
                            </tr>
                        </tbody>
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
                        <tbody class="table-group-divider" id="tablaActivos">
                        <tr>
                                <th scope="row ">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>Ventas</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td colspan="2">Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
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
                        <tbody class="table-group-divider" id="tablaParciales">
                        <tr>
                                <th scope="row ">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>Ventas</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td colspan="2">Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
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
                        <tbody class="table-group-divider" id="tablaFinalizado">
                        <tr>
                                <th scope="row ">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>Ventas</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td colspan="2">Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
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
                        <tbody class="table-group-divider" id="tablaAceptador">
                            <tr>
                                <th scope="row ">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>Ignacio</td>
                                <td>Ventas</td>
                                <td>
                                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalAsignar">
                                        <i class="bi bi-arrow-left-right"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>Ignacio</td>
                                <td>Ventas</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td >Larry the Bird</td>
                                <td>Ignacio</td>
                                <td>Ventas</td>
                            </tr>
                        </tbody>
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
                        <tbody class="table-group-divider" id="tablaAceptar">
                            <tr>
                                <th scope="row ">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>Ventas</td>
                                <td>
                                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalAsignar" >
                                        <i class="bi bi-check-lg"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalRechazar">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td colspan="2">Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Fin de la tabla por Por Aceptar-->
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="permisos-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
        <div class="container">   
            <center>
                <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#modalPermisoN">
                    Agergar nuevo permiso
                  </button>
                <table class="table mt-4 border table-hover table-sm" style="max-width: 600px;">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Permiso</th>
                            <th scope="col col-sm-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>
                                <button type="button" class="btn btn-primary"><i class="bi bi-pencil-square"></i> Editar</button>
                                <button type="button" class="btn btn-danger"><i class="bi bi-trash3"></i> Danger</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </center>
        </div>
    </div>
    <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
        <div class="container">   
            <center>
                <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#modalPermisoN">
                    Agergar nuevo Rol
                  </button>
                <table class="table mt-4 border table-hover table-sm" style="max-width: 600px;">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Permiso</th>
                            <th scope="col col-sm-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>
                                <button type="button" class="btn btn-primary"><i class="bi bi-pencil-square"></i> Editar</button>
                                <button type="button" class="btn btn-danger"><i class="bi bi-trash3"></i> Danger</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </center>
        </div>
    </div>
    <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
        <div class="container">   

            <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#modalPermisoN">
                Agergar nuevo usuario
                </button>
            <table class="table mt-4 border table-hover table-sm" >
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col col-sm-6">Correo</th>
                        <th scope="col col-sm-6">Funciones</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>desarrollo.pfg@proveedorferretero.net</td>
                        <td>
                            <button type="button" class="btn btn-primary"><i class="bi bi-pencil-square"></i> Editar</button>
                            <button type="button" class="btn btn-danger"><i class="bi bi-trash3"></i> Danger</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>

</div>`


*/