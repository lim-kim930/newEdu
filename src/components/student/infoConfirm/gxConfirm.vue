<template>
  <el-form ref="form" class="form1" v-loading="loading" element-loading-text="拼命加载中">
    <el-tag
      type="success"
      style="margin: 10px 0 0 0"
      v-show="file != ''"
      :disable-transitions="true"
    >
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
    <mavonEditor
      :placeholder="holder"
      :toolbars="toolbars"
      :autofocus="false"
      defaultOpen="preview"
      @change="change"
      v-model="content"
      ref="md"
      :style="{'width': '99%', 'margin-top': '10px', 'height': this.wh - 345 + 'px'}"
    />
    <el-button style="margin-top: 10px" @click="save()">暂时保存</el-button>
    <el-button plain type="primary" :disabled="file === ''" @click="confirm()">确认信息</el-button>
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
import { mavonEditor } from "mavon-editor"
import "mavon-editor/dist/css/index.css"
import { Base64 } from "js-base64"
let FormData = require("form-data");
export default {
  data() {
    return {
      holder: "请输入您的个性化信息，也可以可以自由编辑样式",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      file: "",//学业文件
      loading: false,
      dialogTableVisible: false,//交易详情显示
      blockDataInfo: [],//交易详情信息数据
      content: "",
      html: ""
    };
  },
  props: ["globalFile", "wh"],
  components: { mavonEditor },
  methods: {
    getFile(params) {
      this.file = params.file;
      this.$emit("func", params.file);
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
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    save(value, render) {
      this.$confirm("系统会为您保存，但不会写入学业文件，后续可以继续完善", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "put",
          url: "https://api.hduhelp.com/gormja_wrapper/save?topic=self_introduction",
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            "Topic": "self_introduction",
            "ItemObj": {
              "SelfIntroduction": this.content
            }
          }
        }).then(() => {
          this.$message.success("保存成功,您可以随时回来修改");
          this.loading = false;
        }).catch(() => {
          this.$message.error("保存个性化信息出错啦,请稍后再试");
          this.loading = false;
        });
      }).catch(() => {
        this.$message.info("取消保存");
      });
    },
    confirm() {
      this.$confirm("请确认您已经将个性化信息完善, 是否继续确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        let data = new FormData();
        data.append("dataFile", this.file);
        this.axios({
          method: "post",
          url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=self_introduction",
          headers: {
            "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
          },
          data: JSON.stringify({
            SchoolCode: 1,
            StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
          })
        }).then((response) => {
          if (response.data.data.length === 0)
            return this.$message.error("个性化信息为空,请保存后再试");
          else {
            data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + ", \"SelfIntroduction\": " + JSON.stringify(Base64.decode(response.data.data[0].Value.SelfIntroduction.Value)) + "}");
            this.axios({
              method: "put",
              url: "https://api.hduhelp.com/gormja_wrapper/confirm?topic=self_introduction",
              headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
              data,
            }).then((response) => {
              this.$message.success("确认个性化信息成功！");
              this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
              this.$emit("func", this.file);
              this.loading = false;
            }).catch(() => {
              this.$message.error("确认个性化信息出错啦,请稍后再试");
              this.loading = false;
            });
          }
        }).catch(() => {
          this.$message.error("获取个性化信息出错啦,请稍后再试");
          this.loading = false;
        });
      }).catch(() => {
        this.$message.error("操作已取消");
        this.loading = false;
      });
    }
  },
  mounted() {
    this.file = this.globalFile;
    this.loading = true;
    this.axios({
      method: "post",
      url: "https://api.hduhelp.com/gormja_wrapper/lookup?topic=self_introduction",
      headers: {
        "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
      },
      data: JSON.stringify({
        SchoolCode: 1,
        StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
      })
    }).then((response) => {
      if (response.data.data.length === 0)
        this.content = ""
      else
        this.content = Base64.decode(response.data.data[0].Value.SelfIntroduction.Value);
      this.loading = false;
    }).catch(() => {
      this.$message.error("获取个性化信息出错啦,请稍后再试");
      this.loading = false;
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
  margin-left: 10px;
}
::-webkit-input-placeholder {
  color: red;
  font-size: 20px;
  font-weight: bolder;
}
</style>
