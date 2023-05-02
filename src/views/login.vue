<template>
    <div class="card contenedor">
        <Card style="width: 25em; background: rgba(0,0,0,0.3);">
            
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

<script >
    import { response } from 'express';
import superApi from '../api/superApi';
    export default{
        data(){
            return{
                usuario: '',
                clave: ''
            }
        },
        methods:{
            async iniciarSesion()
            {
                var payload = {
                usuario: this.usuario,
                clave: this.clave
                };
                /*await this.axios.get('/login', payload)
                .then(response => {
                    console.log(response);
                });*/
                await superApi.get('/login', payload)
                        .then(response => {
                            console.log(response);
                        });
            }
        }
    }
    
    /*export default{
        name: 'LoginItem',
        components:{
            
        },
        data: function() {
            
            
            return{
                
            }
        },
        created(){
        },
        methods: {
            
        },
        setup() {
            const loading = ref(false);
            const value = ref('Mio');
            const options = ref(['Todo', 'Mio']);
            const pass = ref(null);
            const load = () => {
                loading.value = true;
                setTimeout(() => {
                    loading.value = false;
                }, 2000);
            }
            return {
                options, load
            }
        }
    }*/
</script>