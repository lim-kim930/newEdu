<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>教务—学业分享系统</span>
      </div>
      <div class="user">
        <el-badge
          v-show="file !== ''"
          is-dot
          :hidden="downloaded"
          class="item"
          style="width: 30px; height: 30px; margin-right: 20px; line-height: 30px !important"
        >
          <i
            :title="downloaded?'下载学业文件':'新的学业文件未下载'"
            class="el-icon-download"
            style="font-size: 20px; color: #fff; cursor: pointer;"
            @click="downloadFile('学业文件.enc')"
          ></i>
        </el-badge>
        <el-badge
          :value="received"
          :hidden="received === 0"
          class="item"
          style="width: 30px; height: 30px; margin-right: 20px; line-height: 30px !important"
        >
          <i
            title="消息中心"
            class="el-icon-message el-dropdown-link"
            style="font-size: 20px; color: #fff; cursor: pointer;"
            @click="msgRouteSwitch('received')"
          ></i>
        </el-badge>
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
      <el-aside :style="{ 'height': wh - 100 + 'px', 'width': isCollapse?'64px':'240px' }">
        <span
          @click="isCollapse = !isCollapse"
          :title="isCollapse?'展开':'收起'"
          class="collapse"
          :style="{'width': isCollapse?'64px':'240px'}"
        >
          <i style="font-size: 14px" :class="isCollapse?'el-icon-arrow-right':'el-icon-arrow-left'">
            <span :style="{'font-size': isCollapse?'0':'14px'}">{{isCollapse?"":"点击收起"}}</span>
          </i>
        </span>
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              :default-active="activeIndex"
              @select="indexRouteSwitch"
              :collapse="isCollapse"
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
                >档案重置</el-menu-item>
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
              <!-- <el-menu-item index="6" :disabled="!xjConfirmed">
                <i class="el-icon-s-custom"></i>
                <span slot="title" style="font-size: 20px">账号设置</span>
              </el-menu-item>-->
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
          @func3="getReceived"
          @func4="getFrequency"
          @func5="getDownloaded"
          :frequency="reqFrequency"
          :file="file"
          :xjConfirmed="xjConfirmed"
          :received="received"
          :wh="wh"
        ></router-view>
      </el-main>
      <el-drawer
        :show-close="false"
        :with-header="false"
        :visible.sync="noticeShow"
        direction="rtl"
        size="50%"
        :before-close="beforeClose"
      >
        <h2 style="text-align: center; padding: 10px; user-select: none;">首次使用须知! ! ! !</h2>
        <el-alert
          style="font-size: 16px"
          title="内容不多, 但为了避免影响使用体验, 请仔细阅读哦"
          type="warning"
          :wrapperClosable="false"
          show-icon
          :closable="false"
        ></el-alert>
        <div style="padding: 20px 10px; color: #303133">
          <h3 style="text-indent: 1em">1.首次进入系统后,也就是在你关闭这个须知以后, 会被强制进入进行第一步————学籍确认</h3>
          <h3>检查信息无误并点击确认后, 会进入加载状态, 这个过程会有点慢, 但只会进行这一次, 所以还请耐心等待加载完毕</h3>
          <h3>然后请并务必按照提示下载和保存好一个叫做学业文件.enc的东东, 它存储了你的所有信息</h3>
          <h3>因此它是你完整使用这个系统的前提, 并且一旦丢失将无法找回, 你写入的信息也将随之丢失</h3>
          <el-divider>我是分割线</el-divider>
          <h3 style="text-indent: 1em">2.在每确认/写入一次文件后, 系统内保存的文件内容都会更新, 你可以根据提示选择是否下载新的文件到本地</h3>
          <h3>如果选择下载, 因为浏览器或设置的不同, 请根据自己的情况保存好新的文件, 旧的文件就失效了, 可以直接替换掉</h3>
          <h3>如果选择不下载, 可以点击弹框外任意位置来关闭, 然后继续进行其他操作, 但请不要忘记你还有新的文件没有下载, 在页面右上角也会有红点提示</h3>
          <h3>如果你未下载最新的文件, 但尝试退出登录、刷新、关闭标签页或者浏览器时, 会收到浏览器的提示, 此时请取消退出操作然后点击下载按钮进行下载</h3>
          <el-divider>我是分割线</el-divider>
          <h3
            style="text-indent: 1em"
          >3.使用2k等高分辨率屏幕的小伙伴往往会调大显示的缩放比例, 而这样你就会发现页面出奇的'大'和'怪', 有各种各样的滚动条</h3>
          <h3>所以为了不影响使用, 请使用 ctrl(command)+鼠标滚轮下滑 或 运算符'-', 缩小浏览器页面的缩放比例, 使得当前这个页面不出现滚动条为最佳</h3>
        </div>
        <el-button style="margin: 20px 0 20px 20px" plain type="primary" @click="closeDrawer">我知道啦</el-button>
      </el-drawer>
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
      xjConfirmed: "",// 学籍确认状态
      reqFrequency: 300,
      msgTimer: "",
      known: false,
      isCollapse: false,
      noticeShow: false,
      downloaded: true,
      wh: ""// 屏幕高度
    };
  },
  methods: {
    beforeClose(done) {
      if (this.known)
        done();
    },
    closeDrawer() {
      this.known = true;
      this.noticeShow = false;
    },
    msgRouteSwitch(command) {
      if (this.xjConfirmed)
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
        this.downloaded = true;
        this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        });
      }, 400);
    },
    //拿到子组件传来的学业文件,全局存储在student页面
    getFile(file) {
      if (this.file !== "")
        this.downloaded = false;
      this.file = file;
    },
    //拿到子组件传来的学籍确认状态,全局存储在student页面
    getConfirmed(confirmed) {
      let userData = JSON.parse(localStorage.getItem("jw_student_file"));
      this.xjConfirmed = confirmed;
      userData.xjConfirmed = this.xjConfirmed;
      localStorage.setItem("jw_student_file", JSON.stringify(userData));
    },
    getDownloaded(downloaded) {
      this.downloaded = downloaded;
    },
    getReceived(received) {
      this.received = received;
    },
    getFrequency(frequency) {
      this.reqFrequency = frequency;
      clearInterval(this.msgTimer);
      if (frequency !== 0)
        this.msgTimer = setInterval(() => {
          this.getMsg(JSON.parse(localStorage.getItem("jw_student_file")));
        }, this.reqFrequency * 1000);
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
        location.href = "https://etdla.hduapp.com/sign";
      }
      else {
        this.$confirm("确定要退出登录吗?" + (this.downloaded ? "" : "你好像还没有下载最新的学业文件到本地"), "提示", {
          confirmButtonText: "确定",
          cancelButtonText: this.file === "" ? "取消" : "现在下载",
          type: "warning"
        }).then(() => {
          //清除localStorage里的用户信息,定向到登录
          localStorage.removeItem("jw_student_file");
          localStorage.removeItem("jw_student_msg");
          window.location.href = "https://etdla.hduapp.com/sign";
        }).catch(() => {
          if (this.file === "")
            return;
          this.downloadFile("学业文件.enc");
        });
      }
    },
    //根据路由匹配activeIndex
    redirect() {
      if (this.xjConfirmed)
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
    getMsg(userData) {
      this.axios({
        method: "post",
        url: "/share/listFurtherShareRequestForReceiver",
        headers: { "Authorization": "token " + userData.token },
        data: { "student": "any" }
      }).then((response) => {
        this.received = 0;
        const data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].Read)
            this.received++;
        }
        return this.axios({
          method: "get",
          url: "/campusTalk/lookupForSelf",
          headers: { "Authorization": "token " + userData.token },
          data: { "StaffID": userData.staffID }
        });
      }).then((response) => {
        const data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].Read)
            this.received++;
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取站内信息出错啦,请稍后再试");
        this.loading = false;
      });
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
  created() {
    // 判断是否登录
    if (localStorage.getItem("jw_student_file") === null)
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
      let userData = JSON.parse(localStorage.getItem("jw_student_file"));
      this.uName = userData.staffID;
      if (!JSON.parse(localStorage.getItem("jw_student_msg")))
        localStorage.setItem("jw_student_msg", 300);
      this.reqFrequency = JSON.parse(localStorage.getItem("jw_student_msg"));
      this.loading = true;
      // 拿学籍确认状态
      this.axios({
        method: "get",
        url: "/dataFile/getFileID",
        headers: { "Authorization": "token " + userData.token },
      }).then((response) => {
        this.xjConfirmed = response.data.data.FileID === "null" ? false : true;
        userData.xjConfirmed = this.xjConfirmed;
        localStorage.setItem("jw_student_file", JSON.stringify(userData));
        this.redirect();
        if (this.xjConfirmed) {
          this.getMsg(userData);
          this.msgTimer = setInterval(() => {
            this.getMsg(userData);
          }, this.reqFrequency * 1000);
        }
        else {
          this.loading = false;
          this.noticeShow = true;
        }
      }).catch(() => {
        this.$message.error("获取学业文件状态出错啦,请稍后重试");
        this.redirect();
        this.loading = false;
      });
    }
  },
  mounted() {
    // 刷新和关闭标签页提示
    window.onbeforeunload = (e) => {
      if (!this.downloaded) {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e)
          e.returnValue = "done";
        return this.$confirm("你好像还没有下载最新的学业文件到本地", "提示", {
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
  transition: all 0.5s;
}
.el-aside .collapse {
  cursor: pointer;
  text-align: center;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  transition: all 0.5s;
  color: #909399;
}
.el-aside .collapse span {
  transition: all 0.3s;
  user-select: none;
}
.el-aside .collapse:hover {
  background-color: #ccc;
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
.el-drawer h3 {
  padding: 5px;
  line-height: 25px;
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
.el-badge .is-dot {
  border: none;
}
</style>
