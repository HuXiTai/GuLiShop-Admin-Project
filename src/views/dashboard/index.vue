<template>
  <div class="dashboardContainer">
    <div class="main">
      <TopView />
      <MiddleView />
      <BottomView />
    </div>
  </div>
</template>

<script>
import TopView from "./components/TopView";
import MiddleView from "./components/MiddleView";
import BottomView from "./components/BottomView";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Dashboard",
  components: {
    TopView,
    MiddleView,
    BottomView
  },
  computed: {
    ...mapGetters(["name"])
  },
  mounted() {
    this.getEchartsData();
  },
  methods: {
    ...mapActions("echarts", ["getEchartsData"])
  }
};
</script>

<style lang="scss" scoped>
.dashboardContainer {
  // padding: 20px;
  .main {
    padding: 20px;
    background: #eee;
  }

  ::v-deep .echarts {
    height: 100%;
    width: 100%;
  }

  ::v-deep .down {
    border: 6px solid green;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }

  ::v-deep .up {
    border: 6px solid red;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
}
</style>
