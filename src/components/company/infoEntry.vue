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
        style="width: 100%"
        border
        :max-height="this.wh - 240"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="岗位名称">
                <span>{{ props.row.Name }}</span>
              </el-form-item>
              <el-form-item label="岗位大类">
                <span>{{ props.row.JobType.Name }}</span>
              </el-form-item>
              <el-form-item label="招聘人数">
                <span>{{ props.row.RecruitCount }}</span>
              </el-form-item>
              <el-form-item label="工作地点">
                <span>{{ props.row.WorkLocation }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.CreatedAt }}</span>
              </el-form-item>
              <el-form-item label="最低薪资">
                <span>{{ props.row.MinSalary }}</span>
              </el-form-item>
              <el-form-item label="最高薪资">
                <span>{{ props.row.MaxSalary }}</span>
              </el-form-item>
              <el-form-item label="岗位描述">
                <span>{{ props.row.Description }}</span>
              </el-form-item>
              <el-form-item label="岗位要求">
                <span>{{ props.row.Requirement }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="岗位名称" prop="Name"></el-table-column>
        <el-table-column label="岗位大类" prop="JobType.Name"></el-table-column>
        <el-table-column label="招聘人数" prop="RecruitCount"></el-table-column>
        <el-table-column label="工作地点" prop="WorkLocation"></el-table-column>
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
        label-width="100px"
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
          <el-radio-group v-model="form.type">
            <el-radio
              :label="item.name"
              name="type"
              v-for="item in typeOptions"
              v-bind:key="item.id"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input v-model="form.name" style="width: 200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="招聘人数">
          <el-input v-model="form.num" type="number" style="width: 200px;" max="9999"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述">
          <el-input
            type="textarea"
            v-model="form.jobDesc"
            :rows="4"
            resize="none"
            show-word-limit
            maxlength="300"
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
            maxlength="500"
            style="width: 400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-cascader v-model="form.location" :options="locations"></el-cascader>
        </el-form-item>
        <el-form-item label="月薪资范围">
          <el-slider v-model="form.salary" range :max="50" :marks="marks"></el-slider>
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
    return {
      step: 0,// 切换展示和添加两个页面
      nameHolder: JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode,// 添加企业时,企业名称输入框的placeholder
      loading: false,
      form: {
        name: "",
        type: "",
        salary: [10, 20],
        location: [],
        jobDesc: "",
        num: "",
        jobReq: ""
      },
      jobList: [],// 发布的岗位数据
      locations: provinceAndCityData,
      typeOptions: [],// 职位类别选项
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
      this.jobList = [];
      this.loading = true;
      this.axios({
        method: "post",
        url: "/job/lookup",
        data: { "CompanyCode": JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode }
      }).then(response => {
        const type = Object.keys(response.data.data);
        for (let i = 0; i < type.length; i++)
          for (let j = 0; j < response.data.data[type[i]].length; j++)
            this.jobList.push(response.data.data[type[i]][j]);
        this.step = 0;
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取招聘信息出错啦,请稍后再试");
        this.step = 0;
        this.loading = false;
      });
    },
    next() {
      this.loading = true;
      this.typeOptions = [];
      this.axios({
        method: "get",
        url: "/job/type/list",
      }).then(response => {
        for (let i = 0; i < response.data.data.length; i++)
          this.typeOptions.push({
            name: response.data.data[i].Name
          });
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
        this.axios({
          method: "post",
          url: "/job/publish",
          headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
          data: {
            "Name": this.form.name,
            "JobTypeCode": this.form.type,
            "WorkLocation": CodeToText[this.form.location[0]] + (CodeToText[this.form.location[1]] === "市辖区" ? "" : CodeToText[this.form.location[1]]),
            "MinSalary": this.form.salary[0] * 1000,
            "MaxSalary": this.form.salary[1] * 1000,
            "Description": this.form.jobDesc,
            "requirement": this.form.jobReq,
            "RecruitCount": +this.form.num
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
  width: 155px;
  height: 40px;
  line-height: 40px;
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
</style>