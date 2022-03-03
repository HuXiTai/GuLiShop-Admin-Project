<template>
  <div>
    <el-button type="primary" :disabled="$textButton('btn.text222.add')"
      >添加</el-button
    >
    <el-button type="warning" :disabled="$textButton('btn.text222.update')"
      >修改</el-button
    >
    <el-button type="danger" :disabled="$textButton('btn.text222.delete')"
      >删除</el-button
    >
  </div>
</template>

<script>
export default {
  name: "text222"
};
</script>

<style></style>
