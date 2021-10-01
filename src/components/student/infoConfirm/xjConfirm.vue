<template>
  <el-form ref="form" v-loading="loading" element-loading-text="拼命加载中" class="form1">
    <el-descriptions class="margin-top" :column="3" border v-if="data">
      <el-descriptions-item v-for="item in data" v-bind:key="item.id">
        <template slot="label">{{item.VisibleName}}</template>
        {{item.Value}}
      </el-descriptions-item>
      <el-descriptions-item v-if="pic.VisibleName">
        <template slot="label">{{pic.VisibleName}}</template>
        <img :src="'data:image/png;base64,'+pic.Value" alt="照片" style="width: 100px;">
      </el-descriptions-item>
    </el-descriptions>
    <el-result icon="success" title="学籍信息已确认" v-show="confirmed"></el-result>
    <el-button
      type="primary"
      @click="submit()"
      plain
      v-show="!confirmed"
      :disabled="btnDisabled"
    >确认信息</el-button>
    <el-button type="info" plain @click="dialog = true" v-show="!confirmed">错误反馈</el-button>
    <el-drawer
      title="学籍信息错误反馈提示"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <h4>请联系教务处修改后返回系统，检查无误后继续完成学籍确认</h4>
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
      confirmed: "",//学籍确认状态
      btnDisabled: true,//确认信息按钮禁用
      dialogTableVisible: false,//交易详情显示
      data: {},//学籍信息数据,除去照片信息
      pic: {},//学籍信息的照片信息数据
      blockDataInfo: []//交易详情信息数据
    };
  },
  props: ["xjConfirmed"],//拿到infoConfirmed页面学籍确认状态
  methods: {
    //获取文件
    // Base64ToBlob(dataurl) {
    //   var arr = dataurl.split(','),
    //   // mime = arr[0].match(/:(.*?);/)[1],
    //   bstr = atob(arr[0]),
    //   n = bstr.Length,
    //   u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   return new Blob([u8arr], { type: "no" });
    // },
    // BlobToFile(theBlob, fileName) {
    //   theBlob.lastModifiedDate = new Date();
    //   theBlob.name = fileName;
    //   return theBlob;
    // },
    //将文件Url转为文件
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
    //利用a标签下载文件
    downloadFile(Url, filename) {
      const eleLink = document.createElement("a");
      eleLink.download = filename;
      eleLink.style.display = "none";
      eleLink.href = Url;
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
      this.confirmed = true
      this.$emit("func2", this.confirmed);
      setTimeout(() => {
        this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        })
      }, 400)
    },
    //确认学籍
    submit() {
      this.$confirm( "请确认当前系统内的学籍信息准确无误, 是否继续确认?", "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          //先new一个文件
          this.axios({
            method: "post",
            url:
              "https://api.hduhelp.com/gormja_wrapper/dataFile/new?schoolCode=1&staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
            headers: {
              "Content-type": "application/json",
              Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
            }
          })
            .then((response) => {
              // 成功后确认学籍信息
              var data = new FormData();
              data.append( "dataFile", this.dataURLtoFile(response.data.data.DataFile, "学业文件") );
              data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + "}");
              this
                .axios({
                  method: "put",
                  url: "https://api.hduhelp.com/gormja_wrapper/confirm?topic=profile",
                  headers: { Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
                  data
                })
                .then((response2) => {
                  // 整理交易详情信息,放到blockDataInfo[]
                  var block = response2.data.data.TransactionDetail.detail.result[0]
                  var blockName = Object.keys(block)
                  const translation = {
                    blockHash: "区块哈希",
                    blockNumber: "交易号",
                    blockTimestamp: "区块时间",
                    blockWriteTime: "写入时间",
                    hash: "交易内容"
                  }
                  for (var i = 0; i < blockName.length; i++) {
                    this.blockDataInfo.push({
                      value: block[blockName[i]],
                      name: translation[blockName[i]]
                    })
                  }
                  //改变数据库中学籍确认状态
                  this.axios({
                    method: "post",
                    url: "https://api.limkim.xyz/changeXj",
                    data: { staffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID, confirmed: true }
                  })
                    .then(() => {
                      //最后更新页面中的全局file
                      this.file = this.dataURLtoFile( response2.data.data.DataFile, "学业文件" );
                      var Url = URL.createObjectURL(this.file);
                      this.$confirm( "学籍信息确认成功！请务必下载并保存好您的学业文件,以免档案丢失将无法正常使用本系统", "提示",
                          {
                            confirmButtonText: "确定并下载",
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
                          }
                        )
                        .then(() => {
                          this.downloadFile(Url, "学业文件.enc");
                        })
                        .catch(() => {
                          this.downloadFile(Url, "学业文件.enc");
                        });
                      this.loading = false
                    })
                    .catch(error => {
                      if (error.response.data.status === "staffID Required")
                        this.$message.error("您还未登录或登陆出错,请重新登录后重试")
                      else if (error.response.data.status === "Error")
                        this.$message.error("服务器出错")
                      else
                        this.$message.error("出错啦,请稍后重试")
                      this.loading = false
                    });
                })
                .catch(() => {
                  this.$message.error("出错啦,请稍后再试");
                  this.loading = false;
                });
            })
            .catch(() => {
              this.$message.error("出错啦,请稍后再试");
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "确认操作已取消"
          });
        });
    }
  },
  mounted() {
    //加载页面的时候拿学籍信息
    if (JSON.stringify(this.data) === "{}" && JSON.parse(localStorage.getItem("jw_student_file")).staffID !== undefined) {
      this.loading = true;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=profile",
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
          this.confirmed = this.xjConfirmed;
          this.$emit("func2", this.confirmed);
          this.pic = response.data.data[0].Value.Photo;
          delete response.data.data[0].Value.Photo;//将照片信息单独拿出放到pic
          this.data = response.data.data[0].Value;
          this.loading = false;
          this.btnDisabled = false;
        })
        .catch(() => {
          this.confirmed = this.xjConfirmed;
          this.$emit("func2", this.confirmed);
          this.$message.error("获取学籍信息出错啦,请稍后再试");
          this.loading = false;
        });
    }
  }
};
</script>
<style>
.form1 {
  margin: 0 !important;
}
.el-descriptions {
  padding: 20px 0;
}
.demo-drawer__footer {
  text-align: center;
}
.demo-drawer__footer button {
  width: 100px;
}
.el-drawer h4 {
  margin: 10px 50px;
}
.el-drawer .content span {
  margin: 10px 0 0 70px;
  display: block;
  font-size: 18px;
  color: #909399;
}
</style>
