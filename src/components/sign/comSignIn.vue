<template>
  <el-form ref="form">
    <h3 style="font-weight: 400; margin-bottom: 30px; color: #909399">企业账号密码登录</h3>
    <el-form-item style="margin-bottom: 27px">
      <!-- <el-button type="primary" style="width: 100%; height: 40px" onclick="path.click()">
        请选择密钥文件
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>-->
      <!-- <input type="file" id="path" style="display: none" accept=".json" /> -->
      <el-input
        placeholder="请输入企业账号"
        v-model="name"
        style="width: 100%"
        prefix-icon="el-icon-user"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 27px">
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="pwd"
        style="width: 100%"
        prefix-icon="el-icon-key"
        clearable
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 5px">
      <el-button type="primary" @click="onSubmit()" style="width: 100%" :loading="btnLoad">登录</el-button>
    </el-form-item>
    <div class="footer">
      <el-link
        type="info"
        :underline="false"
        target="_blank"
        href="http://wpa.qq.com/msgrd?v=3&uin=1625753207&site=qq&menu=yes&hm"
      >遇到问题?</el-link>
      <!-- <el-link
        type="info"
        @click="test()"
        style="color: #1890ff; margin-left: 5%;"
        :underline="false"
      >管理员</el-link> -->
      <!-- <el-link
        type="info"
        @click="byHDU()"
        style="color: #1890ff; margin-left: calc(95% - 140px)"
        :underline="false"
      >数字杭电登录</el-link> -->
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      pwd: "",//密钥
      btnLoad: false,//登录按钮加载
    };
  },
  methods: {
    test() {//测试登录，使用指定的学号和token
      // localStorage.setItem("jw_student_file", JSON.stringify({"token":"52bae146-f956-42f5-b3af-b9378710954a","staffID":"18271126"}))
      // window.location.href = "https://limkim.xyz/newEdu/student"
      this.$router.push("/testSignIn");
    },
    byHDU() {
      window.location.href = "https://api.hduhelp.com/gormja_wrapper/oauth/request";
    },
    onSubmit() {
      this.btnLoad = true;
      // var input = document.querySelector("#path");
      // var reader = new FileReader();
      // reader.readAsText(input.files[0], "utf8");
      // reader.onload = () => {
      //   //判断企业密钥文件可用性
      //   var token = JSON.parse(reader.result);
      //   if (
      //     token.FileID === undefined ||
      //     token.CompanyCode === undefined ||
      //     token.Name === undefined ||
      //     token.AccountForm === undefined ||
      //     token.PrivateKey === undefined
      //   ) {
      //     this.$message.error("密钥文件错误, 请检查后重试");
      //     this.btnLoad = false;
      //   }
      //   else {
      //     localStorage.setItem("jw_ent_file", reader.result);
      //     this.$message.success("登录成功");
      //     setTimeout(() => {
      //       this.btnLoad = false;
      //       window.location.href = "../company";
      //     }, 500);
      //   }
      // };
      if (this.name.trim().length !== 0 && this.pwd.trim().length !== 0) {
        this.axios({
          method: "post",
          url: "https://api.hduhelp.com/gormja_wrapper/company/login",
          // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            "CompanyCode": this.name,
            "Passphrase": this.pwd
          },
        })
          .then((response) => {
            this.$message({
              type: "success",
              message: "登录成功",
            });
            localStorage.setItem("jw_ent_file", JSON.stringify({
              CompanyCode: this.name,
              authorization: response.headers.authorization
            }));
            window.location = "../company";
          })
          .catch((err) => {
            this.btnLoad = false;
            this.$message.error("账号或密码错误,请检查后再试");
          })
      }
      else {
        this.btnLoad = false;
        this.$message.error("请正确填写账号和密码")
      }
    },
  },
};
</script>

<style scoped>
.el-form {
  margin: 60px 90px 0 90px;
  width: calc(100% - 180px);
  height: 300px;
  padding: 5px 5px;
  background-color: rgba(255, 255, 255, 0);
}
.footer {
  user-select: none;
}
</style>v
