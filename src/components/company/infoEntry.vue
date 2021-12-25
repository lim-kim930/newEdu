<template>
  <div v-loading="loading" element-loading-text="拼命加载中" style="margin: 10px; border-radius: 10px;">
    <div class="list" v-show="step === 0" :style="{'max-height': this.wh - 105 + 'px'}">
      <span
        style="font-size: 18px; font-weight: 700; display: inline-block; margin-bottom: 20px"
      >当前已录入的招聘信息</span>
      <el-button
        type="primary"
        style="float: right; margin-bottom: 10px"
        icon="el-icon-plus"
        @click="next()"
      >添加招聘岗位</el-button>
      <el-empty :image-size="200" description="还没有发布过招聘岗位~" v-show="jobList.length === 0"></el-empty>
      <el-table
        v-show="jobList.length !== 0"
        :data="jobList"
        class="job"
        border
        :max-height="this.wh - 240"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="岗位名称:">
                <span>{{ props.row.Name }}</span>
              </el-form-item>
              <el-form-item label="岗位大类:">
                <span>{{ props.row.JobType.Name }}</span>
              </el-form-item>
              <el-form-item label="招聘人数:">
                <span>{{ props.row.RecruitCount }}</span>
              </el-form-item>
              <el-form-item label="工作地点:">
                <span>{{ props.row.WorkLocation }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ props.row.CreatedAt }}</span>
              </el-form-item>
              <el-form-item label="薪资类型:">
                <span>{{ props.row.SalaryMode + (props.row.SalaryCount?(" - " + props.row.SalaryCount + "薪"):"") }}</span>
              </el-form-item>
              <el-form-item label="最低薪资:" v-if="props.row.SalaryMode !== '面议'">
                <span>{{ props.row.MinSalary }}</span>
              </el-form-item>
              <el-form-item label="最高薪资:" v-if="props.row.SalaryMode !== '面议'">
                <span>{{ props.row.MaxSalary }}</span>
              </el-form-item>
              <el-form-item label="岗位描述:">
                <span style="display: inline-block;">{{ props.row.Description }}</span>
              </el-form-item>
              <el-form-item label="岗位要求:">
                <span style="display: inline-block;">{{ props.row.Requirement }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="岗位名称" prop="Name" width="500"></el-table-column>
        <el-table-column
          label="岗位大类"
          prop="JobType.Name"
          :filters="jobTypeFilter"
          :filter-method="filterHandler"
        ></el-table-column>
        <el-table-column label="招聘人数" prop="RecruitCount" width="130"></el-table-column>
        <el-table-column
          label="工作地点"
          prop="WorkLocation"
          width="160"
          :filters="locationFilter"
          :filter-method="filterHandler"
        ></el-table-column>
        <el-table-column label="创建时间" prop="CreatedAt" sortable></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button plain type="danger" size="mini" @click="deleteJob(scope.row.JobID)">删除岗位</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="entry" v-show="step === 1">
      <el-form
        class="form"
        :model="form"
        :rules="rules"
        label-width="90px"
        :style="{'max-height': this.wh - 105 + 'px'}"
      >
        <span
          style="font-size: 18px; font-weight: 700; display: inline-block; margin-bottom: 20px"
        >请录入要发布的的招聘信息，以便学生快速了解</span>
        <el-button
          type="primary"
          plain
          style="float: right; margin-bottom: 10px"
          @click="getJobInfo()"
        >返回查看</el-button>
        <el-form-item label="企业名称">
          <el-input style="width: 150px" disabled :placeholder="nameHolder"></el-input>
        </el-form-item>
        <el-form-item label="职位类别">
          <el-form-item
            class="type"
            :label="item.name"
            v-for="(item, index) in translation"
            v-bind:key="item.name"
          >
            <el-radio-group v-model="form.type">
              <el-radio
                :label="item.Name"
                name="type"
                v-for="item in typeOptions[index]"
                v-bind:key="item.id"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input v-model="form.name" style="width: 200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="招聘人数" prop="num">
          <el-input
            v-model.number="form.num"
            type="number"
            style="width: 200px;"
            min="1"
            max="9999"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位描述">
          <el-input
            type="textarea"
            v-model="form.jobDesc"
            :rows="4"
            resize="none"
            show-word-limit
            maxlength="500"
            style="width: 400px;"
          ></el-input>
        </el-form-item>
        <!-- :label="item + '的岗位要求'" v-for="item in form.type" v-bind:key="item.id" -->
        <el-form-item label="岗位要求">
          <el-input
            type="textarea"
            v-model="form.jobReq"
            :rows="7"
            resize="none"
            show-word-limit
            maxlength="1500"
            style="width: 400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-cascader v-model="form.location" :options="locations"></el-cascader>
        </el-form-item>
        <el-form-item label="薪资类型">
          <el-select
            style="width: 150px; margin-right: 20px"
            v-model="form.SalaryMode"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            style="width: 120px"
            v-show="form.SalaryMode === '年薪' || form.SalaryMode === '月薪'"
            v-model="form.SalaryCount"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="薪资范围"
          v-show="form.SalaryMode === '年薪' || form.SalaryMode === '月薪'"
          prop="salary"
        >
          <el-input
            style="width: 100px"
            type="number"
            min="1"
            max="1000"
            v-model.number="form.salary[0]"
            placeholder="请填写"
          ></el-input>&nbsp;k ~
          <el-input
            style="width: 100px"
            type="number"
            min="1"
            max="1000"
            v-model.number="form.salary[1]"
            placeholder="请填写"
          ></el-input>&nbsp;k
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="margin-top: 20px">点击录入</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { provinceAndCityData, CodeToText } from "element-china-area-data";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      console.log(value);
      console.log(!isNaN(value));
      if (isNaN(value) || value <= 0 || value > 1000) {
        this.form.num = "";
        callback(new Error('请输入合法数字'));
      }
    };
    const validateSalary = (rule, value, callback) => {
      if (isNaN(value[0]) || value[0] <= 0 || value[0] > 1000) {
        this.form.salary[0] = 10;
        callback(new Error('请输入合法数字'));
      }
      if (isNaN(value[1]) || value[1] <= 0 || value[1] > 1000) {
        this.form.salary[1] = 20;
        callback(new Error('请输入合法数字'));
      }
    };
    return {
      step: 0,// 切换展示和添加两个页面
      nameHolder: JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode,// 添加企业时,企业名称输入框的placeholder
      loading: false,
      form: {
        name: "",
        type: "",
        salary: [10, 20],
        SalaryMode: "",
        location: [],
        jobDesc: "",
        num: "",
        jobReq: ""
      },
      jobTypeFilter: [],
      locationFilter: [],
      rules: {
        num: [
          { validator: validateNum, trigger: 'blur' }
        ],
        salary: [
          { validator: validateSalary, trigger: 'blur' }
        ]
      },
      options: [{
        value: '年薪',
        label: '年薪'
      }, {
        value: '月薪',
        label: '月薪'
      }, {
        value: '面议',
        label: '面议'
      }],
      options2: [{
        value: 12,
        label: '12薪'
      }, {
        value: 13,
        label: '13薪'
      }, {
        value: 14,
        label: '14薪'
      }, {
        value: 15,
        label: '15薪'
      }, {
        value: 16,
        label: '16薪'
      }, {
        value: 17,
        label: '17薪'
      }, {
        value: 18,
        label: '18薪'
      }, {
        value: 19,
        label: '19薪'
      }, {
        value: 20,
        label: '20薪'
      }],
      translation: [{
        name: "不限",
        value: ["不限"]
      }, {
        name: "IT互联网",
        value: ["编程/IT开发", "测试", "IT运维", "通信工程", "数字多媒体", "产品", "运营"]
      }, {
        name: "会计管理",
        value: ["财务/会计", "金融", "审计", "出纳", "采购", "行政", "人力资源", "贸易/进出口", "质量管理", "项目管理", "项目实施", "管培生"]
      }, {
        name: "设计制造",
        value: ["工业设计", "工程设计", "平面设计", "室内设计", "生产/制造"]
      }, {
        name: "其他",
        value: ["法务", "科研", "销售", "教师", "翻译", "编辑/文案", "培训", "其他"]
      }],
      jobList: [],// 发布的岗位数据
      locations: [],
      typeOptions: [[], [], [], [], []],// 职位类别选项
      marks: {
        0: "0k",
        10: "10k",
        20: "20k",
        30: "30k",
        40: "40k",
        50: "50k"
      }
    };
  },
  props: ["wh"],
  methods: {
    resetForm() {
      this.form = {
        name: "",
        type: "",
        salary: [10, 20],
        location: "",
        jobDesc: "",
        num: "",
        jobReq: ""
      };
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      if (property === "JobType.Name")
        return row.JobType.Name === value;
      else
        return row[property] === value;
    },
    deleteJob(row) {
      this.$confirm("删除该招聘信息后,求职者将无法再看到,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "put",
          url: "/job/delete",
          headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
          data: { "JobID": row }
        }).then(() => {
          this.$message.success("岗位删除成功!");
          this.getJobInfo();
        }).catch(() => {
          this.$message.error("删除岗位出错啦,请稍后再试");
          this.loading = false;
        });
      });
    },
    getJobInfo() {
      this.jobTypeFilter = [];
      this.locationFilter = [];
      this.jobList = [];
      this.loading = true;
      this.axios({
        method: "post",
        url: "/job/lookup",
        data: { "CompanyCode": JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode }
      }).then(response => {
        const data = response.data.data;
        const type = Object.keys(data);
        let loaded = [];
        let loaded2 = [];
        for (let i = 0; i < type.length; i++) {
          if (loaded.indexOf(type[i].replace(/[\r\n]/g,"")) === -1) {
            this.jobTypeFilter.push({
              text: type[i],
              value: type[i]
            });
            loaded.push(type[i]);
          }
          for (let j = 0; j < data[type[i]].length; j++) {
            data[type[i]][j].CreatedAt = new Date(+new Date(data[type[i]][j].CreatedAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
            this.jobList.push(data[type[i]][j]);
            if (loaded2.indexOf(data[type[i]][j].WorkLocation) === -1) {
              this.locationFilter.push({
                text: data[type[i]][j].WorkLocation,
                value: data[type[i]][j].WorkLocation
              });
              loaded2.push(data[type[i]][j].WorkLocation);
            }
          }
        }
        this.step = 0;
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取招聘信息出错啦,请稍后再试");
        this.step = 0;
        this.loading = false;
      });
    },
    next() {
      this.axios({
        method: "get",
        url: "/job/type/list",
      }).then(response => {
        const data = response.data.data;
        this.typeOptions = [[], [], [], [], []];
        let other = null;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (this.translation[j].value.indexOf(data[i].Name) !== -1) {
              switch (data[i].Name) {
                case "编程/IT开发":
                  this.typeOptions[j].unshift(data[i]);
                  break;
                case "测试":
                  if (this.typeOptions[j][0].Name && this.typeOptions[j][0].Name === "编程/IT开发")
                    this.typeOptions[j].splice(1, 0, data[i]);
                  else
                    this.typeOptions[j].unshift(data[i]);
                  break;
                case "销售":
                  this.typeOptions[j].unshift(data[i]);
                  break;
                case "其他":
                  other = data[i];
                  break;
                default:
                  this.typeOptions[j].push(data[i]);
                  break;
              }
              break;
            }
          }
        }
        if (other)
          this.typeOptions[4].push(other);
        this.step = 1;
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取岗位大类信息出错啦,请稍后再试");
        this.loading = false;
      });
    },
    onSubmit() {
      // 简单判断表单是否完成
      if (this.form.name.trim().length === 0 || this.form.type.trim().length === 0 || this.form.location === "" || this.form.jobDesc.trim().length === 0)
        return this.$message.warning("请将招聘信息填写完成!");
      this.$confirm("请确认招聘信息选填无误,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        if (this.form.location[0] === "全国" || this.form.location[0] === "海外" || this.form.location[0] === "不限")
          this.form.location = ["null", this.form.location[0]];
        this.axios({
          method: "post",
          url: "/job/publish",
          headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
          data: {
            "Name": this.form.name,
            "JobTypeCode": this.form.type,
            "WorkLocation": this.form.location[0] !== "null" ? (CodeToText[this.form.location[0]] + (CodeToText[this.form.location[1]] === "市辖区" ? "" : CodeToText[this.form.location[1]])) : this.form.location[1],
            "MinSalary": this.form.salary[0] * 1000,
            "MaxSalary": this.form.salary[1] * 1000,
            "Description": this.form.jobDesc,
            "requirement": this.form.jobReq,
            "RecruitCount": +this.form.num,
            "SalaryCount": this.form.SalaryCount,
            "SalaryMode": this.form.SalaryMode
          }
        }).then(() => {
          this.$message.success("录入成功");
          this.resetForm();
          this.loading = false;
        }).catch(() => {
          this.$message.error("录入招聘信息出错啦,请稍后再试");
          this.loading = false;
        });
      }).catch(() => {
        this.$message.info("录入已取消");
      });
    }
  },
  created() {
    this.locations = provinceAndCityData;
    if (this.locations[0] !== "全国")
      this.locations.unshift({
        "value": "全国",
        "label": "全国"
      }, {
        "value": "海外",
        "label": "海外"
      }, {
        "value": "不限",
        "label": "不限"
      });
  },
  mounted() {
    this.getJobInfo();
  }
};
</script>

<style scoped>
.form,
.list {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.list {
  margin: 0;
}
.el-radio {
  width: 100px;
  height: 40px;
  line-height: 40px;
}
.form .type {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(204, 204, 204, 0.336);
}
.job {
  width: 100%;
}
</style>
<style>
.cell {
  /* 表格字体 */
  font-size: 17px;
}
.el-textarea__inner {
  padding-right: 20px;
}
.el-textarea .el-input__count {
  line-height: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: rgba(255, 255, 255, 0);
}
.type .el-form-item__label {
  font-size: 16px;
  text-align: center;
}
.job .el-form--inline .el-form-item__content {
  text-indent: 2em;
  padding-left: 20px;
}
</style>