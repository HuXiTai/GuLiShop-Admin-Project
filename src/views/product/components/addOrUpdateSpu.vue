<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
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
          placeholder="SPU描述"
          type="textarea"
          rows="4"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="unUseSaleAttrIdName"
          :placeholder="
            unUseSaleAttrList.length > 0
              ? `还有${unUseSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            v-for="item of unUseSaleAttrList"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="plus" @click="addSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>

      <el-form-item label="">
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag v-for="item of row.spuSaleAttrValueList" :key="item.id">{{
                item.saleAttrValueName
              }}</el-tag>

              <el-input
                class="input-new-tag"
                v-model="row.inputValue"
                v-if="row.isEdit"
                ref="input"
                @keyup.enter.native="Edited(row)"
                @blur="Edited(row)"
              ></el-input>

              <el-button
                v-else
                size="mini"
                class="button-new-tag"
                @click="showEdit(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{ row, $index }">
              <HintButton
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除销售属性"
                @click="deleteSaleAttr($index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancelAddOrUpdateSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "addOrUpdateSpu",
  data() {
    return {
      category3Id: "",
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        category3Id: "",
        description: "",
        // id: 0,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "string",
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   spuId: 0,
          // },
          //   ],
          // },
        ],
        tmId: ""
      },
      spuImgList: [],
      trademarkList: [],
      saleAttrList: [],
      unUseSaleAttrIdName: ""
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImgList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureSuccess(_, __, fileList) {
      this.spuImgList = fileList;
    },
    cancelAddOrUpdateSpu() {
      this.$emit("cancelAddOrUpdateSpu");
      Object.assign(this._data, this.$options.data());
    },

    //四个初始化请求
    async getUpdateSpuInitInfo(spu, category3Id) {
      this.category3Id = category3Id;
      //根据spu的id获取spu的详情
      try {
        const re1 = await this.$api.spu.get(spu.id);
        if (re1.code === 200) {
          this.spuInfo = re1.data;
        } else {
          this.$message.error("获取spu的详情失败");
        }
      } catch (e) {
        this.$message.error("请求获取spu的详情失败");
      }

      //根据spu的id获取spu的图片列表
      try {
        const re2 = await this.$api.sku.getSpuImageList(spu.id);
        if (re2.code === 20000 || re2.code === 200) {
          re2.data.forEach(item => {
            item.name = item.imgName;
            item.url = item.imgUrl;
          });
          this.spuImgList = re2.data;
        } else {
          this.$message.error("获取spu的图片列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取spu的图片列表失败");
      }

      //获取所有的品牌列表
      try {
        const re3 = await this.$api.trademark.getList();
        if (re3.code === 20000 || re3.code === 200) {
          this.trademarkList = re3.data;
        } else {
          this.$message.error("获取所有的品牌列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取所有的品牌列表失败");
      }

      //获取所有的销售属性列表
      try {
        const re4 = await this.$api.spu.getSaleAttrList();
        if (re4.code === 20000 || re4.code === 200) {
          this.saleAttrList = re4.data;
        } else {
          this.$message.error("获取所有的销售属性列表");
        }
      } catch (e) {
        this.$message.error("获取所有的销售属性列表");
      }
    },
    //请求获取添加spu的初始化数据
    async getAddSpuInitInfo(category3Id) {
      this.category3Id = category3Id;
      //获取所有的品牌列表
      try {
        const re3 = await this.$api.trademark.getList();
        if (re3.code === 20000 || re3.code === 200) {
          this.trademarkList = re3.data;
        } else {
          this.$message.error("获取所有的品牌列表失败");
        }
      } catch (e) {
        this.$message.error("请求获取所有的品牌列表失败");
      }
      //获取所有的销售属性列表
      try {
        const re4 = await this.$api.spu.getSaleAttrList();
        if (re4.code === 20000 || re4.code === 200) {
          this.saleAttrList = re4.data;
        } else {
          this.$message.error("获取所有的销售属性列表");
        }
      } catch (e) {
        this.$message.error("获取所有的销售属性列表");
      }
    },

    showEdit(row) {
      this.$set(row, "isEdit", true);

      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    Edited(row) {
      let saleAttrValueName = row.inputValue;
      let baseSaleAttrId = row.baseSaleAttrId;

      if (saleAttrValueName.trim() === "") {
        row.inputValue = "";
        return;
      }

      const isRepeat = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === saleAttrValueName;
      });

      if (isRepeat) {
        this.$message.info("销售属性值名称不能重复");
        row.inputValue = "";
        return;
      }

      let obj = {
        saleAttrValueName,
        baseSaleAttrId
      };

      row.spuSaleAttrValueList.push(obj);
      row.isEdit = false;
      row.inputValue = "";
    },

    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.unUseSaleAttrIdName.split(
        ":"
      );

      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };

      this.spuInfo.spuSaleAttrList.push(obj);

      this.unUseSaleAttrIdName = ""; //清空收集的数据
    },

    deleteSaleAttr(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    },

    async save() {
      const { spuInfo, spuImgList, category3Id } = this;

      spuInfo.category3Id = category3Id;

      spuInfo.spuImageList = spuImgList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        };
      });

      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.inputVisible;
        delete item.inputValue;
      });

      try {
        const re = await this.$api.spu.addUpdate(spuInfo);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("保存spu成功");
          this.$emit("cancelAddOrUpdateSpu");
          this.$emit("backSuccess", spuInfo.id);
          Object.assign(this._data, this.$options.data());
        } else {
          this.$message.error("保存spu失败");
        }
      } catch (e) {
        this.$message.error("请求保存spu失败");
      }
    }
  },
  computed: {
    unUseSaleAttrList() {
      return this.saleAttrList.filter(saleAttr => {
        return this.spuInfo.spuSaleAttrList.every(item => {
          return item.saleAttrName !== saleAttr.name;
        });
      });
    }
  }
};
</script>

<style>
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
