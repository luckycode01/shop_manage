import Vue from 'vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'

import App from './App.vue'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/iconfont.css'
import './utils/dateFormat'

// // 导入axios
// import axios from 'axios'
// // 配置请求根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// // 请求拦截器
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
// // 绑定到vue的原型对象上
// Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
