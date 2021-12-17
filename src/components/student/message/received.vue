<template>
  <div v-loading="loading">
    <!-- <el-dropdown @command="classifySwitch" style="cursor: pointer; margin: 10px 30px 10px 71%">
      <span class="el-dropdown-link">
        分类依据 : {{classify}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="无">无</el-dropdown-item>
        <el-dropdown-item command="学校">学校</el-dropdown-item>
        <el-dropdown-item command="应聘岗位">应聘岗位</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
    <el-dropdown @command="sortSwitch" style="cursor: pointer; margin: 10px 30px 10px 80%">
      <span class="el-dropdown-link">
        排序方式 : {{sort}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="时间▼">时间▼</el-dropdown-item>
        <el-dropdown-item command="时间▲">时间▲</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="overflow: auto; padding-bottom: 10px">
      <div
        style="cursor: pointer;"
        v-for="item in receivedMsgData"
        v-bind:key="item.id"
        @click="goQuery(item.CompanyCode, item.JobID)"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover">
            <h5>请求公司: {{item.CompanyCode}}</h5>
            <h5>请求描述: {{item.Text}}</h5>
            <h5>符合岗位: {{item.JobID}}</h5>
            <h5>发起时间: {{item.CreatedAt}}</h5>
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
      sort: "时间▲",
      classify: "无",
      receivedMsgData: []// 
    };
  },
  methods: {
    classifySwitch(command) {
      this.classify = command;
    },
    sortSwitch(command) {
      if (command !== this.sort) {
        this.sort = command;
        const temp = this.receivedMsgData;
        this.receivedMsgData = [];
        for (let i = 0; i < temp.length; i++)
          this.receivedMsgData[i] = temp[temp.length - i - 1];
      }
    },
    goQuery(CompanyCode, JobID) {
      sessionStorage.setItem("com", JSON.stringify({
        CompanyCode,
        Name: "",
        job: "",
        JobID
      }));
      this.$router.push("/infoShare");
    }
  },
  mounted() {
    this.loading = true;
    // 通过sessionStorage得到信息
    this.receivedMsgData = JSON.parse(sessionStorage.getItem("message"));
    this.loading = false;
  }
};
</script>

<style scoped>
.card {
  margin: 15px 5%;
  height: 110px;
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
  height: 130px;
  border-radius: 10px;
}
</style>
