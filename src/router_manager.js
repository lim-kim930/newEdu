import VueRouter from "vue-router"
import addCompany from "./components/manager/addCompany.vue"
import profileReset from "./components/manager/profileReset.vue"

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/addCompany" },
    { path: "/addCompany", component: addCompany },
    { path: "/profileReset", component: profileReset }
  ]
})

export default router