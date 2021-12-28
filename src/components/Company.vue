<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>高校学业核验系统</span>
      </div>
      <div class="user">
        <el-badge
          :value="received + sent"
          :hidden="received + sent === 0"
          class="item"
          style="width: 30px; height: 25px; margin-right: 20px; line-height: 25px !important;"
        >
          <i
            title="消息中心"
            class="el-icon-message"
            style="font-size: 20px; color: #fff; cursor: pointer;"
            @click="msgRouteSwitch('received')"
          ></i>
        </el-badge>
        <el-avatar :size="25" :src="circleUrl"></el-avatar>
        <span id="uname">{{uName === ""?"":uName + ' |'}}</span>
        <el-link
          :underline="false"
          @click="logOut()"
          style="font-size: 15px; color: #fff; margin-top: -4px"
        >
          {{uName === ""?"登录":"退出登录"}}
          <i class="el-icon-caret-right"></i>
        </el-link>
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px" :style="{ 'height': wh - 100 + 'px' }">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              :default-active="activeIndex"
              @select="indexRouteSwitch"
              background-color="#fff"
              text-color="#3a4b56"
              active-text-color="#409eff"
              class="aside"
            >
              <el-menu-item index="1">
                <i class="el-icon-s-grid"></i>
                <span slot="title" style="font-size: 20px">学生信息核验</span>
              </el-menu-item>
              <el-menu-item index="6">
                <i class="el-icon-s-flag"></i>
                <span slot="title" style="font-size: 20px">信息广场</span>
              </el-menu-item>
              <el-menu-item index="5">
                <i class="el-icon-s-management"></i>
                <span slot="title" style="font-size: 20px">招聘信息管理</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-s-check"></i>
                <span slot="title" style="font-size: 20px">学生实习认证</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-message-solid"></i>
                <span slot="title" style="font-size: 20px">消息中心</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-s-custom"></i>
                <span slot="title" style="font-size: 20px">账号设置</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 内容 -->
      <el-main :style="{'height': this.wh - 80 + 'px'}">
        <router-view
          @func="getReceived"
          @func2="getFrequency"
          :received="received"
          :frequency="reqFrequency"
          :sent="sent"
          :wh="wh"
        ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      circleUrl: "https://edu.limkim.cn/static/user.png",// 头像地址
      activeIndex: "",// 侧边栏index
      received: 0,// 收信箱接收数
      reqFrequency: 300,// 站内信请求频率,单位秒
      msgTimer: "",
      sent: 0,// 收信箱发送数
      uName: "",// 用户名
      wh: ""//屏幕高度
    };
  },
  methods: {
    getReceived(received) {
      this.received = received;
    },
    getFrequency(frequency) {
      this.reqFrequency = frequency;
      clearInterval(this.msgTimer);
      if (frequency !== 0)
        this.msgTimer = setInterval(() => {
          this.getMsg();
        }, this.reqFrequency * 1000);
    },
    msgRouteSwitch(command) {
      this.$router.push("/comMessage/" + command);
    },
    indexRouteSwitch(key) {
      if (key === "1")
        this.$router.push("/queryInfo");
      else if (key === "2")
        this.$router.push("/internCert");
      else if (key === "3")
        this.$router.push("/comMessage/received");
      else if (key === "4")
        this.$router.push("/comAccountManage");
      else if (key === "5")
        this.$router.push("/infoEntry");
      else if (key === "6")
        this.$router.push("/infoSquare");
    },
    logOut() {
      if (this.uName === "")
        this.$router.push("/signIn");
      else {
        this.$confirm("确定要退出登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          localStorage.removeItem("jw_ent_file");
          window.location.href = "https://etdla.hduapp.com/sign";
        });
      }
    },
    redirect() {
      switch (this.$route.path) {
        case "/queryInfo":
          this.activeIndex = "1";
          break;
        case "/internCert":
          this.activeIndex = "2";
          break;
        case "/comMessage/received":
        case "/comMessage/sent":
          this.activeIndex = "3";
          break;
        case "/comAccountManage":
          this.activeIndex = "4";
          break;
        case "/infoEntry":
          this.activeIndex = "5";
          break;
        case "/infoSquare":
          this.activeIndex = "6";
          break;
      }
    },
    windowHeight() {
      const de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    },
    getMsg() {
      this.axios({
        method: "post",
        url: "/share/lookupShareLinkForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: { "schoolCode": "1" }
      }).then((response) => {
        const data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].Read)
            this.received++;
        }
      }).catch(() => {
        this.$message.error("获取站内信息出错啦,请稍后再试");
      });
    }
  },
  watch: {
    $route() {//监听路由变化
      this.redirect();
    }
  },
  created() {
    if (localStorage.getItem("jw_ent_file") === null)
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        window.location.href = "https://etdla.hduapp.com/sign";
      }).catch(() => {
        window.location.href = "https://etdla.hduapp.com/sign";
      });
    else {
      this.uName = JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode;
      this.getMsg();
      this.msgTimer = setInterval(() => {
        this.getMsg();
      }, this.reqFrequency * 1000);
    }
  },
  mounted() {
    this.wh = this.windowHeight() < 600 ? 600 : this.windowHeight();
    document.querySelector(".el-main").style.height = this.wh - 80 + "px";
    window.onresize = () => {
      this.wh = this.windowHeight() < 600 ? 600 : this.windowHeight();
    };
    this.redirect();
  }
};
</script>

<style scoped>
.el-header {
  background: url(../img/logo2.png) no-repeat;
  background-position: 20px;
  background-size: 100px;
  background-color: #468dba;
  box-shadow: 0 2px 4px 1px var(--cb-color-shadow, rgba(0, 0, 0, 0.13));
  z-index: 99;
  height: 80px !important;
  min-width: 1500px;
}

.user {
  float: left;
  width: 400px;
  height: 80px;
  margin-left: 47%;
  text-align: center;
  line-height: 80px;
  color: #fff;
}
#uname {
  display: inline-block;
  margin: 0 5px;
}
.el-container {
  background-color: rgba(224, 224, 224, 0.685);
  min-width: 1500px !important;
}
.el-main {
  padding: 0 !important;
  background-size: 100%;
  border-radius: 10px;
  height: 800px;
}
.el-header .el-menu-item {
  padding: 0 30px !important;
}
.el-aside {
  margin-top: 1px;
  background-color: #fff;
  margin: 10px;
  border-radius: 10px;
}
.option-tittle {
  text-align: center;
}
.header-nav {
  margin-left: 220px !important;
}
.aside .el-menu-item {
  height: 60px !important;
  line-height: 60px !important;
}
.el-avatar {
  vertical-align: middle !important;
}
</style>
<style>
/* 收信箱dropdown的右上角数字 */
.item .el-badge__content {
  line-height: 16px;
}
* {
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  list-style: none;
  outline: none;
  box-sizing: border-box;
}
.title {
  float: left;
  width: 250px;
  height: 80px;
  line-height: 80px;
  margin-left: 120px;
  font-size: 26px;
  color: #fff;
  font-weight: 700;
}
</style>
