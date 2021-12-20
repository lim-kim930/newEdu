<template>
  <div v-loading="loading">
    <el-dropdown @command="classifySwitch" style="cursor: pointer; margin: 10px 30px 10px 71%">
      <span class="el-dropdown-link">
        分类依据 : {{classify}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="无">无</el-dropdown-item>
        <el-dropdown-item command="学校">学校</el-dropdown-item>
        <el-dropdown-item command="应聘岗位">应聘岗位</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="sortSwitch" style="cursor: pointer; margin: 10px 0">
      <span class="el-dropdown-link">
        排序方式 : {{sort}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="过期时间▼">过期时间▼</el-dropdown-item>
        <el-dropdown-item command="过期时间▲">过期时间▲</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="overflow: auto; padding-bottom: 10px">
      <div
        style="cursor: pointer;"
        v-for="item in receivedMsgData"
        v-bind:key="item.id"
        @click="goQuery(item.url)"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover">
            <el-link
              type="danger"
              style="float: right"
              @click.stop="deleteMsg(item.ShareLinkID, item.index)"
            >删除</el-link>
            <h5>就读学校: {{item.SchoolCode}}</h5>
            <h5>就读专业: {{item.MajorName}}</h5>
            <h5>应聘岗位: {{item.TargetJob}}</h5>
            <h5>过期时间: {{item.date}}</h5>
            <el-badge :hidden="item.Read" value="new" class="badge">
              <h5>状态: {{item.Read?"已读":"未读"}}</h5>
            </el-badge>
          </el-card>
        </el-col>
      </div>
    </div>
    <el-empty v-show="receivedMsgData.length === 0" :image-size="200" description="您还没有收到的消息哦~"></el-empty>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      sort: "过期时间▼",
      classify: "无",
      receivedMsgData: []
    };
  },
  props: ["received"],
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
    goQuery(url) {
      this.$router.push({
        path: "/queryInfo",
        query: { url }
      });
    },
    deleteMsg(ShareLinkID, index) {
      this.axios({
        method: "put",
        url: "/share/deleteShareLinkForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: { ShareLinkID }
      }).then(() => {
        this.receivedMsgData.splice(index, 1);
        this.$emit("func", this.received - 1);
        sessionStorage.setItem("message", JSON.stringify(this.receivedMsgData));
        this.$message.success("删除成功!");
      }).catch(() => {
        this.$message.error("删除信息出错啦,请稍后再试");
      });
    }
  },
  mounted() {
    this.loading = true;
    // 通过sessionStorage得到信息
    const data = JSON.parse(sessionStorage.getItem("message"));
    if (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
        data[i].sortDate = +new Date(data[i].ExpireAt);
        data[i].date = new Date(+new Date(data[i].ExpireAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
        data[i].url = "/share/verify?fileID=" + data[i].FileID + "&encryptedK1S=" + data[i].EncryptedK1S;
      }
      const newData = data.sort((a, b) => {
        return a.sortDate - b.sortDate;
      });
      this.receivedMsgData = newData;
    }
    this.loading = false;
  }
};
</script>

<style scoped>
.card {
  margin: 15px 5%;
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
  height: 140px;
  border-radius: 10px;
}
</style>
<style>
.el-card__body {
  padding: 15px 20px;
}
/* 未读状态 */
.badge {
  width: 73px;
}
.badge .el-badge__content {
  margin-top: 8px;
  line-height: 12px;
}
</style>
