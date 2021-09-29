<template>
  <!-- template 中，只能有唯一的一个根元素 -->
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <el-menu
        :default-active="activeIndex2"
        class="header-nav"
        mode="horizontal"
        @select="handleSelect"
        background-color="#fff"
        text-color="#909399"
        active-text-color="#7fcef4">
        <el-menu-item index="1" style="font-size: 20px"><i class="el-icon-s-home" style="margin-bottom: 2px;margin-right: 0; font-size: 20px"></i>首页</el-menu-item>
        <el-menu-item index="2" style="font-size: 20px"><i class="el-icon-menu" style="margin:0 0 3px 0; font-size: 20px"></i>我的工作台</el-menu-item>
        <el-menu-item index="3" style="font-size: 20px"><i class="el-icon-s-comment" style="margin-right: 0; font-size: 20px"></i>消息中心</el-menu-item>
        <el-menu-item index="4" style="font-size: 20px">
          <i class="el-icon-question" style="margin-bottom: 2px;margin-right: 0;"></i>问题反馈
        </el-menu-item>
        <div style="margin-left:95%;margin-top:20px;">
          <el-link :underline="false" @click="logOut()" style="font-size: 16px">注销<i class="el-icon-caret-right"></i></el-link>
        </div>
      </el-menu>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="230px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              :default-active="activeIndex1"
              @open="handleOpen"
              @close="handleClose"
              @select="btn"
              background-color="#d9dee4"
              text-color="#222222"
              active-text-color="#f29b76"
              class="aside"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-lock"></i>
                  <span style="font-size: 20px !important;">毕业信息统计</span>
                </template>
                  <el-menu-item index="1-1" style="padding:0 0 0 80px; font-size: 18px !important;">统计概览</el-menu-item>
                  <el-menu-item index="1-2" style="padding:0 0 0 80px; font-size: 18px !important;">往年统计</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 内容 -->
      <el-main style="background-color: rgb(233, 233, 233)">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 使用 JS Component 之前，先按需导入一下需要的组件
// import { Toast } from "mint-ui";

export default {
  data() {
    return {
        activeIndex1: "1-1",
        activeIndex2: "2",
    };
  },
  methods: {
    btn(key) {
      switch(key) {
        case '1-1':
          this.$router.push("/getChainInfo");
          break
        case '1-2':
          this.$router.push("/getChainSpecInfo");
          break
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logOut() {
      this.$confirm('确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
      }).then(() => {
          localStorage.removeItem('keystore')
          localStorage.removeItem('code')
          window.location.href = '../login/index.html'
        })
    },
    redirect(){
      switch(this.$route.path) {
        case '/getChainInfo':
          this.activeIndex1 = '1-1';
          break
        case '/getChainSpecInfo':
          this.activeIndex1 = '1-2';
          break
      }
    },
    windowHeight() {
      var de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    }
  },
  filters: {},
  components: {},
  directives: {},
  props: [],
  mounted() {        //写在mounted或者activated生命周期内即可
    window.onload = e => {      //刷新时弹出提示
        console.log(this.$route.path); 
        this.redirect()
        var wh = this.windowHeight();
        document.querySelector(".el-main").style.height = wh - 60+'px';
        // console.log(22222222);
    };
  },
  watch:{   //监听路由变化
    $route(){
      this.redirect()
    }
  }
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
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px 1px var(--cb-color-shadow, rgba(0, 0, 0, 0.13));
  z-index: 99;
}
.el-header .el-menu-item {
  padding: 0 30px !important;
  font-size: 16px;
}
.logo {
  background: url(../img/logo.png) no-repeat;
  background-position: 10px;
}
.el-aside {
  margin-top: 1px;
  background-color: #d9dee4;
}
.el-main {
  padding: 20px;
}
.option-tittle {
  text-align: center;
}
.header-nav {
  margin-left: 210px !important;
}
.aside .el-menu-item
 {
  height: 50px !important;
  line-height: 50px !important;
}
</style>
