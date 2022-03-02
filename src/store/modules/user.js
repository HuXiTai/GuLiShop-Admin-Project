import { login, logout, getInfo } from "@/api/user";
// import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

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
      const { name, avatar } = re.data;
      commit("SET_NAME", name);
      commit("SET_AVATAR", avatar);
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
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
