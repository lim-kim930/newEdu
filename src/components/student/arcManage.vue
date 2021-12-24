<template>
  <div class="pwd">
    <h4>提交档案重置申请</h4>
    <el-divider></el-divider>
    <el-form
      status-icon
      ref="ruleForm"
      class="demo-ruleForm"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <!-- <el-alert type="info" :closable="false" style="margin-bottom: 10px">
        <h5>提示:</h5>
        <h5>如果档案丢失,无法使用系统,可以在这里向管理员提交档案状态重置的申请</h5>
        <h5>重置后,之前确认的信息将需要重新确认,所以请在文件确实丢失的情况下提交</h5>
      </el-alert> -->
      <el-alert type="info" :closable="false" style="margin-bottom: 10px">
        <h5>提示:</h5>
        <h5>如果档案丢失,无法使用系统,可以在QQ答疑群向管理员发出档案状态重置的申请</h5>
        <h5>重置后,之前确认的信息将需要重新确认,所以请在文件确实丢失的情况下提交</h5>
      </el-alert>
      <el-link
        type="primary"
        target="_blank"
        href="https://qm.qq.com/cgi-bin/qm/qr?k=Ci04wLsNSUcKO6UpX61kBoypUmHYzkWJ&jump_from=webapi"
      >加入QQ答疑群</el-link>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm()">确认提交</el-button>
      </el-form-item> -->
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
      this.$confirm("成功重置后您将需要重新确认所有信息,点击确定以继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "put",
          url: "/dataFile/resetNewable",
          headers: { Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            staffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
          }
        })
          .then(() => {
            this.axios({
              method: "post",
              url: "https://api.limkim.xyz/changeXj",
              data: { staffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID, confirmed: false }
            })
              .then(() => {
                this.$message.success("重置成功");
                location.reload();
              })
              .catch(error => {
                if (error.response.data.status === "staffID Required")
                  this.$message.error("您还未登录或登陆出错,请重新登录后重试");
                else if (error.response.data.status === "Error")
                  this.$message.error("服务器出错");
                else
                  this.$message.error("出错啦,请稍后重试");
                this.loading = false;
              });
          })
          .catch(() => {
            this.$message.error("提交申请出错啦,请稍后重试");
            this.loading = false;
          });
      })
        .catch(() => {

        });
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
.el-alert h5 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
