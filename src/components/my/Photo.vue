<template>
  <el-card>
    <el-row v-if="name">
      <el-button type="success">我的相册</el-button>
      <el-button type="success">上传图片</el-button>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      name: localStorage.getItem("name"),
    };
  },
};
</script>

<style lang="less" scoped>
.el-card {
  position: relative;
}
</style>