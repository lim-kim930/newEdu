<template>
  <el-tabs tab-position="left" :style="{'max-height': this.wh - 230 + 'px', 'margin-top': '10px'}">
    <el-tab-pane style="font-size: 17px">
      <span slot="label">
        <i class="el-icon-tickets"></i> 简历请求
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
          <el-dropdown-item command="发送时间▼">发送时间▼</el-dropdown-item>
          <el-dropdown-item command="发送时间▲">发送时间▲</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div style="cursor: pointer; height: 150px" v-for="item in reqMsgData" v-bind:key="item.id">
        <el-col :span="8" class="card">
          <el-card shadow="hover">
            <h5>发送时间: {{item.date}}</h5>
            <h5>请求内容: {{item.Text}}</h5>
          </el-card>
        </el-col>
      </div>
      <el-divider v-if="reqMsgData.length !== 0" style="padding: 2%">没有更多啦~</el-divider>
      <el-empty v-show="reqMsgData.length === 0" :image-size="200" description="您还没有发送过简历请求哦~"></el-empty>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-data-analysis"></i> 宣讲会通知
      </span>
      <el-dropdown @command="sortSwitch" style="cursor: pointer; margin: 10px 30px 0 80%">
        <span class="el-dropdown-link">
          排序方式 : {{sort}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="发送时间▼">发送时间▼</el-dropdown-item>
          <el-dropdown-item command="发送时间▲">发送时间▲</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        style="cursor: pointer; height: 150px"
        v-for="item in noticeMsgData"
        v-bind:key="item.id"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover">
            <h5>宣讲会主题: {{item.Topic}}</h5>
            <h5>宣讲时间: {{new Date(+new Date(item.StartAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")}}</h5>
            <h5>宣讲会描述: {{item.Detail}}</h5>
          </el-card>
        </el-col>
      </div>
      <el-divider v-if="noticeMsgData.length !== 0" style="padding: 2%">没有更多啦~</el-divider>
      <el-empty :image-size="200" v-show="noticeMsgData.length === 0" description="您还没有发送过宣讲会通知哦~"></el-empty>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      sort: "发送时间▼",
      classify: "无",
      reqMsgData: [],
      noticeMsgData: []
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
        const temp = this.reqMsgData;
        this.reqMsgData = [];
        for (let i = 0; i < temp.length; i++)
          this.reqMsgData[i] = temp[temp.length - i - 1];
      }
    },
  },
  created() {
    this.$emit("func2", true);
    this.axios({
      method: "post",
      url: "/share/listFurtherShareRequestForCompany",
      headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
      data: { "TargetJobID": "" }
    }).then((response) => {
      const data = response.data.data;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].date = new Date(+new Date(data[i].CreatedAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
        }
        const newData = data.sort((a, b) => {
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        });
        this.reqMsgData = newData;
      }
      return this.axios({
        method: "get",
        url: "/campusTalk/lookupForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
      });
    }).then((response) => {
      const data = response.data.data;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].date = new Date(+new Date(data[i].StartAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
        }
        const newData = data.sort((a, b) => {
          return new Date(b.StartAt) - new Date(a.StartAt);
        });
        this.noticeMsgData = newData;
      }
      this.$emit("func2", false);
    }).catch(() => {
      this.$message.error("获取信息出错啦,请稍后再试");
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
  border-radius: 5px;
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
.item {
  margin-top: -2px;
  margin-right: 3px;
  padding-top: 7px;
}
</style>