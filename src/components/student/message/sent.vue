<template>
  <el-tabs tab-position="left" :style="{'max-height': this.wh - 230 + 'px', 'margin-top': '10px'}">
    <el-tab-pane style="font-size: 17px">
      <span slot="label">
        <i class="el-icon-share"></i> 简历分享
      </span>
      <!-- <el-dropdown @command="classifySwitch" style="cursor: pointer; margin: 10px 30px 0 71%">
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
      <el-dropdown @command="sortSwitch" style="cursor: pointer; margin: 10px 30px 0 80%">
        <span class="el-dropdown-link">
          排序方式 : {{sort}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="过期时间▼">过期时间▼</el-dropdown-item>
          <el-dropdown-item command="过期时间▲">过期时间▲</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        style="height: 150px"
        v-for="item in sentMsgData"
        v-bind:key="item.id"
        @click="goQuery()"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover" style="cursor: pointer;">
            <h5>请求公司: {{item.TargetCompanyCode}}</h5>
            <h5>应聘岗位: {{item.TargetJobID}}</h5>
            <h5>过期时间: {{new Date(+new Date(item.ExpireAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")}}</h5>
            <h5>
              状态: {{item.Read?"企业已读":"企业未读"}}
              <el-badge :hidden="item.Read" value="pending" class="sentBadge"></el-badge>
            </h5>
          </el-card>
        </el-col>
      </div>
      <el-divider v-if="sentMsgData.length !== 0" style="padding: 2%">没有更多啦~</el-divider>
      <el-empty :image-size="200" v-show="sentMsgData.length === 0" description="您还没有已发送的消息哦~"></el-empty>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      sort: "过期时间▲",
      classify: "无",
      sentMsgData: []// 
    };
  },
  props: ["wh"],
  methods: {
    classifySwitch(command) {
      this.classify = command;
    },
    sortSwitch(command) {
      if (command !== this.sort) {
        this.sort = command;
        const temp = this.sentMsgData;
        this.sentMsgData = [];
        for (let i = 0; i < temp.length; i++)
          this.sentMsgData[i] = temp[temp.length - i - 1];
      }
    }
  },
  created() {
    this.$emit("func2", true);
    this.axios({
      method: "post",
      url: "/share/lookupShareLinkForSelf",
      headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
      data: { "StaffID": JSON.parse(localStorage.getItem("jw_student_file")).staffID }
    }).then((response) => {
      const newData = response.data.data.sort((a, b) => {
        return new Date(a.ExpireAt) - new Date(b.ExpireAt);
      });
      this.sentMsgData = newData;
      this.$emit("func2", false);
    }).catch(() => {
      this.$message.error("获取已发送信息出错啦,请稍后再试");
      this.$emit("func2", false);
    });
  },
  mounted() {
    this.$nextTick(() => {
      document.querySelector(".el-tabs .el-tabs__content").style.height = this.wh - 230 + "px";
      document.querySelector(".el-tabs .el-tabs__header").style.height = this.wh - 230 + "px";
    });
  }
};
</script>

<style scoped>
.card {
  margin: 10px 2%;
  height: 130px;
  border-radius: 10px;
  width: 95%;
}
.card h5 {
  margin: 5px 0;
}
.card h5:first-child {
  margin: 0;
}
.el-card {
  height: 130px;
  border-radius: 5px;
  background-color: rgb(252, 252, 252);
}
</style>
<style>
.el-card__body {
  padding: 15px 20px;
}
/* 未读状态 */
.sentBadge {
  width: 100px;
}
.sentBadge .el-badge__content {
  line-height: 12px;
  background-color: #ccc;
}
</style>