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
      label-width="100px"
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
            :indeterminate="isIndeterminate1"
            v-model="checkAll1"
            @change="CheckAllChange($event, 1)"
            border
            v-show="profileData.length != 0"
            style="width: 80px"
          >全选</el-checkbox>
          <el-checkbox-group
            v-model="ruleForm.profileType"
            style="margin-left: 50px; width: 960px"
            @change="CheckedChange($event, 1)"
          >
            <el-checkbox
              v-for="item in profileData"
              v-bind:key="item.value"
              :label="item.value"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="要分享的学业信息" required>
          <el-checkbox
            :indeterminate="isIndeterminate2"
            v-model="checkAll2"
            @change="CheckAllChange($event, 2)"
            border
            v-show="scoreData.length != 0"
            style="width: 80px"
          >全选</el-checkbox>
          <el-checkbox-group
            v-model="ruleForm.scoreType"
            style="margin-left: 50px; width: 960px"
            @change="CheckedChange($event, 2)"
          >
            <el-checkbox
              v-for="item in scoreData"
              v-bind:key="item.value"
              :label="item.value"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择目的企业和岗位" required>
          <!-- <el-select v-model="ruleForm.hr" filterable collapse-tags placeholder="请选择">
            <el-option
              v-for="item in hrOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <el-cascader
            v-model="ruleForm.hr"
            :options="options"
            :props="{ multiple: false }"
            collapse-tags
            clearable >
          </el-cascader>
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
      stepActive: 0,
      checkAll1: false,
      checkAll2: false,
      isIndeterminate1: false,
      isIndeterminate2: false,
      shareLink: "",
      content: "",
      fileList: [],
      file: "",
      btnShow: false,
      ruleForm: {
        date: "",
        hr: "",
        profileType: [],
        scoreType: [],
      },
      profileData: [],
      profileDataValue: [],
      scoreData: [],
      scoreDataValue: [],
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
    CheckAllChange(val, id) {
      switch (id) {
        case 1:
          this.ruleForm.profileType = val ? this.profileDataValue : [];
          this.isIndeterminate1 = false;
          break
        case 2:
          this.ruleForm.scoreType = val ? this.scoreDataValue : [];
          this.isIndeterminate2 = false;
          break
      }
    },
    CheckedChange(val, id) {
      let checkedCount = val.length;
      switch (id) {
        case 1:
          this.checkAll1 = checkedCount === this.profileDataValue.length;
          this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.profileDataValue.length;
          break
        case 2:
          this.checkAll2 = checkedCount === this.scoreDataValue.length;
          this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.scoreDataValue.length;
          break
      }
    },
    onCopy() {
      this.$notify({
        title: "成功",
        message: "复制成功,快去分享吧",
        type: "success"
      });
    },
    onCopyError() {
      this.$notify.error({
        title: "错误",
        message: "复制失败,请手动选中复制"
      });
    },
    closeDialog() {
      this.dialogVisible = false
      this.loading = false
      this.resetForm()
    },
    getFile() {
      this.btnShow = true
    },
    change(response, file, fileList) {
      this.file = file[0].raw
    },
    remove(file, fileList) {
      this.fileList = []
    },
    next() {
      document.querySelector(".info-select").style.maxHeight = this.wh - 360 + "px";
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
          console.log(this.content);
          var range = Object.keys(this.content);
          for (var i = 0; i < range.length; i++) {
            if (range[i] === "profile") {
              const translation = {
                ClassCode: "班级号码",
                ClassName: "班级名称",
                SchoolCode: "学校代码",
                StaffID: "学号",
                UnitCode: "学院代码",
                UnitName: "学院名称"
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
          }
          this.loading = false
        })
        .catch((error) => {
          this.$message.error("出错啦,请稍后再试")
        });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.ruleForm = {
        date: "",
        hr: [],
        profileType: [],
        scoreType: []
      }
      this.isIndeterminate1 = false;
      this.checkAll1 = false;
      this.isIndeterminate2 = false;
      this.checkAll2 = false;
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
            if (this.checkAll2 === true)
              ShareItems.push({ "Path": ["score"] })
            else
              for (var i = 0; i < this.ruleForm.scoreType.length; i++) {
                Path = ["score"]
                Path.push(this.ruleForm.scoreType[i])
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
                  console.log(this.shareLink);
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
  width: 500px;
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