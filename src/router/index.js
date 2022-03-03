import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" }
      }
    ]
  }
];

export const allAsyncRoutes = [
  {
    path: "/product",
    component: Layout,
    name: "Product",
    meta: { title: "商品管理", icon: "el-icon-s-goods" },
    children: [
      {
        path: "/trademark/list",
        name: "Trademark",
        component: () => import("@/views/product/Trademark/List"),
        meta: { title: "品牌管理" }
      },
      {
        path: "/attr/list",
        name: "Attr",
        component: () => import("@/views/product/Attr/List"),
        meta: { title: "平台属性管理" }
      },
      {
        path: "/sku/list",
        name: "Sku",
        component: () => import("@/views/product/Sku/List"),
        meta: { title: "Sku管理" }
      },
      {
        path: "/spu/list",
        name: "Spu",
        component: () => import("@/views/product/Spu/List"),
        meta: { title: "Spu管理" }
      },
      {
        path: "/scoped/list",
        name: "Scoped",
        component: () => import("@/views/product/Scoped/List"),
        meta: { title: "Scoped测试" }
      }
    ]
  },

  //权限数据管理相关的路由
  {
    name: "Acl",
    path: "/acl",
    component: Layout,
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "el-icon-lock"
    },
    children: [
      {
        name: "User",
        path: "user/list",
        component: () => import("@/views/acl/user/list"),
        meta: {
          title: "用户管理"
        }
      },
      {
        name: "Role",
        path: "role/list",
        component: () => import("@/views/acl/role/list"),
        meta: {
          title: "角色管理"
        }
      },
      {
        name: "RoleAuth",
        path: "role/auth/:id",
        component: () => import("@/views/acl/role/roleAuth"),
        meta: {
          activeMenu: "/acl/role/list",
          title: "角色授权"
        },
        hidden: true
      },
      {
        name: "Permission",
        path: "permission/list",
        component: () => import("@/views/acl/permission/list"),
        meta: {
          title: "菜单管理"
        }
      }
    ]
  },

  {
    path: "/textButton",
    component: Layout,
    name: "textButton",
    meta: { title: "测试管理", icon: "el-icon-plus" },
    children: [
      {
        path: "/textButton/list1",
        component: () => import("@/views/textButton/text111/List"),
        name: "text111",
        meta: { title: "测试111" }
      },
      {
        path: "/textButton/list2",
        component: () => import("@/views/textButton/text222/List"),
        name: "text222",
        meta: { title: "测试222" }
      }
    ]
  }
];

export const anyRoutes = { path: "*", redirect: "/404", hidden: true };

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
