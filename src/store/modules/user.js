import { login, logout, getInfo } from "@/api/user";
// import { getToken, setToken, removeToken } from "@/utils/auth";
import {
  resetRouter,
  constantRoutes,
  allAsyncRoutes,
<<<<<<< HEAD
  anyRoutes,
  default as router
} from "@/router";

//通过权限信息过滤出路由的函数
function filtersAllAsyncRoutes(allAsyncRoutes, routes) {
  const asyncRoutes = allAsyncRoutes.filter(item => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length) {
        item.children = filtersAllAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });

  return asyncRoutes;
}

import cloneDeep from "lodash/cloneDeep";

const state = {
  token: localStorage.getItem("token_key"),
  name: "",
  avatar: ""
=======
  anyRoute,
  default as router
} from "@/router";

function filterAsyncRouters(allAsyncRoutes, routeNames) {
  const asyncRoutes = allAsyncRoutes.filter(item => {
    if (routeNames.includes(item.name)) {
      if (item.children && item.children.length) {
        item.children = filterAsyncRouters(item.children, routeNames);
      }
      return true;
    }
  });
  return asyncRoutes;
}

const getDefaultState = () => {
  return {
    token: localStorage.getItem("token_key"),
    name: "",
    avatar: "",
    buttons: [],
    roles: [],
    routes: []
  };
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
};

const actions = {
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const re = await login({ username: username.trim(), password: password });
    if (re.code === 20000 || re.code === 200) {
      commit("SET_TOKEN", re.data.token);
      localStorage.setItem("token_key", re.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("error"));
    }
  },

  async getInfo({ commit, state }) {
    const re = await getInfo(state.token);
    if (re.code === 20000 || re.code === 200) {
      commit("SET_USERINFO", re.data);
<<<<<<< HEAD
      commit(
        "SET_ROUTES",
        filtersAllAsyncRoutes(cloneDeep(allAsyncRoutes), re.data.routes)
      );
      return "ok";
=======
      commit("SET_ROUTERS", filterAsyncRouters(allAsyncRoutes, re.data.routes));
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
    } else {
      return Promise.reject(new Error("error"));
    }
  },

  async logout({ commit, state }) {
    const re = await logout(state.token);
    if (re.code === 20000 || re.code === 200) {
      localStorage.removeItem("token_key");
      resetRouter();
      commit("RESET_STATE");
<<<<<<< HEAD
      return "ok";
=======
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
    } else {
      return Promise.reject(new Error("error"));
    }
  },

<<<<<<< HEAD
  async resetToken({ commit }) {
=======
  resetToken({ commit }) {
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
    localStorage.removeItem("token_key");
    commit("RESET_STATE");
  }
};

const mutations = {
  RESET_STATE: state => {
    state.token = "";
    state.name = "";
    state.avatar = "";
    state.buttons = [];
    state.roles = [];
    state.routes = [];
  },

  SET_TOKEN: (state, token) => {
    state.token = token;
  },
<<<<<<< HEAD

=======
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
<<<<<<< HEAD

  SET_ROUTES: (state, asyncRoutes) => {
    state.routes = [...constantRoutes, ...asyncRoutes, anyRoutes];

    router.addRoutes([...asyncRoutes, anyRoutes]);
=======
  SET_ROUTERS: (state, asyncRouters) => {
    state.routes = [...constantRoutes, ...asyncRouters, anyRoute];

    router.addRoutes([...asyncRouters], anyRoute);
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
