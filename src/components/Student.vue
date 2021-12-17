<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>教务—学业分享系统</span>
      </div>
      <div class="user">
        <el-dropdown
          style="height: 50px; cursor: pointer; line-height: 80px"
          @command="msgRouteSwitch"
        >
          <el-badge
            :value="received + sent"
            :hidden="received + sent === 0"
            class="item"
            style="width: 30px; height: 30px; margin-right: 20px; line-height: 30px !important"
          >
            <i
              class="el-icon-message el-dropdown-link"
              style="font-size: 20px; color: #fff"
              @click="msgRoute('received')"
            ></i>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="received" class="clearfix">
              收信箱
              <el-badge class="item" :value="received" :hidden="received === 0" />
            </el-dropdown-item>
            <el-dropdown-item command="sent" class="clearfix">
              已发送
              <el-badge class="item" :value="sent" :hidden="sent === 0" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar :size="25" :src="circleUrl"></el-avatar>
        <span style="color: #fff;" id="uname">{{uName === null?"":uName + " |"}}</span>
        <el-link
          :underline="false"
          @click="logOut()"
          style="font-size: 15px; color: #fff; margin-top: -4px"
        >
          {{uName === null?"登录":"退出登录"}}
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
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-s-grid"></i>
                  <span style="font-size: 20px">信息管理</span>
                </template>
                <el-menu-item
                  index="1-1"
                  style="padding:0 0 0 80px; font-size: 18px !important"
                >信息确认</el-menu-item>
                <el-menu-item
                  index="1-2"
                  style="padding:0 0 0 80px; font-size: 18px !important"
                  :disabled="!xjConfirmed"
                >成绩更改</el-menu-item>
                <el-menu-item
                  index="1-3"
                  style="padding:0 0 0 80px; font-size: 18px !important"
                  :disabled="!xjConfirmed"
                >档案找回</el-menu-item>
              </el-submenu>
              <el-menu-item index="2" :disabled="!xjConfirmed">
                <i class="el-icon-share"></i>
                <span slot="title" style="font-size: 20px">信息分享</span>
              </el-menu-item>
              <el-menu-item index="3" :disabled="!xjConfirmed">
                <i class="el-icon-s-flag"></i>
                <span slot="title" style="font-size: 20px">岗位信息</span>
              </el-menu-item>
              <el-menu-item index="4" :disabled="!xjConfirmed">
                <i class="el-icon-s-promotion"></i>
                <span slot="title" style="font-size: 20px">信息公开设置</span>
              </el-menu-item>
              <el-menu-item index="5" :disabled="!xjConfirmed">
                <i class="el-icon-message-solid"></i>
                <span slot="title" style="font-size: 20px">消息中心</span>
              </el-menu-item>
              <el-menu-item index="6" :disabled="!xjConfirmed">
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
          v-loading="loading"
          element-loading-text="拼命加载中"
          @func="getFile"
          @func2="getConfirmed"
          :file="file"
          :xjConfirmed="xjConfirmed"
          :received="received"
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
      circleUrl: "https://edu.limkim.cn/static/user.png",// 头像url
      activeIndex: "1",// 侧边导航默认选中值
      loading: false,// main的加载
      uName: "",// 用户名
      file: "",// 文件
      received: 0,// 收件箱数量
      sent: 0,// 已发送数量
      xjConfirmed: "",// 学籍确认状态
      wh: ""// 屏幕高度
    };
  },
  methods: {
    msgRouteSwitch(command) {
      this.$router.push("/message/" + command);
    },
    // 下载文件
    downloadFile(filename) {
      const Url = URL.createObjectURL(this.file);
      const eleLink = document.createElement("a");
      eleLink.download = filename;
      eleLink.style.display = "none";
      eleLink.href = Url;
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
      setTimeout(() => {
        this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        });
      }, 400);
    },
    //拿到子组件传来的学业文件,全局存储在student页面
    getFile(file) {
      this.file = file;
    },
    //拿到子组件传来的学籍确认状态,全局存储在student页面
    getConfirmed(confirmed) {
      this.xjConfirmed = confirmed;
    },
    //路由切换
    indexRouteSwitch(key) {
      switch (key) {
        case "1-1":
          this.$router.push("/infoConfirm/profileConfirm");
          break;
        case "1-2":
          this.$router.push("/scoreChange");
          break;
        case "1-3":
          this.$router.push("/arcManage");
          break;
        case "2":
          this.$router.push("/infoShare");
          break;
        case "3":
          this.$router.push("/infoSquare");
          break;
        case "4":
          this.$router.push("/infoDisclose");
          break;
        case "5":
          this.$router.push("/message/received");
          break;
        case "6":
          this.$router.push("/accountManage");
          break;
      }
    },
    //退出登录
    logOut() {
      if (this.uName === null) {
        //没有用户信息直接定向到登录
        location.href = "https://edu.limkim.cn/sign";
      }
      else {
        this.$confirm("确定要退出登录吗?" + (this.file === "" ? "" : "请确认您已经将最新的学业文件下载到了本地"), "提示", {
          confirmButtonText: "确定",
          cancelButtonText: this.file === "" ? "取消" : "现在下载",
          type: "warning"
        }).then(() => {
          //清除localStorage里的用户信息,定向到登录
          localStorage.removeItem("jw_student_file");
          window.location.href = "https://edu.limkim.cn/sign";
        }).catch(() => {
          if (this.file === "")
            return;
          this.downloadFile("学业文件.enc");
        });
      }
    },
    //根据路由匹配activeIndex
    redirect() {
      if (this.xjConfirmed === true)
        switch (this.$route.path) {
          case "/infoConfirm/scoreConfirm":
          case "/infoConfirm/rewardConfirm":
          case "/infoConfirm/gradConfirm":
          case "/infoConfirm/profileConfirm":
          case "/infoConfirm/intConfirm":
          case "/infoConfirm/rankConfirm":
            this.activeIndex = "1-1";
            break;
          case "/scoreChange":
            this.activeIndex = "1-2";
            break;
          case "/arcManage":
            this.activeIndex = "1-3";
            break;
          case "/infoShare":
            this.activeIndex = "2";
            break;
          case "/infoSquare":
            this.activeIndex = "3";
            break;
          case "/infoDisclose":
            this.activeIndex = "4";
            break;
          case "/message/received":
          case "/message/sent":
            this.activeIndex = "5";
            break;
          case "/accountManage":
            this.activeIndex = "6";
            break;
        }
      else
        switch (this.$route.path) {
          case "/infoConfirm/profileConfirm":
            this.activeIndex = "1-1";
            break;
          default:
            setTimeout(() => {
              this.$confirm("您还没有确认学籍信息,请确认后再来吧", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning"
              }).then(() => {
                this.$router.push("/infoConfirm/profileConfirm");
              }).catch(() => {
                this.$router.push("/infoConfirm/profileConfirm");
              });
            }, 100);
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
<<<<<<< HEAD
  mounted() {
    // 刷新和关闭标签页提示
    window.onbeforeunload = (e) => {
      if (this.file !== "") {
        console.log(e);
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e)
          e.returnValue = "done";
        return this.$confirm("请确认您已经将最新的学业文件下载到了本地", "提示", {
          confirmButtonText: "现在下载",
          cancelButtonText: "已下载",
          type: "warning"
        }).then(() => {
          this.downloadFile("学业文件.enc");
        });
      }
    };
    // 拿到屏幕高度
    this.wh = this.windowHeight() < 650 ? 650 : this.windowHeight();
    document.querySelector(".el-main").style.height = this.wh - 80 + "px";
    window.onresize = () => {
      this.wh = this.windowHeight() < 650 ? 650 : this.windowHeight();
    };
    // 判断是否登录
=======
  mounted() {//写在mounted或者activated生命周期内即可
    // 拿到屏幕高度
    window.addEventListener('resize', () => {
      let wh = window.innerHeight;
      document.querySelector(".el-form").style.maxHeight = wh - 190 + "px";
      document.querySelector(".el-main").style.height = wh - 80 + "px";
      console.log(wh)
    })
    //判断是否登录
>>>>>>> 168dbd93b1392ca2bef7c41a2f93ff0a4112056b
    if (localStorage.getItem("jw_student_file") === null)
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        window.location.href = "https://edu.limkim.cn/sign";
      }).catch(() => {
        window.location.href = "https://edu.limkim.cn/sign";
      });
    else {
      this.uName = JSON.parse(localStorage.getItem("jw_student_file")).staffID;
      this.loading = true;
      // 拿学籍确认状态
      this.axios({
        method: "get",
        url: "https://api.hduhelp.com/gormja_wrapper/dataFile/getFileID",
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
      }).then((response) => {
        this.xjConfirmed = response.data.data.FileID === "null" ? false : true;
        this.redirect();
        if (this.xjConfirmed)
          this.axios({
            method: "post",
            url: "https://api.hduhelp.com/gormja_wrapper/share/listFurtherShareRequestForReceiver",
            headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
            data: { "student": "any" }
          }).then((response) => {
            this.received = response.data.data.length;
            sessionStorage.setItem("message", JSON.stringify(response.data.data));
            return this.axios({
              method: "post",
              url: "https://api.hduhelp.com/gormja_wrapper/share/lookupShareLinkForSelf",
              headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
              data: { "StaffID": JSON.parse(localStorage.getItem("jw_student_file")).staffID }
            });
          }).then((response) => {
            sessionStorage.setItem("sent", JSON.stringify(response.data.data));
            this.loading = false;
          }).catch(() => {
            this.$message.error("获取站内信息出错啦,请稍后再试");
            this.loading = false;
          });
        else
          this.loading = false;
      }).catch(() => {
        this.$message.error("获取学业文件状态出错啦,请稍后重试");
        this.redirect();
        this.loading = false;
      });
    }
  },
  destroyed() {
    window.onbeforeunload = null;
  }
};
</script>

<style scoped>
.el-header {
  background: url(../img/logo.png) no-repeat;
  background-position: 20px;
  background-size: 300px;
  background-color: #468dba;
  box-shadow: 0 2px 4px 1px var(--cb-color-shadow, rgba(0, 0, 0, 0.13));
  z-index: 99;
  height: 80px !important;
  min-width: 1500px;
}
.user {
  float: right;
  width: 300px;
  height: 80px;
  margin-right: 10%;
  text-align: center;
  line-height: 80px;
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
.el-aside ul {
  border: none;
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
.item .el-badge__content {
  line-height: 16px;
}
.title {
  float: left;
  width: 240px;
  height: 80px;
  line-height: 80px;
  margin-left: 330px;
  font-size: 26px;
  color: #fff;
  font-weight: 700;
}
</style>
