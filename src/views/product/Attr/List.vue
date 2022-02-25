<template>
  <div>
    <CategorySelector @getCategory="getCategory" :isShowList="isShowList" />

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
              <el-popconfirm
                :title="`您确定要删除${row.attrName}属性吗?`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                />
              </el-popconfirm>
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

          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <!-- 编辑模式 -->
              <el-input
                v-if="row.isEdit"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                :ref="$index"
                size="mini"
              ></el-input>

              <!-- 查看模式 -->
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display:block;width:100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`您确定删除${row.valueName}吗`"
                @onConfirm="deleteAttrValue($index)"
              >
                <HintButton
                  slot="reference"
                  title="删除属性值"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          @click="keepAttrList"
          :disabled="!attrForm.attrValueList.length"
          >保存</el-button
        >
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
        valueName: "",
        //为了实现修改属性值时，属性值是一个span当点击时需要是一个input框，所以需要添加一个标记
        //而这里为数组添加值时用到的是push，所以添加的所有属性都会有响应式
        isEdit: true
      });

      //添加自动获取焦点的逻辑
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    //保存数据时调用
    async keepAttrList() {
      //1：收集参数

      //2：整理参数
      //-1、属性值名称如果为空串，从属性值列表当中去除
      //-2、属性值当中去除isEdit属性
      this.attrForm.attrValueList = this.attrForm.attrValueList.filter(item => {
        delete item.isEdit;
        return item.valueName.trim();
      });
      //-3、属性值列表如果没有属性值，不发请求
      if (!this.attrForm.attrValueList.length) {
        this.$message.error("属性的属性值不能为空!");
        return;
      }
      //3：发请求
      try {
        const re = await this.$api.attr.addOrUpdate(this.attrForm);
        if (re.code === 20000 || re.code === 200) {
          //4：成功
          this.$message.success("保存属性成功");
          this.isShowList = true;

          //修改数据后重新请求数据
          this.getAttrList();
        } else {
          this.$message.error("保存属性失败");
        }
      } catch (e) {
        //5：失败
        this.$message.error("请求保存属性失败");
      }
    },

    //点击修改
    updateAttrList(row) {
      this.isShowList = false;

      // this.attrForm = {...row} //这个是浅拷贝，基本数据可以，对象数据不行，得深拷贝
      this.attrForm = JSON.parse(JSON.stringify(row));

      //为了实现修改属性值时，属性值是一个span当点击时需要是一个input框，所以需要添加一个标记
      //而这里是给对象添加一个属性，没有响应式数据，因为早已过了vue添加代理和劫持的阶段，所以我们要使用到this.$set()或Vue.set()
      this.attrForm.attrValueList.forEach(item => {
        this.$set(item, "isEdit", false);
      });
    },

    //点击添加/修改里属性值的span时
    toEdit(row, $index) {
      row.isEdit = true;
      // 让当前点击的这个span切换为input的时候自动获取焦点
      this.$nextTick(() => {
        //等待页面最近一次更新完成之后，去执行回调函数
        this.$refs[$index].focus();
      });
    },

    //添加/修改里属性值的input失去焦点或按下enter键时
    toLook(row) {
      // 1、数据是不是空的
      if (!row.valueName.trim()) {
        return (row.valueName = "");
      }

      // 2、除了自己以外，输入的数据是不是和其它的属性值名称重复
      const isRepeat = this.attrForm.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });

      if (isRepeat) {
        this.$message.error("输入的属性值不能重名!");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },

    //点击删除某一项属性值时
    deleteAttrValue($index) {
      this.attrForm.attrValueList.splice($index, 1);
    },

    //点击删除属性时
    async deleteAttr(row) {
      try {
        const re = await this.$api.attr.deleteList(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success("删除属性成功");
          //修改数据后重新请求数据
          this.getAttrList();
        } else {
          this.$message.error("删除属性失败");
        }
      } catch (e) {
        this.$message.error("请求删除属性失败");
      }
    }
  }
};
</script>

<style></style>
