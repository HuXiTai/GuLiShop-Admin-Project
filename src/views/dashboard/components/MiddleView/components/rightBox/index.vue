<template>
  <div class="rightBox">
    <div class="title">
      {{ activeIndex === "1" ? "销售排行榜" : "访问排行榜" }}
    </div>
    <div class="rankList">
      <div
        class="rankItem"
        v-for="(item, index) of activeIndex === '1'
          ? echartsData.userRank
          : echartsData.orderRank"
        :key="item.no"
      >
        <span class="no" :class="{ active: index <= 2 }">{{ item.no }}</span>
        <span class="name">{{ item.name }}</span>
        <span class="count">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "rightBox",
  props: ["activeIndex"],
  computed: {
    //echartsData.orderRank //echartsData.userRank
    ...mapState("echarts", ["echartsData"])
  }
};
</script>

<style lang="scss" scoped>
.rightBox {
  margin-top: 35px;
  .rankList {
    margin-top: 20px;
    .rankItem {
      width: 40%;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin: 10px 0;
      .no {
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        &.active {
          background: black;
          color: #fff;
          border-radius: 50%;
        }
      }

      .name {
        flex: 1;
        padding: 0 10px;
      }
    }
  }
}
</style>
