import { getEchartsData } from "@/api/echarts";

const state = {
  echartsData: {}
};

const actions = {
  async getEchartsData({ commit }) {
    const re = await getEchartsData();
    if (re.code === 888) {
      commit("SET_ECHARTS_DATA", re.data);
    }
  }
};

const mutations = {
  SET_ECHARTS_DATA(state, value) {
    state.echartsData = value;
  }
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
};
