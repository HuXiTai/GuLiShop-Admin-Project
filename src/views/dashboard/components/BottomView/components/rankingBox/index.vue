<template>
  <div class="rankingBox">
    <el-card class="card">
      <div class="title">
        <div slot="header">分类销售排行</div>

        <el-radio-group v-model="radio">
          <el-radio-button label="品类"></el-radio-button>
          <el-radio-button label="商品"></el-radio-button>
        </el-radio-group>
      </div>

      <div class="body">
        <vueEcharts :options="getOptions()" autoresize />
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "rankingBox",
  data() {
    return {
      radio: "品类",
      type: [],
      goods: []
    };
  },
  computed: {
    ...mapState("echarts", ["echartsData"]),
    typeSum() {
      return (
        ((this.echartsData.saleRank || {}).category || {}).data1 || []
      ).reduce((p, c) => {
        p += c;
        return p;
      }, 0);
    },
    goodsSum() {
      return ((this.echartsData.saleRank.goods || {}).data1 || []).reduce(
        (p, c) => {
          p += c;
          return p;
        },
        0
      );
    }
  },
  methods: {
    getOptions() {
      return {
        title: [
          {
            text: this.radio + "分布",
            textStyle: {
              fontSize: 14
            },
            left: "8%",
            top: "8%"
          },

          {
            text: "用户数量",
            subtext: this.radio === "品类" ? this.typeSum : this.goodsSum,
            textStyle: {
              fontSize: 14,
              color: "black",
              fontWeight: "bold"
            },
            subtextStyle: {
              fontSize: 14,
              color: "#999"
            },
            left: "39.5%",
            top: "44.5%",
            textAlign: "center"
          }
        ],
        tooltip: {
          trigger: "item",
          formatter: ({ data, marker }) => {
            return `${this.radio}分类<br>${marker}名称:${
              data.name.split("|")[0]
            }<br>${marker}数量:${data.value}<br>${marker}占比:${
              data.name.split("|")[1]
            }`;
          }
        },
        legend: {
          orient: "vertical",
          left: "70%",
          top: "middle",
          textStyle: {
            color: "#8c8c8c"
          }
          // top: "bottom"
        },
        toolbox: {
          show: true
          // feature: {
          //   mark: { show: true },
          //   dataView: { show: true, readOnly: false },
          //   restore: { show: true },
          //   saveAsImage: { show: true }
          // }
        },
        series: [
          {
            name: `${this.radio}分布`,
            type: "pie",
            radius: ["20%", "70%"],
            center: ["40%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8
            },
            data: this.radio === "品类" ? this.type : this.goods,
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: true,
              position: "outside",
              // 指定特定标题
              formatter: function(params) {
                return params.data.name.split("|")[0];
              }
            },
            labelLine: {
              length: 7,
              length2: 5
            }
          }
        ]
      };
    }
  },
  watch: {
    echartsData() {
      for (
        let i = 0;
        i < (this.echartsData.saleRank || {}).category.axisX.length;
        i++
      ) {
        this.type.push({
          name:
            (this.echartsData.saleRank || {}).category.axisX[i] +
            " | " +
            (
              (((this.echartsData.saleRank || {}).category || {}).data1[i] /
                this.typeSum) *
              100
            ).toFixed(2) +
            "%",
          value: ((this.echartsData.saleRank || {}).category || {}).data1[i]
        });
      }

      this.type.sort((a, b) => {
        return a.value - b.value;
      });

      for (let i = 0; i < this.echartsData.saleRank.goods.axisX.length; i++) {
        this.goods.push({
          name:
            this.echartsData.saleRank.goods.axisX[i] +
            " | " +
            (
              ((this.echartsData.saleRank.goods || {}).data1[i] /
                this.goodsSum) *
              100
            ).toFixed(2) +
            "%",
          value: (this.echartsData.saleRank.goods || {}).data1[i]
        });
      }

      this.goods.sort((a, b) => {
        return a.value - b.value;
      });

      console.log(this.type);
      console.log(this.goods);
    }
  }
};
</script>

<style lang="scss" scoped>
.rankingBox {
  .card {
    padding: 8px 20px;
    box-sizing: border-box;
    height: 543px;
  }
  ::v-deep .el-card__body {
    padding: 0;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .body {
    // width: 750px;
    height: 450px;
    display: flex;
    justify-content: center;
    margin-right: 0;
  }
}
</style>
