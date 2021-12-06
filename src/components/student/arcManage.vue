<template>
  <div class="pwd">
    <h4>重置学籍确认状态</h4>
    <el-divider></el-divider>
    <el-form
      status-icon
      ref="ruleForm"
      class="demo-ruleForm"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-form-item>
        <el-button type="primary" @click="submitForm()">确认修改</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {
    submitForm() {
      this.$confirm("确定要重置您的学籍确认状态吗?您将需要重新确认所有信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "put",
          url: "https://api.hduhelp.com/gormja_wrapper/dataFile/resetNewable",
          headers: { Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            staffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
          }
        })
          .then((response) => {
            this.axios({
              method: "post",
              url: "https://api.limkim.xyz/changeXj",
              data: { staffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID, confirmed: false }
            })
              .then((response) => {
                this.$message.success("重置成功");
                location.reload()
              })
              .catch(error => {
                if (error.response.data.status === "staffID Required")
                  this.$message.error("您还未登录或登陆出错,请重新登录后重试")
                else if (error.response.data.status === "Error")
                  this.$message.error("服务器出错")
                else
                  this.$message.error("出错啦,请稍后重试")
                this.loading = false
              });
          })
          .catch(error => {
            this.$message.error("重置出错啦,请稍后重试")
            this.loading = false
          });
      })
        .catch(() => {

        })
    }
  }
};
</script>

<style scoped>
.pwd {
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
