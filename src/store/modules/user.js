import { login, logout, getInfo } from "@/api/user";
// import { getToken, setToken, removeToken } from "@/utils/auth";
import {
  resetRouter,
  constantRoutes,
  allAsyncRoutes,
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
};

const state = getDefaultState();

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
      commit("SET_ROUTERS", filterAsyncRouters(allAsyncRoutes, re.data.routes));
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
    } else {
      return Promise.reject(new Error("error"));
    }
  },

  resetToken({ commit }) {
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
  SET_ROUTERS: (state, asyncRouters) => {
    state.routes = [...constantRoutes, ...asyncRouters, anyRoute];

    router.addRoutes([...asyncRouters], anyRoute);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
