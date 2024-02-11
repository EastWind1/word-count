import { createApp } from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { pl, zhHans } from 'vuetify/locale'
import * as VueRouter from 'vue-router'
import { routes } from './router'
import { vDraggable } from './directive/dragable'

const vuetify = createVuetify({
  locale: {
    locale: 'zhHans',
    messages: { zhHans, pl }
  }
})
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})
createApp(App).use(vuetify).use(router).directive('draggable', vDraggable).mount('#app')
