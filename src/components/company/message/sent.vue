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
        <el-dropdown-item command="发送时间▼">发送时间▼</el-dropdown-item>
        <el-dropdown-item command="发送时间▲">发送时间▲</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="overflow: auto; padding-bottom: 10px">
      <div
        style="cursor: pointer;"
        v-for="item in sentMsgData"
        v-bind:key="item.id"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover">
            <!-- <el-link
              type="danger"
              style="float: right"
              @click.stop="deleteMsg(item.ShareLinkID, item.index)"
            >删除</el-link> -->
            <h5>发送时间: {{item.date}}</h5>
            <h5>请求内容: {{item.Text}}</h5>
            <!-- <el-badge :hidden="item.Read" value="new" class="badge">
              <h5>状态: {{item.Read?"已读":"未读"}}</h5>
            </el-badge> -->
          </el-card>
        </el-col>
      </div>
    </div>
    <el-empty v-show="sentMsgData.length === 0" :image-size="200" description="您还没有已发送的消息哦~"></el-empty>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      sort: "发送时间▼",
      classify: "无",
      sentMsgData: []
    };
  },
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
    },
    deleteMsg(ShareLinkID, index) {
      this.axios({
        method: "put",
        url: "/share/deleteShareLinkForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: { ShareLinkID }
      }).then(() => {
        this.sentMsgData.splice(index, 1);
        this.$emit("func", this.received - 1);
        sessionStorage.setItem("message", JSON.stringify(this.sentMsgData));
        this.$message.success("删除成功!");
      }).catch(() => {
        this.$message.error("删除信息出错啦,请稍后再试");
      });
    }
  },
  mounted() {
    this.loading = true;
    this.axios({
      method: "post",
      url: "/share/listFurtherShareRequestForCompany",
      headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
      data: {
        "TargetJobID": ""
      }
    }).then((response) => {
      const data = response.data.data;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
          data[i].sortDate = +new Date(data[i].CreatedAt);
          data[i].date = new Date(+new Date(data[i].CreatedAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
        }
        const newData = data.sort((a, b) => {
          return a.sortDate - b.sortDate;
        });
        this.sentMsgData = newData;
      }
    }).catch(() => {
      this.$message.error("获取信息出错啦,请稍后再试");
    });
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