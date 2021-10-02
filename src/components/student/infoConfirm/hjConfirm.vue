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
    <span style="margin-left: calc(100% - 700px)">请选择类型:</span>
    <el-select v-model="typeValue" placeholder="请选择" style="width: 150px; margin: 15px;" @change="getInfo()">
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-table
      :data="honorData"
      v-show="typeValue==='reward'&&honorData.length !== 0"
      border
      style="width: 100%; margin-top: 0;"
    >
      <el-table-column prop="RewardName.Value" label="奖项名称"></el-table-column>
      <el-table-column prop="RewardLevel.Value" label="奖项等级" width="250"></el-table-column>
      <el-table-column prop="SchoolYear.Value" label="获得学年"></el-table-column>
      <el-table-column prop="Semester.Value" label="获得学期"></el-table-column>
      <el-table-column label="类型">奖学金</el-table-column>
    </el-table>
    <el-empty :image-size="150" v-show="typeValue==='reward'&&honorData.length === 0" description="未查询到您的个人荣誉信息"></el-empty>
    <el-table
      :data="innovData"
      v-show="typeValue==='race_reward'&&innovData.length !== 0"
      border
      style="width: 100%; margin-top: 0;"
    >
      <el-table-column prop="RaceName.Value" label="竞赛名称"></el-table-column>
      <el-table-column prop="RaceLevel.Value" label="竞赛等级" width="220"></el-table-column>
      <el-table-column prop="RewardDate.Value" label="获奖日期"></el-table-column>
      <el-table-column prop="RewardLevel.Value" label="奖项等级"></el-table-column>
      <el-table-column label="类型" width="180">学科竞赛</el-table-column>
    </el-table>
    <el-empty :image-size="150" v-show="typeValue==='race_reward'&&innovData.length === 0" description="未查询到您的创新学分信息"></el-empty>
    <el-result icon="success" title="个人荣誉信息已确认" v-show="typeValue==='reward'&&honorConfirmed"></el-result>
    <el-result icon="success" title="创新学分信息已确认" v-show="typeValue==='race_reward'&&innovConfirmed"></el-result>
    <el-button
      type="primary"
      @click="submit()"
      plain
      v-show="(typeValue==='reward'&&!honorConfirmed&&honorData.length !== 0)||(typeValue==='race_reward'&&!innovConfirmed&&innovData.length !== 0)"
      :disabled="file===''"
    >确认信息</el-button>
    <!-- 使用typeValue、Confirmed和Data.length来判断按钮是否显示和禁用 -->
    <el-button
      type="info"
      @click="dialog = true;"
      plain
      v-show="(typeValue==='reward'&&!honorConfirmed&&honorData.length !== 0)||(typeValue==='race_reward'&&!innovConfirmed&&innovData.length !== 0)"
    >错误反馈</el-button>
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
      dialog: false,//错误反馈显示
      loading: false,//form加载
      typeOptions: [{
        value: "reward",
        label: "个人荣誉"
      }, {
        value: "race_reward",
        label: "创新学分"
      }],
      typeValue: "reward",
      yearOptions: [{
        value: "0",
        label: "2018 - 2019"
      }, {
        value: "1",
        label: "2019 - 2020"
      }, {
        value: "2",
        label: "2020 - 2021"
      }, {
        value: "3",
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
      file: "",//学业文件
      honorData: [],//个人荣誉信息数据
      innovData: [],//创新学分信息数据
      honorConfirmed: false,
      innovConfirmed: false,
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
      sessionStorage.removeItem("score");
      sessionStorage.removeItem("level_exam");
      sessionStorage.removeItem("hj");
      this.honorConfirmed = false
      this.innovConfirmed = false
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
      if(this.file === "") {
        this.honorConfirmed = false
        this.innovConfirmed = false
        return
      }
      if(sessionStorage.getItem("hj") === null) {
        this.getFileInfo()
        return
      }
      if(JSON.parse(sessionStorage.getItem("hj")).indexOf(this.typeValue) === -1) {
        if(this.typeValue === "reward")
          this.honorConfirmed = false
        else
          this.innovConfirmed = false
      }
      else {
        if(this.typeValue === "reward")
          this.honorConfirmed = true
        else
          this.innovConfirmed = true
      }
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
          var data = response.data.data.Body.data_map
          if (data.reward !== undefined && data.race_reward !== undefined)
            sessionStorage.setItem("hj", JSON.stringify(["reward", "race_reward"]))
          else if (data.reward !== undefined && data.race_reward === undefined)
            sessionStorage.setItem("hj", JSON.stringify(["reward"]))
          else if (data.reward === undefined && data.race_reward !== undefined)
            sessionStorage.setItem("hj", JSON.stringify(["race_reward"]))
          else if (data.reward === undefined && data.race_reward === undefined)
            sessionStorage.setItem("hj", JSON.stringify([]))
          this.loading = false
          this.checkConfirm()//判断确认状态
        })
        .catch(() => {
          this.$message.error("获取学业文件信息出错啦,请稍后再试")
          this.loading = false
          if(this.typeValue === "reward")
            this.honorConfirmed = false
          else
            this.innovConfirmed = false
        });
    },
    //根据typeValue拿信息
    getInfo() {
      if(this.typeValue === "reward")
        this.honorData = [];
      else
        this.innovData = [];
      this.loading = true;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=" + this.typeValue,
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
          response.data.data.forEach(item => {
            if(this.typeValue === "reward") {
              item.Value.Semester.Value = (item.Value.Semester.Value === 0 ? "第一学期" : "第二学期")//替换Semester为文字描述
              this.honorData.push(item.Value);
            } else
              this.innovData.push(item.Value);
          });
          this.checkConfirm();//判断确认状态
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("获取相关信息出错啦,请稍后再试");
          this.loading = false;
          if(this.typeValue === "reward")
            this.honorConfirmed = false
          else
            this.innovConfirmed = false
        });
    },
    submit() {
      this.$confirm( "请确认当前系统内该类型的综合素质信息准确无误, 是否继续确认?", "提示",
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
              sessionStorage.removeItem("hj");
              this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
              this.$emit("func", this.file);
              this.$confirm("综合素质信息确认成功！继续确认请点击任意空白区域", "提示", {
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
              if(this.typeValue === "reward")
                this.honorConfirmed = true
              else
                this.innovConfirmed = true
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
