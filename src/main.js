import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

//导入组件
// 导入自定义路由模块
// import APP from "../src/components/Sign.vue"
// import router from "./router_sign"

//剪切板组件
import VueClipboard from "vue-clipboard2";
import APP from "../src/components/Student.vue";
import router from "./router_student";
Vue.use(VueClipboard);

// import APP from "../src/components/Company.vue";
// import router from "./router_company";

// import APP from "../src/components/Manager.vue"
// import router from "./router_manager"

// 安装路由
Vue.use(VueRouter);
// element ui
Vue.use(ElementUI);
//axios cookies配置
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://api.hduhelp.com/gormja_wrapper";
Vue.prototype.axios = axios;

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
new Vue({
  el: "#app",
  render: c => c(APP),
  router
});