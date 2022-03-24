<template>
  <div class="searchBox">
    <el-card>
      <div slot="header">关键词搜索</div>

      <el-row :gutter="10" class="echarts">
        <el-col :span="18">
          <div class="echartsLeft">
            <span class="title">搜索用户数</span>
            <span class="count">{{ userSum | numberFormat }}</span>
            <div class="vueEcharts">
              <vueEcharts :options="getOptions1()" autoresize />
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="echartsRight">
            <span class="title">搜索量</span>
            <span class="count">{{ searchSum | numberFormat }}</span>
            <div class="vueEcharts">
              <vueEcharts :options="getOptions2()" autoresize />
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="table">
        <el-table :data="searchWord" style="width: 100%">
          <el-table-column type="index" label="排名" width="80">
          </el-table-column>

          <el-table-column prop="word" label="关键字" width="width">
          </el-table-column>

          <el-table-column prop="count" label="搜索数量" width="width">
          </el-table-column>

          <el-table-column prop="user" label="搜索用户数" width="width">
          </el-table-column>

          <el-table-column prop="mix" label="搜索占比" width="width">
          </el-table-column>
        </el-table>
      </div>

      <!-- @size-change="handleSizeChange"
    @current-change="handleCurrentChange" -->
      <el-pagination
        background
        style="text-align: center;"
        layout="prev, pager, next , total"
        :page-size="limit"
        :pager-count="5"
        :current-page="page"
        :total="(echartsData.searchWord || []).length"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "searchBox",
  data() {
    return {
      key: [],
      searchNum: [],
      searchUserNum: [],
      mix: [],
      page: 1,
      limit: 5
    };
  },
  mounted() {
    console.log(this);
  },
  methods: {
    getOptions1() {
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
          data: this.key || [],
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
            data: this.searchUserNum || [],
            itemStyle: {
              opacity: 0,
              color: "hotpink"
            },
            // lineStyle: {
            //   color: "greenyellow"
            // },
            smooth: true,
            areaStyle: {
              color: "pink"
            }
          }
        ]
      };
    },
    getOptions2() {
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
          data: this.key || [],
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
            data: this.searchNum || [],
            itemStyle: {
              opacity: 0,
              color: "hotpink"
            },
            // lineStyle: {
            //   //   opacity: 0
            // },
            smooth: true,
            areaStyle: {
              color: "pink"
            }
          }
        ]
      };
    },
    handleCurrentChange(value) {
      this.page = value;
    }
  },
  computed: {
    ...mapState("echarts", ["echartsData"]),
    userSum() {
      return (this.echartsData.searchWord || []).reduce((p, c) => {
        p += c.user;
        return p;
      }, 0);
    },
    searchSum() {
      return (this.echartsData.searchWord || []).reduce((p, c) => {
        p += c.count;
        return p;
      }, 0);
    },
    searchWord() {
      return (
        this.echartsData.searchWord ||
        [].slice((this.page - 1) * 5, this.page * 5)
      );
    }
  },
  watch: {
    echartsData() {
      const { key, searchNum, searchUserNum, mix } = this;
      this.echartsData.searchWord.forEach(item => {
        key.push(item.word);
        searchNum.push(item.count);
        searchUserNum.push(item.user);
        item.mix = ((item.count / this.searchSum) * 100).toFixed(2) + "%";
      });

      //   this.echartsData.searchWord.sort((a, b) => {
      //     return a.count - b.count;
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.searchBox {
  .echartsLeft,
  .echartsRight {
    display: flex;
    flex-direction: column;
    .vueEcharts {
      height: 50px;
    }
  }
  .title {
    font-size: 14px;
    color: #aaa;
  }

  .count {
    font-size: 24px;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .table {
    height: 300px;
  }
}
</style>
