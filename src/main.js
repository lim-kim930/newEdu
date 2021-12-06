import Vue from "vue"
import VueRouter from "vue-router"
import axios from "axios"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
// import VueClipboard from "vue-clipboard2"
//导入组件
// 导入自定义路由模块
// import APP from "../src/components/Sign.vue"
// import router from "./router_sign"

import APP from "../src/components/Student.vue"
import router from "./router_student"

// import APP from "../src/components/Company.vue"
// import router from "./router_company"

// import APP from "../src/components/Manager.vue"
// import router from "./router_manager"

// 安装路由
Vue.use(VueRouter)
// element ui
Vue.use(ElementUI)
//axios cookies配置
axios.defaults.withCredentials = true
Vue.prototype.axios = axios
//剪切板组件
// Vue.use(VueClipboard)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const vm = new Vue({
  el: "#app",
  render: c => c(APP),
  router
})