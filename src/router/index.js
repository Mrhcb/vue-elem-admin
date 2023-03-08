import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
export const routes = [
  // 根路由
  {
    path: "/",
    redirect: "Login",
    hidden: true
  },
  // 登录 
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/account/Login.vue")
  },
  // 路由中转 
  {
    path: "/admin",
    name: "Admin",
    hidden: true
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
