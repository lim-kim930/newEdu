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
      <span>当前公开的信息:</span>
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
      <el-button
        @click="next()"
        v-show="!upload"
        type="primary"
        style="margin-left: 10px"
        plain
      >点击修改</el-button>
      <el-table
        v-show="tableData.length !== 0"
        :data="tableData"
        stripe
        style="width: 100%; margin: 10px"
        border
        max-height="750"
      >
        <el-table-column :resizable="false" prop="name" label="公开信息" width="400"></el-table-column>
        <el-table-column :resizable="false" prop="type" label="信息种类" width="130"></el-table-column>
        <el-table-column :resizable="false" prop="content" label="内容"></el-table-column>
      </el-table>
      <el-empty :image-size="200" v-show="tableData.length === 0" description="您还没有公开的信息"></el-empty>
    </div>
    <div class="disclose" v-show="dataFile !== ''">
      <el-form-item label="要公开的学籍信息">
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
      <el-form-item label="gpa信息">
        <el-table
          :data="rankData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="StaffID" label="学号"></el-table-column>
          <el-table-column prop="GPA" label="绩点"></el-table-column>
          <el-table-column prop="Rank" label="排名"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="综合素质信息">
        <el-checkbox-group
          v-show="rewardDataValue.length !== 0 || raceDataValue.length !== 0"
          v-model="ruleForm.rewardType"
          style="margin-left: 30px; width: 960px"
        >
          <el-checkbox v-show="rewardDataValue.length !== 0" label="reward">个人荣誉</el-checkbox>
          <el-checkbox v-show="raceDataValue.length !== 0" label="race_reward">创新学分</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="个人填写信息">
        <el-checkbox-group
          v-show="clubData.length !== 0"
          v-model="ruleForm.intType"
          style="margin-left: 30px; width: 960px"
        >
          <el-checkbox label="org_experience">班团经历情况</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="课程成绩信息" required>
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
      </el-form-item>-->
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
        intType: [],
        scoreType: [],
        levelType: [],
        rewardType: []
      },
      profileData: [],//学籍信息数据
      profileDataValue: [],//学籍全选辅助
      levelData: [],//等级考试信息数据
      scoreData: [],
      scoreDataValue: [],
      rewardData: [],
      rankData: [],
      clubData: [],
      rewardDataValue: [],
      raceData: [],
      raceDataValue: [],
      gpa: false,
      loading: false
    };
  },
  props: ["wh", "file"],
  methods: {
    filterType(value, row) {
      return row.type === value;
    },
    switcher() {
      if (!this.disclose) {
        this.resetForm();
        this.submitForm(true);
      }
    },
    handleSelectionChange(v) {
      this.gpa = (v.length !== 0);
    },
    handleSelectionChange1(val) {
      val.forEach(item => {
        this.ruleForm.scoreType.push(item.value);
      });
    },
    handleSelectionChange2(val) {
      val.forEach(item => {
        this.ruleForm.levelType.push(item.key);
      });
    },
    handleSelectionChange3(val) {
      val.forEach(item => {
        this.ruleForm.rewardType.push(item.key);
      });
    },
    handleSelectionChange4(val) {
      val.forEach(item => {
        this.ruleForm.raceType.push(item.key);
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
      this.next();
    },
    change(response, file) {
      this.dataFile = file[0].raw;
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
        intType: []
      };
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    getInfo() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "/expose/search",
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
      }).then((response) => {
        if (response.data.data.Results.length === 0) {
          this.loading = false;
          return;
        }
        var content = response.data.data.Results[0].Source.data_map;
        let range = Object.keys(content);
        let profileData = [];
        let rewardData = [];
        let raceData = [];
        let rankData = [];
        let clubData = [];
        for (let i = 0; i < range.length; i++) {
          if (range[i] === "profile") {
            const translation = {
              ClassName: "班级名称",
              SchoolCode: "学校代码",
              StaffID: "学号",
              UnitName: "学院名称",
              MajorName: "专业名称",
              Sex: "性别",
              Name: "姓名",
              Nation: "民族",
            };
            let profile = Object.keys(content.profile[Object.keys(content.profile)]);
            for (let j = 0; j < profile.length; j++) {
              if (translation[profile[j]])
                profileData.push({
                  content: profile[j] !== "Photo" ? content.profile[Object.keys(content["profile"])][profile[j]] : "/",
                  name: translation[profile[j]],
                  type: "学籍信息"
                });
            }
          }
          // else if (range[i] === "score") {
          //   let score = Object.keys(content.score);
          //   for (let j = 0; j < score.length; j++) {
          //     scoreData.push({
          //       content: "最终成绩: " + content.score[score[j]].ScoreFinal + " / " + content.score[score[j]].SchoolYear + "第" + content.score[score[j]].Semester + "学期",
          //       name: content.score[score[j]].CourseName,
          //       type: "成绩信息"
          //     });
          //   }
          // }
          // else if (range[i] === "level_exam") {
          //   let level = Object.keys(content.level_exam);
          //   for (let j = 0; j < level.length; j++) {
          //     levelData.push({
          //       content: "成绩: " + content.level_exam[level[j]].Score + " / " + content.level_exam[level[j]].ExamDate,
          //       name: content.level_exam[level[j]].ExamName,
          //       type: "等级考试信息",
          //     });
          //   }
          // }
          // else if (range[i] === "reward") {
          //   let reward = Object.keys(content.reward);
          //   for (let j = 0; j < reward.length; j++) {
          //     rewardData.push({
          //       content: content.reward[reward[j]].Semester === 0 ? "第一学期" : "第二学期",
          //       name: content.reward[reward[j]].RewardName,
          //       type: "个人荣誉信息"
          //     });
          //   }
          // }
          // else if (range[i] === "race_reward") {
          //   let race = Object.keys(content.race_reward);
          //   for (let j = 0; j < race.length; j++) {
          //     raceData.push({
          //       content: "获奖类型: " + content.race_reward[race[j]].RaceLevel + "-" + content.race_reward[race[j]].RewardLevel + " / " + content.race_reward[race[j]].RewardDate,
          //       name: content.race_reward[race[j]].RaceName,
          //       type: "创新学分类型"
          //     });
          //   }
          // }
          else if (range[i] === "rank") {
            let rank = Object.keys(content.rank);
            for (let j = 0; j < rank.length; j++) {
              rankData.push({
                content: "GPA: " + content.rank[rank[j]].GPA + " / 排名: " + content.rank[rank[j]].Rank,
                name: "GPA排名",
                type: "排名信息"
              });
            }
          }
          else if (range[i] === "org_experience") {
            clubData.push({
              content: "工作履历(只包含工作组织等级信息)",
              name: "班团经历",
              type: "个人填写信息"
            });
          }
          else if (range[i] === "race_reward") {
            raceData.push({
              content: "竞赛履历(只包含竞赛等级信息)",
              name: "创新学分",
              type: "综合素质信息"
            });
          }
          else if (range[i] === "reward") {
            rewardData.push({
              content: "奖学金获得情况(只包含奖学金等级信息)",
              name: "个人荣誉",
              type: "综合素质信息"
            });
          }
        }
        this.tableData = [...profileData, ...rewardData, ...raceData, ...rankData, ...clubData];
        this.loading = false;
      }).catch(() => {
        this.$message.error("出错啦,请稍后再试");
        this.loading = false;
      });
    },
    //下一步
    next() {
      if (!this.upload)
        this.dataFile = this.file;
      document.querySelector(".disclose").style.maxHeight = this.wh - 300 + "px";
      this.resetForm();
      this.loading = true;
      var data = new FormData();
      data.append("dataFile", this.dataFile);
      this.axios({
        method: "post",
        url: "/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data,
      }).then((response) => {
        this.content = response.data.data.Body.data_map;
        var range = Object.keys(this.content);
        for (var i = 0; i < range.length; i++) {
          if (range[i] === "profile") {
            const translation = {
              ClassName: "班级名称",
              SchoolCode: "学校代码",
              StaffID: "学号",
              UnitName: "学院名称",
              MajorName: "专业名称",
              Sex: "性别",
              Name: "姓名",
              Nation: "民族"
            };
            const sort = ["Name", "Sex", "Nation", "ClassName", "MajorName", "UnitName", "SchoolCode"];
            const profile = Object.keys(this.content.profile[Object.keys(this.content.profile)]);
            this.profileData = [];
            this.profileDataValue = [];
            for (let i = 0; i < sort.length; i++) {
              if (profile.indexOf(sort[i])) {
                this.profileDataValue.push(sort[i]);
                this.profileData.push({
                  value: sort[i],
                  name: translation[sort[i]]
                });
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
              this.scoreDataValue.push(score[j]);
              this.scoreData.push({
                value: this.content.score[score[j]].CourseCode,
                name: this.content.score[score[j]].CourseName,
                gp: this.content.score[score[j]].GP,
              });
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
              });
            }
          }
          else if (range[i] === "reward") {
            this.rewardData = [];
            this.rewardDataValue = [];
            var reward = Object.keys(this.content.reward);
            for (var j = 0; j < reward.length; j++) {
              this.rewardDataValue.push(reward[j]);
              this.rewardData.push({
                yearValue: this.content.reward[reward[j]].SchoolYear,
                semValue: this.content.reward[reward[j]].Semester === 0 ? "第一学期" : "第二学期",
                name: this.content.reward[reward[j]].RewardName,
                key: reward[j]
              });
            }
          }
          else if (range[i] === "race_reward") {
            this.raceData = [];
            this.raceDataValue = [];
            var race = Object.keys(this.content.race_reward);
            for (var j = 0; j < race.length; j++) {
              this.raceDataValue.push(race[j]);
              this.raceData.push({
                value: this.content.race_reward[race[j]].RewardDate,
                name: this.content.race_reward[race[j]].RaceName,
                key: race[j]
              });
            }
          }
          else if (range[i] === "rank") {
            const rank = this.content.rank[Object.keys(this.content.rank)[0]];
            this.rankData = [{
              GPA: rank.GPA,
              MajorName: rank.MajorName,
              Rank: rank.Rank
            }];
          }
          else if (range[i] === "org_experience") {
            const club = Object.keys(this.content.org_experience);
            this.clubData = [];
            for (let i = 0; i < club.length; i++) {
              this.clubData.push({
                ID: this.content.org_experience[club[i]].ID,
                title: club[i]
              });
            }
          }
        }
        this.loading = false;
      }).catch((err) => {
        if (err.response.data.msg === "file hash does not equal to chain")
          this.$message.error("学业文件错误或者过期,请检查后再试");
        else
          this.$message.error("获取学业文件信息出错啦,请稍后再试");
        this.dataFile = "";
        this.loading = false;
      });
    },
    back() {
      this.upload = false;
      this.dataFile = "";
      this.getInfo();
    },
    // 提交按钮
    submitForm(id) {
      this.$confirm("请确认信息选填无误,是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        var ShareItems = [{ "Path": ["profile", Object.keys(this.content.profile)[0], "StaffID"] }, { "Path": ["profile", Object.keys(this.content.profile)[0], "ClassCode"] }];
        var Path = [];
        var data = new FormData();
        data.append("dataFile", this.dataFile);
        if (this.ruleForm.profileType.length != 0) {
          // if (this.checkAll1 === true)
          //   ShareItems.push({ "Path": ["profile", Object.keys(this.content.profile)[0]] })
          // else
          for (let i = 0; i < this.ruleForm.profileType.length; i++) {
            if (this.ruleForm.profileType[i] === "MajorName")
              this.ruleForm.profileType.push("MajorCode");
            if (this.ruleForm.profileType[i] === "UnitName")
              this.ruleForm.profileType.push("UnitCode");
            Path = ["profile", Object.keys(this.content.profile)[0]];
            Path.push(this.ruleForm.profileType[i]);
            ShareItems.push({ "Path": Path });
          }
        }
        if (this.gpa)
          ShareItems.push({ "Path": ["rank", Object.keys(this.content.profile)[0]] });
        if (this.ruleForm.intType.indexOf("org_experience") !== -1)
          for (let i = 0; i < this.clubData.length; i++)
            ShareItems.push({ "Path": ["org_experience", this.clubData[i].title] });
        if (this.ruleForm.rewardType.indexOf("race_reward") !== -1)
          for (let i = 0; i < this.raceDataValue.length; i++)
            ShareItems.push({ "Path": ["race_reward", this.raceDataValue[i]] });
        if (this.ruleForm.rewardType.indexOf("reward") !== -1)
          for (let i = 0; i < this.rewardDataValue.length; i++)
            ShareItems.push({ "Path": ["reward", this.rewardDataValue[i]] });
        data.append("body", JSON.stringify({ "ShareItems": ShareItems }));
        this.axios({
          method: "put",
          url: "/expose/cache?topic=profile&staffID" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data,
        }).then(() => {
          this.$confirm("信息已经成功公开，你也可以随时更改", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning",
          }).then(() => {
            this.back();
          });
          this.dialogVisible = true;
          this.loading = false;
        })
          .catch(() => {
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
      this.upload = false;
    }
    this.getInfo();
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