<template>
  <div>
    <h2>我是爷爷</h2>
    <parent />
  </div>
</template>

<script>
import parent from "./parent";
export default {
  name: "grandpa",
  components: {
    parent
  }
};
</script>

<style scoped>
h2 {
  color: red;
}
.abc {
  color: green;
}
</style>
