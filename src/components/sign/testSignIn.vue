<template>
  <el-form ref="form">
    <h3 style="font-weight: 400; margin-bottom: 30px; color:#909399">测试登录</h3>
    <el-form-item style="margin-bottom: 27px">
      <el-input
        placeholder="请输入学号"
        v-model="uName"
        style="width: 300px;"
        prefix-icon="el-icon-user-solid"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 27px">
      <el-input
        placeholder="请输入对应token"
        v-model="token"
        style="width: 300px;"
        prefix-icon="el-icon-key"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 5px;">
      <el-button
        type="primary"
        @click="onSubmit()"
        style="width: 300px;"
        :loading="btnLoad"
      >登录</el-button>
    </el-form-item>
    <div class="footer">
      <el-link
        type="info"
        :underline="false"
        target="_blank"
        href="http://wpa.qq.com/msgrd?v=3&uin=1625753207&site=qq&menu=yes&hm"
      >遇到问题?</el-link>
      <el-link
        type="info"
        @click="byCode()"
        style="color: #1890ff; margin-left: 70px;"
        :underline="false"
      >密钥登录</el-link>
      <el-link
        type="info"
        @click="byHDU()"
        style="color: #1890ff; margin-left: 20px;"
        :underline="false"
      >数字杭电登录</el-link>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      uName: "",
      token: "",
      btnLoad: false
    };
  },
  methods: {
    byCode() {
      this.$router.push("/signIn");
    },
    byHDU() {
      window.location.href = "https://api.hduhelp.com/gormja_wrapper/oauth/request";
    },
    onSubmit() {
      this.btnLoad = true
      if (this.uName.length === 8 && this.uName.length !== 0)
        localStorage.setItem("jw_student_file", JSON.stringify({ "token": this.token, "staffID": this.uName }))
      else {
        this.$message.error("请正确输入学号和token");
        return
      }
      window.location.href = "https://limkim.xyz/newEdu/student"
    },
  },
};
</script>

<style scoped>
.el-form {
  margin: 70px 130px 0 100px;
  width: 340px;
  height: 300px;
  padding: 5px 5px;
  background-color: rgba(255, 255, 255, 0);
}
.footer {
  user-select: none;
}
</style>
