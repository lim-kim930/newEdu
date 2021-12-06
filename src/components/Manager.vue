<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>管理系统</span>
      </div>
      <div class="user">
        <!-- <el-badge :value="200" :max="99" class="item">
          <el-button size="small">评论</el-button>
        </el-badge>-->
        <el-avatar :size="25" :src="circleUrl"></el-avatar>
        <span style="color: #fff;" id="uname">{{uName === ""?"":uName + " |"}}</span>
        <el-link :underline="false" @click="logOut()" style="color: #fff;">
          {{uName === ""?"登录":"退出"}}
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
                <span slot="title" style="font-size: 20px">企业相关</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-s-check"></i>
                <span slot="title" style="font-size: 20px">档案重置</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 内容 -->
      <el-main v-loading="loading" element-loading-text="拼命加载中">
        <router-view :wh="wh"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      wh: "",
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
    btn(key) {
      if (key === "1")
        this.$router.push("/addCompany");
      else if (key === "2")
        this.$router.push("/profileReset");
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
        case "/addCompany":
          this.activeIndex = "1";
          break
        case "/profileReset":
          this.activeIndex = "2";
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
    this.wh = this.windowHeight()
    document.querySelector(".el-main").style.height = this.wh - 80 + "px";
    if (localStorage.getItem("jw_manage_file") === null)
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      }).catch(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      });
    else
      this.uName = JSON.parse(localStorage.getItem("jw_manage_file")).name
    this.redirect();
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
