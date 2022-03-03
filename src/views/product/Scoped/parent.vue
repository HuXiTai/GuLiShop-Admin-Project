<template>
  <div class="abc">
    <h2>我是父亲</h2>
    <child />
  </div>
</template>

<script>
import child from "./child";
export default {
  name: "parent",
  components: {
    child
  }
};
</script>

<style></style>
