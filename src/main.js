import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import store from "@/auth/index.js";

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')