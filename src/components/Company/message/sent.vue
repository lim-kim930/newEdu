<template>
  <el-form ref="form" class="form1">
    <el-empty :image-size="200" description="您还没有已发送的消息哦~"></el-empty>
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
