import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/index.css'
import {Message, Loading} from "element-ui";

Vue.config.productionTip = false

Vue.prototype.$message = Message;
Vue.use(Loading)

Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
