import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

// 导入axios
import axios from "axios";
// 配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 绑定到vue的原型对象上
Vue.prototype.$http = axios;

import "./assets/css/global.css";
import "./assets/css/iconfont.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
