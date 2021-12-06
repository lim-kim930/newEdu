<template>
  <el-form
    ref="ruleForm"
    label-width="100px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    class="form"
    :style="{'max-height': this.wh - 105 + 'px'}"
  >
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1" style="font-size: 18px">学籍确认</el-menu-item>
      <el-menu-item index="2" style="font-size: 18px" :disabled="!confirmed">学业成绩确认</el-menu-item>
      <el-menu-item index="3" style="font-size: 18px" :disabled="!confirmed">综合素质确认</el-menu-item>
      <el-menu-item index="4" style="font-size: 18px" :disabled="!confirmed">个性化确认</el-menu-item>
      <el-menu-item index="5" style="font-size: 18px" :disabled="!confirmed">排名确认</el-menu-item>
      <el-menu-item index="6" style="font-size: 18px" :disabled="!confirmed">毕业确认</el-menu-item>
    </el-menu>
    <router-view
      @func="getFile"
      @func2="getConfirmed"
      :globalFile="file"
      :xjConfirmed="xjConfirmed"
      :wh="wh"
    ></router-view>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",//上边导航默认选中值
      loading: false,//form加载
      confirmed: "",//学籍确认状态
    };
  },
  props: ["file", "xjConfirmed", "wh"],//拿到student页面传来的数据
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
          this.$router.push("/infoConfirm/gxConfirm");
          break
        case "5":
          this.$router.push("/infoConfirm/gpaConfirm");
          break;
        case "6":
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
          case "/infoConfirm/gxConfirm":
          this.activeIndex = "4";
          break
          case "/infoConfirm/gpaConfirm":
          this.activeIndex = "5";
          break
        case "/infoConfirm/byConfirm":
          this.activeIndex = "6";
          break
      }
    },
  },
  watch: {//监听路由变化
    $route() {
      this.redirect()
    },
    xjConfirmed: {
        handler(newValue, oldValue) {
            this.confirmed = newValue;
        }
    }
  },
  mounted() {
    this.confirmed = this.xjConfirmed;
    this.redirect();
  },
};
</script>

<style scoped>
.form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  min-width: 1250px;
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