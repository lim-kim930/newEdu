<template>
  <el-form ref="form" class="form1" v-loading="loading" element-loading-text="拼命加载中">
    <el-tag type="success" style="margin: 10px 0 0 0" v-show="file != ''" :disable-transitions="true">
      <i class="el-icon-success"></i> 学业文件已上传
    </el-tag>
    <el-tag type="info" style="margin: 10px 0 0 0" v-show="file === ''" :disable-transitions="true">
      <i class="el-icon-error"></i> 学业文件未上传
    </el-tag>
    <el-upload
      ref="file-upload"
      class="upload"
      action="#"
      :http-request="getFile"
      :limit="1"
      :on-change="change"
      accept=".enc"
      :show-file-list="false"
      v-show="file === ''"
    >
      点击上传学业文件
      <i class="el-icon-upload"></i>
    </el-upload>
    <el-button
      type="primary"
      plain
      icon="el-icon-delete-solid"
      @click="reupload()"
      v-show="file != ''"
      style="margin-left: 10px;"
    >删除文件</el-button>
    <el-button
      type="primary"
      plain
      icon="el-icon-download"
      @click="downloadFile('学业文件.enc')"
      v-show="file != ''"
      style="margin-left: 10px;"
    >下载文件</el-button>
    <br>
    <span>请选择类型:</span>
    <el-select v-model="typeValue" placeholder="请选择" style="width: 150px; margin: 15px;" @change="getScore(true)">
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span>请选择学年:</span>
    <el-select v-model="yearValue" placeholder="请选择" style="width: 150px; margin: 15px;">
      <el-option
        v-for="item in yearOptions"
        :key="item.value"
        :label="item.label"
        :value="item.label"
      ></el-option>
    </el-select>
    <span>学期:</span>
    <el-select v-model="termValue" placeholder="请选择" style="width: 150px; margin: 15px;">
      <el-option
        v-for="item in termOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-button
      type="primary"
      icon="el-icon-search"
      @click="getScore(false)"
      :loading="secLoading"
    >查询</el-button>
    <el-table v-show="typeValue==='score'" :data="Score" border style="width: 100%; margin-top: 0;">
      <el-table-column prop="Value.CourseName.Value" label="课程"></el-table-column>
      <el-table-column prop="Value.CourseCode.Value" label="选课号"></el-table-column>
      <el-table-column prop="Value.Score.Value" label="成绩" width="180"></el-table-column>
      <el-table-column prop="Value.GP.Value" label="绩点" width="180"></el-table-column>
    </el-table>
    <el-table
      v-show="typeValue==='level_exam'"
      :data="LevelScore"
      border
      style="width: 100%; margin-top: 0;"
    >
      <el-table-column prop="ExamName.Value" label="考试名称"></el-table-column>
      <el-table-column prop="Score.Value" label="考试成绩"></el-table-column>
      <el-table-column prop="RegID.Value" label="准考证号"></el-table-column>
      <el-table-column prop="ExamDate.Value" label="考试日期"></el-table-column>
    </el-table>
    <el-result icon="success" title="课程成绩信息已确认" v-show="typeValue === 'score'&&scoreConfirmed"></el-result>
    <el-result icon="success" title="等级考试信息已确认" v-show="typeValue === 'level_exam'&&levelConfirmed"></el-result>
    <el-button
      type="primary"
      @click="scoreSubmit()"
      plain
      v-show="typeValue==='score'&&!scoreConfirmed"
      :disabled="scoreBtnDisabled"
    >确认信息</el-button>
    <el-button
      type="primary"
      @click="levelSubmit()"
      plain
      style="margin-left: 0"
      v-show="typeValue==='level_exam'&&!levelConfirmed"
      :disabled="levelBtnDisabled"
    >确认信息</el-button>
    <el-button type="info" @click="dialog = true" plain v-show="(typeValue==='score'&&!scoreConfirmed)||(typeValue==='level_exam'&&!levelConfirmed)">错误反馈</el-button>
    <el-drawer
      title="学业信息错误反馈提示"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <h4>请联系教务处修改后返回系统，检查无误后继续完成成绩确认</h4>
      <h4>教务处联系信息:</h4>
      <div class="content">
        <span>电话: 0571-86915011</span>
        <span>邮箱地址: hdujwc@hdu.edu.cn</span>
        <span>地址: 行政楼</span>
      </div>
      <el-button @click="$refs.drawer.closeDrawer()" style="margin: 20px 0 0 50px; width: 100px">确 定</el-button>
    </el-drawer>
    <el-dialog title="交易详情" :visible.sync="dialogTableVisible">
      <el-table :data="blockDataInfo">
        <el-table-column property="name" label="交易信息" width="150"></el-table-column>
        <el-table-column property="value" label="对应值"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>
<script>
let FormData = require("form-data");
export default {
  data() {
    return {
      Score: [],//学期成绩数据
      LevelScore: [],//等级考试信息数据
      typeOptions: [{
        value: "score",
        label: "课程成绩"
      }, {
        value: "level_exam",
        label: "等级考试"
      }],
      typeValue: "score",
      yearOptions: [],
      yearValue: "",
      termOptions: [{
        value: "1",
        label: "第一学期"
      }, {
        value: "2",
        label: "第二学期"
      }],
      termValue: "",
      dialog: false,//错误反馈显示
      loading: false,//form加载
      secLoading: false,//查询按钮加载
      scoreConfirmed: false,//学期成绩信息确认状态
      levelConfirmed: false,//等级考试信息确认状态
      scoreBtnDisabled: true,//学期成绩信息确认按钮禁用
      levelBtnDisabled: true,//等级考试信息确认按钮禁用
      file: "",//学业文件
      dialogTableVisible: false,//交易详情显示
      blockDataInfo: []//交易详情信息数据
    };
  },
  props: ["globalFile"],//拿到infoConfirmed页面file
  methods: {
    //文件上传成功后
    getFile(params) {
      this.file = params.file;
      this.$emit("func", params.file);
      this.getScore(true);
    },
    //删除文件
    reupload() {
      this.$refs["file-upload"].clearFiles();
      this.file = "";
      sessionStorage.removeItem("score");
      sessionStorage.removeItem("level_exam");
      sessionStorage.removeItem("hj");
      this.scoreBtnDisabled = true;
      this.levelBtnDisabled = true;
      this.$emit("func", "");
    },
    change(response, file, fileList) {
      sessionStorage.removeItem("score");
      sessionStorage.removeItem("level_exam");
      sessionStorage.removeItem("hj");
    },
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(","),
        bstr = atob(arr[0]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: "enc" });
    },
    downloadFile(filename) {
      var Url = URL.createObjectURL(this.file);
      const eleLink = document.createElement("a")
      eleLink.download = filename
      eleLink.style.display = "none"
      eleLink.href = Url
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
      setTimeout(() => {
        this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        })
      }, 400)
    },
    //拿到学期成绩信息
    getScore(byFile) {//上传文件调用的,就不需要提示选择学期了
      if (this.yearValue === "" || this.termValue === "") {
        if (byFile !== true)
          this.$message({
            message: "请选择要查询的学年以及学期",
            type: "warning"
          });
        return
      }
      this.loading = true;
      this.secLoading = true;
      this.LevelScore = [];//因为填充数据是push,而不是像Score的=,所以需要先清空
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=" + this.typeValue,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: {
          SchoolCode: 1,
          StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID,
          SchoolYear: this.yearValue.replace(/\s+/g, ""),
          Semester: +this.termValue
        }
      })
        .then((response) => {
          if (response.data.data.length === 0) {
            this.$alert("没有查询到该学年学期的相关成绩信息", "警告", {
              confirmButtonText: "确定",
              type: "warning",
            });
            if (this.typeValue === "score") {
              this.Score = [];
              this.scoreConfirmed = false;
              this.scoreBtnDisabled = true;
            } else if (this.typeValue === "level_exam") {
              this.LevelScore = [];
              this.levelConfirmed = false;
              this.levelBtnDisabled = true;
            }
            this.secLoading = false;
            this.loading = false;
          }
          else {
            if (this.file !== "") {//如果上传了文件
              if (sessionStorage.getItem(this.typeValue) === null) {//如果没有存对应类型成绩的已确认的学期,需要请求明文
                var data = new FormData();
                data.append("dataFile", this.file);
                // 拿到学生档案明文
                this.axios({
                  method: "post",
                  url: "https://api.hduhelp.com/gormja_wrapper/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
                  headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
                  data,
                })
                  .then((response2) => {
                    var scores = []//存储学业文件内有成绩的学年和学期,避免每次查询都要请求一次文件明文
                    if (JSON.stringify(response2.data.data.Body.data_map) !== "{}" && response2.data.data.Body.data_map[this.typeValue] !== undefined) {
                      var courses = Object.keys(response2.data.data.Body.data_map[this.typeValue])
                      if (this.typeValue === "score") {
                        for (var i = 0; i < courses.length; i++) {
                          var term = courses[i].split("(")[1].split(")")[0]
                          if (scores.indexOf(term) === -1) {
                            scores.push(term)
                            this.scoreConfirmed = scores.indexOf(this.yearValue.replace(/\s+/g, "") + "-" + this.termValue) != -1 ? true : false
                          }
                        }
                      }
                      else if (this.typeValue === "level_exam") {
                        var level_exam = response2.data.data.Body.data_map.level_exam
                        for (var i = 0; i < courses.length; i++) {
                          var term = level_exam[courses[i]].SchoolYear + " - " + level_exam[courses[i]].Semester
                          if (scores.indexOf(term) === -1) {
                            scores.push(term)
                            this.levelConfirmed = scores.indexOf(this.yearValue.replace(/\s+/g, "") + "-" + this.termValue) !== -1 ? true : false
                          }
                        }
                      }
                    }
                    if (this.typeValue === "score") {
                      this.Score = response.data.data
                      this.scoreBtnDisabled = false
                    }
                    else if (this.typeValue === "level_exam") {
                      response.data.data.forEach(item => {
                        this.LevelScore.push(item.Value)
                      });
                      this.levelBtnDisabled = false
                    }
                    var data = response2.data.data.Body.data_map
                    if (data.reward !== undefined && data.race_reward !== undefined)
                      sessionStorage.setItem("hj", JSON.stringify(["reward", "race_reward"]))
                    else if (data.reward !== undefined && data.race_reward === undefined)
                      sessionStorage.setItem("hj", JSON.stringify(["reward"]))
                    else if (data.reward === undefined && data.race_reward !== undefined)
                      sessionStorage.setItem("hj", JSON.stringify(["race_reward"]))
                    else if (data.reward === undefined && data.race_reward === undefined)
                      sessionStorage.setItem("hj", JSON.stringify([]))
                    sessionStorage.setItem(this.typeValue, JSON.stringify(scores))
                    this.loading = false
                    this.secLoading = false
                  })
                  .catch(() => {
                    this.$message.error("获取学业文件信息出错啦,请稍后再试")
                    if (this.typeValue === "score") {
                      this.Score = response.data.data
                      this.scoreBtnDisabled = true
                    }
                    else if (this.typeValue === "level_exam") {
                      this.LevelScore = response.data.data
                      this.levelBtnDisabled = true
                    }
                    this.loading = false
                    this.secLoading = false
                  });
              }
              else {//如果有存过的score或者level,不用请求文件中的信息,直接比对
                var scores = JSON.parse(sessionStorage.getItem(this.typeValue))
                if (this.typeValue === "score") {
                  this.scoreConfirmed = scores.indexOf(this.yearValue.replace(/\s+/g, "") + "-" + this.termValue) !== -1 ? true : false
                  this.Score = response.data.data
                  this.scoreBtnDisabled = false
                }
                else if (this.typeValue === "level_exam") {
                  this.levelConfirmed = scores.indexOf(this.yearValue.replace(/\s+/g, "") + "-" + this.termValue) !== -1 ? true : false
                  response.data.data.forEach(item => {
                    this.LevelScore.push(item.Value)
                  });
                  this.levelBtnDisabled = false
                }
                this.loading = false
                this.secLoading = false
              }
            }
            else {//如果没有上传文件,直接展示数据就行
              if (this.typeValue === "score") {
                this.scoreConfirmed = false
                this.Score = response.data.data
                this.scoreBtnDisabled = true;
              }
              else if (this.typeValue === "level_exam") {
                this.levelConfirmed = false
                response.data.data.forEach(item => {
                  this.LevelScore.push(item.Value)
                });
                this.levelBtnDisabled = true;
              }
              this.loading = false
              this.secLoading = false
            }
          }
        })
        .catch(() => {
          this.$alert("出错啦,请稍后再试", "警告", {
            confirmButtonText: "确定",
            type: "warning",
          });
          this.loading = false;
          this.secLoading = false;
        })
    },
    confirm() {
      var data = new FormData()
      data.append("dataFile", this.file);
      data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + ", \"SchoolYear\":\"" + this.yearValue.replace(/\s+/g, "") + "\", \"Semester\":" + +this.termValue + "}");
      this.loading = true;
      this.axios({
        method: "put",
        url: "https://api.hduhelp.com/gormja_wrapper/confirm?topic=" + this.typeValue,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data,
      })
        .then((response) => {
          var block = response.data.data.TransactionDetail.detail.result[0]
          var blockName = Object.keys(block)
          const translation = {
            blockHash: "区块哈希",
            blockNumber: "交易号",
            blockTimestamp: "区块时间戳",
            blockWriteTime: "写入时间",
            hash: "交易内容"
          }
          this.blockDataInfo = []
          for (var i = 0; i < blockName.length; i++) {
            this.blockDataInfo.push({
              value: block[blockName[i]],
              name: translation[blockName[i]]
            })
          }
          sessionStorage.removeItem(this.typeValue);//清空之前存储的学期信息
          this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
          this.$emit("func", this.file);
          this.$confirm("学业信息确认成功！继续确认请点击任意空白区域", "提示", {
            confirmButtonText: "下载新的学业文件",
            cancelButtonText: "查看此次交易详情",
            distinguishCancelAndClose: true,
            beforeClose: (action, instance, done) => {
              if (action === "cancel")
                this.dialogTableVisible = true
              if (action === "confirm" || action === "close")
                done()
            },
            dangerouslyUseHTMLString: true,
            type: "success"
          }).then(() => {
            this.downloadFile("学业文件.enc")
          }).catch(() => {
            this.$message({
              type: "info",
              message: "请在结束确认时下载最新的学业文件",
            });
          });
          this.loading = false;
          if(this.typeValue === "score")
            this.scoreConfirmed = true;
          else
            this.levelConfirmed = true;
        })
        .catch(() => {
          this.$message.error("出错啦,请稍后再试");
          this.loading = false;
        });
    },
    scoreSubmit() {
      this.$confirm("请确认当前系统内的本学期课程成绩信息准确无误, 是否继续确认?", "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$confirm("如果确认错误的学业信息,您将承担所有的后果, 是否继续确认?", "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.$confirm("学业信息确认后将很难更改,请确认无误, 是否继续确认?", "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  this.confirm();
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "操作已取消",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "操作已取消",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消",
          });
        });
    },
    levelSubmit() {
      this.$confirm("请确认当前系统内的本学期等级考试信息准确无误, 是否继续确认?", "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.confirm();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消",
          });
        });
    },
  },
  mounted() {
    this.file = this.globalFile;
    var grade = +JSON.parse(localStorage.getItem("jw_student_file")).staffID.substr(0, 2)
    //根据学号判断年级,提供对应的4年学年选择
    for(var i = 0; i < 4; i++)
      this.yearOptions.push({
        value: i,
        label: "20"+ (grade + i) + " - 20" + (grade + i + 1)
      })
  },
};
</script>

<style scoped>
.el-table {
  margin: 20px 0;
}
.upload {
  display: inline-block;
  margin-left: 30px;
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
.el-tag {
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  margin-left: 10px;
}
</style>
