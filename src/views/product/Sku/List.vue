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
          width="width"
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
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="price"
          label="价格(元)"
          width="width"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="300" align="center">
          <template v-slot="{ row, $index }">
            <HintButton
              v-if="true"
              type="success"
              icon="el-icon-bottom"
              title="下架"
              size="mini"
            />
            <HintButton
              v-else
              type="info"
              icon="el-icon-top"
              title="上架"
              size="mini"
            />
            <HintButton
              type="primary"
              icon="el-icon-edit"
              title="修改"
              size="mini"
            />
            <HintButton
              type="info"
              icon="el-icon-view"
              title="查看"
              size="mini"
            />
            <HintButton
              type="danger"
              icon="el-icon-delete"
              title="删除"
              size="mini"
            />
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
      skuList: []
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
    }
  }
};
</script>

<style></style>
