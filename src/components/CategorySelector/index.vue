<template>
  <el-card style="margin-top:20px">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          placeholder="--请选择--"
          v-model="cForm.getCategory1"
          @change="clickCategory1"
        >
          <el-option
            v-for="item of category1List"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.getCategory2"
          placeholder="--请选择--"
          @change="clickCategory2"
        >
          <el-option
            v-for="item of category2List"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          placeholder="--请选择--"
          v-model="cForm.getCategory3"
          @change="clickCategory3"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item of category3List"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        getCategory1: "",
        getCategory2: "",
        getCategory3: ""
      }
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    //一级分类列表获取
    async getCategory1List() {
      try {
        const re = await this.$api.category.getCategory1();
        if (re.code === 20000 || re.code === 200) {
          this.category1List = re.data;
        } else {
          this.$message.error("一级分类列表获取失败");
        }
      } catch (error) {
        this.$message.error("请求一级分类列表获取失败");
      }
    },

    //点击一级分类列表获取二级分类列表数据
    async clickCategory1() {
      //当每次点击一级分类列表数据时都要把二级和三级的categoryList和getCategory清空
      this.cForm.getCategory2 = "";
      this.cForm.getCategory3 = "";
      this.category2List = [];
      this.category3List = [];

      // 选中1级触发自定义事件，给父组件通信，让父组件发生改变
      // 因为后面父组件发请求需要用到我们选中的三个id，所以在这我们要把对应选中的分类id传给父组件
      this.$emit("getCategory", {
        categoryId: this.cForm.getCategory1,
        flag: 1
      });

      try {
        const re = await this.$api.category.getCategory2(
          this.cForm.getCategory1
        );
        if (re.code === 20000 || re.code === 200) {
          this.category2List = re.data;
        } else {
          this.$message.error("二级分类列表获取失败");
        }
      } catch (e) {
        this.$message.error("请求二级分类列表获取失败");
      }
    },

    //点击二级分类列表获取三级分类列表数据
    async clickCategory2() {
      //当每次点击一级分类列表数据时都要把三级的categoryList和getCategory清空
      this.cForm.getCategory3 = "";
      this.category3List = [];

      // 选中1级触发自定义事件，给父组件通信，让父组件发生改变
      // 因为后面父组件发请求需要用到我们选中的三个id，所以在这我们要把对应选中的分类id传给父组件
      this.$emit("getCategory", {
        categoryId: this.cForm.getCategory2,
        flag: 2
      });

      try {
        const re = await this.$api.category.getCategory3(
          this.cForm.getCategory2
        );
        if (re.code === 20000 || re.code === 200) {
          this.category3List = re.data;
        } else {
          this.$message.error("三级分类列表获取失败");
        }
      } catch (e) {
        this.$message.error("请求三级分类列表获取失败");
      }
    },

    //点击三级分类列表数据后
    clickCategory3() {
      // 选中1级触发自定义事件，给父组件通信，让父组件发生改变
      // 因为后面父组件发请求需要用到我们选中的三个id，所以在这我们要把对应选中的分类id传给父组件
      this.$emit("getCategory", {
        categoryId: this.cForm.getCategory3,
        flag: 3
      });
    }
  }
};
</script>

<style></style>
