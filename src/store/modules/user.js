import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: ""
  };
};

const state = getDefaultState();

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo;
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password })
  //       .then(response => {
  //         const { data } = response;
  //         commit("SET_TOKEN", data.token);
  //         setToken(data.token);
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },

  // user login 的async/await写法
  async login(miniStore, userInfo) {
    try {
      const { username, password } = userInfo;
      const re = await login({ username: username.trim(), password: password });
      const { data } = re;
      miniStore.commit("SET_TOKEN", data.token);
      setToken(data.token);
      return "ok";
    } catch (e) {
      return Promise.reject(e);
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  //get user info 的async/await写法
  // async getInfo(miniStore, { state }) {
  //   try {
  //     const re = await getInfo(state.token);
  //     const { data } = re;

  //     if (!data) {
  //       return reject("Verification failed, please Login again.");
  //     }

  //     const { name, avatar } = data;

  //     miniStore.commit("SET_NAME", name);
  //     miniStore.commit("SET_AVATAR", avatar);
  //     return data;
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
  // },

  // user logout 的async/await写法
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout 的async/await写法
  // async logout(miniStore, { state }) {
  //   try {
  //     await logout(state.token);
  //     removeToken(); // must remove  token  first
  //     resetRouter();
  //     miniStore.commit("RESET_STATE");
  //     resolve();
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
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
