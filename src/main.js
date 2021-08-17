import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/index.css'
import {Loading} from "element-ui";
import messageUtil from "@/utils/messageUtil";
import {dateFormatter, timeFormatter, dateTimeFormatter} from './utils/filters'

Vue.config.productionTip = false

Vue.prototype.$message = messageUtil;
Vue.use(Loading)

Vue.use(VueCookies)
Vue.filter('dateFormatter', dateFormatter)
Vue.filter('timeFormatter', timeFormatter)
Vue.filter('dateTimeFormatter', dateTimeFormatter)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
