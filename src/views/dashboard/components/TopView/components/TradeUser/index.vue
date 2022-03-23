<template>
  <div>
    <PublicCard
      title="今日交易用户数"
      :salesToday="echartsData.usersTotal | numberFormat"
    >
      <template v-slot:main>
        <vueEcharts :options="getIOptions()" autoresize></vueEcharts>
      </template>

      <template v-slot:bottom>
        <div class="box">
          <div class="leftBox">
            <span>日同比{{ " " + echartsData.userGrowthLastDay }}</span>
            <span
              :class="echartsData.userGrowthLastDay < 0 ? 'down' : 'up'"
            ></span>
          </div>

          <div class="rightBox">
            <span>月同比{{ " " + echartsData.userGrowthLastMonth }}</span>
            <span
              :class="echartsData.userGrowthLastMonth < 0 ? 'down' : 'up'"
            ></span>
          </div>
        </div>
      </template>
    </PublicCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TradeUser",
  computed: {
    ...mapState("echarts", ["echartsData"]),
  },
  methods: {
    getIOptions() {
      return {
        xAxis: {
          // 去掉两边留白
          boundaryGap: false,
          // 不显示
          show: false,
          type: "value",
          min: 0, // x轴最小值
          max: this.echartsData.usersTotal, // x轴最大值
        },
        yAxis: {
          // 变为水平条
          type: "category",
          show: false, // 不显示y轴
        },
        series: {
          type: "bar",
          data: [this.echartsData.usersTotal - this.echartsData.usersLastMonth],

          // 柱条的宽度
          barWidth: 10,

          // 展示背景
          showBackground: true,
          // 背景样式
          backgroundStyle: {
            // 背景色
            color: "#eee",
          },

          // 柱条样式
          itemStyle: {
            color: "yellowgreen",
          },

          // 柱条显示的内容
          label: {
            show: true, // 显示
            formatter: "|", // 显示的具体内容
            position: "right", // 内容的位置
            distance: 1, // 间隔距离
          },
        },
        // 坐标系的位置
        grid: {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
        },
        // 显示提示
        tooltip: {
          // trigger: 'axis'
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: space-between;
  .leftBox,
  .rightBox {
    display: flex;
    justify-content: center;
  }

  .up,
  .down {
    margin-left: 4px;
  }
}
</style>
