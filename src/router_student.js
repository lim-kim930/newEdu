import VueRouter from "vue-router";
import infoConfirm from "./components/student/infoConfirm.vue";
import xjConfirm from "./components/student/infoConfirm/profileConfirm.vue";
import scoreConfirm from "./components/student/infoConfirm/scoreConfirm.vue";
import gradConfirm from "./components/student/infoConfirm/gradConfirm.vue";
import rewardConfirm from "./components/student/infoConfirm/rewardConfirm.vue";
import rankConfirm from "./components/student/infoConfirm/rankConfirm.vue";
import intConfirm from "./components/student/infoConfirm/intConfirm.vue";
import scoreChange from "./components/student/scoreChange.vue";
import arcManage from "./components/student/arcManage.vue";
import infoShare from "./components/student/infoShare.vue";
import infoSquare from "./components/student/infoSquare.vue";
import message from "./components/student/message.vue";
import received from "./components/student/message/received.vue";
import sent from "./components/student/message/sent.vue";
import infoDisclose from "./components/student/infoDisclose.vue";
import accountManage from "./components/student/accountManage.vue";

const router = new VueRouter({
  routes: [ // 路由规则
    { path: "/", redirect: "/infoConfirm/profileConfirm" },
    { path: "/scoreChange", component: scoreChange },
    {
      path: "/infoConfirm",
      component: infoConfirm,
      children: [{
        path: "/infoConfirm/profileConfirm",
        component: xjConfirm
      },
      {
        path: "/infoConfirm/scoreConfirm",
        component: scoreConfirm
      },
      {
        path: "/infoConfirm/rewardConfirm",
        component: rewardConfirm
      },
      {
        path: "/infoConfirm/gradConfirm",
        component: gradConfirm
      },
      {
        path: "/infoConfirm/rankConfirm",
        component: rankConfirm
      },
      {
        path: "/infoConfirm/intConfirm",
        component: intConfirm
      }]
    },
    { path: "/arcManage", component: arcManage },
    { path: "/infoShare", component: infoShare },
    { path: "/infoSquare", component: infoSquare },
    {
      path: "/message",
      component: message,
      children: [{
        path: "/message/received",
        component: received
      },
      {
        path: "/message/sent",
        component: sent
      }]
    },
    { path: "/infoDisclose", component: infoDisclose },
    { path: "/accountManage", component: accountManage }
  ]
});
router.beforeEach((to, from, next) => {
  if (JSON.parse(localStorage.getItem("jw_student_file")).xjConfirmed === undefined)
    return window.location.reload();
  if (to.path !== "/infoConfirm/profileConfirm" && !JSON.parse(localStorage.getItem("jw_student_file")).xjConfirmed) {
    return router.push("/infoConfirm/profileConfirm");
  }
  next();
});

export default router;