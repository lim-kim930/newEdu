import VueRouter from "vue-router"
import scoreChange from "./components/student/scoreChange.vue"
import infoConfirm from "./components/student/infoConfirm.vue"
import xjConfirm from "./components/student/infoConfirm/xjConfirm.vue"
import xyConfirm from "./components/student/infoConfirm/xyConfirm.vue"
import byConfirm from "./components/student/infoConfirm/byConfirm.vue"
import hjConfirm from "./components/student/infoConfirm/hjConfirm.vue"
import gpaConfirm from "./components/student/infoConfirm/gpaConfirm.vue"
import gxConfirm from "./components/student/infoConfirm/gxConfirm.vue"
import arcManage from "./components/student/arcManage.vue"
import infoShare from "./components/student/infoShare.vue"
import infoSquare from "./components/student/infoSquare.vue"
import message from "./components/student/message.vue"
import infoDisclose from "./components/student/infoDisclose.vue"
import accountManage from "./components/student/accountManage.vue"

const router = new VueRouter({
  routes: [ // 路由规则
    { path: "/", redirect: "/infoConfirm/xjConfirm" },
    { path: "/scoreChange", component: scoreChange },
    {
      path: "/infoConfirm",
      component: infoConfirm,
      children: [{
        path: "/infoConfirm/xjConfirm",
        component: xjConfirm
      },
      {
        path: "/infoConfirm/xyConfirm",
        component: xyConfirm
      },
      {
        path: "/infoConfirm/hjConfirm",
        component: hjConfirm
      },
      {
        path: "/infoConfirm/byConfirm",
        component: byConfirm
      },
      {
        path: "/infoConfirm/gpaConfirm",
        component: gpaConfirm
      },
      {
        path: "/infoConfirm/gxConfirm",
        component: gxConfirm
      }]
    },
    { path: "/arcManage", component: arcManage },
    { path: "/infoShare", component: infoShare },
    { path: "/infoSquare", component: infoSquare },
    { path: "/message", component: message },
    { path: "/infoDisclose", component: infoDisclose },
    { path: "/accountManage", component: accountManage }
  ]
})

export default router