<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-top:17px"
      @click="addTrademark"
      >添加</el-button
    >

    <!-- 表格：展示数据 -->
    <el-table border style="width: 100%;margin:17px 0" :data="pageList">
      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>

      <el-table-column
        prop="tmName"
        :label="tmFrom.id ? '添加品牌' : '品牌名称'"
        align="center"
        width="width"
      >
      </el-table-column>

      <el-table-column
        prop="prop"
        label="品牌LOGO"
        align="center"
        width="width"
      >
        <template v-slot="{ row, $index }">
          <img
            :src="row.logoUrl"
            alt=""
            align="center"
            style="width:80px;height:60px"
          />
        </template>
      </el-table-column>

      <el-table-column prop="prop" label="操作" align="center" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="editTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- 
      属性：
        :current-page="pageNum" //传递的当前页码
        :page-size="pageSize" //传递的每页数量
        :total="totalCount" //传递的总数
        :pager-count="5" //传递的连续页数，如果写的是5，连续数是3 5包含了首页和尾页
        @current-change="handleCurrentChange" //切换页面的事件

        :page-sizes="[10, 20, 50]" //在页面可以改变当前页的数量
        @size-change="handleSizeChange" //改变当前页数量的事件

        layout="prev, pager, next, jumper,->,sizes,total" //可以改变分页器前后顺序（布局顺序）
     -->
    <el-pagination
      background
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="5"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next,jumper,->,sizes,total"
      style="text-align:center"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmFrom" :rules="rules" ref="tmFrom">
        <el-form-item label="活动名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>

        <!-- 上传 -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    //表单验证自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("长度在 2 到 10 个字符"));
      } else {
        callback();
      }
    };

    return {
      page: 1,
      limit: 3,
      pageList: [],
      total: 0,
      dialogFormVisible: false,
      tmFrom: {
        logoUrl: "",
        tmName: ""
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //第二个规则使用自定义写法
          { validator: validateTmName, trigger: "change" }
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change"
          // }
        ],
        logoUrl: [{ required: true, message: "请选择上传图片" }]
      }
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 这个函数负责两个作用：1、初始化请求 2、切换页码的回调
    async getPageList(page = 1) {
      this.page = page;
      try {
        const re = await this.$api.trademark.getPageList(this.page, this.limit);
        if (re.code === 20000 || re.code === 200) {
          this.pageList = re.data.records;
          this.total = re.data.total;
        } else {
          this.$message.error("获取品牌列表失败");
        }
      } catch (e) {
        this.$message.eroor("请求获取品牌列表失败");
      }
    },

    //点击页码时触发事件
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getPageList();
    // },

    //点击当前页数量时触发事件
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },

    //点击添加按钮
    addTrademark() {
      this.dialogFormVisible = true;

      //每次点击添加时都要清空数据
      this.tmFrom.logoUrl = "";
      this.tmFrom.tmName = "";
    },

    //点击修改按钮
    editTrademark(row) {
      this.dialogFormVisible = true;
      this.tmFrom = { ...row };
    },

    //添加/修改后点击确认
    addOrUpdate() {
      //表单整体校验
      this.$refs.tmFrom.validate(async valid => {
        if (valid) {
          //验证成功后发请求
          try {
            const re = await this.$api.trademark.addOrUpdate(this.tmFrom);
            if (re.code === 20000 || re.code === 200) {
              this.$message.success(
                this.tmFrom.id ? "修改品牌成功" : "添加品牌成功"
              );

              //成功后需要重新发送请求，page如果是添加的话就是1，page如果是修改的话就是当前页面
              this.getPageList(this.tmFrom.id ? this.page : 1);

              // 关闭对话框
              this.dialogFormVisible = false;
            } else {
              this.$message.error(
                this.tmFrom.id ? "修改品牌失败" : "添加品牌失败"
              );
            }
          } catch (e) {
            this.$message.error(
              this.tmFrom.id ? "请求修改品牌失败" : "请求添加品牌失败"
            );
          }
        } else {
          this.$message.error("请核对格式！");
          return false;
        }
      });
    },

    //上传图片成功的回调函数
    handleAvatarSuccess(res, file) {
      //获取的时图片在本地的地址，我们不需要
      // this.imageUrl = URL.createObjectURL(file.raw);

      //我们需要的是网络地址
      this.tmFrom.logoUrl = res.data;
    },

    //对图片做限制的回调函数
    beforeAvatarUpload(file) {
      const isJPGOrPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt2M;
    },

    //点击删除品牌时调用
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const re = await this.$api.trademark.delete(row.id);
            if (re.code === 20000 || re.code === 200) {
              this.$message.success("删除品牌成功");

              //重新请求数据,如果最后一页只有一条数据点击删除时页面要跳到上一张
              this.getPageList(
                this.pageList.length > 1 ? this.page : this.page - 1
              );
            } else {
              this.$message.error("删除品牌失败");
            }
          } catch (e) {
            this.$message.error("请求删除品牌失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
