<template>
  <!-- template 中，只能有唯一的一个根元素 -->
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>高校学业核验系统</span>
      </div>
      <div class="user">
        <!-- <el-badge :value="200" :max="99" class="item">
          <el-button size="small">评论</el-button>
        </el-badge>-->
        <el-dropdown style="height: 50px; line-height: 80px" @command="handleCommand">
          <el-badge
            :value="received + sent"
            class="item"
            style="width: 30px; height: 30px; margin-right: 20px; line-height: 30px !important; cursor: pointer;"
          >
            <i class="el-icon-message" style="font-size: 20px; color: #fff" @click="goMessage()"></i>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="received" class="clearfix">
              收信箱
              <el-badge class="mark" :value="received" v-show="received !== 0"/>
            </el-dropdown-item>
            <el-dropdown-item command="sent" class="clearfix">
              已发送
              <el-badge class="mark" :value="sent" v-show="sent !== 0"/>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar :size="25" :src="circleUrl"></el-avatar>
        <span style="color: #fff;" id="uname">{{uName === ""?"":uName + " |"}}</span>
        <el-link :underline="false" @click="logOut()" style="color: #fff;">
          {{uName === ""?"登录":"注销"}}
          <i class="el-icon-caret-right"></i>
        </el-link>
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              :default-active="activeIndex"
              @select="btn"
              background-color="#fff"
              text-color="#3a4b56"
              active-text-color="#409eff"
              class="aside"
            >
              <el-menu-item index="1">
                <i class="el-icon-s-grid"></i>
                <span slot="title" style="font-size: 20px">学生信息核验</span>
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
      <el-main v-loading="loading" element-loading-text="拼命加载中">
        <router-view
          @func="getReceived"
          @func2="getSent"
          :received="received"
          :sent="sent"
        ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      circleUrl: "https://limkim.xyz/newEdu/user.png",
      activeIndex: "",
      tokenInfo: "",
      loading: false,
      received: 0,
      sent: 0,
      uName: ""
    };
  },
  methods: {
    getReceived(received) {
      this.received = received
    },
    getSent(sent) {
      this.sent= sent
    },
    handleCommand(command) {
      this.$router.push("/comMessage/" + command);
    },
    goMessage() {
      this.$router.push("/comMessage");
    },
    btn(key) {
      if (key === "1")
        this.$router.push("/queryInfo");
      else if (key === "2")
        this.$router.push("/internCert");
      else if (key === "3")
        this.$router.push("/comMessage/received");
      else if (key === "4")
        this.$router.push("/comAccountManage");
    },
    logOut() {
      if (this.uName === "")
        //改成登录
        this.$router.push("/signIn");
      else {
        this.$confirm("确定要退出登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          localStorage.removeItem("jw_ent_file")
          window.location.href = "https://limkim.xyz/newEdu/sign"
        })
      }
    },
    redirect() {
      switch (this.$route.path) {
        case "/queryInfo":
          this.activeIndex = "1";
          break
        case "/comAccountManage":
          this.activeIndex = "4";
          break
        case "/internCert":
          this.activeIndex = "2";
          break
        case "/comMessage/received":
        case "/comMessage/sent":
          this.activeIndex = "3";
          break
      }
    },
    windowHeight() {
      var de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    }
  },
  watch: {   //监听路由变化
    $route() {
      this.redirect()
      //  console.log(to , from )
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
    }
  },
  mounted() {        //写在mounted或者activated生命周期内即可
    window.onload = e => {      //刷新时弹出提示
      var wh = this.windowHeight();
      document.querySelector(".el-main").style.height = wh - 80 + "px";
    };
    this.redirect();
    if (localStorage.getItem("jw_ent_file") === null)
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      }).catch(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      });
    else{
      this.uName = JSON.parse(localStorage.getItem("jw_ent_file")).Name
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/share/lookupShareLink",
        headers: { "Content-Type": "application/json" },
        data: localStorage.getItem("jw_ent_file")
      })
        .then((response) => {
          this.received = response.data.data.length;
          sessionStorage.setItem("message", JSON.stringify(response.data.data))
        })
        .catch(error => {
          this.$message.error("获取学籍信息出错啦,请稍后再试");
        });
    }
  },
};
</script>

<style scoped>
.mark {
  margin-top: 10px;
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
.user {
  float: left;
  width: 400px;
  height: 80px;
  margin-left: 47%;
  text-align: center;
  line-height: 80px;
}
.el-container {
  background-color: rgba(224, 224, 224, 0.685);
  min-width: 1500px !important;
}
.el-main {
  padding: 0 !important;
  background-size: 100%;
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
/* #logout {
  background: url('E:\网站\sever\src\img\logout2.png') no-repeat;
  background-size: 100%;
  background-position: 0 0;
} */
/* #logout:hover {

} */
</style>
