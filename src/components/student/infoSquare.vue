<template>
  <el-form
    class="form"
    ref="form"
    label-width="0px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{'max-height': this.wh - 105 + 'px'}"
  >
    <span>请选择筛选条件:</span>
    <el-select v-model="Name" filterable placeholder="岗位名称" style="width: 180px">
      <el-option
        v-for="item in options[0].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="JobTypeCode" filterable placeholder="岗位大类" style="width: 180px">
      <el-option
        v-for="item in options[1].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="MinSalary" filterable placeholder="最低薪资" style="width: 140px">
      <el-option
        v-for="item in options[2].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-form-item style="display: inline-block; width: 180px">
      <el-cascader v-model="location" :options="locations" clearable placeholder="工作地点" filterable></el-cascader>
    </el-form-item>
    <el-autocomplete
      class="inline-input"
      v-model="CompanyCode"
      prefix-icon="el-icon-search"
      :fetch-suggestions="querySearch"
      placeholder="公司"
      :trigger-on-focus="false"
    ></el-autocomplete>
    <!-- <el-input style="width: 190px" placeholder="最低薪资(K)" v-model="MinSalary" type='number' max="20" class="input-with-select">
      <el-button style="width: 30px; padding: 13px" slot="prepend" icon="el-icon-minus"></el-button>
      <el-button style="width: 30px; padding: 13px" slot="append" icon="el-icon-plus"></el-button>
    </el-input>-->
    <!-- <i @click="add" style="margin-right: 5px; cursor: pointer; color: #409eff" title="添加条件" class="el-icon-circle-plus-outline"></i> -->
    <el-button type="primary" @click="getInfo()" style="margin: 20px" icon="el-icon-search">点击查询</el-button>
    <el-table
      v-show="tableData.length !== 0"
      :data="tableData[page]"
      style="width: 100%"
      border
      :default-sort="{prop: 'MaxSalary', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" label-width="80px">
            <el-form-item label="公司名称">
              <span>{{ props.row.Company.Name }}</span>
            </el-form-item>
            <el-form-item label="公司简介">
              <span>{{ props.row.Company.Description }}</span>
            </el-form-item>
            <el-form-item label="岗位名称">
              <span>{{ props.row.Name }}</span>
            </el-form-item>
            <el-form-item label="岗位大类">
              <span>{{ props.row.JobType.Name }}</span>
            </el-form-item>
            <el-form-item label="最低薪资">
              <span>{{ props.row.MinSalary }}</span>
            </el-form-item>
            <el-form-item label="最高薪资">
              <span>{{ props.row.MaxSalary }}</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{ props.row.CreatedAt }}</span>
            </el-form-item>
            <el-form-item label="工作地点">
              <span>{{ props.row.WorkLocation }}</span>
            </el-form-item>
            <el-form-item label="岗位描述">
              <span style="display: inline-block; width: 500px;">{{ props.row.Description }}</span>
            </el-form-item>
            <el-form-item label="岗位要求">
              <span style="display: inline-block; width: 500px;">{{ props.row.requirement }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="公司" prop="Company.Name"></el-table-column>
      <el-table-column label="岗位" prop="Name"></el-table-column>
      <el-table-column label="最低薪资" prop="MinSalary" sortable></el-table-column>
      <el-table-column label="最高薪资" prop="MaxSalary" sortable></el-table-column>
      <el-table-column label="工作地点" prop="WorkLocation"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">投递简历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="currentChange"
      :page-size="10"
      :pager-count="9"
      layout="prev, pager, next"
      :total="total"
      style="margin: 10px 0"
    ></el-pagination>
    <el-empty :image-size="200" v-show="tableData.length === 0" description="没有找到符合条件的招聘信息"></el-empty>
  </el-form>
</template>
<script>
import { provinceAndCityData, CodeToText } from "element-china-area-data";
export default {
  data() {
    return {
      total: 0,
      page: 0,
      tableData: [[]],
      loading: false,
      locations: provinceAndCityData,
      options: [{
        value: "Name",
        label: "岗位",
        children: [{ value: "", label: "不限" }]
      }, {
        value: "JobTypeCode",
        label: "岗位大类",
        children: [{ value: "", label: "不限" }]
      }, {
        value: "MinSalary",
        label: "最低薪资",
        children: [
          { value: 0, label: "不限" },
          { value: 1000, label: "1K" },
          { value: 2000, label: "2K" },
          { value: 3000, label: "3K" },
          { value: 4000, label: "4K" },
          { value: 5000, label: "5K" },
          { value: 6000, label: "6K" },
          { value: 7000, label: "7K" },
          { value: 8000, label: "8K" },
          { value: 9000, label: "9K" },
          { value: 10000, label: "10K" },
          { value: 15000, label: "15K" }
        ]
      }],
      companies: [],
      location: [],
      Name: null,
      MinSalary: "",
      WorkLocation: "",
      JobTypeCode: null,
      CompanyCode: "",
      select: { "MinSalary": 0 },
      input: [],
      gpa: false
    }
  },
  props: ["wh"],
  methods: {
    querySearch(queryString, cb) {
      let results = []
      this.axios({
        method: "get",
        url: "https://api.hduhelp.com/gormja_wrapper/company/lookup",
        // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        params: {
          name: queryString
        }
      }).then((response) => {
        for (let i = 0; i < response.data.data.length; i++)
          results.push({
            CompanyCode: response.data.data[i].CompanyCode,
            value: response.data.data[i].Name
          })
        cb(results);
      })
    },
    // handleSelect(item) {
    //   this.CompanyCode = item.CompanyCode
    // },
    currentChange(v) {
      this.page = v - 1
    },
    handleEdit(index, row) {
      sessionStorage.setItem("com", JSON.stringify({
        CompanyCode: row.Company.CompanyCode,
        Name: row.Company.Name,
        job: row.Name,
        JobID: row.JobID
      }))
      this.$router.push("/infoShare");
    },
    getInfo() {
      this.select = { "MinSalary": 0 };
      if (this.Name && this.Name.length !== 0)
        this.select.Name = this.Name
      if (this.JobTypeCode && this.JobTypeCode.length !== 0)
        this.select.JobTypeCode = this.JobTypeCode
      if (this.MinSalary.length !== 0)
        this.select.MinSalary = this.MinSalary
      if (this.CompanyCode.length !== 0)
        this.select.CompanyCode = this.CompanyCode
      if (this.location.length !== 0)
        this.select.WorkLocation = CodeToText[this.location[0]] + (CodeToText[this.location[1]] === "市辖区" ? "" : CodeToText[this.location[1]])
      this.loading = true;
      this.tableData = [[]];
      this.total = 0;
      this.page = 0;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/job/lookup",
        // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: this.select
      }).then((response) => {
        if (response.data.data.length === 0) {
          this.loading = false;
          return;
        }
        let temp = [];
        const type = Object.keys(response.data.data)
        for (let i = 0; i < type.length; i++)
          for (let j = 0; j < response.data.data[type[i]].length; j++)
            temp.push(response.data.data[type[i]][j])
        let count = 0
        for (let i = 0; i < temp.length; i++) {
          this.total++
          if (i !== 0 && i % 10 === 0) {
            count++
            this.tableData[count] = []
          }
          this.tableData[count].push(temp[i]);
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取岗位信息出错啦,请稍后再试")
        this.loading = false
      });
    }
  },
  mounted() {
    this.loading = true;
    this.axios({
      method: "post",
      url: "https://api.hduhelp.com/gormja_wrapper/job/lookup",
      data: { "MinSalary": 0 }
    }).then((response) => {
      this.axios({
        method: "get",
        url: "https://api.hduhelp.com/gormja_wrapper/job/type/list",
        data: { "MinSalary": 0 }
      }).then((response2) => {
        if (response.data.data.length !== 0) {
          let temp = [];
          let job = [];
          const type = Object.keys(response.data.data)
          for (let i = 0; i < type.length; i++)
            for (let j = 0; j < response.data.data[type[i]].length; j++) {
              temp.push(response.data.data[type[i]][j])
              if (job.indexOf(response.data.data[type[i]][j].Name) === -1)
                job.push(response.data.data[type[i]][j].Name)
            }
          for (let i = 0; i < job.length; i++) {
            this.options[0].children.push({
              label: job[i],
              value: job[i]
            })
          }
          let count = 0
          for (let i = 0; i < temp.length; i++) {
            this.total++
            if (i !== 0 && i % 10 === 0) {
              count++
              this.tableData[count] = []
            }
            this.tableData[count].push(temp[i]);
          }
        }
        for (let i = 0; i < response2.data.data.length; i++) {
          this.options[1].children.push({
            label: response2.data.data[i].Name,
            value: response2.data.data[i].JobTypeCode
          })
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取岗位大类信息出错啦,请稍后再试")
        this.loading = false
      });
    }).catch(() => {
      this.$message.error("获取招聘信息出错啦,请稍后再试")
      this.loading = false
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
.el-table {
  margin: 0 !important;
}
</style>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
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
</style>