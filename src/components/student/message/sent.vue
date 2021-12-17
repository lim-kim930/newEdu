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
    </el-dropdown> -->
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
        v-for="item in sentMsgData"
        v-bind:key="item.id"
        @click="goQuery()"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover">
            <h5>请求公司: {{item.TargetCompanyCode}}</h5>
            <h5>应聘岗位: {{item.TargetJobID}}</h5>
            <h5>过期时间: {{item.ExpireAt}}</h5>
            <el-badge :hidden="item.Read" value="pending" class="sentBadge">
              <h5>状态: {{item.Read?"企业已读":"企业未读"}}</h5>
            </el-badge>
          </el-card>
        </el-col>
      </div>
      <el-empty :image-size="200" v-show="sentMsgData.length === 0" description="您还没有已发送的消息哦~"></el-empty>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      sort: "时间▼",
      classify: "无",
      sentMsgData: []// 
    };
  },
  methods: {
    classifySwitch(command) {
      this.classify = command
    },
    sortSwitch(command) {
      if (command !== this.sort) {
        this.sort = command
        const temp = this.sentMsgData;
        this.sentMsgData = []
        for (let i = 0; i < temp.length; i++)
          this.sentMsgData[i] = temp[temp.length - i - 1]
      }
    }
  },
  mounted() {
    this.loading = true
    // 通过sessionStorage得到信息
    const data = JSON.parse(sessionStorage.getItem("sent"))
    const newData = data.sort((a, b) => {
      return a.sortDate - b.sortDate
    })
    this.sentMsgData = newData
    this.loading = false
  }
};
</script>

<style scoped>
.card {
  margin: 15px 5%;
  height: 130px;
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
<style>
.el-card__body {
  padding: 15px 20px;
}
/* 未读状态 */
.sentBadge {
  width: 100px
}
.sentBadge .el-badge__content {
  margin-top: 9px;
  line-height: 12px;
  background-color: #ccc;
}
</style>