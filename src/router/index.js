
import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import Login from '../views/login.vue'

export const router = createRouter({
history: createWebHistory(),
routes: [
    { 
        path: "/", 
        name: 'Login',
        component: Login
    }
]
});

export default router