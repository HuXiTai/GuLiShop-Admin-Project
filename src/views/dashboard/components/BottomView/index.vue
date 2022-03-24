<template>
  <div class="BottomView">
    <el-row :gutter="10">
      <el-col :span="12">
        <searchBox />
      </el-col>
      <el-col :span="12">
        <rankingBox />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import searchBox from "./components/searchBox";
import rankingBox from "./components/rankingBox";
export default {
  name: "BottomView",
  components: {
    searchBox,
    rankingBox
  }
};
</script>

<style></style>
