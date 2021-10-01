import Vue from "vue"
//导入自己的 .vue 组件
// 在这里，如果要在webpack中使用.vue组件，必须先安装对应的loader加载器，否则webpack处理不了这种文件
// vue-loader
// import APP from "../src/components/Sign.vue"
import APP from "../src/components/Student.vue"
// import APP from "../src/components/Company.vue"
// import APP3 from '../src/components/App3.vue'
// import APP4 from '../src/components/App4.vue'
// 导入路由模块
import VueRouter from "vue-router"
import axios from "axios"
axios.defaults.withCredentials = true
Vue.prototype.axios = axios


//引入FormData
// import FormData from 'form-data'
// Vue.prototype.FormData = FormData;

//引入Clipboard2
import VueClipboard from "vue-clipboard2"
Vue.use(VueClipboard)

// 安装路由
Vue.use(VueRouter)
// 导入自己的路由规则模块，得到路由对象
import router from "./router.js"

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// element ui
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

Vue.use(ElementUI)

const vm = new Vue({
  el: "#app",
  render: c => c(APP),
  router
})