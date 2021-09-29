<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩更改</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="100px" v-loading="loading" element-loading-text="拼命加载中" class="form">
      <el-form-item label="课程代码(课程号)" required>
        <el-input v-model="form.course" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="原有成绩" required>
        <el-input v-model="form.oldScore" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="要更改的成绩" required>
        <el-input v-model="form.newScore" style="width: 200px"></el-input>
      </el-form-item>
      <el-upload
        ref="file-upload"
        class="upload"
        action="#"
        :http-request="getFile"
        :limit="1"
        :on-change="change"
        accept=".enc"
      >
        点击上传学业文件
        <i class="el-icon-upload"></i>
      </el-upload>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="width: 150px; margin: 10px 0 0 50px">提交申请</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <h3>请先联系教务处更改有错误的成绩信息,然后在本系统提交更改申请</h3>
      <h3 style="margin-top: 10px">教务处联系方式:</h3>
      <div class="content">
        <span>电话: 0571-86915011</span>
        <span>邮箱地址: hdujwc@hdu.edu.cn</span>
        <span>地址: 行政楼</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">我已经更改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogVisible: true,
      loading: false,
      uploaded: false,
      fileList: [],
      file: "",
    }
  },
  methods: {
    getFile(params) {
      console.log(params.file);
    },
    reupload() {
      this.$refs["file-upload"].clearFiles();
      this.file = "";
      this.uploaded = false;
    },
    change(response, file, fileList) {
      // console.log(1111)
      console.log(file);
      this.file = file;
      this.uploaded = true;
      // this.fileList.push({
      //   name: file.name
      // })
    },
    onSubmit() {
      var that = this;
      this.$confirm(
        "请确认您已经联系教务处,并成功修改了错误成绩,否则申请将会失败, 是否继续确认?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.loading = true;
          this.axios({
            method: "get",
            url: "https://api.limkim.xyz/xy",
          }).then(function (response) {
            if (response.data === "OK") {
              that.$message({
                message: "成绩更改成功！",
                type: "success",
              });
            }
            that.loading = false;
            that.confirmed = true;
          })
            .catch((error) => {
              that.$message.error("出错啦,请稍后再试");
              that.loading = false;
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
.upload {
  display: inline-block;
  width: 170px;
  height: 40px;
  margin-left: 150px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #b3d8ff;
  background-color: #ecf5ff;
  font-size: 14px;
  color: #409eff;
  border-radius: 5px;
}
</style>
<style>
.el-dialog h4 {
  margin: 10px 50px;
}
.el-dialog .content span {
  margin: 10px 0 0 70px;
  display: block;
  font-size: 18px;
  color: #909399;
}
.el-collapse-item__content {
  padding: 0 !important;
}
.el-breadcrumb {
  margin: 10px 10px 0 10px;
  height: 60px;
  background-color: #fff;
  line-height: 60px !important;
  padding-left: 20px;
  border-radius: 10px;
}
.el-breadcrumb__item {
  font-size: 16px !important;
}
.table-expand .el-form-item {
  font-size: 18px;
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.el-table__expanded-cell {
  padding: 0 !important;
}
.table-expand {
  margin: 0 !important;
  width: 100% !important;
  padding: 10px 60px !important;
}
.table-expand .el-form-item .el-form-item__label {
  color: #99a9bf !important;
  font-size: 17px !important;
}
.table-expand .el-form-item .el-form-item__content {
  font-size: 17px !important;
}
.cell {
  font-size: 17px;
}
</style>
