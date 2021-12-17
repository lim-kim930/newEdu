<template>
  <el-form
    status-icon
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <h4>重置学籍确认状态</h4>
    <el-divider></el-divider>
    <el-form-item label="要重置的学号" style="width: 250px;display: inline-block">
      <el-input v-model="staffID" style="width: 150px;"></el-input>
    </el-form-item>
    <el-form-item style="display: inline-block">
      <el-button type="primary" @click="submitForm()">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      staffID: ""
    };
  },
  methods: {
    submitForm() {
      this.$confirm("确定要重置该学生的学籍确认状态吗？学生将需要重新确认所有信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "put",
          url: "https://api.hduhelp.com/gormja_wrapper/dataFile/resetNewable",
          headers: { Authorization: "token " + JSON.parse(localStorage.getItem("jw_manager_file")).token },
          data: { staffID: this.staffID }
        }).then(() => {
          this.$message.success("重置成功");
          this.loading = false
          this.staffID = ""
        }).catch(() => {
          this.$message.error("重置出错啦,请稍后重试")
          this.loading = false
        });
      }).catch(() => {
        this.$message.info("重置已取消")
      })
    }
  }
};
</script>

<style scoped>
.el-form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 750px;
}
</style>