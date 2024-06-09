import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import { router } from './routes/routes.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './style.css'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const pinia = (createPinia())
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(Quasar)
app.use(router)
app.use(pinia)

app.mount('#app')