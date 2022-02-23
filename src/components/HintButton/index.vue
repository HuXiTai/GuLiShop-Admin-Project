<template>
  <a href="javascript:;" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  props: ["title"]
};
</script>

<style scoped>
a {
  margin: 0 8px;
}
</style>
