<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(千克)"
          type="number"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          placeholder="规格描述"
          type="textarea"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" style="margin-left:30px">
          <el-form-item
            v-for="plat of platAttr"
            :key="plat.id"
            :label="plat.attrName"
          >
            <el-select placeholder="请选择" v-model="plat.platParam">
              <el-option
                v-for="platValue of plat.attrValueList"
                :key="platValue.id"
                :label="platValue.valueName"
                :value="`${plat.id}:${platValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" style="margin-left:30px">
          <el-form-item
            v-for="sale of saleAttr"
            :key="sale.id"
            :label="sale.saleAttrName"
          >
            <el-select placeholder="请选择" v-model="sale.saleParam">
              <el-option
                v-for="saleValue of sale.spuSaleAttrValueList"
                :key="saleValue.id"
                :label="saleValue.saleAttrValueName"
                :value="`${sale.id}:${saleValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表"
        ><el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>

          <el-table-column
            prop="prop"
            label="图片"
            width="width"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px" />
            </template>
          </el-table-column>

          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <el-button
                v-if="row.isDefault === '0'"
                type="primary"
                size="mini"
                @click="setDefault(spuImageList, row)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="keepAddSku">保存</el-button>
        <el-button @click="cancelAddSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "addSku",
  data() {
    return {
      platAttr: [],
      saleAttr: [],
      spuImageList: [],
      turnImageList: [],
      spu: {},
      skuInfo: {
        //1:父组件传递过来的
        category3Id: "",
        spuId: "",
        tmId: "",

        //2:通过v-model直接收集的
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        //需要自己写代码收集
        skuDefaultImg: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string"
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      }
    };
  },
  methods: {
    //点击取消时
    cancelAddSku() {
      this.$emit("update:visible", false);
    },

    //进入添加Sku页面需要发的三个初始化动态数据请求
    async getInitData(spu, category1Id, category2Id) {
      this.spu = spu;
      //http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      //获取平台属性
      const re1 = this.$api.attr.getList(
        category1Id,
        category2Id,
        spu.category3Id
      );

      //http://localhost:9529/dev-api/admin/product/spuSaleAttrList/7005
      //获取销售属性
      const re2 = this.$api.sku.getSpuSaleAttrList(spu.id);

      //http://localhost:9529/dev-api/admin/product/spuImageList/7005
      //获取指定spu的图片列表
      const re3 = this.$api.sku.getSpuImageList(spu.id);

      //用promise.all统一处理各请求
      const result = await Promise.all([re1, re2, re3]);

      //收集初始化数据
      this.platAttr = result[0].data;
      this.saleAttr = result[1].data;

      const spuImageList = result[2].data;
      spuImageList.forEach(item => {
        item.isDefault = "0";
      });
      this.spuImageList = spuImageList;
    },

    //图片选中的函数
    handleSelectionChange(val) {
      this.turnImageList = val;
    },

    //点击设为默认时
    setDefault(spuImageList, row) {
      spuImageList.forEach(item => {
        item.isDefault = "0";
      });

      row.isDefault = "1";

      this.skuInfo.skuDefaultImg = row.imgUrl;
    },

    //点击保存时
    keepAddSku() {
      //收集数据
      //整理数据
      //发送请求
      //成功
      //失败
    }
  }
};
</script>

<style></style>
