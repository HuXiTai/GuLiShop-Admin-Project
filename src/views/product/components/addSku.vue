<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="价格(元)"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuInfo.weight"
          placeholder="重量(千克)"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            v-for="item of platAttrList"
            :key="item.id"
            :label="item.attrName"
            label-width="100px"
          >
            <el-select v-model="item.attrIdValueId" placeholder="请选择">
              <el-option
                v-for="itemX of item.attrValueList"
                :key="itemX.id"
                :label="itemX.valueName"
                :value="`${item.id}:${itemX.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性" label-width="100px">
        <el-form :inline="true">
          <el-form-item
            v-for="item of saleAttrList"
            :key="item.id"
            :label="item.saleAttrName"
          >
            <el-select
              v-model="item.saleAttrIdValueId"
              value=""
              placeholder="请选择"
            >
              <el-option
                v-for="itemX of item.spuSaleAttrValueList"
                :key="itemX.id"
                :label="itemX.saleAttrValueName"
                :value="`${item.id}:${itemX.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          tooltip-effect="dark"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template></template>
          </el-table-column>

          <el-table-column prop="prop" label="名称" width="width">
            <template></template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template></template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="label">
        <el-button type="primary" @click="save">保存</el-button>
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
      spu: {},
      platAttrList: [],
      saleAttrList: [],
      spuImageList: [],
      skuInfo: {
        //从父组件传过来的
        spuId: "",
        category3Id: "",
        tmId: "",

        // createTime: "2021-03-03T07:17:36.281Z",
        // id: 0,
        // isSale: 0,
        //咱们通过v-model直接收集
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        //通过自己写代码收集
        // sku的平台属性值列表，是由用户选择平台属性的值所决定的
        // 选择了一个平台属性值，那么列表当中就多了一个平台属性值对象
        // 没有选择，那就没有
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // }
        ],

        skuDefaultImg: "", //默认图片的路径

        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],

        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ]
      }
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    cancelAddSku() {
      this.$emit("cancelAddSku");
    },

    async getAddSkuInitInfo(row, category1Id, category2Id) {
      this.spu = row;

      const re1 = this.$api.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );

      const re2 = this.$api.sku.getSpuSaleAttrList(row.id);

      const re3 = this.$api.sku.getSpuImageList(row.id);

      const result = await Promise.all([re1, re2, re3]);

      this.platAttrList = result[0].data;
      this.saleAttrList = result[1].data;
      const spuImageList = result[2].data;
      spuImageList.forEach(item => (item.isDefault = "0"));
      this.spuImageList = spuImageList;
    },

    async save() {
      let { spu, skuInfo, platAttrList, saleAttrList, skuImageList } = this;

      skuInfo.id = spu.id;
      skuInfo.category3Id = spu.category3Id;
      skuInfo.tmId = spu.tmId;

      skuImageList = skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        };
      });

      skuInfo.skuImageList = skuImageList;

      skuInfo.skuAttrValueList = platAttrList.reduce((p, c) => {
        if (c.attrIdValueId) {
          let [attrId, valueId] = item.attrIdValueId.split(":");
          let obj = { attrId, valueId };
          p.push(obj);
        }
        return p;
      }, []);

      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((p, c) => {
        if (c.saleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(":");
          let obj = { saleAttrId, saleAttrId };
          p.push(obj);
        }
        return p;
      }, []);

      try {
        await this.$api.sku.addUpdate(skuInfo);
        this.$message.success("保存sku成功");
        this.$emit("cancelAddSku");
        Object.assign(this._data, this.$options.data());
      } catch (e) {
        this.$message.success("保存sku失败");
      }
    }
  }
};
</script>

<style></style>
