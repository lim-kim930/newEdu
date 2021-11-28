//  路由规则模块
import VueRouter from "vue-router"
// 导入路由相关的组件
// import signIn from "./components/sign/signIn.vue"
// import signUp from "./components/sign/signUp.vue"
// import testSignIn from "./components/sign/testSignIn.vue"

import scoreChange from "./components/student/scoreChange.vue"
import infoConfirm from "./components/student/infoConfirm.vue"
import xjConfirm from "./components/student/infoConfirm/xjConfirm.vue"
import xyConfirm from "./components/student/infoConfirm/xyConfirm.vue"
import byConfirm from "./components/student/infoConfirm/byConfirm.vue"
import hjConfirm from "./components/student/infoConfirm/hjConfirm.vue"
// import gpaConfirm from "./components/student/infoConfirm/gpaConfirm.vue"
// import gxConfirm from "./components/student/infoConfirm/gxConfirm.vue"
import arcManage from "./components/student/arcManage.vue"
import infoShare from "./components/student/infoShare.vue"
// import infoSquare from "./components/student/infoSquare.vue"
import message from "./components/student/message.vue"
// import infoDisclose from "./components/student/infoDisclose.vue"
import accountManage from "./components/student/accountManage.vue"

// import queryInfo from "./components/Company/queryInfo.vue"
// import infoSquare from "./components/Company/infoSquare.vue"
// import infoEntry from "./components/Company/infoEntry.vue"
// import internCert from "./components/Company/internCert.vue"
// import comMessage from "./components/Company/message.vue"
// import received from "./components/Company/message/received.vue"
// import sent from "./components/Company/message/sent.vue"
// import comAccountManage from "./components/Company/accountManage.vue"

// import deansOfficeHome from './components/deansOffice/deansOfficeHome.vue'
// import addStudent from './components/deansOffice/addStudent.vue'
// import batchAddStu from './components/deansOffice/batchAddStu.vue'
// import faceRec from './components/deansOffice/faceRec.vue'
// import checkCourse from './components/deansOffice/checkCourse.vue'
// import batchCkCourse from './components/deansOffice/batchCkCourse.vue'
// import modSpecStin from './components/deansOffice/modSpecStin.vue'
// import modPun from './components/deansOffice/modPun.vue'
// import IsGrad from './components/deansOffice/IsGrad.vue'
// import genCert from './components/deansOffice/genCert.vue'

// import getChainInfo from './components/superisoryBody/getChainInfo.vue'
// import getChainSpecInfo from './components/superisoryBody/getChainSpecInfo.vue'

// 创建路由对象，并把得到的路由对象，挂载到 VM 实例上
const router = new VueRouter({
  routes: [ // 路由规则
    { path: "/", redirect: "/infoConfirm/xjConfirm" },
    // { path: "/", redirect: "/queryInfo" },
    // { path: "/comMessage", redirect: "/comMessage/received" },
    // { path: "/signIn", component: signIn },
    // { path: "/signUp", component: signUp },
    // { path: "/testSignIn", component: testSignIn },

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
      // {
      //   path: "/infoConfirm/gpaConfirm",
      //   component: gpaConfirm
      // },
      // {
      //   path: "/infoConfirm/gxConfirm",
      //   component: gxConfirm
      // }
      ]
    },
    { path: "/arcManage", component: arcManage },
    { path: "/infoShare", component: infoShare },
    // { path: "/infoSquare", component: infoSquare },
    { path: "/message", component: message },
    // { path: "/infoDisclose", component: infoDisclose },
    { path: "/accountManage", component: accountManage },

    // { path: "/queryInfo", component: queryInfo },
    // { path: "/infoSquare", component: infoSquare },
    // { path: "/infoEntry", component: infoEntry },
    // { path: "/internCert", component: internCert },
    // {
    //   path: "/comMessage",
    //   component: comMessage,
    //   children: [{
    //     path: "/comMessage/received",
    //     component: received
    //   },
    //   {
    //     path: "/comMessage/sent",
    //     component: sent
    //   }]
    // },
    // { path: "/comAccountManage", component: comAccountManage },


    // { path: '/deansOfficeHome', component: deansOfficeHome },
    // { path: '/addStudent', component: addStudent },
    // { path: '/batchAddStu', component: batchAddStu},
    // { path: '/faceRec', component: faceRec},
    // { path: '/checkCourse', component: checkCourse},
    // { path: '/batchCkCourse', component: batchCkCourse},
    // { path: '/modSpecStin', component: modSpecStin},
    // { path: '/modPun', component: modPun},
    // { path: '/IsGrad', component: IsGrad},
    // { path: '/genCert', component: genCert},

    // { path: '/getChainInfo', component: getChainInfo},
    // { path: '/getChainSpecInfo', component: getChainSpecInfo},
  ]
})

// 导出路由对象
export default router