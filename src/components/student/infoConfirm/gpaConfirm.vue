<template>
  <el-form ref="form" class="form1" v-loading="loading" element-loading-text="拼命加载中">
    <el-tag
      style="margin: 10px 0 0 0"
      type="success"
      v-show="file != ''"
      :disable-transitions="true"
    >
      <i class="el-icon-success"></i> 学业文件已上传
    </el-tag>
    <el-tag style="margin: 10px 0 0 0" type="info" v-show="file === ''" :disable-transitions="true">
      <i class="el-icon-error"></i> 学业文件未上传
    </el-tag>
    <el-upload
      style="margin-bottom: 10px;"
      ref="file-upload"
      class="upload"
      action="#"
      :http-request="getFile"
      :limit="1"
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
      style="margin: 0 0 10px 10px;"
    >删除文件</el-button>
    <el-button
      type="primary"
      plain
      icon="el-icon-download"
      @click="downloadFile('学业文件.enc')"
      v-show="file != ''"
      style="margin: 0 0 10px 10px;"
    >下载文件</el-button>
    <br />
    <span v-show="loading2" class="loadmask">
      <i style="dispaly: block" class="el-icon-loading"></i>
      <span>正在为您努力计算排名,请稍等</span>
      <el-progress
        style="width: 300px; margin-bottom: 10px; display: inline-block"
        :stroke-width="10"
        :percentage="percentage"
      ></el-progress>
    </span>
    <el-descriptions style="padding: 0;" :column="3" border v-show="data">
      <el-descriptions-item v-for="item in data" v-bind:key="item.id">
        <template slot="label">{{item.VisibleName}}</template>
        {{item.Value}}
      </el-descriptions-item>
    </el-descriptions>
    <el-empty :image-size="150" v-show="data.length === 0" description="未查询到您的排名信息"></el-empty>
    <el-result icon="success" title="排名信息已确认" v-show="confirmed"></el-result>
    <el-button
      type="primary"
      @click="submit()"
      plain
      v-show="!confirmed&&data.length !== 0"
      :disabled="file===''"
      style="margin-top: 10px"
    >确认信息</el-button>
    <!-- 使用typeValue、Confirmed和Data.length来判断按钮是否显示和禁用 -->
    <el-button type="info" @click="dialog = true;" plain v-show="!confirmed&&data.length !== 0">错误反馈</el-button>
    <el-drawer
      title="排名信息错误反馈提示"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <h4>请联系教务处修改后返回系统，检查无误后继续完成排名确认</h4>
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
      percentage: 0,
      dialog: false,//错误反馈显示
      loading: false,//form加载
      file: "",//学业文件
      data: {},//信息数据
      confirmed: false,
      secLoading: false,//查询按钮加载
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
      this.getFileInfo();
    },
    //删除文件
    reupload() {
      this.$refs["file-upload"].clearFiles();
      this.file = "";
      this.$emit("func", "");
      sessionStorage.removeItem("gpa");
      this.confirmed = false
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
    //根据存的项目名判断确认状态
    checkConfirm() {
      if (this.file === "") {
        this.confirmed = false;
        return;
      }
      if (sessionStorage.getItem("gpa") === null) {
        this.getFileInfo();
        return;
      }
      if (JSON.parse(sessionStorage.getItem("gpa")) === false)
        this.confirmed = false;
      else
        this.confirmed = true;
    },
    //拿到文件明文
    getFileInfo() {
      this.loading = true;
      var data = new FormData();
      data.append("dataFile", this.file);
      // 拿到学生档案明文
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data,
      })
        .then((response) => {
          //存储学业文件内有的项目名称,避免每次查询都要请求一次文件明文
          const data = response.data.data.Body.data_map
          sessionStorage.setItem("gpa", data.rank === undefined ? false : true)
          this.loading = false
          this.checkConfirm()//判断确认状态
        })
        .catch(() => {
          this.$message.error("获取学业文件信息出错啦,请稍后再试")
          this.loading = false
          this.confirmed = false
        });
    },
    //根据typeValue拿信息
    getInfo() {
      let timer = setInterval(() => {
        if (this.percentage < 90)
          this.percentage += parseInt(10 * Math.random())
        else if (this.percentage < 97)
          this.percentage += parseInt(3 * Math.random())
        else {
          this.percentage = 99
          clearInterval(timer)
        }
      }, 300)
      this.data = {};
      this.loading2 = true;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=rank",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
        },
        data: JSON.stringify({
          SchoolCode: 1,
          StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        })
      })
        .then((response) => {
          this.percentage = 100;
          this.data = {
            MajorName: response.data.data[0].Value.MajorName,
            GPA: response.data.data[0].Value.GPA,
            Rank: response.data.data[0].Value.Rank
          }
          this.checkConfirm();//判断确认状态
          this.loading2 = false;
        })
        .catch(() => {
          this.$message.error("获取排名信息出错啦,请稍后再试");
          this.loading2 = false;
          this.confirmed = false;
        });
    },
    submit() {
      this.$confirm("请确认当前系统内排名信息准确无误, 是否继续确认?", "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          var data = new FormData()
          data.append("dataFile", this.file);
          data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + "}");
          this.loading = true;
          this.axios({
            method: "put",
            url: "https://api.hduhelp.com/gormja_wrapper/confirm?topic=rank",
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
              sessionStorage.removeItem("gpa");
              this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
              this.$emit("func", this.file);
              this.$confirm("排名信息确认成功！继续确认请点击任意空白区域", "提示", {
                confirmButtonText: "下载新的学业文件",
                cancelButtonText: "查看此次交易详情",
                distinguishCancelAndClose: true,
                beforeClose: (action, instance, done) => {//将左边的按钮改为打开交易详情，且不关闭此弹框
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
              this.confirmed = true
            })
            .catch(() => {
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
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("jw_student_file")).staffID !== null) {
      this.getInfo();//页面加载时默认获取个人荣誉信息
      this.file = this.globalFile;
    } else
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      }).catch(() => {
        window.location.href = "https://limkim.xyz/newEdu/sign"
      });
  },
};
</script>

<style scoped>
.form1 {
  min-height: 200px;
  position: relative;
}
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
.loadmask {
  text-align: center;
  background-color: #fff;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  padding-top: 100px;
}
</style>
