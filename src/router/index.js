
import { createRouter, createWebHistory } from "vue-router";

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