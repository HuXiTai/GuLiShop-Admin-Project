import Vue from "vue";
import * as echarts from "echarts";
import vueEcharts from "vue-echarts";

Vue.prototype.$echarts = echarts;
Vue.component("vueEcharts", vueEcharts);
