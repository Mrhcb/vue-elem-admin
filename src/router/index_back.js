import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
export const routes = [
  {
    path: "/",
    redirect: "Login",
    hidden: true,
    aaa: "",
    bbb:""
  },
  // 登录 
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/account/Login.vue")
  },
  // 后台首页
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "控制台",
      icon: "home"
    },
    component: () => import("../layout/Index.vue"),
    children: [
      {
        path: "/console",
        name: "Console",
        meta: {
          title: "首页"
        },
        component: () => import("../views/console/Index.vue"),
      }
    ]
  },
  {
    path: "/system",
    name: "System",
    meta: {
      title: "系统配置",
      icon: "system"
    },
    component: () => import("../layout/Index.vue"),
    children: [
      {
        path: "/user",
        name: "User",
        meta: {
          title: "用户列表"
        },
        component: () => import("../views/system/User.vue"),
      },
      {
        path: "/role",
        name: "Role",
        meta: {
          title: "角色列表"
        },
        component: () => import("../views/system/Role.vue"),
      },
      {
        path: "/menu",
        name: "Menu",
        meta: {
          title: "菜单列表"
        },
        component: () => import("../views/system/Menu.vue"),
      }
    ]
  },
  {
    path: "/news",
    name: "News",
    meta: {
      title: "信息管理",
      icon: "information"
    },
    component: () => import("../layout/Index.vue"),
    children: [
      {
        path: "/newsIndex",
        name: "NewsIndex",
        meta: {
          title: "信息列表"
        },
        component: () => import("../views/info/Index.vue"),
      },
      {
        path: "/newsCategory",
        name: "NewsCategory",
        meta: {
          title: "信息分类"
        },
        component: () => import("../views/info/Category.vue"),
      },
      {
        path: "/newsDetailed",
        name: "NewsDetailed",
        hidden: true,
        meta: {
          title: "信息详情"
        },
        component: () => import("../views/info/Detailed.vue"),
      }
    ]
  }
    
];



const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
