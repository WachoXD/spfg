<template>
    <div class="card contenedor">
        <Card style="width: 25em">
            <template #header style="background: #000;">
                <img alt="user header" src="../assets/logo_web.png" width="350" />
                
            </template>
            <template #title> Bienvenido a Seguimiento PFG </template>
            <template #subtitle> SPFG </template>
            <template #content>
                <div class="p-inputgroup flex-1">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-user"></i>
                    </span>
                    <InputText type="email" v-model="email" placeholder="Correo"/>
                </div><br>
                <div class="p-inputgroup flex-1">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-eye"></i>
                    </span>
                    <InputText type="password" v-model="pass" placeholder="Correo" toggleMask/>
                    
                </div>
            </template>
            <template #footer>
                <Button label="Iniciar sesión" icon="pi pi-sign-in" class="w-10rem"></Button>
            </template>
        </Card>
    </div>
</template>

<script >
    import { ref, onMounted } from 'vue';
    export default{
        components:{},
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