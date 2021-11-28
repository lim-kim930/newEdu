<template>
  <!-- template 中，只能有唯一的一个根元素 -->
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>教务—学业分享系统</span>
      </div>
      <div class="user">
        <el-dropdown style="height: 50px; cursor: pointer; line-height: 80px">
          <el-badge
            :value="received + sent"
            :hidden="received + sent === 0"
            class="item"
            style="width: 30px; height: 30px; margin-right: 20px; line-height: 30px !important"
          >
            <i class="el-icon-message-solid el-dropdown-link" style="font-size: 20px; color: #fff"></i>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              已发送
              <el-badge class="mark" :value="sent" :hidden="sent === 0" />
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              收信箱
              <el-badge class="mark" :value="received" :hidden="received === 0" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar :size="25" :src="circleUrl"></el-avatar>
        <span style="color: #fff;" id="uname">{{uName === null?"":uName + " |"}}</span>
        <el-link :underline="false" @click="logOut()" style="color: #fff;">
          {{uName === null?"登录":"注销"}}
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
                <i class="el-icon-s-promotion"></i>
                <span slot="title" style="font-size: 20px">信息分享</span>
              </el-menu-item>
              <el-menu-item index="3" :disabled="!xjConfirmed">
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
          @func="getFile"
          @func2="getConfirmed"
          :file="file"
          :xjConfirmed="xjConfirmed"
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
      circleUrl: "https://limkim.xyz/newEdu/user.png",//头像url
      activeIndex: "1",//侧边导航默认选中值
      loading: false,//main的加载
      uName: "",//用户名
      file: "",//文件
      received: 0,//收件箱数量
      sent: 0,//已发送数量
      xjConfirmed: true,//学籍确认状态
      wh: ""//屏幕高度
    };
  },
  methods: {
    //拿到子组件传来的学业文件,全局存储在student页面
    getFile(file) {
      this.file = file
    },
    //拿到子组件传来的学籍确认状态,全局存储在student页面
    getConfirmed(confirmed) {
      this.xjConfirmed = confirmed
    },
    //路由切换
    btn(key) {
      if (key === "1-1")
        this.$router.push("/infoConfirm/xjConfirm");
      else if (key === "1-2") {
        this.$router.push("/scoreChange");
      }
      else if (key === "1-3") {
        this.$router.push("/arcManage");
      }
      else if (key === "2") {
        this.$router.push("/infoShare");
      }
      else if (key === "3") {
        this.$router.push("/accountManage");
      }
    },
    //登出
    logOut() {
      if (this.uName === null) {
        //没有用户信息直接定向到登录
        location.href = "https://limkim.xyz/newEdu/sign"
      }
      else {
        this.$confirm("确定要退出登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          //清除localStorage里的用户信息,定向到登录
          localStorage.removeItem("jw_student_file")
          window.location.href = "https://limkim.xyz/newEdu/sign"
        })
      }
    },
    //根据路由匹配activeIndex
    redirect() {
      if (this.xjConfirmed === true)
        switch (this.$route.path) {
          case "/scoreChange":
            this.activeIndex = "1-2";
            break
          case "/infoConfirm/xyConfirm":
          case "/infoConfirm/hjConfirm":
          case "/infoConfirm/byConfirm":
          case "/infoConfirm/xjConfirm":
            this.activeIndex = "1-1";
            break
          case "/arcManage":
            this.activeIndex = "1-3";
            break
          case "/accountManage":
            this.activeIndex = "3";
            break
          case "/infoShare":
            this.activeIndex = "2";
            break
        }
      else
        switch (this.$route.path) {
          case "/infoConfirm/xjConfirm":
            this.activeIndex = "1-1";
            break
          default:
            setTimeout(() => {
              this.$confirm("您还没有确认学籍信息,请确认后再来吧", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning"
              }).then(() => {
                this.$router.push("/infoConfirm/xjConfirm");
              }).catch(() => {
                this.$router.push("/infoConfirm/xjConfirm");
              });
            }, 100)
        }
    },
    windowHeight() {
      var de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    }
  },
  watch: {//监听路由变化,调用redirect()
    $route() {
      this.redirect()
      //  console.log(to , from )
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
    }
  },
  mounted() {//写在mounted或者activated生命周期内即可
    // 拿到屏幕高度
    window.addEventListener('resize', () => {
      let wh = window.innerHeight;
      document.querySelector(".el-form").style.maxHeight = wh - 190 + "px";
      document.querySelector(".el-main").style.height = wh - 80 + "px";
      console.log(wh)
    })
    //判断是否登录
    if (localStorage.getItem("jw_student_file") === null)
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      }).catch(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      });
    else {
      this.uName = JSON.parse(localStorage.getItem("jw_student_file")).staffID
      this.loading = true
      //拿学籍确认状态
      this.axios({
        method: "get",
        url: "https://api.limkim.xyz/getXj",
        params: { staffID: this.uName }
      })
        .then((response) => {
          this.xjConfirmed = response.data.data.confirmed
          this.loading = false
          this.redirect();
        })
        .catch(error => {
          if (error.response.data.status === "staffID Required"){
            this.$confirm("您还未登录或登陆出错,请重新登录后重试", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "warning"
            }).then(() => {
              window.location.href = "https://limkim.xyz/newEdu/sign"
            }).catch(() => {
              window.location.href = "https://limkim.xyz/newEdu/sign"
            });
          }
          else if (error.response.data.status === "Error")
            this.$message.error("服务器出错")
          else
            this.$message.error("出错啦,请稍后重试")
          this.loading = false
          this.redirect();
        });
    }
  },
};
</script>

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
  background: url(../img/logo.png) no-repeat;
  background-position: 20px;
  background-size: 300px;
  background-color: #468dba;
  box-shadow: 0 2px 4px 1px var(--cb-color-shadow, rgba(0, 0, 0, 0.13));
  z-index: 99;
  height: 80px !important;
  min-width: 1500px;
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
.user {
  float: left;
  width: 230px;
  height: 80px;
  margin-left: 45%;
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
.el-aside ul {
  border: none;
}
</style>
