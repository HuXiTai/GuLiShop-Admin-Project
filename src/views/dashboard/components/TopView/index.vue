<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <TodaySale />
      </el-col>
      <el-col :span="6">
        <TodayOrder />
      </el-col>
      <el-col :span="6">
        <TotalUser />
      </el-col>
      <el-col :span="6">
        <TradeUser />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TodaySale from "./components/TodaySale";
import TodayOrder from "./components/TodayOrder";
import TradeUser from "./components/TradeUser";
import TotalUser from "./components/TotalUser";
export default {
  name: "TopView",
  components: {
    TodaySale,
    TodayOrder,
    TradeUser,
    TotalUser,
  },
};
</script>

<style></style>
