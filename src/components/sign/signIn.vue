<template>
  <el-form ref="form">
    <h3 style="font-weight: 400; margin-bottom: 30px; color: #909399">密钥文件登录</h3>
    <el-form-item style="margin-bottom: 27px">
      <el-button type="primary" style="width: 100%; height: 40px" onclick="path.click()">
        请选择密钥文件
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <input type="file" id="path" style="display: none" accept=".json" />
    </el-form-item>
    <el-form-item style="margin-bottom: 27px">
      <el-input
        type="password"
        placeholder="请输入密钥"
        v-model="code"
        style="width: 100%"
        prefix-icon="el-icon-key"
        clearable
        show-password
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 5px">
      <el-button
        type="primary"
        @click="onSubmit()"
        style="width: 100%"
        :loading="btnLoad"
        :disabled="disabled"
      >登录</el-button>
    </el-form-item>
    <div class="footer">
      <el-link
        type="info"
        :underline="false"
        target="_blank"
        href="http://wpa.qq.com/msgrd?v=3&uin=1625753207&site=qq&menu=yes&hm"
      >遇到问题?</el-link>
      <el-link type="info" @click="test()" style="color: #1890ff; margin-left: 5%;" :underline="false">测试登录</el-link>
      <!-- 153 -->
      <el-link
        type="info"
        @click="byHDU()"
        style="color: #1890ff; margin-left: calc(95% - 216px)"
        :underline="false"
      >数字杭电登录</el-link>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      code: "",
      btnLoad: false,
      disabled: false,
    };
  },
  methods: {
    test() {
      localStorage.setItem("jw_student_file", JSON.stringify({"token":"1679bd9a-43d5-43cc-9dc9-81374325f937","staffID":"19270808"}))
      window.location.href = "https://limkim.xyz/newEdu/student"
    },
    byHDU() {
      window.location.href = "https://api.hduhelp.com/gormja_wrapper/oauth/request";
    },
    onSubmit() {
      this.btnLoad = true;
      var input = document.querySelector("#path");
      var reader = new FileReader();
      reader.readAsText(input.files[0], "utf8");
      reader.onload = () => {
        var token = JSON.parse(reader.result);
        if (
          token.FileID === undefined ||
          token.CompanyCode === undefined ||
          token.Name === undefined ||
          token.AccountForm === undefined ||
          token.PrivateKey === undefined
        ) {
          this.$message.error("密钥文件错误, 请检查后重试");
          this.btnLoad = false;
        }
        else {
          localStorage.setItem("jw_ent_file", reader.result);
          this.$message.success("登录成功");
          setTimeout(() => {
            this.btnLoad = false;
            window.location.href = "../company";
          }, 500);
        }
      };
    },
  },
};
</script>

<style scoped>
.el-form {
  margin: 70px 90px 0 90px;
  width: calc(100% - 180px);
  height: 300px;
  padding: 5px 5px;
  background-color: rgba(255, 255, 255, 0);
}
.footer {
  user-select: none;
}
</style>v
