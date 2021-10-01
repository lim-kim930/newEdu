<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>信息查询确认</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      ref="ruleForm"
      label-width="100px"
      v-loading="loading"
      element-loading-text="拼命加载中"
      class="form"
    >
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1" style="font-size: 18px">学籍确认</el-menu-item>
        <el-menu-item index="2" style="font-size: 18px" :disabled="!confirmed">学业确认</el-menu-item>
        <el-menu-item index="3" style="font-size: 18px" :disabled="!confirmed">综合素质确认</el-menu-item>
        <el-menu-item index="4" style="font-size: 18px" :disabled="!confirmed">毕业确认</el-menu-item>
      </el-menu>
      <router-view
        @func="getFile"
        @func2="getConfirmed"
        :sendDataToChid="sendDataToChid"
        :sendDataToChid2="sendDataToChid2"
      ></router-view>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      loading: false,
      diaLoading: false,
      confirmed: ""
    };
  },
  props: ["sendDataToChid", "sendDataToChid2", "wh"],
  methods: {
    getFile(file) {
      this.$emit("func", file)
    },
    getConfirmed(confirmed) {
      this.confirmed = confirmed
      this.$emit("func2", confirmed)
    },
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.$router.push("/infoConfirm/xjConfirm");
          break
        case "2":
          this.$router.push("/infoConfirm/xyConfirm");
          break
        case "3":
          this.$router.push("/infoConfirm/hjConfirm");
          break
        case "4":
          this.$router.push("/infoConfirm/byConfirm");
          break
      }
    },
    redirect() {
      switch (this.$route.path) {
        case "/infoConfirm/xjConfirm":
          this.activeIndex = "1";
          break
        case "/infoConfirm/xyConfirm":
          this.activeIndex = "2";
          break
        case "/infoConfirm/hjConfirm":
          this.activeIndex = "3";
          break
        case "/infoConfirm/byConfirm":
          this.activeIndex = "4";
          break
      }
    },
  },
  watch: {   //监听路由变化
    $route() {
      this.redirect()
    },
  },
  mounted() {
    document.querySelector(".el-form").style.maxHeight = this.wh - 190 + "px";
    this.confirmed = this.sendDataToChid2;
    this.redirect();
  },
};
</script>

<style scoped>
.form {
  overflow: auto;
  margin: 30px 10px;
  width: calc(100% - 20px);
  padding: 20px 80px 40px 80px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.line {
  text-align: center;
  margin-top: 50px;
}
.el-checkbox {
  width: 80px;
  margin-right: 50px;
}
</style>