<template>
  <el-form ref="form" class="form1" v-loading="loading" element-loading-text="拼命加载中">
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
    <el-button type="primary" icon="el-icon-search" @click="getScore()" :loading="secLoading">查询</el-button>
    <el-tag type="success" v-show="file != ''" :disable-transitions="true">
      <i class="el-icon-check"></i> 学业文件已上传
    </el-tag>
    <el-tag type="info" v-show="file === ''" :disable-transitions="true">
      <i class="el-icon-close"></i> 学业文件未上传
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
    <el-table :data="tableData" border style="width: 100%; margin-top: 0;">
      <el-table-column prop="Value.CourseName.Value" label="课程" width="220"></el-table-column>
      <el-table-column prop="Value.CourseCode.Value" label="课程代码"></el-table-column>
      <el-table-column prop="Value.Score.Value" label="成绩" width="180"></el-table-column>
      <el-table-column prop="Value.GP.Value" label="绩点"></el-table-column>
    </el-table>
    <el-result icon="success" title="信息已确认" v-show="confirmed"></el-result>
    <el-button type="primary" @click="submit()" plain v-show="!confirmed" :disabled="disabled">确认信息</el-button>
    <el-button type="info" @click="queSubmit()" plain v-show="!confirmed">错误反馈</el-button>
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
      tableData: [],
      yearOptions: [{
        value: "0",
        label: "2019 - 2020"
      }, {
        value: "2",
        label: "2020 - 2021"
      }, {
        value: "4",
        label: "2021 - 2022"
      }],
      yearValue: "",
      termOptions: [{
        value: "1",
        label: "第一学期"
      }, {
        value: "2",
        label: "第二学期"
      }],
      termValue: "",
      closeBtn: false,
      dialog: false,
      loading: false,
      secLoading: false,
      confirmed: false,
      disabled: true,
      file: "",
      dialogTableVisible: false,
      blockDataInfo: []
    };
  },
  props: ["sendDataToChid"],
  methods: {
    getFile(params) {
      console.log(params.file);
      this.file = params.file;
      this.$emit("func", params.file);
      this.getScore();
    },
    reupload() {
      this.$refs["file-upload"].clearFiles();
      this.file = "";
      sessionStorage.removeItem("terms");
      this.disabled = true;
      this.$emit("func", "");
    },
    change(response, file, fileList) {
      sessionStorage.removeItem("terms");
      // sessionStorage.setItem("arc_file", JSON.stringify(file))
      // this.fileList.push({
      //   name: file.name
      // })
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
    queSubmit() {
      this.dialog = true;
    },
    getScore() {
      if (this.yearValue == "" || this.termValue == "") {
        this.$message({
          message: "请选择要查询的学年以及学期",
          type: "warning"
        });
        return
      }
      this.loading = true;
      this.secLoading = true;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=score",
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
            this.$alert("没有查询到该学年学期的成绩信息", "警告", {
              confirmButtonText: "确定",
              type: "warning",
            });
            this.tableData = ""
            this.disabled = true;
            this.secLoading = false;
            this.loading = false;
            this.confirmed = false;
          }
          else {
            console.log(document.querySelector(".el-form").style.height);
            if (this.file != "") {
              if (sessionStorage.getItem("terms") === null) {
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
                    var terms = []
                    if (JSON.stringify(response2.data.data.Body.data_map) != "{}" && response2.data.data.Body.data_map.score != undefined) {
                      var courses = Object.keys(response2.data.data.Body.data_map.score)
                      for (var i = 0; i < courses.length; i++) {
                        var term = courses[i].split("(")[1].split(")")[0]
                        if (terms.indexOf(term) === -1) {
                          terms.push(term)
                          if (terms.indexOf(this.yearValue.replace(/\s+/g, "") + "-" + this.termValue) != -1)
                            this.confirmed = true
                          else
                            this.confirmed = false
                        }
                      }
                    }
                    sessionStorage.setItem("terms", JSON.stringify(terms))
                    this.tableData = response.data.data
                    this.loading = false
                    this.secLoading = false
                    this.disabled = false
                  })
                  .catch((error) => {
                    this.$message.error("出错啦,请稍后再试")
                    this.tableData = response.data.data
                    this.loading = false
                    this.secLoading = false
                    this.disabled = true
                  });
              }
              else {
                var terms = JSON.parse(sessionStorage.getItem("terms"))
                if (terms.indexOf(this.yearValue.replace(/\s+/g, "") + "-" + this.termValue) != -1)
                  this.confirmed = true
                else
                  this.confirmed = false
                this.tableData = response.data.data
                this.loading = false
                this.secLoading = false
                this.disabled = false
              }
            }
            else {
              this.tableData = response.data.data
              this.loading = false
              this.secLoading = false
              this.disabled = true
              this.confirmed = false
            }
          }
        })
        .catch((err) => {
          this.$alert("出错啦,请稍后再试", "警告", {
            confirmButtonText: "确定",
            type: "warning",
          });
          this.loading = false;
          this.secLoading = false;
        })
    },
    submit() {
      this.$confirm(
        "请确认当前系统内的本学期学业信息准确无误, 是否继续确认?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$confirm(
            "如果确认错误的学业信息,您将承担所有的后果, 是否继续确认?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.$confirm(
                "学业信息确认后将很难更改,请确认无误, 是否继续确认?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  var data = new FormData()
                  data.append("dataFile", this.file);
                  data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + ", \"SchoolYear\":\"" + this.yearValue.replace(/\s+/g, "") + "\", \"Semester\":" + +this.termValue + "}");
                  console.log(data.get("condMap"));
                  this.loading = true;
                  this.axios({
                    method: "put",
                    url: "https://api.hduhelp.com/gormja_wrapper/confirm?topic=score",
                    headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
                    data,
                  })
                    .then((response) => {
                      var block = response.data.data.TransactionDetail.detail.result[0]
                      var blockName = Object.keys(block)
                      const translation = {
                        blockHash: "区块哈希",
                        blockNumber: "交易号",
                        // hash: "交易号",
                        blockTimestamp: "区块时间戳",
                        blockWriteTime: "写入时间",
                        hash: "交易内容"
                      }
                      for (var i = 0; i < blockName.length; i++) {
                        this.blockDataInfo = []
                        this.blockDataInfo.push({
                          value: block[blockName[i]],
                          name: translation[blockName[i]]
                        })
                      }
                      console.log(this.blockDataInfo);
                      sessionStorage.removeItem("terms");
                      this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
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
                      this.confirmed = true;
                    })
                    .catch((error) => {
                      this.$message.error("出错啦,请稍后再试");
                      this.loading = false;
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
    // var that = this;
    // this.loading = true;
    // this.axios
    //   .get("https://api.hduhelp.com/gormja/company/list")
    //   .then(
    //     function (response) {
    //         // if(response.data.flag2 === 1){
    //         //     that.confirmed = true;
    //         // }
    //         // that.loading = false;
    //         console.log(response);
    //     },
    //     function (err) {
    //       that.$alert("出错啦,请稍后再试", "警告", {
    //         confirmButtonText: "确定",
    //         type: "warning",
    //       });
    //         that.loading = false;
    //     }
    //   );
    this.file = this.sendDataToChid;
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
