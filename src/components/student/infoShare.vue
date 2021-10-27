<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息分享</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      :model="ruleForm"
      v-loading="loading"
      element-loading-text="拼命加载中"
      ref="ruleForm"
      label-width="120px"
    >
      <el-steps
        :active="stepActive"
        align-center
        finish-status="success"
        style="height: 70px;margin-bottom: 50px"
      >
        <el-step title="步骤 1" description="请上传您之前生成的学业文件" icon="el-icon-user"></el-step>
        <el-step title="步骤 2" description="请确定此次分享的各项信息" icon="el-icon-edit"></el-step>
      </el-steps>
      <div v-show="stepActive===0">
        <el-upload
          class="upload"
          action="#"
          :http-request="getFile"
          :limit="1"
          :on-change="change"
          :on-remove="remove"
          :file-list="fileList"
          accept=".enc"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传enc格式的学业文件</div>
        </el-upload>
        <el-button class="next" type="primary" plain v-show="btnShow" @click="next()">下一步</el-button>
      </div>
      <div v-show="stepActive===1" class="info-select" style="overflow: auto; max-height: 550px;">
        <el-form-item label="要分享的学籍信息" required>
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
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="课程 " width="300">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="value" label="选课号"></el-table-column>
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
        <el-form-item label="选择目的企业和岗位" required>
          <el-cascader
            v-model="ruleForm.hr"
            :options="options"
            :props="{ multiple: false }"
            collapse-tags
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="有效时间"
          prop="date"
          :rules="[
        { type: 'number', message: '有效日期须为数字', trigger: 'change'},
        { type: 'number', max: 9999, message: '数值过大', trigger: 'change'}
      ]"
        >
          <el-input v-model.number="ruleForm.date" style="width: 150px" placeholder="默认为10天"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()"
            style="margin: 0 0 30px 50px; width: 150px"
          >立即分享</el-button>
          <el-button @click="resetForm()" style="width: 100px">重置</el-button>
          <el-button type="primary" @click="stepActive = 0" style="width: 100px">上一步</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>
        <i class="el-icon-success el-icon--left" style="color: #67C23A"></i>分享成功! 此次分享链接为:
      </span>
      <span>
        <el-popover placement="bottom" width="500" trigger="hover" :content="shareLink">
          <i id="shareLink" slot="reference">{{shareLink}}</i>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="复制" placement="right">
          <el-button
            v-clipboard:copy="shareLink"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
          >
            <i class="el-icon-document-copy"></i>
          </el-button>
        </el-tooltip>
      </span>
      <span>请将此链接妥善保存,线下分享给企业即可</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let FormData = require("form-data");
export default {
  data() {
    return {
      stepActive: 0,//步骤数
      checkAll: false,//学籍信息全选
      isIndeterminate: false,//学籍全选按钮的不确定状态
      shareLink: "",//分享链接
      content: "",//学业文件内容
      fileList: [],//upload文件列表
      file: "",//文件
      btnShow: false,//下一步按钮显示
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
      options: [
        {
          value: "company1",
          label: "杭州椿玮电子商务有限公司",
          children: [
            {
              value: 1,
              label: "淘宝天猫客服",
            },
            {
              value: 2,
              label: "跨境电商运营",
            },
            {
              value: 3,
              label: "淘宝天猫运营",
            }]
        },
        {
          value: "company2",
          label: "杭州未景科技有限公司",
          children: [
            {
              value: 1,
              label: "小程序全栈工程师",
            },
            {
              value: 2,
              label: "全栈工程师",
            },
            {
              value: 3,
              label: "销售专员",
            }]
        },
        {
          value: "company3",
          label: "杭州信与义专利代理有限公司",
          children: [
            {
              value: 1,
              label: "销售",
            },
            {
              value: 2,
              label: "知识产权销售顾问",
            },
            {
              value: 3,
              label: "专利事务所合作人",
            }]
        }],
      loading: false,
      dialogVisible: false
    };
  },
  props: ["wh"],
  methods: {
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
    //复制成功提示
    onCopy() {
      this.$notify({
        title: "成功",
        message: "复制成功,快去分享吧",
        type: "success"
      });
    },
    //复制失败提示
    onCopyError() {
      this.$notify.error({
        title: "错误",
        message: "复制失败,请手动选中复制"
      });
    },
    //关闭分享成功的dialog
    closeDialog() {
      this.dialogVisible = false
      this.loading = false
      this.resetForm()
    },
    //文件加载完成,出现下一步按钮
    getFile() {
      this.btnShow = true
    },
    //将文件放到file变量中
    change(response, file, fileList) {
      this.file = file[0].raw
    },
    //删除文件
    remove(file, fileList) {
      this.fileList = []
      this.file = ""
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
      document.querySelector(".info-select").style.maxHeight = this.wh - 360 + "px";
      this.resetForm();
      this.stepActive = 1;
      this.loading = true;
      var data = new FormData();
      data.append("dataFile", this.file);
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
                Nation: "民族",
              }
              var profile = Object.keys(this.content.profile[Object.keys(this.content.profile)]);
              this.profileData = [];
              this.profileDataValue = [];
              for (var j = 0; j < profile.length; j++) {
                this.profileDataValue.push(profile[j])
                this.profileData.push({
                  value: profile[j],
                  name: translation[profile[j]]
                })
              }
            }
            else if (range[i] === "score") {
              this.scoreData = [];
              this.scoreDataValue = [];
              var score = Object.keys(this.content.score);
              for (var j = 0; j < score.length; j++) {
                this.scoreDataValue.push(score[j])
                this.scoreData.push({
                  value: score[j],
                  name: this.content.score[score[j]].CourseName,
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
                  key: level[j],
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
      .catch(() => {
        this.$message.error("获取学业文件信息出错啦,请稍后再试")
      });
    },
    // 提交按钮
    submitForm() {
      if (this.ruleForm.hr === "") {
        this.$message({
          type: "error",
          message: "请选择要分享的企业",
        });
        return
      }
      if ((!(/(^[1-9]\d*$)/.test(this.ruleForm.date)) && this.ruleForm.date != "") || this.ruleForm.date > 9999) {
        this.$message({
          type: "error",
          message: "分享时长填写有误,请检查",
        });
        return
      }
      this.$confirm("请确认信息选填无误,是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          var ShareItems = [];
          var Path = [];
          var data = new FormData();
          data.append("dataFile", this.file);
          data.append("companyCode", this.ruleForm.hr[0]);
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
          this.axios
            .get("https://api.limkim.xyz/getSysTime")
            .then((response) => {
              if (this.ruleForm.date === "")
                var nextDate = new Date((response.data.Systime2 + 10 * 86400000));
              else
                var nextDate = new Date((response.data.Systime2 + this.ruleForm.date * 86400000));
              data.append("expireAtStr", "{\"Time\":\"" + nextDate.toISOString() + "\"}");
              this.axios({
                method: "post",
                url: "https://api.hduhelp.com/gormja_wrapper/share/share?topic=profile",
                headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
                data,
              })
                .then((response) => {
                  this.shareLink = "https://api.hduhelp.com/gormja_wrapper/share/verify?fileID=" + response.data.data.Body.FileID + "&encryptedK1S=" + response.data.data.Body.EncryptedK1S;
                  this.dialogVisible = true;
                  this.loading = false
                })
                .catch((error) => {
                  this.$message.error("出错啦,请稍后再试");
                  this.loading = false;
                });
            });
        })
      .catch(() => {
        this.$message({
          type: "info",
          message: "分享已取消",
        });
      });
    },
  },
  mounted() {
    document.querySelector(".el-form").style.maxHeight = this.wh - 190 + "px";
  },
};
</script>

<style scoped>
.el-form {
  overflow: auto;
  margin: 30px 10px 10px 10px;
  width: calc(100% - 20px);
  min-height: 500px;
  padding: 40px 100px 0 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}
.upload,
.next {
  margin: 30px 0 0 calc(50% - 180px);
  width: 360px;
}
.info-select {
  margin: 40px;
}
.line {
  text-align: center;
  margin-top: 50px;
}
.el-checkbox {
  width: 300px;
  margin-right: 20px;
}
.el-dialog span {
  display: block;
  margin: 15px 0;
  height: 25px;
  line-height: 25px;
  font-size: 18px;
}
.el-dialog span:nth-child(2) {
  display: inline-block;
  width: 100%;
}
.el-dialog span:nth-child(2) span {
  display: inline-block;
  margin: 0;
}
.el-dialog span i:nth-child(2) {
  cursor: pointer;
}
.el-dialog span .el-button:nth-child(2) {
  vertical-align: text-top;
  border: none;
  width: 14px;
  height: 14px;
  padding: 0;
  text-align: center;
  line-height: 14px;
}
#shareLink {
  display: inline-block;
  cursor: pointer;
  font-style: normal;
  color: #909399;
  height: 25px;
  width: 400px;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
<style>
.el-form-item .el-form-item__label {
  width: 150px !important;
}
.message_box_confirm {
  word-break: break-all !important;
}
</style>