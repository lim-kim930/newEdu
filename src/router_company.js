import VueRouter from "vue-router";
import queryInfo from "./components/Company/queryInfo.vue";
import infoSquare from "./components/Company/infoSquare.vue";
import infoEntry from "./components/Company/infoEntry.vue";
import internCert from "./components/Company/internCert.vue";
import comMessage from "./components/Company/message.vue";
import received from "./components/Company/message/received.vue";
import sent from "./components/Company/message/sent.vue";
import comAccountManage from "./components/Company/accountManage.vue";

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/queryInfo" },
    { path: "/queryInfo", component: queryInfo },
    { path: "/infoSquare", component: infoSquare },
    { path: "/infoEntry", component: infoEntry },
    { path: "/internCert", component: internCert },
    {
      path: "/comMessage",
      component: comMessage,
      children: [{
        path: "/comMessage/received",
        component: received
      },
      {
        path: "/comMessage/sent",
        component: sent
      }]
    },
    { path: "/comAccountManage", component: comAccountManage }
  ]
});

export default router;