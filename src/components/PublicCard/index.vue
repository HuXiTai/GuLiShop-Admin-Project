<template>
  <div class="main">
    <el-card>
      <div class="title">{{ title }}</div>

      <div class="count">{{ salesToday }}</div>

      <div class="templateMain">
        <slot name="main"></slot>
      </div>

      <div class="line"></div>

      <div class="templateBottom">
        <slot name="bottom"></slot>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PublicCard",
  props: ["title", "salesToday"],
};
</script>

<style lang="scss" scoped>
.main {
  .title {
    font-size: 12px;
    color: #aaa;
  }

  .count {
    font-size: 22px;
  }

  .templateMain {
    height: 50px;
  }

  .line {
    height: 2px;
    background-color: #999;
    margin: 10px 0;
  }

  .templateBottom {
    font-size: 12px;
    color: #aaa;
  }
}
</style>
