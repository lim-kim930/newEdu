<template>
  <el-form ref="form" class="form1">
    <!-- <el-tag type="success" v-show="uploaded" :disable-transitions="true"><i class="el-icon-check"></i> 学业文件已上传</el-tag> -->
    <el-empty :image-size="200" description="未查询到您的获奖信息"></el-empty>
    <!-- <el-upload
        class="upload"
        action="#"
        :http-request="getFile"
        :limit=1
        :on-change="change"
        :file-list="fileList"
        accept=".pdf"
        >
        点击上传学业文件<i class="el-icon-upload"></i>
      </el-upload>
   <el-result icon="success" title="信息已确认" v-show="confirmed">
    </el-result>
  <el-button type="primary" @click="submit()" plain v-show="!confirmed">确认信息</el-button>
  <el-button type="info" @click="queSubmit()" plain v-show="!confirmed">问题反馈</el-button>
  <el-drawer
        title="请填写相关信息"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        :show-close="closeBtn"
        :close-on-press-escape="closeBtn"
    >
        <div class="demo-drawer__content">
        <el-form :model="form" style="width: 400px">
        <el-form-item label="信息名称" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择">
            <el-option label="专业" value="shanghai"></el-option>
            <el-option label="政治面貌" value="beijing"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="要修改的值" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="btnloading">{{ btnloading ? '提交中 ...' : '确 定' }}</el-button>
        <el-button @click="cancelForm">取 消</el-button>
        </div>
    </div>
    </el-drawer>-->
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      closeBtn: false,
      dialog: false,
      loading: false,
      btnloading: false,
      confirmed: false,
      uploaded: true,
      form: {
        name: "",
        region: "",
      },
      fileList: [],
      file: "",
      formLabelWidth: "100px",
      timer: null,
    };
  },
  methods: {
    getFile() {
      this.btnShow = true
    },
    change(response, file, fileList) {
      // console.log(1111)
      console.log(file)
      this.file = file
      // this.fileList.push({
      //   name: file.name
      // })
    },
    handleClose(done) {
      if (this.btnloading) {
        return;
      }
      this.$confirm("请确定信息准确无误,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(_ => {
          this.btnloading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.btnloading = false;
              this.$notify({
                title: "成功",
                message: "问题反馈成功,请等待数据核实后更新",
                type: "success"
              });
            }, 400);
          }, 2000);

        })
        .catch(_ => { });
    },
    cancelForm() {
      this.btnloading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    queSubmit() {
      this.dialog = true;
    },
    submit() {
      var that = this;
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
          this.loading = true;
          this.axios({
            method: "get",
            url: "https://api.limkim.xyz/by",
          })
            .then(function (response) {
              if (response.data === "OK") {
                that.$message({
                  message: "毕业信息确认成功！",
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
    //   .get("https://api.limkim.xyz/getby")
    //   .then(
    //     function (response) {
    //         if(response.data.flag3 === 1){
    //             that.confirmed = true;
    //         }
    //         that.loading = false;
    //     },
    //     function (err) {
    //       that.$alert("出错啦,请稍后再试", "警告", {
    //         confirmButtonText: "确定",
    //         type: "warning",
    //       });
    //         that.loading = false;
    //     }
    //   );
  },
};
</script>

<style scoped>
.upload {
  width: 170px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #b3d8ff;
  background-color: #ecf5ff;
  margin-bottom: 40px;
  font-size: 14px;
  color: #409eff;
  border-radius: 5px;
}
.el-tag {
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  margin: 10px 0 0 10px;
}
</style>
