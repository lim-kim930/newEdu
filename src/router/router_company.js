import VueRouter from "vue-router";
import queryInfo from "../components/company/queryInfo.vue";
import infoSquare from "../components/company/infoSquare.vue";
import infoEntry from "../components/company/infoEntry.vue";
import internCert from "../components/company/internCert.vue";
import comMessage from "../components/company/message.vue";
import received from "../components/company/message/received.vue";
import sent from "../components/company/message/sent.vue";
import comAccountManage from "../components/company/accountManage.vue";

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