<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>档案找回</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="100px" class="form">
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
      <el-button type="primary" @click="creatFile()" :loading="loading">提交档案找回申请</el-button>
      <el-popover
        placement="right-start"
        title="注意："
        width="200"
        trigger="hover"
        content="档案找回只包含已确认的信息"
      >
        <i slot="reference" class="el-icon-warning-outline" style="cursor: pointer; color: #E6A23C"></i>
      </el-popover>
    </el-form>
  </div>
</template>
<script>
let FormData = require("form-data");
export default {
  data() {
    return {
      loading: false,
      num: 4,
      file: ""
    };
  },
  methods: {
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
    downloadFile(Url, filename) {
      const eleLink = document.createElement("a")
      eleLink.download = filename
      eleLink.style.display = "none"
      eleLink.href = Url
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
      setTimeout(() => {
        this.loading = false;
        this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        })
      }, 400)
    },
    creatFile() {
      this.$confirm("确定要提交找回申请吗? 当前剩余免费申请次数: " + this.num + "次", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "post",
          url: "https://api.hduhelp.com/gormja_wrapper/dataFile/new?schoolCode=1&staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        })
          .then((response) => {
            // console.log(that.dataURLtoFile(response.data.data.DataFile, "学业文件"));
            var data = new FormData();
            data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + "}");
            data.append("dataFile", this.dataURLtoFile(response.data.data.DataFile, "学业文件"));
            this.axios({
              method: "post",
              url: "https://api.hduhelp.com/gormja_wrapper/restore?topic=profile",
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
              },
              data
            })
              .then((response2) => {
                data.set("dataFile", this.dataURLtoFile(response2.data.data.DataFile, "学业文件"))
                this.axios({
                  method: "post",
                  url: "https://api.hduhelp.com/gormja_wrapper/restore?topic=score",
                  headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
                  },
                  data
                })
                  .then((response3) => {
                    var Url = URL.createObjectURL(this.dataURLtoFile(response3.data.data.DataFile, "学业文件"));
                    this.$confirm("学业文件找回成功！请务必下载并保存好您的学业文件,以免档案再次丢失将无法正常使用本系统", "提示", {
                      confirmButtonText: "确定",
                      showCancelButton: false,
                      type: "success"
                    }).then(() => {
                      this.downloadFile(Url, "学业文件.enc")
                    }).catch(() => {
                      this.downloadFile(Url, "学业文件.enc")
                    });
                  })
                  .catch((error) => {
                    this.$message.error("找回学业信息出错啦,请稍后再试");
                    this.loading = false;
                  });
              })
              .catch((error) => {
                this.$message.error("找回学籍信息出错啦,请稍后再试");
                this.loading = false;
              });
          })
          .catch((error) => {
            this.$message.error("生成新文件出错啦,请稍后再试");
            this.loading = false;
          });
      })
    }
  },
  mounted() {

  },
};
</script>
<style scoped>
.form {
  overflow: auto;
  margin: 30px 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 750px;
}
iframe {
  background-color: #fff;
  margin: 10px 0 0 10px;
  box-sizing: border-box;
}
</style>
