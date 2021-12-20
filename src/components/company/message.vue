<template>
  <el-form
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
      @select="msgRouteSwitch"
    >
      <el-menu-item index="1" style="font-size: 18px; line-height: 60px">
        收信箱
        <el-badge :value="received" :max="99" class="item" v-show="received !== 0"></el-badge>
      </el-menu-item>
      <el-menu-item index="2" style="font-size: 18px">
        已发送
        <el-badge :value="sent" :max="99" class="item" v-show="sent !== 0"></el-badge>
      </el-menu-item>
    </el-menu>
    <router-view @func="getReceived" :received="received"></router-view>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      loading: false
    };
  },
  props: ["wh", "received", "sent"],
  methods: {
    getReceived(received) {
      this.$emit("func", received);
    },
    msgRouteSwitch(key) {
      this.$router.push(key === "1" ? "/comMessage/received" : "/comMessage/sent");
    },
    redirect() {
      switch (this.$route.path) {
        case "/comMessage/received":
          this.activeIndex = "1";
          break;
        case "/comMessage/sent":
          this.activeIndex = "2";
          break;
      }
    },
  },
  watch: {
    $route() {
      this.redirect();
    }
  },
  mounted() {
    this.redirect();
  }
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
  margin-top: -7px;
}
</style>