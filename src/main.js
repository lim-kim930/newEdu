import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 导入组件
// 导入自定义路由模块

// 首页,需要把其余的不相干模块全部注释掉
// import APP from "./components/Homepage.vue";
// const router = null;

// import APP from "./components/Sign.vue";
// import router from "./router/router_sign";

//剪切板组件
import VueClipboard from "vue-clipboard2";
import APP from "./components/Student.vue";
import router from "./router/router_student";
Vue.use(VueClipboard);

// import APP from "./components/Company.vue";
// import router from "./router/router_company";

// import APP from "./components/Manager.vue";
// import router from "./router/router_manager";

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

const config = {
  el: "#app",
  render: c => c(APP)
};
if (router) config.router = router;

new Vue(config);