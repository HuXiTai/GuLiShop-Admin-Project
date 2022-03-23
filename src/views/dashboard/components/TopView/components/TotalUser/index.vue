<template>
  <div>
    <PublicCard
      title="累计用户数"
      :salesToday="echartsData.orderUser | numberFormat"
    >
      <template v-slot:main>
        <vueEcharts :options="getIOptions()" autoresize></vueEcharts>
      </template>

      <template v-slot:bottom>
        <div class="bottom">
          <span>退货率{{ " " + echartsData.returnRate }}</span>
        </div>
      </template>
    </PublicCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TotalUser",
  computed: {
    ...mapState("echarts", ["echartsData"]),
  },
  mounted() {},
  methods: {
    getIOptions() {
      return {
        // title: {
        //   text: "ECharts 入门示例",
        // },
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   data: ["销量"],
        // },
        xAxis: {
          data: this.echartsData.orderUserTrendAxis || [],
          show: false,
        },
        yAxis: {
          show: false,
        },

        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.echartsData.orderUserTrend || [],
            barWidth: "50%",
            itemStyle: {
              color: "skyblue",
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}
</style>
