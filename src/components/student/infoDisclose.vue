<template>
  <el-form
    :model="ruleForm"
    v-loading="loading"
    element-loading-text="拼命加载中"
    ref="ruleForm"
    label-width="150px"
    :style="{'max-height': this.wh - 105 + 'px', 'overflow': loading?'hidden':'auto'}"
  >
    <div class="infoShow" v-show="dataFile === ''">
      <span>当前公开的信息：</span>
      <el-popover
        placement="right-start"
        title="提示"
        width="200"
        trigger="hover"
        content="这些信息将会被直接公开展示给用人单位，系统会默认为您勾选一些信息公开，您也可以自由选择增删"
      >
        <el-button slot="reference" style="padding: 0; border: none">
          <i class="el-icon-question"></i>
        </el-button>
      </el-popover>
      <!-- <el-switch v-model="disclose" @change="switcher" active-text="我要公开" inactive-text="暂不公开" style="margin: 0 10px; font-size: 18px"></el-switch> -->
      <el-upload
        ref="file-upload"
        class="upload"
        action="#"
        :http-request="getFile"
        :on-change="change"
        :limit="1"
        accept=".enc"
        :show-file-list="false"
        v-show="upload"
      >
        上传文件进行修改
        <i class="el-icon-upload"></i>
      </el-upload>
      <el-button @click="next()" v-show="!upload" type="primary" plain>点击修改</el-button>
      <el-table
        v-show="tableData.length !== 0"
        :data="tableData"
        stripe
        style="width: 100%; margin: 10px"
        border
        max-height="750"
      >
        <el-table-column prop="name" label="公开信息" width="400"></el-table-column>
        <el-table-column
          prop="type"
          label="信息种类"
          width="130"
          :filters="[{ text: '学籍信息', value: '学籍信息' }, { text: '成绩信息', value: '成绩信息' }]"
          :filter-method="filterType"
          filter-placement="bottom-end"
        ></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
      </el-table>
      <el-empty :image-size="200" v-show="tableData.length === 0" description="您还没有公开的信息"></el-empty>
    </div>
    <div class="disclose" v-show="dataFile !== ''">
      <el-form-item label="要公开的学籍信息" required>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="CheckAllChange($event, 1)"
          border
          v-show="profileData.length !== 0"
          style="width: 80px"
        >全选</el-checkbox>
        <el-checkbox-group
          v-model="ruleForm.profileType"
          style="margin-left: 30px; width: 960px"
          @change="CheckedChange($event, 1)"
        >
          <el-checkbox
            v-for="item in profileData"
            v-bind:key="item.value"
            :label="item.value"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="课程成绩信息" required>
        <h4 v-show="scoreData.length === 0">暂无信息</h4>
        <el-table
          ref="multipleTable"
          border
          :data="scoreData"
          v-show="scoreData.length !== 0"
          tooltip-effect="dark"
          style="width: 90%"
          @selection-change="handleSelectionChange1"
          max-height="500"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="课程">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="value" label="课程号"></el-table-column>
          <el-table-column prop="gp" label="绩点"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="等级考试信息" required>
        <h4 v-show="levelData.length === 0">暂无信息</h4>
        <el-table
          ref="multipleTable"
          border
          :data="levelData"
          v-show="levelData.length !== 0"
          tooltip-effect="dark"
          style="width: 90%"
          @selection-change="handleSelectionChange2"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="考试名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="value" label="考试时间"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="个人荣誉信息" required>
        <h4 v-show="rewardData.length === 0">暂无信息</h4>
        <el-table
          ref="multipleTable"
          border
          :data="rewardData"
          v-show="rewardData.length !== 0"
          tooltip-effect="dark"
          style="width: 90%"
          @selection-change="handleSelectionChange3"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="项目名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="yearValue" label="获得年份"></el-table-column>
          <el-table-column prop="semValue" label="获得学期"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="创新学分信息" required>
        <h4 v-show="raceData.length === 0">暂无信息</h4>
        <el-table
          ref="multipleTable"
          border
          :data="raceData"
          v-show="raceData.length !== 0"
          tooltip-effect="dark"
          style="width: 90%"
          @selection-change="handleSelectionChange4"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="项目名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="value" label="获得时间"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm()"
          style="margin: 0 0 30px 0; width: 150px"
        >点击更改</el-button>
        <!-- <el-button @click="resetForm()" style="width: 100px">重置</el-button> -->
        <el-button @click="back()" style="width: 100px">返回查看</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
let FormData = require("form-data");
export default {
  data() {
    return {
      upload: true,
      disclose: true,
      checkAll: false,//学籍信息全选
      isIndeterminate: false,//学籍全选按钮的不确定状态
      content: "",//学业文件内容
      fileList: [],//upload文件列表
      dataFile: "",//文件
      tableData: [],
      ruleForm: {//表单选中数据
        date: "",
        hr: "",
        profileType: [],
        scoreType: [],
        levelType: [],
        rewardType: [],
        raceType: []
      },
      profileData: [],//学籍信息数据
      profileDataValue: [],//学籍全选辅助
      levelData: [],//等级考试信息数据
      scoreData: [],
      scoreDataValue: [],
      rewardData: [],
      rewardDataValue: [],
      raceData: [],
      raceDataValue: [],
      loading: true,
    };
  },
  props: ["wh", "file"],
  methods: {
    filterType(value, row) {
      return row.type === value;
    },
    switcher() {
      if (!this.disclose) {
        this.resetForm()
        this.submitForm(true)
      }
    },
    handleSelectionChange1(val) {
      val.forEach(item => {
        this.ruleForm.scoreType.push(item.value)
      });
    },
    handleSelectionChange2(val) {
      val.forEach(item => {
        this.ruleForm.levelType.push(item.key)
      });
    },
    handleSelectionChange3(val) {
      val.forEach(item => {
        this.ruleForm.rewardType.push(item.key)
      });
    },
    handleSelectionChange4(val) {
      val.forEach(item => {
        this.ruleForm.raceType.push(item.key)
      });
    },
    CheckAllChange(val) {
      this.ruleForm.profileType = val ? this.profileDataValue : [];
      this.isIndeterminate = false;
    },
    CheckedChange(val) {
      this.checkAll = val.length === this.profileDataValue.length;
      this.isIndeterminate = val.length > 0 && val.length < this.profileDataValue.length;
    },
    //文件加载完成,出现下一步按钮
    getFile() {
      this.next()
    },
    change(response, file, fileList) {
      this.dataFile = file[0].raw
      this.$emit("func", this.dataFile);
    },
    //重置
    resetForm() {
      this.ruleForm = {
        date: "",
        hr: "",
        profileType: [],
        scoreType: [],
        levelType: [],
        rewardType: [],
        raceType: []
      }
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    //下一步
    next() {
      if (!this.upload)
        this.dataFile = this.file
      document.querySelector(".disclose").style.maxHeight = this.wh - 300 + "px";
      this.resetForm();
      this.loading = true;
      var data = new FormData();
      data.append("dataFile", this.dataFile);
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data,
      })
        .then((response) => {
          this.content = response.data.data.Body.data_map;
          var range = Object.keys(this.content);
          for (var i = 0; i < range.length; i++) {
            if (range[i] === "profile") {
              const translation = {
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
                Nation: "民族"
              }
              const sort = ["Name", "Sex", "Nation", "Photo", "ClassCode", "ClassName", "MajorName", "MajorCode", "UnitName", "UnitCode", "SchoolCode"]
              const profile = Object.keys(this.content.profile[Object.keys(this.content.profile)]);
              this.profileData = [];
              this.profileDataValue = [];
              for (let i = 0; i < sort.length; i++) {
                if (profile.indexOf(sort[i])) {
                  this.profileDataValue.push(sort[i])
                  this.profileData.push({
                    value: sort[i],
                    name: translation[sort[i]]
                  })
                }
              }
              // for (var j = 0; j < profile.length; j++) {
              //   if (profile[j] !== "StaffID") {
              //     this.profileDataValue.push(profile[j])
              //     this.profileData.push({
              //       value: profile[j],
              //       name: translation[profile[j]]
              //     })
              //   }
              // }
            }
            else if (range[i] === "score") {
              this.scoreData = [];
              this.scoreDataValue = [];
              var score = Object.keys(this.content.score);
              for (var j = 0; j < score.length; j++) {
                this.scoreDataValue.push(score[j])
                this.scoreData.push({
                  value: this.content.score[score[j]].CourseCode,
                  name: this.content.score[score[j]].CourseName,
                  gp: this.content.score[score[j]].GP,
                })
              }
            }
            else if (range[i] === "level_exam") {
              this.levelData = [];
              var level = Object.keys(this.content.level_exam);
              for (var j = 0; j < level.length; j++) {
                this.levelData.push({
                  value: this.content.level_exam[level[j]].ExamDate,
                  name: this.content.level_exam[level[j]].ExamName,
                  key: level[j]
                })
              }
            }
            else if (range[i] === "reward") {
              this.rewardData = [];
              this.rewardDataValue = [];
              var reward = Object.keys(this.content.reward);
              for (var j = 0; j < reward.length; j++) {
                this.rewardDataValue.push(reward[j])
                this.rewardData.push({
                  yearValue: this.content.reward[reward[j]].SchoolYear,
                  semValue: this.content.reward[reward[j]].Semester === 0 ? "第一学期" : "第二学期",
                  name: this.content.reward[reward[j]].RewardName,
                  key: reward[j]
                })
              }
            }
            else if (range[i] === "race_reward") {
              this.raceData = [];
              this.raceDataValue = [];
              var race = Object.keys(this.content.race_reward);
              for (var j = 0; j < race.length; j++) {
                this.raceDataValue.push(race[j])
                this.raceData.push({
                  value: this.content.race_reward[race[j]].RewardDate,
                  name: this.content.race_reward[race[j]].RaceName,
                  key: race[j]
                })
              }
            }
          }
          this.loading = false
        })
        .catch((err) => {
          if (err.response.data.msg === "file hash does not equal to chain")
            this.$message.error("学业文件错误或者过期,请检查后再试")
          else
            this.$message.error("获取学业文件信息出错啦,请稍后再试")
          this.dataFile = ""
          this.loading = false;
        });
    },
    back() {
      this.upload = false;
      this.dataFile = "";
    },
    // 提交按钮
    submitForm(id) {
      this.$confirm("请确认信息选填无误,是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          var ShareItems = [];
          var Path = [];
          var data = new FormData();
          data.append("dataFile", this.dataFile);
          if (this.ruleForm.profileType.length != 0) {
            if (this.checkAll1 === true)
              ShareItems.push({ "Path": ["profile", Object.keys(this.content.profile)[0]] })
            else
              for (var i = 0; i < this.ruleForm.profileType.length; i++) {
                Path = ["profile", Object.keys(this.content.profile)[0]]
                Path.push(this.ruleForm.profileType[i])
                ShareItems.push({ "Path": Path })
              }
          }
          if (this.ruleForm.scoreType.length != 0) {
            for (var i = 0; i < this.ruleForm.scoreType.length; i++) {
              Path = ["score"]
              Path.push(this.ruleForm.scoreType[i])
              ShareItems.push({ "Path": Path })
            }
          }
          if (this.ruleForm.levelType.length != 0) {
            for (var i = 0; i < this.ruleForm.levelType.length; i++) {
              Path = ["level_exam"]
              Path.push(this.ruleForm.levelType[i])
              ShareItems.push({ "Path": Path })
            }
          }
          if (this.ruleForm.rewardType.length != 0) {
            for (var i = 0; i < this.ruleForm.rewardType.length; i++) {
              Path = ["reward"]
              Path.push(this.ruleForm.rewardType[i])
              ShareItems.push({ "Path": Path })
            }
          }
          if (this.ruleForm.raceType.length != 0) {
            for (var i = 0; i < this.ruleForm.raceType.length; i++) {
              Path = ["race_reward"]
              Path.push(this.ruleForm.raceType[i])
              ShareItems.push({ "Path": Path })
            }
          }
          data.append("body", JSON.stringify({ "ShareItems": ShareItems }));
          this.axios({
            method: "put",
            url: "https://api.hduhelp.com/gormja_wrapper/expose/cache?topic=profile&staffID" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
            headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
            data,
          })
            .then((response) => {
              this.$confirm("信息已经成功公开，你也可以随时更改", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning",
              }).then(() => {
                location.reload()
              })
              this.dialogVisible = true;
              this.loading = false
            })
            .catch((error) => {
              this.$message.error("出错啦,请稍后再试");
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: id ? "操作已取消" : "公开已取消",
          });
        });
    },
  },
  mounted() {
    if (this.file) {
      this.upload = false
    }
    this.axios({
      method: "post",
      url: "https://api.hduhelp.com/gormja_wrapper/expose/search",
      // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
      data: {
        "Predicates": [
          {
            "FieldPath": [
              "data_map",
              "profile",
              "*",
              "StaffID"
            ],
            "RelationType": "must",
            "NodeType": "match",
            "Predicate": {
              "value": JSON.parse(localStorage.getItem("jw_student_file")).staffID
            }
          }
        ]
      }
    })
      .then((response) => {
        if (response.data.data.Results.length === 0) {
          this.loading = false;
          return;
        }
        var content = response.data.data.Results[0].Source.data_map;
        let range = Object.keys(content);
        let profileData = [];
        let scoreData = [];
        let levelData = [];
        let rewardData = [];
        let raceData = [];
        for (let i = 0; i < range.length; i++) {
          if (range[i] === "profile") {
            const translation = {
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
            }
            let profile = Object.keys(content.profile[Object.keys(content.profile)]);
            for (let j = 0; j < profile.length; j++) {
              profileData.push({
                content: profile[j] !== "Photo" ? content.profile[Object.keys(content["profile"])][profile[j]] : "/",
                name: translation[profile[j]],
                type: "学籍信息"
              })
            }
          }
          else if (range[i] === "score") {
            let score = Object.keys(content.score);
            for (let j = 0; j < score.length; j++) {
              scoreData.push({
                content: "最终成绩: " + content.score[score[j]].ScoreFinal + " / " + content.score[score[j]].SchoolYear + "第" + content.score[score[j]].Semester + "学期",
                name: content.score[score[j]].CourseName,
                type: "成绩信息"
              })
            }
          }
          else if (range[i] === "level_exam") {
            let level = Object.keys(content.level_exam);
            for (let j = 0; j < level.length; j++) {
              levelData.push({
                content: "成绩: " + content.level_exam[level[j]].Score + " / " + content.level_exam[level[j]].ExamDate,
                name: content.level_exam[level[j]].ExamName,
                type: "等级考试信息",
              })
            }
          }
          else if (range[i] === "reward") {
            let reward = Object.keys(content.reward);
            for (let j = 0; j < reward.length; j++) {
              rewardData.push({
                content: content.reward[reward[j]].Semester === 0 ? "第一学期" : "第二学期",
                name: content.reward[reward[j]].RewardName,
                type: "个人荣誉信息"
              })
            }
          }
          else if (range[i] === "race_reward") {
            let race = Object.keys(content.race_reward);
            for (let j = 0; j < race.length; j++) {
              raceData.push({
                content: "获奖类型: " + content.race_reward[race[j]].RaceLevel + "-" + content.race_reward[race[j]].RewardLevel + " / " + content.race_reward[race[j]].RewardDate,
                name: content.race_reward[race[j]].RaceName,
                type: "创新学分类型"
              })
            }
          }
        }
        this.tableData = [...profileData, ...scoreData, ...levelData, ...rewardData, ...raceData];
        this.loading = false;
      })
      .catch((err) => {
        this.$message.error("出错啦,请稍后再试");
        this.loading = false;
      })
  },
};
</script>

<style scoped>
.el-form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  min-height: 500px;
  padding: 40px 50px 0 50px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: auto;
}
.upload {
  display: inline-block;
  margin: 0 0 10px 10px;
  width: 170px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #b3d8ff;
  background-color: #ecf5ff;
  font-size: 14px;
  color: #409eff;
  border-radius: 5px;
}
.el-checkbox {
  width: 200px;
  margin-right: 20px;
}
</style>
<style>
.el-form-item .el-form-item__label {
  width: 150px;
}
.message_box_confirm {
  word-break: break-all !important;
}
</style>