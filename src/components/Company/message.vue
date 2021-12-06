<template>
  <el-form
    ref="ruleForm"
    label-width="100px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    class="form">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1" style="font-size: 18px; line-height: 60px">
            收信箱 <el-badge :value="received" :max="99" class="item" v-show="received !== 0"></el-badge>
          </el-menu-item>
          <el-menu-item index="2" style="font-size: 18px">
            已发送 <el-badge :value="sent" :max="99" class="item" v-show="sent !== 0"></el-badge>
          </el-menu-item>
      </el-menu>
      <router-view @func="getReceived"></router-view>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      index: "收信箱",
      loading: false
    }
  },
  props: ["received", "sent"],
  methods: {
    getReceived(received) {
      this.$emit("func", received)
    },
    handleSelect(key, keyPath) {
      switch (key) {
        case "1":
          this.$router.push("/comMessage/received");
          this.index = "收信箱"
          break
        case "2":
          this.$router.push("/comMessage/sent");
          this.index = "已发送"
          break
      }
    },
    redirect() {
      switch (this.$route.path) {
        case "/comMessage/received":
          this.activeIndex = "1";
          break
        case "/comMessage/sent":
          this.activeIndex = "2";
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
    this.redirect();
  },
};
</script>

<style scoped>
.form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 20px 80px 30px 80px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.item {
  margin-top: -5px;
}
</style>