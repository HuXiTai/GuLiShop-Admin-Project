<template>
  <div>
    <PublicCard
      title="今日订单"
      :salesToday="echartsData.orderToday | numberFormat"
    >
      <template v-slot:main>
        <div class="main" ref="main"></div>
      </template>

      <template v-slot:bottom>
        <div class="bottom">
          <span>昨日销售量{{ " " + echartsData.orderLastDay }}</span>
        </div>
      </template>
    </PublicCard>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import { mapState } from "vuex";
export default {
  name: "TodayOrder",
  data() {
    return {
      myChart: null,
      options: {}
    };
  },
  computed: {
    ...mapState("echarts", ["echartsData"])
  },
  mounted() {
    this.myChart = this.$echarts.init(this.$refs.main);
    this.myChart.setOption(this.getOptions());

    window.addEventListener("resize", throttle(this.handlerResize, 200));
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handlerResize);
  },
  methods: {
    getOptions() {
      return {
        // title: {
        //   text: "ECharts 入门示例",
        // },
        tooltip: {
          trigger: "axis"
        },
        // legend: {
        //   data: ["销量"],
        // },
        xAxis: {
          data: this.echartsData.orderTrendAxis || [],
          show: false
        },
        yAxis: {
          show: false
        },

        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        series: [
          {
            name: "销量",
            type: "line",
            data: this.echartsData.orderTrend || [],
            itemStyle: {
              opacity: 0,
              color: "hotpink"
            },
            lineStyle: {
              opacity: 0
            },
            smooth: true,
            areaStyle: {
              color: "pink"
            }
          }
        ]
      };
    },

    handlerResize() {
      this.myChart.resize();
    }
  },
  watch: {
    echartsData: {
      handler() {
        this.myChart.setOption(this.getOptions());
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}
</style>
