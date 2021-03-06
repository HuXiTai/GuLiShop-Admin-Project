import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

import * as api from "@/api"; //引入所有api

import "@/plugins/echarts"; //执行echarts配置

import "@/mock"; //执行mock配置

import "@/filters"; //执行自定义过滤器

//全局注册组件
import CategorySelector from "./components/CategorySelector";
Vue.component("CategorySelector", CategorySelector);
import HintButton from "./components/HintButton";
Vue.component("HintButton", HintButton);

import PublicCard from "./components/PublicCard";
Vue.component("PublicCard", PublicCard);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

Vue.prototype.$api = api; //把api放到所有组件能访问到的地方

import { textButton } from "@/utils/textButton";
Vue.prototype.$textButton = textButton;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
