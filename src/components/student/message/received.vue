<template>
  <el-tabs tab-position="left" :style="{'max-height': this.wh - 230 + 'px', 'margin-top': '10px'}">
    <el-tab-pane style="font-size: 17px">
      <span slot="label">
        <el-badge :value="request" :max="99" class="item" v-show="request !== 0"></el-badge>
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
          排序方式 : {{reqSort}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="请求时间▼">请求时间▼</el-dropdown-item>
          <el-dropdown-item command="请求时间▲">请求时间▲</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        style="height: 150px"
        v-for="item in requestMsgData"
        v-bind:key="item.id"
        @click="goQuery(item.CompanyCode, item.JobID, item.ID)"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover" style="cursor: pointer;">
            <h5>
              请求公司: {{item.CompanyCode}}
              <el-badge style="float: right" :hidden="item.Read" value="new" class="badge"></el-badge>
            </h5>
            <h5>请求时间: {{new Date(+new Date(item.CreatedAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")}}</h5>
            <h5>请求描述: {{item.Text}}</h5>
          </el-card>
        </el-col>
      </div>
      <el-divider v-if="requestMsgData.length !== 0" style="padding: 2%">没有更多啦~</el-divider>
      <el-empty
        :image-size="200"
        v-show="requestMsgData.length === 0"
        description="您还没有收到过宣讲会通知的消息哦~"
      ></el-empty>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <el-badge :value="notice" :max="99" class="item" v-show="notice !== 0"></el-badge>
        <i class="el-icon-data-analysis"></i> 宣讲会通知
      </span>
      <el-dropdown @command="sortSwitch" style="cursor: pointer; margin: 10px 30px 0 80%">
        <span class="el-dropdown-link">
          排序方式 : {{noticeSort}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="宣讲时间▼">宣讲时间▼</el-dropdown-item>
          <el-dropdown-item command="宣讲时间▲">宣讲时间▲</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        style="height: 150px"
        v-for="(item, index) in noticeMsgData"
        v-bind:key="item.id"
        @click="noticeRead(item.ID,index)"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover" style="cursor: pointer;">
            <h5>
              宣讲主题: {{item.Topic}}
              <el-badge style="float: right" :hidden="item.Read" value="new" class="badge"></el-badge>
            </h5>
            <!-- <h5>宣讲时间: {{new Date(+new Date(item.CreatedAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")}}</h5> -->
            <h5>宣讲时间: {{new Date(+new Date(item.StartAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")}}</h5>
            <h5>宣讲会描述: {{item.Detail}}</h5>
          </el-card>
        </el-col>
      </div>
      <el-divider v-if="noticeMsgData.length !== 0" style="padding: 2%">没有更多啦~</el-divider>
      <el-empty
        :image-size="200"
        v-show="noticeMsgData.length === 0"
        description="您还没有收到过宣讲会通知的消息哦~"
      ></el-empty>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-setting"></i> 消息设置
      </span>
      <el-form>
        <h5 style="font-size: 16px; margin-bottom: 10px;">消息刷新频率（消息收件箱刷新的间隔时间）</h5>
        <el-form-item>
          <el-radio-group v-model="reqFrequency" @change="freChange">
            <el-radio
              style="margin: 0 5px"
              border
              :label="item.value"
              v-for="item in freOptions"
              :key="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider style="margin: 0"></el-divider>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      reqSort: "请求时间▼",
      noticeSort: "宣讲时间▼",
      classify: "无",
      requestMsgData: [],
      noticeMsgData: [],
      notice: 0,
      request: 0,
      freOptions: [
        { value: 0, label: "关闭" },
        { value: 180, label: "3分钟" },
        { value: 300, label: "5分钟" },
        { value: 600, label: "10分钟" },
      ],
      reqFrequency: 300
    };
  },
  props: ["wh", "frequency"],
  methods: {
    classifySwitch(command) {
      this.classify = command;
    },
    freChange(v) {
      this.$emit("func3", v);
    },
    sortSwitch(command) {
      if (command !== this.sort) {
        this.reqSort = command;
        const temp = this.requestMsgData;
        this.requestMsgData = [];
        for (let i = 0; i < temp.length; i++)
          this.requestMsgData[i] = temp[temp.length - i - 1];
      }
    },
    goQuery(CompanyCode, JobID, ID) {
      this.axios({
        method: "put",
        url: "/share/markFurtherShareRequestRead",
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: { "ID": ID }
      }).then(() => {
        if (this.request !== 0)
          this.request--;
        this.$emit("func", this.request + this.notice);
        sessionStorage.setItem("com", JSON.stringify({
          CompanyCode,
          Name: "",
          job: "",
          JobID
        }));
        this.$router.push("/infoShare");
      }).catch(() => {
        this.$message.error("状态更改出错啦,请稍后再试");
      });
    },
    noticeRead(ID, index) {
      this.axios({
        method: "put",
        url: "/campusTalk/markCampusTalkRead",
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: { "ID": ID }
      }).then(() => {
        if (this.notice !== 0)
          this.notice--;
        this.$emit("func", this.request + this.notice);
        this.noticeMsgData[index].Read = true;
      }).catch(() => {
        this.$message.error("状态更改出错啦,请稍后再试");
      });
    }
  },
  created() {
    this.$emit("func2", true);
    this.axios({
      method: "post",
      url: "/share/listFurtherShareRequestForReceiver",
      headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
      data: { "student": "any" }
    }).then((response) => {
      this.request = 0;
      const data = response.data.data;
      const newData = data.sort((a, b) => {
        return new Date(b.CreatedAt) - new Date(a.CreatedAt);
      });
      let readed = [], unReaded = [];
      for (let i = 0; i < newData.length; i++) {
        if (!newData[i].Read) {
          this.request++;
          unReaded.push(newData[i]);
          continue;
        }
        readed.push(newData[i]);
      }
      this.requestMsgData = [...unReaded, ...readed];
      return this.axios({
        method: "get",
        url: "/campusTalk/lookupForSelf",
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: { "StaffID": JSON.parse(localStorage.getItem("jw_student_file")).staffID }
      });
    }).then((response) => {
      this.notice = 0;
      const data = response.data.data;
      const newData = data.sort((a, b) => {
        return new Date(b.StartAt) - new Date(a.StartAt);
      });
      let readed = [], unReaded = [];
      for (let i = 0; i < newData.length; i++) {
        if (!newData[i].Read) {
          this.notice++;
          unReaded.push(newData[i]);
          continue;
        }
        readed.push(newData[i]);
      }
      this.noticeMsgData = [...unReaded, ...readed];
      this.$emit("func2", false);
      this.$emit("func", this.request + this.notice);
    }).catch(() => {
      this.$message.error("获取站内信息出错啦,请稍后再试");
      this.$emit("func2", false);
    });
  },
  mounted() {
    this.reqFrequency = this.frequency;
    this.$nextTick(() => {
      document.querySelector(".el-tabs .el-tabs__content").style.height = this.wh - 230 + "px";
      document.querySelector(".el-tabs .el-tabs__header").style.height = this.wh - 230 + "px";
    });
  }
};
</script>

<style scoped>
.el-form {
  padding: 20px;
}
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
.item {
  margin-top: -2px;
  margin-right: 3px;
  padding-top: 8px;
}
</style>
<style>
/* 未读状态 */
.badge {
  width: 50px;
}
.badge .el-badge__content {
  line-height: 12px;
}
.el-tabs .el-tabs__content {
  overflow: auto;
}
.el-tabs .el-tabs__item {
  font-size: 16px;
  width: 180px;
}
.el-tabs #tab-2 {
  border-top: 1px solid #ccc;
}
.el-tabs .el-divider--horizontal {
  width: 95%;
  margin-left: 2%;
}
.el-tabs .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>