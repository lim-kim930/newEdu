<template>
  <el-form
    class="form"
    ref="form"
    label-width="80px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{'max-height': this.wh - 105 + 'px'}"
  >
    <span>请选择筛选条件:</span>
    <el-cascader
      @change="lll"
      style="width: 300px; margin: 10px"
      :options="options"
      :props="props"
      collapse-tags
      clearable
    ></el-cascader>
    <el-input v-show="gpa" style="width: 100px" v-model="input[0]" placeholder="gpa下限"></el-input>
    <el-input v-show="gpa" style="width: 100px" v-model="input[1]" placeholder="gpa上限"></el-input>
    <el-button type="primary" @click="getInfo()" style="margin-top: 20px">点击筛选</el-button>
    <el-table
      v-show="tableData.length !== 0"
      :data="tableData"
      style="width: 100%"
      border
      :default-sort="{prop: 'id', order: 'descending'}"
      :max-height="this.wh - 260"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.Name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.Sex }}</span>
            </el-form-item>
            <el-form-item label="民族">
              <span>{{ props.row.Nation }}</span>
            </el-form-item>
            <el-form-item label="学号">
              <span>{{ props.row.StaffID }}</span>
            </el-form-item>
            <el-form-item label="班级号码">
              <span>{{ props.row.ClassCode }}</span>
            </el-form-item>
            <el-form-item label="班级名称">
              <span>{{ props.row.ClassName }}</span>
            </el-form-item>
            <el-form-item label="学校代码">
              <span>{{ props.row.SchoolCode }}</span>
            </el-form-item>
            <el-form-item label="学院代码">
              <span>{{ props.row.UnitCode }}</span>
            </el-form-item>
            <el-form-item label="学院名称">
              <span>{{ props.row.UnitName }}</span>
            </el-form-item>
            <el-form-item label="专业代码">
              <span>{{ props.row.MajorCode }}</span>
            </el-form-item>
            <el-form-item label="专业名称">
              <span>{{ props.row.MajorName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="Name" sortable></el-table-column>
      <el-table-column label="学院" prop="UnitName"></el-table-column>
      <el-table-column label="专业" prop="MajorName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">请求详细简历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-descriptions class="margin-top" :column="3" border v-for="item in data" v-bind:key="item.FileID">
      <template slot="extra">
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item v-for="item2 in item.Source.data_map.profile['1-19270808']" v-bind:key="item2.FileID">
        <template slot="label">
          <i class="el-icon-user"></i>
          {{item2.index}}
        </template>
      </el-descriptions-item>
    </el-descriptions>-->
    <el-empty :image-size="200" v-show="tableData.length === 0"></el-empty>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      translation: {
        ClassCode: "班级号码",
        ClassName: "班级名称",
        SchoolCode: "学校代码",
        StaffID: "学号",
        UnitCode: "学院代码",
        UnitName: "学院名称",
        MajorCode: "专业代码",
        MajorName: "专业名称",
        Sex: "性别",
        Name: "姓名",
        Photo: "照片",
        Nation: "民族",
      },
      tableData: [],
      loading: false,
      props: { multiple: true },
      options: [{
        value: "gpa",
        label: "GPA范围",
        children: [
          { value: 1, label: "请选择范围" },
        ]
      }, {
        value: "UnitCode",
        label: "学院",
        children: [
          { value: "网络空间安全学院", label: "网络空间安全学院" },
          { value: "外国语学院", label: "外国语学院" },
        ]
      }, {
        value: "MajorCode",
        label: "专业",
        children: [
          { value: "英语", label: "英语" },
          { value: "网络空间安全专业", label: "网络空间安全专业" }
        ]
      }, {
        value: "Sex",
        label: "性别",
        children: [
          { value: "男", label: "男" },
          { value: "女", label: "女" }
        ]
      }],
      selected: [],
      input: [],
      gpa: false,
      Predicates: []
    }
  },
  props: ["wh"],
  methods: {
    lll(v) {
      if (v.length === 0){
        this.gpa = false;
        this.Predicates = []
      }
      let flag = 0;
      for (let i = 0; i < v.length; i++) {
        if (v[i].indexOf("gpa") === -1)
          flag++
        this.gpa = flag !== v.length
      }
      this.selected = v;
    },
    getInfo() {
      this.Predicates = []
      console.log(this.selected.length);
      for (let i = 0; i < this.selected.length; i++)
        this.Predicates.push({
          "FieldPath": [
            "data_map",
            this.selected[i][0] === "gpa" ? "rank" : "profile",
            "*",
            this.selected[i][0]
          ],
          "RelationType": this.selected.length > 1 ? "should" : "must",
          "NodeType": this.selected[i][0] === "gpa" ? "range" : "match",
          "Predicate": this.selected[i][0] === "gpa" ? { "from": +this.input[0], "to": +this.input[1] } : { "value": this.selected[i][1] }
        })
      this.loading = true;
      this.tableData = []
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/expose/search",
        // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: {
          "Predicates": this.Predicates
        },
      })
        .then((response) => {
          if (response.data.data.Results.length === 0) {
            this.loading = false;
            return;
          }
          let result = response.data.data.Results;
          console.log(result);

          for (let i = 0; i < result.length; i++) {
            this.tableData.push(result[i].Source.data_map.profile[result[i].FileID])
            this.tableData[i].Photo = "/"
            // this.tableData[i]
            // data[i].Source = data[i].Source.data_map
            // data[i].Source = data[i].Source.data_map
          }
          // console.log(data);

          this.loading = false;
        })
        .catch(() => {
          this.$message.error("获取公开信息出错啦,请稍后再试")
          this.loading = false
        });
    }
  },
  mounted() {
    this.getInfo()
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