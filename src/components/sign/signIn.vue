<template>
  <el-form ref="form">
    <h3 style="font-weight: 400; margin-bottom: 30px;; margin-top: 10px; color: #909399">用户登录</h3>
    <el-form-item style="margin-bottom: 37px">
      <el-input
        placeholder="请输入用户名"
        v-model="name"
        style="width: 100%"
        prefix-icon="el-icon-user"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 37px">
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
        style="margin-left: calc(100% - 63px)"
        href="https://qm.qq.com/cgi-bin/qm/qr?k=Ci04wLsNSUcKO6UpX61kBoypUmHYzkWJ&jump_from=webapi"
      >遇到问题?</el-link>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      pwd: "",
      btnLoad: false// 登录按钮加载
    };
  },
  methods: {
    onSubmit() {
      localStorage.setItem("arrange_user", JSON.stringify({
        uname: this.name
      }));
      window.location.href = "../";
    }
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
