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
        <el-menu-item index="1" style=" font-size: 20px"><i class="el-icon-s-home" style="margin-bottom: 2px; margin-right: 0; font-size: 20px"></i>首页</el-menu-item>
        <el-menu-item index="2" style=" font-size: 20px"><i class="el-icon-menu" style="margin:0 0 3px 0;  font-size: 20px"></i>我的工作台</el-menu-item>
        <el-menu-item index="3" style=" font-size: 20px"><i class="el-icon-s-comment" style="margin-right: 0;  font-size: 20px"></i>消息中心</el-menu-item>
        <el-menu-item index="4" style=" font-size: 20px">
          <i class="el-icon-question" style="margin-bottom: 2px;margin-right: 0; font-size: 20px"></i>问题反馈
        </el-menu-item>
        <div style="margin-left:95%;margin-top:20px;">
          <el-link :underline="false" @click="logOut()" style=" font-size: 16px">注销<i class="el-icon-caret-right"></i></el-link>
        </div>
      </el-menu>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="230px" v-show="asideShow">
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
                  <i class="el-icon-circle-plus"></i>
                  <span style="font-size: 20px">添加学生</span>
                </template>
                  <el-menu-item index="1-1" style="padding:0 0 0 70px; font-size: 18px !important">手动添加</el-menu-item>
                  <el-menu-item index="1-2" style="padding:0 0 0 70px; font-size: 18px !important">批量添加</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span style="font-size: 20px">管理学生信息</span>
                </template>
                <el-submenu index="2-1" style="padding:0 0 0 30px">
                  <template slot="title" ><span style="font-size: 20px">录入学分</span></template>
                  <el-menu-item index="2-1-1" style="padding:0 0 0 70px; font-size: 18px !important">手动录入</el-menu-item>
                  <el-menu-item index="2-1-2" style="padding:0 0 0 70px; font-size: 18px !important">批量录入</el-menu-item>
                </el-submenu>
                  <el-menu-item index="2-2" style="margin-left:30px; font-size: 18px !important">添加特殊情况</el-menu-item>
                  <el-menu-item index="2-3" style="margin-left:30px; font-size: 18px !important">添加惩罚情况</el-menu-item>
              </el-submenu>
             <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-s-check"></i>
                  <span style="font-size: 20px">学生毕业相关</span>
                </template>
                <el-menu-item index="3-1" style="padding:0 0 0 70px; font-size: 18px !important">添加毕业</el-menu-item>
                <el-menu-item index="3-2" style="padding:0 0 0 70px; font-size: 18px !important">毕业证书生成</el-menu-item>
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
      loading: false,
      activeIndex1: "1-1",
      activeIndex2: "1",
      asideShow: false
    };
  },
  methods: {
    btn(key) {
      switch(key) {
        case '1-1':
          this.$router.push("/faceRec");
          break
        case '1-2':
          this.$router.push("/batchAddStu");
          break
        case '2-1-1':
          this.$router.push("/checkCourse");
          break
        case '2-1-2':
          this.$router.push("/batchCkCourse");
          break
        case '2-2':
          this.$router.push("/modSpecStin");
          break
        case '2-3':
          this.$router.push("/modPun");
          break
        case '3-1':
          this.$router.push("/IsGrad");
          break
        case '3-2':
          this.$router.push("/genCert");
          break
      }
    },
    handleSelect(key, keyPath) {
      if(keyPath == '1'){
        this.$router.push("/deansOfficeHome");
        this.asideShow = false
      }
      else if(keyPath == '2'){
        this.$router.push("/faceRec");
        this.asideShow = true
      }
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
        case '/addStudent':
          this.asideShow = true
          this.activeIndex1 = '1-1';
          this.activeIndex2 = '2';
          break
        case '/batchAddStu':
          this.asideShow = true
          this.activeIndex1 = '1-2';
          this.activeIndex2 = '2';
          break
        case '/faceRec':
          this.asideShow = true
          this.activeIndex1 = '1-1';
          this.activeIndex2 = '2';
          break
        case '/checkCourse':
          this.asideShow = true
          this.activeIndex2 = '2';
          this.activeIndex1 = '2-1-1';
          break
        case '/batchCkCourse':
          this.asideShow = true
          this.activeIndex2 = '2';
          this.activeIndex1 = '2-1-2';
          break
        case '/modSpecStin':
          this.asideShow = true
          this.activeIndex2 = '2';
          this.activeIndex1 = '2-2';
          break
        case '/modPun':
          this.asideShow = true
          this.activeIndex2 = '2';
          this.activeIndex1 = '2-3';
          break
        case '/IsGrad':
          this.asideShow = true
          this.activeIndex2 = '2';
          this.activeIndex1 = '3-1';
          break
        case '/genCert':
          this.asideShow = true
          this.activeIndex2 = '2';
          this.activeIndex1 = '3-2';
          break
        case '/deansOfficeHome':
          this.activeIndex2 = '1';
          this.asideShow = false
          break
      }
    },
    windowHeight() {
      var de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    }
    // logIn() {
    //   localStorage.setItem("keystore", this.keystore);
    //   localStorage.setItem("code", this.code);
    //   this.axios.get("https://api-vnt.fdkevin.xyz/getRole", {
    //       headers: { Authorization: this.keystore, code: this.code },
    //     })
    //     .then(function (response) {
    //       console.log(response.data.role);
    //       if (response.data.role == "student") {
    //         window.location.href = "../manageStuToken/index.html";
    //       } else if (response.data.role == "HR") {
    //         window.location.href = "../queryStuToken/index.html";
    //       } else if (response.data.role == "deansOffice") {
    //         window.location.href = "../addStudent/index.html";
    //       }
    //     });
    // },
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
        console.log(22222222);
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
