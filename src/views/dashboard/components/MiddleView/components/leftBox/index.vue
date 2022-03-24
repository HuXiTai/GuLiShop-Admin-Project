<template>
  <div class="leftBox">
    <vueEcharts :options="getOptions()" aotoresize />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "leftBox",
  props: ["activeIndex"],
  data() {
    return {};
  },
  computed: {
    ...mapState("echarts", ["echartsData"])
  },
  methods: {
    getOptions() {
      return {
        title: {
          text: this.activeIndex === "1" ? "销售趋势" : "访问量",
          textStyle: {
            fontSize: 14
          },
          left: "4%",
          top: "7%"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          type: "category",
          data:
            this.activeIndex === "1"
              ? this.echartsData.orderFullYearAxis || []
              : this.echartsData.userFullYearAxis || [],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: "dotted",
              color: "#eee"
            }
          }
        },

        series: [
          {
            type: "bar",
            data:
              this.activeIndex === "1"
                ? this.echartsData.orderFullYear || []
                : this.echartsData.userFullYear || [],
            barWidth: "40%",
            itemStyle: {
              color: "skyblue"
            }
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.leftBox {
  height: 350px;
}
</style>
