<template>
  <el-form
    ref="form"
    class="form1"
    v-loading="loading"
    element-loading-text="拼命加载中"
    label-width="120px"
  >
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
    <!-- <el-button
      type="primary"
      plain
      icon="el-icon-delete-solid"
      @click="reupload()"
      v-show="file != ''"
      style="margin-left: 10px;"
    >删除文件</el-button>-->
    <el-button
      type="primary"
      plain
      icon="el-icon-download"
      @click="downloadFile('学业文件.enc')"
      v-show="file != ''"
      style="margin-left: 10px;"
    >下载文件</el-button>
    <span style="margin-left: 10px">请选择类型:</span>
    <el-select
      v-model="typeValue"
      placeholder="请选择"
      style="width: 150px; margin: 15px;"
      @change="typeChange()"
    >
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-button
      :style="{'margin': '10px 0 0 calc(100% - 840px)'}"
      v-show="typeValue !== 'int'"
      @click="addDialogShow = true;"
    >添加工作</el-button>
    <el-button
      :style="{'margin': '10px 0 0 calc(100% - 840px)'}"
      v-show="typeValue === 'int'"
      @click="save()"
    >暂时保存</el-button>
    <el-button plain type="primary" :disabled="file === ''" @click="confirm()">写入文件</el-button>
    <mavonEditor
      v-show="typeValue === 'int'"
      :placeholder="holder"
      :toolbars="toolbars"
      :autofocus="false"
      defaultOpen="preview"
      :editable="true"
      :imageFilter="imageFilter"
      @save="save"
      @change="change"
      v-model="content"
      :style="{'width': '99%', 'margin-top': '10px', 'height': this.wh - 300 + 'px'}"
    />
    <el-table
      v-show="typeValue==='club'"
      :data="clubData"
      border
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column prop="Value.JobName.Value" label="工作名称"></el-table-column>
      <el-table-column prop="Value.OrgName.Value" label="组织名称"></el-table-column>
      <el-table-column prop="Value.OrgLevel.Value" label="组织等级"></el-table-column>
      <el-table-column prop="Value.StartAt.Value" label="开始时间"></el-table-column>
      <el-table-column prop="Value.EndAt.Value" label="结束时间"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button plain type="danger" size="mini" @click="deleteJob(scope.row.Value.ID.Value)">删除记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="typeValue==='social'"
      :data="socialData"
      border
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column prop="name" label="工作名称"></el-table-column>
      <el-table-column prop="type" label="工作类型"></el-table-column>
      <el-table-column prop="department" label="工作地点"></el-table-column>
      <el-table-column prop="time" label="工作时间"></el-table-column>
    </el-table>
    <el-dialog :title="typeValue==='club'?'添加班团工作经历':'添加实习工作经历'" :visible.sync="addDialogShow">
      <h3 style="margin: 0 0 15px 20px; color: #F56C6C">注: 由于信息用于应聘岗位,所以请确保以下填写的信息真实可靠,否则后果自负</h3>
      <div v-show="typeValue==='club'">
        <el-form-item label="工作名称" style="width: 300px">
          <el-input v-model="clubAddData.JobName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" style="width: 300px">
          <el-input v-model="clubAddData.OrgName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="组织等级">
          <el-select v-model="clubAddData.OrgLevel" placeholder="请选择">
            <el-option label="校级" value="校级"></el-option>
            <el-option label="院级" value="院级"></el-option>
            <el-option label="班级" value="班级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作时间">
          <el-col :span="11">
            <el-date-picker
              v-model="clubAddData.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="备注" style="width: 500px">
          <el-input
            type="textarea"
            :rows="10"
            v-model="clubAddData.desc"
            resize="none"
            show-word-limit
            maxlength="500"
          ></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="save" type="primary">立即添加</el-button>
          <el-button @click="resetDialogForm()">重置</el-button>
        </el-form-item>
      </div>
      <div v-show="typeValue==='social'">
        <el-form-item label="工作名称" style="width: 300px">
          <el-input v-model="socialAddData.name" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="工作类型">
          <el-select v-model="socialAddData.type" placeholder="请选择">
            <el-option label="实习工作" value="club"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作地点" style="width: 300px">
          <el-input v-model="socialAddData.department" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="工作时间">
          <el-col :span="11">
            <el-date-picker
              v-model="socialAddData.time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" style="width: 500px">
          <el-input
            type="textarea"
            :rows="10"
            v-model="socialAddData.desc"
            resize="none"
            show-word-limit
            maxlength="500"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button @click="resetDialogForm()">重置</el-button>
        </el-form-item>
      </div>
    </el-dialog>
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
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { Base64 } from "js-base64";
let FormData = require("form-data");
export default {
  data() {
    return {
      holder: "请输入您的自我介绍，同样可以自由编辑样式(Markdown)",
      typeOptions: [{
        value: "int",
        label: "自我介绍"
      }, {
        value: "club",
        label: "班团工作"
      }, {
        value: "social",
        label: "实习工作"
      }, {
        value: "volun",
        label: "志愿服务"
      }],
      typeValue: "int",
      clubData: [],
      socialData: [],
      clubAddData: {
        JobName: "",
        OrgName: "",
        OrgLevel: "",
        time: []
      },
      socialAddData: {
        name: "",
        type: "",
        time: "",
        department: "",
        desc: ""
      },
      addDialogShow: false,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        fullscreen: false, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
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
    imageFilter() {
      return;
    },
    resetDialogForm() {
      if (this.typeValue === "club")
        this.clubAddData = {
          JobName: "",
          OrgName: "",
          OrgLevel: "",
          time: []
        };
      else if (this.typeValue === "social")
        this.clubAddData = {
          name: "",
          type: "",
          time: "",
          level: "",
          department: "",
          desc: ""
        };
    },
    getFile(params) {
      this.loading = true;
      let data = new FormData();
      data.append("dataFile", params.file);
      this.axios({
        method: "post",
        url: "/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data
      }).then(() => {
        this.loading = false;
        this.file = params.file;
        this.$emit("func", params.file);
      }).catch((err) => {
        if (err.response.data.msg === "file hash does not equal to chain")
          this.$message.error("学业文件错误或者过期,请检查后再试");
        else
          this.$message.error("获取学业文件信息出错啦,请稍后再试");
        this.loading = false;
        this.reupload();
      });
    },
    //删除文件
    reupload() {
      this.$refs["file-upload"].clearFiles();
      this.file = "";
      this.$emit("func", "");
      sessionStorage.removeItem("score");
      sessionStorage.removeItem("level_exam");
      sessionStorage.removeItem("hj");
      this.honorConfirmed = false;
      this.innovConfirmed = false;
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
      const eleLink = document.createElement("a");
      eleLink.download = filename;
      eleLink.style.display = "none";
      eleLink.href = Url;
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
      setTimeout(() => {
        this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        });
      }, 400);
    },
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    typeChange() {
      let url = "";
      switch (this.typeValue) {
        case "int":
          url = "/lookup?topic=self_introduction";
          break;
        case "club":
          url = "/lookup?topic=org_experience";
          break;
        default:
          return;
      }
      this.loading = true;
      this.axios({
        method: "post",
        url,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: JSON.stringify({
          SchoolCode: 1,
          StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
        })
      }).then((response) => {
        if (this.typeValue === "int") {
          if (response.data.data.length === 0)
            this.content = "";
          else
            this.content = Base64.decode(response.data.data[0].Value.SelfIntroduction.Value);
          this.loading = false;
        }
        else if (this.typeValue === "club") {
          if (response.data.data.length !== 0)
            for (let i = 0; i < response.data.data.length; i++) {
              response.data.data[i].Value.StartAt.Value = response.data.data[i].Value.StartAt.Value.substr(0, 10);
              response.data.data[i].Value.EndAt.Value = response.data.data[i].Value.EndAt.Value.substr(0, 10);
            }
          this.clubData = response.data.data;
          this.loading = false;
        }
      }).catch(() => {
        this.$message.error("获取个人填写信息出错啦,请稍后再试");
        this.loading = false;
      });
    },
    deleteJob(ID) {
      this.$confirm("确定要删除此项工作记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        this.axios({
          method: "put",
          url: "/delete?topic=org_experience",
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            "Topic": "org_experience",
            "CondMap": {
              "SchoolCode": "1",
              "StaffID": JSON.parse(localStorage.getItem("jw_student_file")).staffID,
              "ID": ID
            }
          }
        }).then(() => {
          this.$message.success("删除成功!");
          this.typeChange();
        }).catch(() => {
          this.$message.error("删除失败啦,请稍后再试");
          this.loading = false;
        });
      });
    },
    save() {
      if (this.typeValue === "club") {
        if (this.clubAddData.JobName.trim().length === 0 || this.clubAddData.OrgName.trim().length === 0 || this.clubAddData.OrgLevel.length === 0 || this.clubAddData.time.length === 0)
          return this.$message.error("请将表单填写完整");
      }
      else if (this.typeValue === "int")
        if (this.content.length === 0)
          return this.$message.error("请先填写你的自我介绍吧");
      this.$confirm("系统会为您保存，但不会写入学业文件，后续可以继续完善" + (this.typeValue === "int" ? "" : "但请确保信息真实可信"), "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        let url = "", data = {};
        switch (this.typeValue) {
          case "int":
            url = "/save?topic=self_introduction";
            data = {
              "Topic": "self_introduction",
              "ItemObj": {
                "SelfIntroduction": this.content
              }
            };
            break;
          case "club":
            url = "/save?topic=org_experience";
            data = {
              "Topic": "org_experience",
              "ItemObj": {
                "JobName": this.clubAddData.JobName,
                "OrgName": this.clubAddData.OrgName,
                "OrgLevel": this.clubAddData.OrgLevel,
                "StartAt": this.clubAddData.time[0],
                "ID": 0,
                "EndAt": this.clubAddData.time[1]
              }
            };
            break;
        }
        this.axios({
          method: "put",
          url,
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data
        }).then(() => {
          this.$message.success("保存成功,您可以随时回来修改");
          if (this, this.typeValue === "club") {
            this.resetDialogForm();
            this.addDialogShow = false;
            return this.typeChange();
          }
          this.loading = false;
        }).catch(() => {
          this.$message.error("保存个人填写信息出错啦,请稍后再试");
          this.loading = false;
        });
      });
    },
    confirm() {
      if (this.typeValue === "int")
        if (this.content.length === 0)
          return this.$message.error("请先填写你的自我介绍吧");
      this.$confirm("请确认您已经将个人填写信息完善, 是否继续确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        this.$emit("func2", false);
        this.$emit("func3", 3);
        let data = new FormData();
        data.append("dataFile", this.file);
        if (this.typeValue !== "int") {
          data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + "}");
          this.axios({
            method: "put",
            url: "/confirm?topic=org_experience",
            headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
            data
          }).then((response) => {
            var block = response.data.data.TransactionDetail.detail.result[0];
            var blockName = Object.keys(block);
            const translation = {
              blockHash: "区块哈希",
              blockNumber: "交易号",
              blockTimestamp: "区块时间戳",
              blockWriteTime: "写入时间",
              hash: "交易内容"
            };
            this.blockDataInfo = [];
            for (var i = 0; i < blockName.length; i++) {
              this.blockDataInfo.push({
                value: block[blockName[i]],
                name: translation[blockName[i]]
              });
            }
            this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
            this.$emit("func", this.file);
            this.$emit("func2", true);
            this.$emit("func3", null);
            this.$confirm("个人填写信息确认成功! 继续确认请点击任意空白区域", "提示", {
              confirmButtonText: "下载新的学业文件",
              cancelButtonText: "查看此次交易详情",
              distinguishCancelAndClose: true,
              beforeClose: (action, instance, done) => {//将左边的按钮改为打开交易详情，且不关闭此弹框
                if (action === "cancel")
                  this.dialogTableVisible = true;
                if (action === "confirm" || action === "close")
                  done();
              },
              dangerouslyUseHTMLString: true,
              type: "success"
            }).then(() => {
              this.downloadFile("学业文件.enc");
            }).catch(() => {
              this.$message({
                type: "info",
                message: "请在结束确认时下载最新的学业文件",
              });
            });
            this.loading = false;
          }).catch(() => {
            this.$emit("func2", true);
            this.$emit("func3", null);
            this.$message.error("确认个人填写信息出错啦,请稍后再试");
            this.loading = false;
          });
          return;
        }
        this.axios({
          method: "put",
          url: "/save?topic=self_introduction",
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            "Topic": "self_introduction",
            "ItemObj": {
              "SelfIntroduction": this.content
            }
          }
        }).then(() => {
          this.axios({
            method: "post",
            url: "/lookup?topic=self_introduction",
            headers: {
              "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token
            },
            data: JSON.stringify({
              SchoolCode: 1,
              StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
            })
          }).then((response) => {
            if (response.data.data.length === 0)
              return this.$message.error("个人填写信息为空,请保存后再试");
            else {
              data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + ", \"SelfIntroduction\": " + JSON.stringify(Base64.decode(response.data.data[0].Value.SelfIntroduction.Value)) + "}");
              this.axios({
                method: "put",
                url: "/confirm?topic=self_introduction",
                headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
                data
              }).then((response) => {
                var block = response.data.data.TransactionDetail.detail.result[0];
                var blockName = Object.keys(block);
                const translation = {
                  blockHash: "区块哈希",
                  blockNumber: "交易号",
                  blockTimestamp: "区块时间戳",
                  blockWriteTime: "写入时间",
                  hash: "交易内容"
                };
                this.blockDataInfo = [];
                for (var i = 0; i < blockName.length; i++) {
                  this.blockDataInfo.push({
                    value: block[blockName[i]],
                    name: translation[blockName[i]]
                  });
                }
                this.file = this.dataURLtoFile(response.data.data.DataFile, "学业文件");
                this.$emit("func", this.file);
                this.$emit("func2", true);
                this.$emit("func3", null);
                this.$confirm("个人填写信息确认成功! 继续确认请点击任意空白区域", "提示", {
                  confirmButtonText: "下载新的学业文件",
                  cancelButtonText: "查看此次交易详情",
                  distinguishCancelAndClose: true,
                  beforeClose: (action, instance, done) => {//将左边的按钮改为打开交易详情，且不关闭此弹框
                    if (action === "cancel")
                      this.dialogTableVisible = true;
                    if (action === "confirm" || action === "close")
                      done();
                  },
                  dangerouslyUseHTMLString: true,
                  type: "success"
                }).then(() => {
                  this.downloadFile("学业文件.enc");
                }).catch(() => {
                  this.$message({
                    type: "info",
                    message: "请在结束确认时下载最新的学业文件",
                  });
                });
                this.loading = false;
              }).catch(() => {
                this.$emit("func2", true);
                this.$emit("func3", null);
                this.$message.error("确认个人填写信息出错啦,请稍后再试");
                this.loading = false;
              });
            }
          }).catch(() => {
            this.$emit("func2", true);
            this.$emit("func3", null);
            this.$message.error("获取个人填写信息出错啦,请稍后再试");
            this.loading = false;
          });
        }).catch(() => {
          this.$emit("func2", true);
          this.$emit("func3", null);
          this.$message.error("保存个人填写信息出错啦,请稍后再试");
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
    this.typeChange();
  },
};
</script>

<style scoped>
.el-table {
  margin: 20px 0;
}
.upload {
  display: inline-block;
  margin-left: 10px;
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