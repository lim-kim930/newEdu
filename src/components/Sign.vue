<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <span class="tittle">教务—学业分享系统 | 高校学业核验系统</span>
    </el-header>
    <!-- 内容 -->
    <el-main :style="{ 'min-height': wh - 80 + 'px' }">
      <div class="ad_content">
        <span style="font-size: 30px">基于区块链</span>
        <el-divider></el-divider>
        <span style="font-size: 20px">构建安全、可信、高效的新型教务—学业分享系统</span>
      </div>
      <div class="log_content">
        <div class="method_switch">
          <div id="signUp" :style="codeIcon" @click="signRouteSwitch(0)">
            <i class="el-icon-link"></i>
            <span>企业登录</span>
          </div>
          <div id="signIn" :style="psIcon" @click="signRouteSwitch(1)">
            <i class="el-icon-lock"></i>
            <span>普通用户登录</span>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      flag: 1,
      psIcon: {
        color: "#5eacf0",
        borderBottomColor: "#5eacf0",
        borderBottomWidth: "2px",
      },
      codeIcon: {
        color: "",
        borderBottomColor: "#ccc",
        borderBottomWidth: "1px",
      },
      wh: "",
    };
  },
  methods: {
    signRouteSwitch(flag) {
      if (this.flag == 1 && flag == 0)
        this.signRouteChange(0);
      else if (this.flag == 0 && flag == 1)
        this.signRouteChange(1);
    },
    signRouteChange(flag) {
      this.codeIcon.color = this.codeIcon.borderBottomColor = flag === 0 ? "#5eacf0" : "#909399";
      this.psIcon.color = this.psIcon.borderBottomColor = flag === 0 ? "#909399" : "#5eacf0";
      this.codeIcon.borderBottomWidth = flag === 0 ? "2px" : "1px";
      this.psIcon.borderBottomWidth = flag === 0 ? "1px" : "2px";
      this.$router.push(flag === 0 ? "/comSignIn" : "/signIn");
      this.flag = flag;
    },
    redirect() {
      switch (this.$route.path) {
        case "/signIn":
          // case "/testSignIn":
          this.signRouteSwitch(1);
          break;
        case "/comSignIn":
          this.signRouteSwitch(0);
          break;
        default:
          this.$router.push("/signIn");
          this.signRouteSwitch(1);
      }
    },
    windowHeight() {
      const de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    }
  },
  watch: {
    $route() {
      this.redirect();
    }
  },
  mounted() {
    this.wh = this.windowHeight() < 600 ? 600 : this.windowHeight();
    window.onresize = () => {
      this.wh = this.windowHeight() < 600 ? 600 : this.windowHeight();
    };
    this.redirect();
    if (localStorage.getItem("jw_student_file") !== null && localStorage.getItem("jw_ent_file") === null)
      window.location.href = "https://edu.limkim.cn/student";
    else if (localStorage.getItem("jw_student_file") === null && localStorage.getItem("jw_ent_file") !== null)
      window.location.href = "https://edu.limkim.cn/company";
  }
};
</script>

<style scoped>
.el-header {
  background: url(../img/logo2.png) no-repeat;
  background-size: 90px;
  background-position: 10px 0;
  background-color: #fff;
  box-shadow: 0 2px 4px 1px var(--cb-color-shadow, rgba(0, 0, 0, 0.13));
  z-index: 99;
  height: 80px !important;
}
.el-header .el-menu-item {
  padding: 0 30px !important;
}
.el-main {
  padding: 20px;
  min-width: 1440px;
  background-color: #f5f5f6;
}
.tittle {
  height: 80px;
  margin-left: 100px;
  padding-left: 10px;
  font-size: 24px;
  line-height: 80px;
  /* border-left: 1px solid ; */
}
.ad_content {
  float: left;
  width: 30%;
  max-width: 560px;
  height: 460px;
  margin: 150px 0 0 17%;
  background: url(../img/login_icon.png) no-repeat;
  background-size: 75%;
  background-position: 50px 100px;
}
.log_content {
  float: left;
  position: relative;
  margin: 110px 0 0 80px;
  width: 30%;
  max-width: 500px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 15px rgb(0 0 0 / 10%);
  border-radius: 10px;
}
.method_switch {
  height: 52px;
}
.method_switch div {
  float: left;
  margin: 0 !important;
  width: 50%;
  height: 52px;
  line-height: 52px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
#signUp {
  border-right: 1px solid #ccc;
}
.else {
  position: absolute;
  height: 44px;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ccc;
  color: #5eacf0;
  cursor: pointer;
  text-align: center;
  line-height: 44px;
}
.el-divider--horizontal {
  margin: 10px 0 !important;
}
</style>
<style>
* {
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  list-style: none;
  outline: none;
  box-sizing: border-box;
}
body {
  margin: 0 !important;
}
</style>