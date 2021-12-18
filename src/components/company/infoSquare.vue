<template>
  <el-form
    class="form"
    ref="form"
    label-width="80px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{'max-height': this.wh - 105 + 'px', 'overflow': this.loading?'hidden':'auto'}"
  >
    <!-- <el-select
      v-model="conditions.UnitCode"
      filterable
      placeholder="学院名称"
      style="width: 190px; margin: 0 10px"
    >
      <el-option
        v-for="item in options[0].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="conditions.MajorCode" filterable placeholder="专业名称" style="width: 190px;">
      <el-option
        v-for="item in options[1].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select
      v-model="conditions.Sex"
      filterable
      placeholder="性别"
      style="width: 80px; margin: 0 10px"
    >
      <el-option
        v-for="item in options[2].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>-->
    <span>请选择筛选条件:</span>
    <el-button type="primary" @click="getInfo()" style="margin: 10px 0 0 10px">点击筛选</el-button>
    <el-button type="primary" plain @click="resetConditions()" style="margin-bottom: 10px">清空</el-button>
    <el-form class="coditions" label-width="110px">
      <el-form-item label="匹配规则">
        <el-radio-group v-model="method">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            v-for="item in options[7].children"
            :key="item.value"
            border
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="就读专业">
        <el-cascader
          placeholder="请选择"
          style="width: 190px; margin-left: 5px"
          filterable
          v-model="conditions.MajorCode"
          :options="options[0].children"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="GPA">
        <el-input
          style="width: 90px; margin-left: 5px"
          v-model="conditions.GPA[0]"
          placeholder="gpa下限"
        ></el-input>
        <el-input
          style="width: 90px; margin: 0 10px"
          v-model="conditions.GPA[1]"
          placeholder="gpa上限"
        ></el-input>
      </el-form-item>
      <el-form-item label="奖学金获得情况">
        <el-radio-group v-model="conditions.RewardLevel">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            border
            v-for="item in options[3].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="竞赛获奖情况">
        <el-radio-group v-model="conditions.RaceLevel">
          <el-radio
            style="margin: 0 5px"
            border
            :label="item.value"
            v-for="item in options[4].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="班团工作">
        <el-radio-group v-model="conditions.OrgLevel">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            border
            v-for="item in options[5].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="社会工作">
        <el-radio-group v-model="conditions.Social">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            border
            v-for="item in options[6].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item label="性别">
        <el-radio-group v-model="conditions.Sex">
          <el-radio
            style="margin: 0 5px"
            border
            :label="item.value"
            v-for="item in options[2].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-divider>
      <i class="el-icon-collection-tag">为您找到以下结果</i>
    </el-divider>
    <el-button
      style="float: right; margin-bottom: 10px"
      :disabled="selected.length === 0"
      type="primary"
      plain
      @click="askMore(0, { FileID: 0, Name: 'selected' });"
    >批量发送</el-button>
    <el-table
      v-show="exposeData.length !== 0"
      :data="exposeData"
      style="width: 100%; margin-top: 20px"
      border
      :default-sort="{prop: 'id', order: 'descending'}"
      :max-height="this.wh - 270"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="姓名" prop="Name" width="120px"></el-table-column>
      <el-table-column label="年级" prop="Grade" width="150px" sortable></el-table-column>
      <el-table-column label="学院" prop="UnitName"></el-table-column>
      <el-table-column label="专业" prop="MajorName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="askMore(scope.$index, scope.row)">请求详细简历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty :image-size="200" v-show="exposeData.length === 0"></el-empty>
    <el-dialog title="请填写您想详细了解的内容" :visible.sync="dialogFormVisible" style="width: 100%;">
      <el-form :model="form" label-width="100px">
        <el-form-item label="请求对象">
          <el-input style="width: 150px" disabled :placeholder="chossenName"></el-input>
        </el-form-item>
        <el-form-item label="其他请求描述" class="text">
          <el-alert v-show="template" type="info" style="width: 500px" :closable="false">
            【{{uname}}】亲爱的同学你好，
            <el-button
              style="margin-left: 180px"
              icon="el-icon-edit"
              circle
              @click="template = !template"
            ></el-button>
            <br />由于您的信息与我们岗位: 【
            <el-select style="width: 150px" v-model="form.FromJobID" filterable placeholder="请选择">
              <el-option
                v-for="item in jobList"
                :key="item.JobID"
                :label="item.Name"
                :value="item.JobID"
              ></el-option>
            </el-select>】的需求高度匹配，为进一步了解，诚邀您提供一份完整的简历。如有意向，请尽快登录学业分享系统分享完整版简历。如有任何问题，请联系HR，联系方式:
            <el-input v-model="form.Text" style="width: 150px;"></el-input>
          </el-alert>
          <el-input
            v-show="!template"
            type="textarea"
            v-model="form.Text"
            :rows="10"
            resize="none"
            show-word-limit
            maxlength="500"
            style="width: 400px;"
          ></el-input>
          <el-button
            v-show="!template"
            style="margin: 0 0 180px 10px"
            icon="el-icon-edit"
            circle
            @click="template = !template"
          ></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAsk()">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      template: true,
      exposeData: [],
      uname: "",
      loading: false,
      options: [{
        value: "UnitCode",
        label: "学院",
        children: []
      }, {
        value: "MajorCode",
        label: "专业",
        children: [
          { value: "", label: "不限" },
          { value: "0304", label: "管理科学与工程类" },
          { value: "0648", label: "生物医学工程" },
          { value: "1406", label: "会计学类" },
          { value: "2703", label: "网络空间安全专业" }
        ]
      }, {
        value: "Sex",
        label: "性别",
        children: [
          { value: "", label: "不限" },
          { value: "男", label: "男" },
          { value: "女", label: "女" }
        ]
      }, {
        value: "RewardLevel",
        label: "奖学金情况",
        children: [
          { value: "", label: "不限" },
          { value: "国家级", label: "获得过国家级奖学金" },
          { value: "省级", label: "获得过省级奖学金" },
          { value: "校级", label: "获得过校级奖学金" }
        ]
      }, {
        value: "RaceLevel",
        label: "竞赛获奖情况",
        children: [
          { value: "", label: "不限" },
          { value: "国家级及以上", label: "获得过国赛级奖项" },
          { value: "省部级", label: "获得过省赛级奖项" },
          { value: "校级", label: "获得过校赛级奖项" },
          { value: "院级", label: "获得过院赛级奖项" }
        ]
      }, {
        value: "OrgLevel",
        label: "班团工作",
        children: [
          { value: "", label: "不限" },
          { value: "校级", label: "曾任校级工作" },
          { value: "院级", label: "曾任院级工作" },
          { value: "班级", label: "曾任班级工作" }
        ]
      }, {
        value: "social",
        label: "社会工作",
        children: [
          { value: "", label: "不限" },
          { value: "1", label: "实习工作" }
        ]
      }, {
        value: "method",
        label: "各条件匹配规则",
        children: [
          { value: "must", label: "全部符合" },
          { value: "should", label: "满足一项及以上" }
        ]
      }],
      conditions: {
        GPA: [],
        MajorCode: "",
        UnitCode: "",
        Sex: "",
        OrgLevel: "",
        Social: "",
        RewardLevel: "",
        RaceLevel: "",
      },// 选择的条件
      method: "must",
      Predicates: [],// 要传给后端的筛选条件
      dialogFormVisible: false,
      form: {
        "ExposeFileID": "",
        "Text": "",
        "FromJobID": ""
      },
      chossenName: "",
      jobList: [],
      selected: []
    };
  },
  props: ["wh"],
  methods: {
    resetConditions() {
      this.conditions = {
        GPA: [],
        MajorCode: null,
        UnitCode: null,
        Sex: null,
        OrgLevel: null,
        Social: null,
        RaceLevel: null,
        RewardLevel: null,
        method: "must"
      };
    },
    resetForm() {
      this.form = {
        "ExposeFileID": "",
        "Text": "",
        "FromJobID": ""
      };
    },
    selectionChange(v) {
      for (let i = 0; i < v.length; i++)
        this.selected.push(v[i].FileID);
    },
    batchRequest() {
      this.loading = true;
      let methods = [];
      for (let i = 0; i < this.selected.length; i++) {
        methods.push(this.askRequest(this.selected[i]));
      }
      Promise.all(methods).then(() => {
        this.$message.success("已成功向求职者发送详细简历请求");
        this.resetForm();
        this.dialogFormVisible = false;
        this.loading = false;
      }).catch(() => {
        this.$message.error("请求详细简历出错啦,请稍后再试");
        this.loading = false;
      });
    },
    getInfo() {
      this.loading = true;
      this.exposeData = [];
      // 先根据conditions填好Predicates
      this.Predicates = [];
      const index = Object.keys(this.conditions);
      for (let i = 0; i < index.length; i++) {
        if (index[i] === "MajorCode" && this.conditions[index[i]][0] === "")
          continue;
        if (this.conditions[index[i]].length !== 0) {
          let path = [];
          let pre = {};
          switch (index[i]) {
            case "GPA":
              path = ["data_map", "rank", "*", "GPA"];
              pre = {
                "from": +this.conditions[index[i]][0],
                "to": +this.conditions[index[i]][1]
              };
              break;
            case "OrgLevel":
              path = ["data_map", "org_experience", "*", "OrgLevel"];
              pre = { "value": this.conditions[index[i]] };
              break;
            case "RaceLevel":
              path = ["data_map", "race_reward", "*", "RaceLevel"];
              pre = { "value": this.conditions[index[i]] };
              break;
            case "RewardLevel":
              path = ["data_map", "reward", "*", "RewardLevel"];
              pre = { "value": this.conditions[index[i]] };
              break;
            case "MajorCode":
              path = ["data_map", "profile", "*", "MajorCode"];
              pre = { "value": this.conditions[index[i]][1] };
              break;
            default:
              path = ["data_map", "profile", "*", index[i]];
              pre = { "value": this.conditions[index[i]] };
              break;
          }
          this.Predicates.push({
            "FieldPath": path,
            "RelationType": this.method,
            "NodeType": index[i] === "GPA" ? "range" : "match",
            "Predicate": pre
          });
        }
      }
      this.axios({
        method: "post",
        url: "/expose/search",
        data: { "Predicates": this.Predicates }
      }).then((response) => {
        if (response.data.data.Results.length === 0)
          return this.loading = false;
        const result = response.data.data.Results;
        for (let i = 0; i < result.length; i++) {
          // 把FileID也放进去
          let data = result[i].Source.data_map.profile[result[i].FileID];
          if (data.Name) {
            if (data.Name.length === 2)
              data.Name = data.Name.substr(0, 1) + "*";
            else {
              let name = data.Name.substr(0, 1);
              for (let i = 0; i < (data.Name.length - 2); i++)
                name += "*";
              data.Name = name + data.Name.substr(data.Name.length - 1);
            }
          }
          if (data.ClassCode)
            data.Grade = "20" + data.ClassCode.substr(0, 2);
          else
            data.Grade = "/";
          data.FileID = result[i].FileID;
          this.exposeData.push(data);
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取公开信息出错啦,请稍后再试");
        this.loading = false;
      });
    },
    askMore(index, row) {
      this.resetForm();
      this.form.ExposeFileID = row.FileID;
      this.chossenName = row.Name || "/";
      this.dialogFormVisible = true;
    },
    askRequest(FileID) {
      return new Promise((resolve, reject) => {
        this.axios({
          method: "post",
          url: "/share/addFurtherShareRequest",
          headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
          data: {
            "ExposeFileID": FileID,
            "Text": this.form.Text,
            "FromJobID": this.form.FromJobID
          }
        }).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    },
    sendAsk() {
      this.loading = true;
      if (this.template) {
        if (this.form.FromJobID === "")
          return this.$message.error("请选择岗位信息");
        let JobName = "";
        for (let i = 0; i < this.jobList.length; i++) {
          if (this.jobList[i].JobID === this.form.FromJobID) {
            JobName = this.jobList[i].Name;
            break;
          }
        }
        this.form.Text = "【" + this.uname + "】亲爱的同学你好，由于您的信息与我们岗位: 【" + JobName + "】的需求高度匹配，为进一步了解，诚邀您提供一份完整的简历。如有意向，请尽快登录学业分享系统分享完整版简历。如有任何问题，请联系HR，联系方式:" + this.form.Text;
      }
      if (this.chossenName === "selected")
        return this.batchRequest();
      this.axios({
        method: "post",
        url: "/share/addFurtherShareRequest",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: this.form
      }).then(() => {
        this.$message.success("已成功向该求职者发送详细简历请求");
        this.resetForm();
        this.dialogFormVisible = false;
        this.loading = false;
      }).catch(() => {
        this.$message.error("请求详细简历出错啦,请稍后再试");
        this.loading = false;
      });
    }
  },
  watch: {
    conditions: {
      handler() {
        this.getInfo();
      },
      deep: true
    },
    method: {
      handler() {
        this.getInfo();
      }
    }
  },
  mounted() {
    this.loading = true;
    this.uname = JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode;
    this.axios({
      method: "get",
      url: "/info/listMajor",
    }).then(response => {
      let units = {}, majors = [{ value: "", label: "不限" }], flag = 1;
      const data = response.data.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].UnitName in units) {
          majors[units[data[i].UnitName]].children.push({
            value: data[i].MajorCode,
            label: data[i].MajorName
          });
        }
        else {
          units[[data[i].UnitName]] = flag;
          majors.push({
            value: data[i].UnitCode,
            label: data[i].UnitName,
            children: [{
              value: data[i].MajorCode,
              label: data[i].MajorName
            }]
          });
          flag++;
        }
      }
      this.options[0].children = majors;
      this.axios({
        method: "post",
        url: "/job/lookup",
        data: { "CompanyCode": this.uname }
      }).then(response => {
        const type = Object.keys(response.data.data);
        for (let i = 0; i < type.length; i++)
          for (let j = 0; j < response.data.data[type[i]].length; j++)
            this.jobList.push(response.data.data[type[i]][j]);
        this.getInfo();
      }).catch(() => {
        this.$message.error("获取招聘信息出错啦,请稍后再试");
        this.loading = false;
      });
    });

  }
};
</script>

<style scoped>
.form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.coditions {
  padding: 20px;
  background-color: rgba(243, 243, 243, 0.541);
}
</style>
<style>
/* table里下拉菜单的样式表 */
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  margin-left: 20px;
}
.demo-table-expand .el-form-item {
  margin: 0;
  width: 50%;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-dialog__wrapper .el-dialog {
  /* margin: 90px 25%; */
  width: 40%;
  min-width: 740px;
}
.coditions .el-form-item {
  margin-bottom: 10px;
}
.form .el-loading-mask {
  height: 1000px;
}
.text .el-alert .el-alert__description {
  font-size: 14px;
}
</style>