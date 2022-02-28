<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌" value="1">
          <el-option
            v-for="item of trademarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU名称"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="addSaleValueParam"
          :placeholder="
            unSelectedSaleAttrList.length
              ? `还有${unSelectedSaleAttrList.length}未选择`
              : `暂无可选择`
          "
          style="margin-right:18px"
        >
          <el-option
            v-for="unSelectedSaleAttr of unSelectedSaleAttrList"
            :key="unSelectedSaleAttr.id"
            :label="unSelectedSaleAttr.name"
            :value="JSON.stringify(unSelectedSaleAttr)"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!addSaleValueParam"
          >添加销售属性</el-button
        >
      </el-form-item>

      <el-form-item label="">
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                v-for="(item, index) of row.spuSaleAttrValueList"
                :key="item.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <!-- 
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
               -->
              <el-input
                v-if="row.isEdit"
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
                @blur="addSaleAttrValueComplete(row)"
                @keyup.enter.native="addSaleAttrValueComplete(row)"
                v-model="row.saleAttrValueName"
              >
              </el-input>
              <!--  @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >点击添加属性</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template v-slot="{ row, $index }" }>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除销售属性"
                size="mini"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="keepSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "addOrUpdateSpu",
  props: ["category3Id"],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        category3Id: "",
        description: "",
        spuImageList: [
          // {
          // imgName: "string",
          // imgUrl: "string",
          // }
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        tmId: ""
      },
      spuImageList: [],
      trademarkList: [],
      baseSaleAttrList: [],
      addSaleValueParam: ""
    };
  },
  methods: {
    //图片墙的函数
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(_, __, fileList) {
      this.spuImageList = fileList;
    },
    //获取修改spu页面的4个请求获取初始化数据
    async getUpdateInfo(row) {
      //http://localhost:9528/dev-api/admin/product/getSpuById/6591
      //获取SPU详情信息
      try {
        const re1 = await this.$api.spu.get(row.id);
        if (re1.code === 20000 || re1.code === 200) {
          this.spuInfo = re1.data;
        } else {
          this.$message.error("获取SPU详情信息失败");
        }
      } catch (e) {
        this.$message.error("请求获取SPU详情信息失败");
      }

      //http://localhost:9528/dev-api/admin/product/spuImageList/6591
      //获取指定SPU的id对应的图片列表
      try {
        const re2 = await this.$api.sku.getSpuImageList(row.id);
        if (re2.code === 20000 || re2.code === 200) {
          // 整理图片列表添加name和url属性
          re2.data.forEach(item => {
            item.name = item.imgName;
            item.url = item.imgUrl;
          });

          this.spuImageList = re2.data;
        } else {
          this.$message.error("获取指定SPU的id对应的图片列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取指定SPU的id对应的图片列表失败");
      }

      //http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList
      //获取所有品牌列表
      try {
        const re3 = await this.$api.trademark.getAllTrademarkList();
        if (re3.code === 20000 || re3.code === 200) {
          this.trademarkList = re3.data;
        } else {
          this.$message.error("获取所有品牌列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取所有品牌列表失败");
      }

      //http://localhost:9528/dev-api/admin/product/baseSaleAttrList
      //获取所有的销售属性列表
      try {
        const re4 = await this.$api.spu.getSaleAttrList();
        if (re4.code === 20000 || re4.code === 200) {
          this.baseSaleAttrList = re4.data;
        } else {
          this.$message.error("获取所有的销售属性列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取所有的销售属性列表失败");
      }
    },

    //获取添加spu页面的2个请求获取初始化数据
    async getAddInfo() {
      //http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList
      //获取所有品牌列表
      try {
        const re3 = await this.$api.trademark.getAllTrademarkList();
        if (re3.code === 20000 || re3.code === 200) {
          this.trademarkList = re3.data;
        } else {
          this.$message.error("获取所有品牌列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取所有品牌列表失败");
      }

      //http://localhost:9528/dev-api/admin/product/baseSaleAttrList
      //获取所有的销售属性列表
      try {
        const re4 = await this.$api.spu.getSaleAttrList();
        if (re4.code === 20000 || re4.code === 200) {
          this.baseSaleAttrList = re4.data;
        } else {
          this.$message.error("获取所有的销售属性列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取所有的销售属性列表失败");
      }
    },

    //点击添加销售属性
    addSaleAttr() {
      // this.spuInfo.spuSaleAttrList
      (this.spuInfo.spuSaleAttrList || []).push({
        baseSaleAttrId: JSON.parse(this.addSaleValueParam).id,
        saleAttrName: JSON.parse(this.addSaleValueParam).name,
        spuSaleAttrValueList: []
      });

      this.addSaleValueParam = "";
    },

    //点击添加销售属性值
    addSaleAttrValue(row) {
      //显示input框
      this.$set(row, "isEdit", true);

      //处理undefind.trim()的假报错
      this.$set(row, "saleAttrValueName", "");

      //自动聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    //点击添加销售属性值时按下enter或失去焦点时
    addSaleAttrValueComplete(row) {
      const { saleAttrValueName, baseSaleAttrId } = row;

      //判断是否为空
      if (!saleAttrValueName.trim()) {
        this.$message.error("输入的销售属性值名称不能为空!");
        row.isEdit = false;
        return (row.saleAttrValueName = "");
      }

      //判断是否有重复
      const isRepeat = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === saleAttrValueName;
      });

      if (isRepeat) {
        this.$message.error("输入的销售属性值名称不能重复!");
        row.isEdit = false;
        return (row.saleAttrValueName = "");
      }

      row.spuSaleAttrValueList.push({ saleAttrValueName, baseSaleAttrId });
      row.saleAttrValueName = "";
      row.isEdit = false;
    },

    //SPU的修改或添加的保存操作
    async keepSpu() {
      //收集数据
      const { spuInfo, spuImageList, category3Id } = this;
      //整理数据
      // 1、整理图片数据结构
      // imgName: "string",
      // imgUrl: "string",
      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        };
      });
      // 2、整理category3Id
      spuInfo.category3Id = category3Id;
      // 3、去掉所有销售属性身上不需要的属性
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.edit;
        delete item.saleAttrValueName;
      });
      //发送请求
      try {
        const re = await this.$api.spu.addUpdate(spuInfo);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("SPU保存成功");
          this.$emit("update:visible", false);
          this.$emit("backSuccess", spuInfo.id);
          //清除数据
          Object.assign(this._data, this.$options.data());
        } else {
          this.$message.error("SPU保存失败");
        }
      } catch (e) {
        this.$message.error("请求SPU保存失败");
      }
      //成功
      //失败
    },

    //SPU修改或添加时取消
    cancel() {
      this.$emit("update:visible", false);

      //清除数据
      Object.assign(this._data, this.$options.data());
    }
  },
  computed: {
    //根据所有的销售属性列表和spuInfo自己的销售属性列表计算一个新的销售属性列表
    // unSelectedSaleAttrList() {
    //   return this.baseSaleAttrList.filter(item => {
    //     return this.spuInfo.spuSaleAttrList.every(item1 => {
    //       return item1.saleAttrName !== item.name;
    //     });
    //   });
    // }
    unSelectedSaleAttrList() {
      return this.baseSaleAttrList.filter(item =>
        (this.spuInfo.spuSaleAttrList || []).every(
          item1 => item1.saleAttrName !== item.name
        )
      );
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
