<template>
  <el-form
    class="form loadingForm"
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
    <el-collapse @change="collapse" value="1">
      <el-collapse-item name="1">
        <template slot="title">
          <span style="font-size: 16px">请选择筛选条件:</span>
          <el-button type="primary" @click.stop="getInfo()" style="margin: 0 0 0 10px">点击筛选</el-button>
          <el-button type="primary" plain @click.stop="resetConditions()" style>清空</el-button>
          <span style="width: 50%; text-align: center">{{"点击" + title + "条件"}}</span>
        </template>
        <el-form class="coditions" label-width="110px" style="user-select: none;">
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
          <el-form-item label="意向岗位">
            <el-cascader
              placeholder="请选择"
              style="width: 190px; margin-left: 5px"
              filterable
              v-model="conditions.JobTypeIntent"
              :options="options[8].children"
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
          <el-form-item label="班团经历">
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
      </el-collapse-item>
    </el-collapse>
    <el-divider>
      <i class="el-icon-collection-tag">为您找到以下结果</i>
    </el-divider>
    <el-button
      style="float: right; margin-bottom: 10px"
      :disabled="selectedFileID.length === 0"
      type="primary"
      plain
      @click="askMore(0, { FileID: 0, Name: 'selected' });"
    >批量发送简历请求</el-button>
    <el-button
      style="float: right; margin: 0 10px 10px 10px"
      :disabled="selectedFileID.length === 0"
      type="primary"
      plain
      @click="editNotice(0, { FileID: 0, Name: 'selected' });"
    >批量发送通知</el-button>
    <el-table
      v-show="exposeData.length !== 0"
      style="width: 100%; margin-top: 20px"
      border
      :data="exposeData.slice(page*parseInt((wh - 440)/53), (page+1)*parseInt((wh - 440)/53))"
      :default-sort="{prop: 'id', order: 'descending'}"
      :max-height="this.wh - 270"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="姓名" prop="Name" width="120px"></el-table-column>
      <el-table-column
        label="年级"
        prop="Grade"
        width="150px"
        :filters="[{text: '2017', value: '2017'},{text: '2018', value: '2018'},{text: '2019', value: '2019'},{text: '2020', value: '2020'},{text: '2021', value: '2021'},{text: '2022', value: '2022'}]"
        :filter-method="filterHandler"
      ></el-table-column>
      <el-table-column label="学院" prop="UnitName"></el-table-column>
      <el-table-column label="专业" prop="MajorName"></el-table-column>
      <el-table-column label="发送">
        <template slot-scope="scope">
          <el-button size="mini" @click="askMore(scope.$index, scope.row)">详细简历请求</el-button>
          <el-button size="mini" @click="editNotice(scope.$index, scope.row)">宣讲会通知</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="currentChange"
      :page-size="parseInt((this.wh - 440)/53)"
      :pager-count="9"
      layout="prev, pager, next"
      :total="total"
      style="margin: 10px 0"
    ></el-pagination>
    <el-empty :image-size="200" v-show="exposeData.length === 0"></el-empty>
    <el-dialog title="请填写您想详细了解的内容" :visible.sync="reqDialogVisible" style="width: 100%;">
      <el-form label-width="100px">
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
            <el-select
              style="width: 150px"
              v-model="reqForm.FromJobID"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in jobList"
                :key="item.JobID"
                :label="item.Name"
                :value="item.JobID"
              ></el-option>
            </el-select>】的需求高度匹配，为进一步了解，诚邀您提供一份完整的简历。如有意向，请尽快登录学业分享系统分享完整版简历。如有任何问题，请联系HR，联系方式:
            <el-input v-model="reqForm.Text" style="width: 150px;"></el-input>
          </el-alert>
          <el-select
            v-show="!template"
            style="width: 150px"
            v-model="reqForm.FromJobID"
            filterable
            placeholder="请选择符合岗位"
          >
            <el-option
              v-for="item in jobList"
              :key="item.JobID"
              :label="item.Name"
              :value="item.JobID"
            ></el-option>
          </el-select>
          <br />
          <el-input
            v-show="!template"
            type="textarea"
            v-model="reqForm.Text"
            :rows="10"
            resize="none"
            show-word-limit
            maxlength="500"
            style="width: 400px; margin-top: 10px"
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
        <el-button @click="reqDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAsk()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请填写宣讲会相关信息" :visible.sync="noticeDialogVisible" style="width: 100%;">
      <el-form label-width="100px">
        <el-form-item label="发送对象">
          <el-input style="width: 150px" disabled :placeholder="chossenName"></el-input>
        </el-form-item>
        <el-form-item label="宣讲会主题">
          <el-input style="width: 200px" v-model="noticeForm.Topic" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="宣讲时间" class="text">
          <el-date-picker
            v-model="noticeForm.StartAt"
            :picker-options="pickerOptions"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="其他细节">
          <el-input
            type="textarea"
            v-model="noticeForm.Detail"
            :rows="10"
            resize="none"
            show-word-limit
            maxlength="500"
            placeholder="请填写宣讲会地点、形式等其他细节内容"
            style="width: 400px; margin-top: 10px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noticeDialogVisible =  false">取 消</el-button>
        <el-button type="primary" @click="sendNotice()">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      total: 0,
      page: 0,
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
        label: "班团经历",
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
          { value: "1", label: "实习经历" }
        ]
      }, {
        value: "method",
        label: "各条件匹配规则",
        children: [
          { value: "must", label: "全部符合" },
          { value: "should", label: "满足一项及以上" }
        ]
      }, {
        value: "JobTypeIntent",
        label: "意向职位",
        children: [
          {
            value: "不限",
            label: "不限",
          }, {
            value: "IT互联网",
            label: "IT互联网",
            children: []
          }, {
            value: "会计管理",
            label: "会计管理",
            children: []
          }, {
            value: "设计制造",
            label: "设计制造",
            children: []
          }, {
            value: "其他",
            label: "其他",
            children: []
          },
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
      title: "收起",
      translation: [{
        name: "不限",
        value: ["不限"]
      }, {
        name: "IT互联网",
        value: ["编程/IT开发", "测试", "IT运维", "通信工程", "数字多媒体", "产品", "运营"]
      }, {
        name: "会计管理",
        value: ["财务/会计", "金融", "审计", "出纳", "采购", "行政", "人力资源", "贸易/进出口", "质量管理", "项目管理", "项目实施"]
      }, {
        name: "设计制造",
        value: ["工业设计", "工程设计", "平面设计", "室内设计", "生产/制造"]
      }, {
        name: "其他",
        value: ["法务", "科研", "销售", "教师", "翻译", "编辑/文案", "培训", "其他"]
      }],
      method: "must",
      Predicates: [],// 要传给后端的筛选条件
      reqDialogVisible: false,
      noticeDialogVisible: false,
      reqForm: {
        "ExposeFileID": "",
        "Text": "",
        "FromJobID": ""
      },
      noticeForm: {
        "Topic": "",
        "SchoolCode": "",
        "StaffIDs": [],
        "StartAt": "",
        "Detail": ""
      },
      chossenName: "",
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < Date.now();
        }
      },
      jobList: [],
      selectedFileID: []
    };
  },
  props: ["wh"],
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    currentChange(v) {
      this.page = v - 1;
    },
    collapse(v) {
      this.title = v.length === 0 ? "展开" : "收起";
    },
    resetConditions() {
      this.conditions = {
        GPA: [],
        MajorCode: "",
        UnitCode: "",
        Sex: "",
        OrgLevel: "",
        Social: "",
        RewardLevel: "",
        RaceLevel: "",
      };
    },
    resetReqForm() {
      this.reqForm = {
        "ExposeFileID": "",
        "Text": "",
        "FromJobID": ""
      };
    },
    resetNoticeForm() {
      this.noticeForm = {
        "Topic": "",
        "SchoolCode": "",
        "StaffIDs": [],
        "StartAt": "",
        "Detail": ""
      };
    },
    selectionChange(v) {
      this.selectedFileID = [];
      this.noticeForm.StaffIDs = [];
      for (let i = 0; i < v.length; i++) {
        this.selectedFileID.push(v[i].FileID);
        this.noticeForm.StaffIDs.push(v[i].StaffID);
      }
    },
    batchRequest() {
      this.loading = true;
      let methods = [];
      for (let i = 0; i < this.selectedFileID.length; i++) {
        methods.push(this.askRequest(this.selectedFileID[i]));
      }
      Promise.all(methods).then(() => {
        this.$message.success("已成功向求职者发送详细简历请求");
        this.resetReqForm();
        this.reqDialogVisible = false;
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
              path = ["data_map", "race_reward", "*", "RaceLevel.keyword"];
              pre = { "value": this.conditions[index[i]] };
              break;
            case "RewardLevel":
              path = ["data_map", "reward", "*", "RewardLevel.keyword"];
              pre = { "value": this.conditions[index[i]] };
              break;
            case "MajorCode":
              path = ["data_map", "profile", "*", "MajorCode"];
              pre = { "value": this.conditions[index[i]][1] };
              break;
            case "JobTypeIntent":
              path = ["data_map", "career_intent", "*", "JobTypeIntent"];
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
        this.total = 0;
        if (response.data.data.Results.length === 0)
          return this.loading = false;
        const result = response.data.data.Results;
        for (let i = 0; i < result.length; i++) {
          this.total++;
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
      this.resetReqForm();
      this.reqForm.ExposeFileID = row.FileID;
      this.chossenName = row.Name || "/";
      this.reqDialogVisible = true;
    },
    editNotice(index, row) {
      if (row.StaffID)
        this.noticeForm.StaffIDs = [row.StaffID];
      else {
        const StaffIDs = this.noticeForm.StaffIDs;
        this.resetNoticeForm();
        this.noticeForm.StaffIDs = StaffIDs;
      }
      this.noticeForm.SchoolCode = "1";
      this.chossenName = row.Name || "/";
      this.noticeDialogVisible = true;
    },
    sendNotice() {
      if (this.noticeForm.Topic === "")
        return this.$message.error("请填写宣讲会主题");
      if (this.noticeForm.StartAt === "")
        return this.$message.error("请选择宣讲时间");
      this.loading = true;
      const date = new Date(+new Date(this.noticeForm.StartAt) + 8 * 3600 * 1000);
      console.log(date);
      this.noticeForm.StartAt = date.toISOString().split(".")[0] + "+08:00";
      this.axios({
        method: "post",
        url: "/campusTalk/publish",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: this.noticeForm
      }).then(() => {
        this.$message.success("已成功发送宣讲会通知");
        this.resetNoticeForm();
        this.noticeDialogVisible = false;
        this.loading = false;
      }).catch(() => {
        this.$message.error("发送宣讲会通知出错啦,请稍后再试");
        this.loading = false;
      });
    },
    askRequest(FileID) {
      return new Promise((resolve, reject) => {
        this.axios({
          method: "post",
          url: "/share/addFurtherShareRequest",
          headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
          data: {
            "ExposeFileID": FileID,
            "Text": this.reqForm.Text,
            "FromJobID": this.reqForm.FromJobID
          }
        }).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    },
    sendAsk() {
      if (this.reqForm.FromJobID === "")
        return this.$message.error("请选择岗位信息");
      this.loading = true;
      if (this.template) {
        let JobName = "";
        for (let i = 0; i < this.jobList.length; i++) {
          if (this.jobList[i].JobID === this.reqForm.FromJobID) {
            JobName = this.jobList[i].Name;
            break;
          }
        }
        this.reqForm.Text = "【" + this.uname + "】亲爱的同学你好，由于您的信息与我们岗位: 【" + JobName + "】的需求高度匹配，为进一步了解，诚邀您提供一份完整的简历。如有意向，请尽快登录学业分享系统分享完整版简历。如有任何问题，请联系HR，联系方式:" + this.reqForm.Text;
      }
      if (this.chossenName === "selected")
        return this.batchRequest();
      this.axios({
        method: "post",
        url: "/share/addFurtherShareRequest",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: this.reqForm
      }).then(() => {
        this.$message.success("已成功发送详细简历请求");
        this.resetReqForm();
        this.reqDialogVisible = false;
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
      return;
    }).then(() => {
      return this.axios({
        method: "post",
        url: "/job/lookup",
        data: { "CompanyCode": this.uname }
      });
    }).then(response => {
      const type = Object.keys(response.data.data);
      for (let i = 0; i < type.length; i++)
        for (let j = 0; j < response.data.data[type[i]].length; j++)
          this.jobList.push(response.data.data[type[i]][j]);
      return this.axios({
        method: "get",
        url: "/job/type/list"
      });
    }).then((response) => {
      const data = response.data.data;
      let other = null;
      // this.options[8].children = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 1; j < 5; j++) {
          if (this.translation[j].value.indexOf(data[i].Name) !== -1) {
            this.options[8].children[j].children.push({
              value: data[i].JobTypeCode,
              label: data[i].Name
            });
          }
        }
      }
      if (other)
        this.jobOpitions[4].push(other);
      this.getInfo();
    }).catch(() => {
      this.$message.error("获取筛选条件失败啦,请稍后重试");
      this.loading = false;
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
.el-collapse {
  border: none;
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
.loadingForm .el-loading-mask {
  height: 1000px;
}
.text .el-alert .el-alert__description {
  font-size: 14px;
}
.form .el-collapse-item__wrap,
.form .el-collapse-item__header {
  border: none;
}
</style>