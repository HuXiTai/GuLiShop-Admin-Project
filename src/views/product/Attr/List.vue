<template>
  <div>
    <CategorySelector @getCategory="getCategory" />

    <el-card style="margin-top:20px">
      <!-- 显示属性列表页 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >

        <el-table
          style="width: 100%;margin-top:20px"
          border=""
          :data="attrList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                type="success"
                v-for="item of row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template v-slot="{ row, $index }">
              <HintButton
                title="修改"
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="updateAttrList(row)"
              />
              <HintButton
                title="删除"
                type="danger"
                size="mini"
                icon="el-icon-delete"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 显示添加或修改页 -->
      <div v-show="!isShowList">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrForm.attrName"
          >添加属性值</el-button
        >
        <el-button @click="cancel">取消</el-button>

        <el-table
          style="width: 100%;margin:20px 0"
          border
          :data="attrForm.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <HintButton
                title="删除属性值"
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="keepAttrList">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,
      attrForm: {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: ""
          // }
        ],
        categoryId: 0,
        categoryLevel: 3
      }
    };
  },
  methods: {
    //和CategorySelector组件的自定义事件通信，得到属性列表的请求需要的参数
    getCategory({ categoryId, flag }) {
      if (flag === 1) {
        //清空23级及属性列表数据
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];

        this.category1Id = categoryId;
      } else if (flag === 2) {
        //清空3级及属性列表数据
        this.category3Id = "";
        this.attrList = [];

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;

        //当点击三级分类列表数据时请求属性列表
        this.getAttrList();
      }
    },

    //请求属性列表
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      try {
        const re = await this.$api.attr.getList(
          category1Id,
          category2Id,
          category3Id
        );
        if (re.code === 20000 || re.code === 200) {
          this.attrList = re.data;
        } else {
          this.$message.error("属性列表数据获取失败");
        }
      } catch (e) {
        this.$message.error("请求属性列表数据获取失败");
      }
    },

    //点击添加属性
    addAttr() {
      this.isShowList = false;

      //需要清空所有数据
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      };
    },

    //点击取消
    cancel() {
      this.isShowList = true;
    },

    //点击添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: ""
      });
    },

    //保存数据时调用
    async keepAttrList() {
      try {
        const re = await this.$api.attr.addOrUpdate(this.attrForm);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("保存属性成功");
          this.isShowList = true;

          //修改数据后重新请求数据
          this.getAttrList();
        } else {
          this.$message.error("保存属性失败");
        }
      } catch (e) {
        this.$message.error("请求保存属性失败");
      }
    },

    //点击修改
    updateAttrList(row) {
      this.isShowList = false;

      // this.attrForm = {...row} //这个是浅拷贝，基本数据可以，对象数据不行，得深拷贝
      this.attrForm = JSON.parse(JSON.stringify(row));
    }
  }
};
</script>

<style></style>
