<template>
  <el-card class="card">
    <div class="header">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">销售额</el-menu-item>
        <el-menu-item index="2">访问量</el-menu-item>
      </el-menu>

      <el-radio-group v-model="radio" class="vadio">
        <el-radio-button label="今日"></el-radio-button>
        <el-radio-button label="本周"></el-radio-button>
        <el-radio-button label="本月"></el-radio-button>
        <el-radio-button label="本年"></el-radio-button>
      </el-radio-group>

      <el-date-picker
        value-format="yyyy-MM-dd"
        v-model="value"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
    <div class="body">
      <el-row :gutter="10">
        <el-col :span="18">
          <leftBox :activeIndex="activeIndex" />
        </el-col>
        <el-col :span="6">
          <rightBox :activeIndex="activeIndex" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import leftBox from "./components/leftBox";
import rightBox from "./components/rightBox";
export default {
  name: "MiddleView",
  components: {
    leftBox,
    rightBox
  },
  data() {
    return {
      activeIndex: "1",
      radio: "今日",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value: []
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
    }
  },
  watch: {
    value() {
      // console.log(this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 20px 0;
  ::v-deep .el-card__body {
    padding: 0 20px 0 0;
  }
  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #aaa;
    .el-menu-demo {
      flex: 1;
      border-bottom: none;
    }
    .vadio {
      margin-right: 20px;
    }
  }

  .body {
    height: 350px;
  }
}
</style>
