import VueRouter from "vue-router";
import signIn from "./components/sign/signIn.vue";
import comSignIn from "./components/sign/comSignIn.vue";
// import signUp from "./components/sign/signUp.vue"
// import testSignIn from "./components/sign/testSignIn.vue"

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/signIn" },
    { path: "/signIn", component: signIn },
    { path: "/comSignIn", component: comSignIn },
    // { path: "/signUp", component: signUp },
    // { path: "/testSignIn", component: testSignIn }
  ]
});

export default router;