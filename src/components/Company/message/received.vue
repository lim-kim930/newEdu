<template>
  <div v-loading="loading">
    <el-dropdown @command="handleCommand1" style="cursor: pointer; margin: 10px 30px 10px 71%">
      <span class="el-dropdown-link">
        分类依据 : {{classify}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="无">无</el-dropdown-item>
        <el-dropdown-item command="学校">学校</el-dropdown-item>
        <el-dropdown-item command="应聘岗位">应聘岗位</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="handleCommand2" style="cursor: pointer; margin: 10px 0">
      <span class="el-dropdown-link">
        排序方式 : {{sort}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="过期时间▼">过期时间▼</el-dropdown-item>
        <el-dropdown-item command="过期时间▲">过期时间▲</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="height: 610px; overflow: auto;">
      <div style="cursor: pointer;" v-for="item in data" v-bind:key="item.id" @click="goQuery(item.url)">
        <el-col :span="8" class="card">
          <el-card  shadow="always">
            <h5>学校: {{item.SchoolCode}}</h5>
            <h5>应聘公司: {{item.TargetCompanyCode}}</h5>
            <h5>应聘岗位: {{item.TargetTargetJobID}}</h5>
            <h5>过期时间: {{item.date}}</h5>
          </el-card>
        </el-col>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      sort: "过期时间▼",
      classify: "无",
      data: []
    };
  },
  methods: {
    handleCommand1(command) {
     this.classify = command
    },
    handleCommand2(command) {
     if(command !== this.sort){
        this.sort = command
        var temp = this.data;
        this.data = []
        console.log(temp);
        for(var i = 0;i<temp.length;i++)
          this.data[i] = temp[temp.length-i-1]
      }
    },
    goQuery(url) {
      this.$router.push({
          path: "/queryInfo",
          query: { url }
      }) 
    }
  },
  mounted() {
    this.loading = true
    var data = JSON.parse(sessionStorage.getItem("message"))
    var count = 1
    for(var i = 0;i< data.length;i++){
      data[i].id = i+1
      data[i].sortDate = +new Date(data[i].ExpireAt)
      data[i].date = new Date(+new Date(data[i].ExpireAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")
      data[i].url = "https://api.hduhelp.com/gormja_wrapper/share/verify?fileID=" + data[i].FileID + "&encryptedK1S=" + data[i].EncryptedK1S
    }
    var data2 = data.sort(function(a,b){
      return a.sortDate - b.sortDate
    })
    this.data = data2
    this.loading = false
  },
};
</script>

<style scoped>
.card {
  margin: 15px 5%;
  height: 100px;
  border-radius: 10px;
  width: 90%;
}
.card h5 {
  margin: 5px 0;
}
.card h5:first-child {
  margin: 0;
}
.el-card {
  height: 120px;
  border-radius: 10px;
}
</style>
