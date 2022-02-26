<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="model" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="model" placeholder="请选择品牌">
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          v-model="model"
          placeholder="SPU名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="model"
          placeholder="还有3条未选择"
          style="margin-right:18px"
        >
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      </el-form-item>

      <el-form-item label="">
        <el-table style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="prop" label="属性名" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width"> 
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "addOrUpdateSpu"
};
</script>

<style></style>
