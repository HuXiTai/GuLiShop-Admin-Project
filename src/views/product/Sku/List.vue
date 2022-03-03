<template>
  <div>
    <el-card style="margin-top:20px">
      <el-table style="width: 100%" border :data="skuList">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="skuDesc"
          label="描述"
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="prop"
          label="默认图片"
          width="150"
          align="center"
        >
          <template v-slot="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width:100px;height:100px"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="weight"
          label="重量(KG)"
          width="100"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="price"
          label="价格(元)"
          width="100"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="300" align="center">
          <template v-slot="{ row, $index }">
            <HintButton
              v-show="row.isSale == '1'"
              type="success"
              icon="el-icon-bottom"
              title="下架"
              size="mini"
              @click="lower(row)"
            />
            <HintButton
              v-show="row.isSale == '0'"
              type="info"
              icon="el-icon-top"
              title="上架"
              size="mini"
              @click="upper(row)"
            />
            <HintButton
              type="primary"
              icon="el-icon-edit"
              title="修改"
              size="mini"
              @click="$message.info('正在开发中...')"
            />
            <HintButton
              type="info"
              icon="el-icon-view"
              title="查看"
              size="mini"
              @click="look(row)"
            />

            <el-popconfirm
              :title="`您确定要删除${row.skuName}吗？`"
              @onConfirm="deleteSku(row)"
            >
              <HintButton
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                title="删除"
                size="mini"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
      <el-pagination
        background
        style="text-align:center"
        :current-page="page"
        :page-size="limit"
        :total="total"
        :pager-count="7"
        :page-sizes="[10, 20, 30]"
        @current-change="getList"
        layout="prev, pager, next, jumper, ->, sizes,total"
      >
      </el-pagination>

      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :with-header="false"
        size="50%"
      >
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ sku.skuName }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ sku.skuDesc }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ sku.price }}元</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <el-tag
              type="success"
              v-for="item of skuInfo.skuAttrValueList"
              :key="item.id"
              >{{ item.attrId + "-" + item.valueId }}</el-tag
            >
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel trigger="click" height="400px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" alt="" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      skuList: [],
      drawer: false,
      sku: {},
      skuInfo: {}
    };
  },
  mounted() {
    // http://localhost:9529/dev-api/admin/product/list/1/10
    this.getList();
  },
  methods: {
    async getList(page = 1) {
      this.page = page;
      try {
        const re = await this.$api.sku.getList(this.page, this.limit);
        if (re.code === 20000 || re.code === 200) {
          this.skuList = re.data.records;
          this.total = re.data.total;
        } else {
          this.$message.error("获取Sku列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取Sku列表失败");
      }
    },

    //点击上架
    async upper(row) {
      //http://localhost:9529/dev-api/admin/product/onSale/4742
      //http://localhost:9529/dev-api/admin/product/list/1/10

      try {
        const re = await this.$api.sku.onSale(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("上架Sku成功");
          this.getList();
        } else {
          this.$message.error("上架Sku失败");
        }
      } catch (e) {
        this.$message.error("请求上架Sku失败");
      }
    },

    //点击下架
    async lower(row) {
      //http://localhost:9529/dev-api/admin/product/cancelSale/4742
      //http://localhost:9529/dev-api/admin/product/list/1/10

      try {
        const re = await this.$api.sku.cancelSale(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("下架Sku成功");
          this.getList();
        } else {
          this.$message.error("下架Sku失败");
        }
      } catch (e) {
        this.$message.error("请求下架Sku失败");
      }
    },

    //点击查看
    async look(row) {
      try {
        const re = await this.$api.sku.get(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.skuInfo = re.data;
        } else {
          this.$message.error("获取Sku详细信息失败");
        }
      } catch (e) {
        this.$message.error("请求获取Sku详细信息失败");
      }
      this.drawer = true;
      this.sku = row;
    },

    //点击删除
    async deleteSku(row) {
      //http://localhost:9529/dev-api/admin/product/deleteSku/32
      try {
        const re = await this.$api.sku.remove(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("删除Sku成功");
          this.getList();
        } else {
          this.$message.error("删除Sku失败");
        }
      } catch (e) {
        this.$message.error("请求删除Sku失败");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel {
  width: 400px;
  img {
    width: 400px;
  }
}

.el-row {
  height: 40px;
  .el-col {
    line-height: 40px;
    &.el-col-5 {
      font-size: 18px;
      font-weight: bold;
      text-align: right;
      margin-right: 20px;
    }
  }
}
::v-deep .el-carousel__indicators {
  width: 80%;
  text-align: center;
}
::v-deep .el-carousel__button {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: hotpink;
}
</style>
