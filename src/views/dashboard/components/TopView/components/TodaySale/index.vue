<template>
  <div>
    <PublicCard
      title="今日销售额"
      :salesToday="echartsData.salesToday | moneyFormat"
    >
      <template v-slot:main>
        <div class="main">
          <div class="top">
            <span>日同比</span>
            <span class="count">{{ echartsData.salesGrowthLastDay }}</span>
            <span
              :class="echartsData.salesGrowthLastDay < 0 ? 'down' : 'up'"
            ></span>
          </div>
          <div class="bottom">
            <span>月同比</span>
            <span class="count">{{ echartsData.salesGrowthLastMonth }}</span>
            <span
              :class="echartsData.salesGrowthLastMonth < 0 ? 'down' : 'up'"
            ></span>
          </div>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="bottom">
          <span>昨日销售量{{ " " + echartsData.salesLastDay }}</span>
        </div>
      </template>
    </PublicCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TodaySale",
  computed: {
    ...mapState("echarts", ["echartsData"]),
  },
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .top,
  .bottom {
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .count {
      margin: 0 4px;
      color: #333;
    }
  }
}
</style>
