<template>
  <div class="pwd">
    <!-- <h4>重置学籍确认状态</h4> -->
    <el-divider></el-divider>
    <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!-- <el-form-item label="原密码" prop="oldPass" required>
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass" required>
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" required>
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password></el-input>
      </el-form-item>-->
      <!-- <el-form-item> -->
      <!-- <el-button type="primary" @click="submitForm()">确认修改</el-button> -->
      <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      <!-- </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: ""
      },
    };
  },
  methods: {
    submitForm() {
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
  },
};
</script>

<style scoped>
.pwd,
.chain {
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
.pwd .el-input {
  width: 250px;
}
</style>
