import { login, logout, getInfo } from "@/api/acl/user";
// import { getToken, setToken, removeToken } from "@/utils/auth";
import {
  resetRouter,
  constantRoutes,
  allAsyncRoutes,
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
      commit(
        "SET_ROUTES",
        filtersAllAsyncRoutes(cloneDeep(allAsyncRoutes), re.data.routes)
      );
      return "ok";
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
      return "ok";
    } else {
      return Promise.reject(new Error("error"));
    }
  },

  async resetToken({ commit }) {
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

  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },

  SET_ROUTES: (state, asyncRoutes) => {
    state.routes = [...constantRoutes, ...asyncRoutes, anyRoutes];

    router.addRoutes([...asyncRoutes, anyRoutes]);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
