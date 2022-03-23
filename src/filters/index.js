/* 
自定义过滤器
*/
import Vue from "vue";
/*
数值每3位逗号分隔
*/
function formatNumber(value) {
  if (!value) return "";
  return `${value}`.replace(/(\d{3})(?=\d)/g, "$1,");
}

/* 
数值格式化
*/
Vue.filter("numberFormat", formatNumber);

/* 
人民币格式化
*/
Vue.filter("moneyFormat", value => {
  return `¥ ${formatNumber(value)}`;
});
