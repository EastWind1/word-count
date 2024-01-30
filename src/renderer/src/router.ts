import { RouteRecordRaw } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import Detail from './components/Detail.vue'
import Setting from './components/Setting.vue'
export const routes: readonly RouteRecordRaw[] = [
  { path: '/', component: Dashboard },
  { path: '/dashboard', redirect: '/' },
  { path: '/detail', component: Detail },
  { path: '/setting', component: Setting }
]
