<template>
  <div>
    <!-- !isShowAddOrUpdate && !isShowAddSku -->
    <CategorySelector
      @getCategory="getCategory"
      :isShowList="!isShowAddOrUpdate && !isShowAddSku"
    />

    <el-card style="margin-top:20px">
      <!-- spu列表页 -->
      <div v-show="!isShowAddOrUpdate && !isShowAddSku">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table :data="spuList" style="width: 100%;margin:20px 0" border>
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="200">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="300" align="center">
            <template v-slot="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSku(row)"
              />

              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="updateSpu(row)"
              />

              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU"
                @click="showSkuOfSpu(row)"
              />
              <el-popconfirm
                :title="`您确定要删除${row.spuName}吗?`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
       -->
        <el-pagination
          background
          style="text-align:center"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :pager-count="5"
          :page-sizes="[3, 6, 9]"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev, pager, next, jumper, ->, sizes,total"
        >
        </el-pagination>
      </div>

      <!-- 添加或修改spu页 -->
      <addOrUpdateSpu
        ref="spu"
        v-show="isShowAddOrUpdate"
        :visible.sync="isShowAddOrUpdate"
        :category3Id="category3Id"
        @backSuccess="backSuccess"
      />

      <!-- 添加sku页 -->
      <addSku ref="sku" v-show="isShowAddSku" :visible.sync="isShowAddSku" />

      <!-- 对话框 -->
      <el-dialog
        :before-close="dialogClose"
        :title="`${spu.spuName}的SKU列表`"
        :visible.sync="dialogTableVisible"
      >
        <el-table :data="skuList" v-loading="loading">
          <el-table-column
            property="skuName"
            label="名称"
            align="center"
          ></el-table-column>

          <el-table-column
            property="price"
            label="价格"
            align="center"
          ></el-table-column>

          <el-table-column
            property="weight"
            label="重量"
            align="center"
          ></el-table-column>

          <el-table-column property="name" label="默认图面" align="center">
            <template v-slot="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width:100px;height:100px"
              /> </template
          ></el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import addOrUpdateSpu from "./addOrUpdateSpu";
import addSku from "./addSku";
export default {
  name: "Spu",
  components: {
    addOrUpdateSpu,
    addSku
  },
  data() {
    return {
      spu: {},
      dialogTableVisible: false,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      skuList: [],
      page: 1,
      limit: 3,
      total: 0,
      isShowAddOrUpdate: false,
      isShowAddSku: false,
      loading: false
    };
  },
  methods: {
    //接收子组件触发自定义事件反过来的参数
    getCategory({ categoryId, flag }) {
      if (flag === 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];

        this.category1Id = categoryId;
      } else if (flag === 2) {
        this.category3Id = "";
        this.spuList = [];

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;

        this.getSpuList();
      }
    },

    //获取sup列表的请求
    async getSpuList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;
      try {
        const re = await this.$api.spu.getList(page, limit, category3Id);
        if (re.code === 20000 || re.code === 200) {
          this.spuList = re.data.records;
          this.total = re.data.total;
        } else {
          this.$message.error("获取SUP列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取SUP列表失败");
      }
    },

    //点击每页显示条数
    handleSizeChange(limit) {
      this.limit = limit;

      //重新获取数据
      this.getSpuList();
    },

    //点击添加SPU
    addSpu() {
      this.isShowAddOrUpdate = true;

      //点击添加SPU发送2个请求
      this.$refs.spu.getAddInfo();
    },

    //点击修改SPU
    updateSpu(row) {
      this.isShowAddOrUpdate = true;

      //点击修改SPU发送4个请求
      this.$refs.spu.getUpdateInfo(row);
    },

    //点击添加SKU
    addSku(spu) {
      this.isShowAddSku = true;

      //调用组件里的初始化数据请求
      this.$refs.sku.getInitData(spu, this.category1Id, this.category2Id);
    },

    //保存成功后需要重新请求数据，并根据添加或修改判断跳转到那一页
    backSuccess(flag) {
      if (flag) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },

    //点击删除spu
    async deleteSpu(row) {
      try {
        const re = await this.$api.spu.remove(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success(`${row.spuName}删除成功`);
          this.getSpuList(this.spuList > 1 ? this.page : this.page - 1);
        } else {
          this.$message.error(`${row.spuName}删除失败`);
        }
      } catch (e) {
        this.$message.error(`请求${row.spuName}删除失败`);
      }
    },

    //点击查看SPU的SKU列表
    async showSkuOfSpu(spu) {
      this.spu = spu;
      this.dialogTableVisible = true;
      this.loading = true;

      //发送获取某个spu的sku列表
      try {
        const re = await this.$api.sku.getListBySpuId(spu.id);
        if (re.code === 20000 || re.code === 200) {
          this.skuList = re.data;
        } else {
          this.$message.error("获取spu的sku列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取spu的sku列表失败");
      }

      this.loading = false;
    },

    //dialog关闭之前,清空数据，也可以去重置我们的初始化数据
    dialogClose() {
      this.skuList = [];
      this.loading = false;
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style></style>
