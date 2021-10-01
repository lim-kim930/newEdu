<template>
  <el-form ref="form" class="form1" v-loading="loading">
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
    <el-empty :image-size="200" v-show="honorData.length === 0&&innovData.length === 0" description="未查询到您的获奖信息"></el-empty>
    <h3 style="margin: 10px" >个人荣誉</h3>
    <el-table :data="honorData" v-show="honorData.length != 0" border style="width: 100%; margin-top: 0;">
      <el-table-column prop="Value.CourseName.Value" label="课程" width="220"></el-table-column>
      <el-table-column prop="Value.CourseCode.Value" label="选课号"></el-table-column>
      <el-table-column prop="Value.Score.Value" label="成绩" width="180"></el-table-column>
      <el-table-column prop="Value.GP.Value" label="绩点"></el-table-column>
    </el-table>
    <el-empty :image-size="100" v-show="honorData.length === 0" description="未查询到您的个人荣誉信息"></el-empty>
    <h3 style="margin: 10px" v-show="innovData.length != 0">创新学分</h3>
    <el-table :data="innovData" v-show="innovData.length != 0" border style="width: 100%; margin-top: 0;">
      <el-table-column prop="RaceName.Value" label="竞赛名称"></el-table-column>
      <el-table-column prop="RaceLevel.Value" label="竞赛等级" width="220"></el-table-column>
      <el-table-column prop="RewardDate.Value" label="获奖日期"></el-table-column>
      <el-table-column prop="RewardLevel.Value" label="奖项等级"></el-table-column>
      <el-table-column label="类型" width="180">学科竞赛</el-table-column>
    </el-table>
    <el-result icon="success" title="信息已确认" v-show="confirmed"></el-result>
    <el-button type="primary" @click="submit()" plain v-show="(!confirmed&&honorData.length != 0)||(!confirmed&&innovData.length != 0)" :disabled="(innovData.length === 0&&honorData.length === 0)||file===''">确认信息</el-button>
    <el-button type="info" @click="dialog = true;" plain v-show="(!confirmed&&honorData.length != 0)||(!confirmed&&innovData.length != 0)">错误反馈</el-button>
    <el-drawer
      title="综合素质信息错误反馈提示"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <h4>请联系教务处修改后返回系统，检查无误后继续完成综合素质确认</h4>
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
export default {
  data() {
    return {
      dialog: false,
      loading: false,
      file: "",
      honorData: [],
      innovData: [],
      confirmed: false,
      disabled: true,
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
      this.getInfo();
    },
    reupload() {
      this.$refs["file-upload"].clearFiles();
      this.file = "";
      sessionStorage.removeItem("terms");
      sessionStorage.removeItem("level");
      this.disabled = true;
      this.$emit("func", "");
    },
    change(response, file, fileList) {
      sessionStorage.removeItem("terms");
      sessionStorage.removeItem("level");
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
    getInfo() {
      this.innovData = [];
      this.honorData = [];
      this.loading = true;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=reward",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
        },
        data: JSON.stringify({
          SchoolCode: 1,
          StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
        })
      })
        .then((response) => {
          this.honorData = response.data.data;
          this.axios({
            method: "post",
            url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=race_reward",
            headers: {
              "Content-Type": "application/json",
              Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
            },
            data: JSON.stringify({
              SchoolCode: 1,
              StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
            })
          })
            .then((response) => {
              response.data.data.forEach(item => {
                this.innovData.push(item.Value)
              });
              console.log(this.innovData);
              this.loading = false;
            })
            .catch(error => {
              this.$message.error("获取奖学金信息出错啦,请稍后再试");
              this.loading = false;
            });
        })
        .catch(error => {
          this.$message.error("获取奖学金信息出错啦,请稍后再试");
          this.loading = false;
        });
    },
    submit() {
      this.$confirm(
        "请确认当前系统内的综合素质信息准确无误, 是否继续确认?",
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
                  data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + ",\"RaceName\": \"“挑战杯”全国大学生课外学术科技作品竞赛\"" + "}");
                  console.log(data.get("condMap"));
                  this.loading = true;
                  this.axios({
                    method: "put",
                    url: "https://api.hduhelp.com/gormja_wrapper/confirm?topic=race_reward",
                    headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
                    data,
                  })
                    .then((response) => {
                      var block = response.data.data.TransactionDetail.detail.result[0]
                      var blockName = Object.keys(block)
                      console.log(blockName);
                      const translation = {
                        blockHash: "区块哈希",
                        blockNumber: "交易号",
                        // hash: "交易号",
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
                      console.log(this.blockDataInfo);
                      // sessionStorage.removeItem("terms");
                      this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
                      this.$confirm("信息确认成功！继续确认请点击任意空白区域", "提示", {
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
                    // .catch((error) => {
                    //   this.$message.error("出错啦,请稍后再试");
                    //   this.loading = false;
                    // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消",
          });
        });
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("jw_student_file")).staffID !== null) {
      this.getInfo()
    }
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
  margin: 10px;
}
</style>
