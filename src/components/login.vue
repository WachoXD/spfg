<template>
    <br><br><br><br>
    <div class="card contenedor">
          <Card style="width: 25em; background: rgba(0,0,0,0.2);">
              
              <template #header>
                  <img alt="user header" src="../assets/logo_web.png" width="350" />
                  
              </template>
              <template #title> Bienvenido a Seguimiento PFG </template>
              <template #subtitle> SPFG </template>
              <template #content>
                  <div class="p-inputgroup flex-1">
                      <span class="p-inputgroup-addon">
                          <i class="pi pi-user"></i>
                      </span>
                      <InputText type="email" v-model="usuario" placeholder="Correo"/>
                  </div><br>
                  <div class="p-inputgroup flex-1">
                      <span class="p-inputgroup-addon">
                          <i class="pi pi-eye"></i>
                      </span>
                      <InputText type="password" v-model="clave" placeholder="Correo" toggleMask/>
                  </div>                    
              </template>
              <template #footer>
                  <Button label="Iniciar sesión" icon="pi pi-sign-in" class="w-10rem" v-on:click="iniciarSesion()"></Button>
              </template>            
          </Card>
      </div>
  </template>
  
  <script>
  export default {
    name: 'IndexWord',
    props: {
      msg: String
    },
    data(){
        return{
            usuario: '',
            clave: ''
        }
    },
    methods:{
        async iniciarSesion(){
            var payload = {
            usuario: this.usuario,
            clave: this.clave
            };
            console.log(payload);
            await this.axios.get('/login', payload)
            .then(response => {
                console.log(response);
            });
            /*await superApi.get('/login', payload)
                    .then(response => {
                        console.log(response);
                    });*/
        }
    }
    
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .contenedor {
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  
  .loader {
      position: fixed;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      z-index: 9999;
      /*background: url('images/pageLoader.gif') 50% 50% no-repeat rgb(249,249,249);*/
      opacity: .8;
  }
  
  </style>