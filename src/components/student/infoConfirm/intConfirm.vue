<template>
  <el-form
    ref="form"
    class="form1"
    v-loading="loading"
    element-loading-text="拼命加载中"
    label-width="80px"
  >
    <!-- <el-tag
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
    </el-upload> -->
    <!-- <el-button
      type="primary"
      plain
      icon="el-icon-delete-solid"
      @click="reupload()"
      v-show="file != ''"
      style="margin-left: 10px;"
    >删除文件</el-button>-->
    <!-- <el-button
      type="primary"
      plain
      icon="el-icon-download"
      @click="downloadFile('学业文件.enc')"
      v-show="file != ''"
      style="margin-left: 10px;"
    >下载文件</el-button>-->
    <span>请选择类型:</span>
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
      style="margin: 10px 0 0 calc(100% - 470px)"
      v-show="typeValue === 'club' || typeValue === 'social'|| typeValue === 'volun'"
      @click="addDialogShow = true;"
    >添加经历</el-button>
    <el-button
      style="margin: 10px 0 0 calc(100% - 470px)"
      v-show="typeValue === 'int' || typeValue === 'intention'"
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
      codeStyle="github-dark"
      :ishljs="true"
      @change="change"
      v-model="content"
      @imgAdd="imgAdd"
      :style="{'width': '99%', 'margin-top': '10px', 'height': this.wh - 310 + 'px'}"
    ></mavonEditor>
    <el-form-item label="意向岗位" v-show="typeValue==='intention'">
      <el-form-item style="min-height: 50px">
        <h3 style="display: inline-block; padding-left: 10px;">已选择:</h3>
        <div style="display: inline-block">
          <el-tag
            :disable-transitions="true"
            v-show="intentionAddData.jobFormated.length === 0"
            type="info"
            style="font-size: 14px; margin-bottom: 10px"
          >暂无</el-tag>
          <el-tag
            :disable-transitions="true"
            v-for="item in intentionAddData.jobFormated"
            v-bind:key="item.id"
            style="font-size: 14px; margin-bottom: 10px"
          >{{item}}</el-tag>
        </div>
      </el-form-item>
      <el-form-item
        class="type"
        :label="item.name"
        v-for="(item, index) in translation"
        v-bind:key="item.name"
      >
        <el-checkbox-group v-model="job[index]">
          <el-checkbox
            :disabled="index !== 0 && job[0].length !== 0"
            :label="item.Name"
            name="type"
            v-for="item in jobOpitions[index]"
            v-bind:key="item.id"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form-item>
    <el-form-item label="意向城市" v-show="typeValue==='intention'">
      <el-form-item style="min-height: 50px;">
        <h3 style="display: inline-block; padding-left: 10px;">已选择:</h3>
        <div style="display: inline-block">
          <el-tag
            :disable-transitions="true"
            v-show="intentionAddData.locationFormated.length === 0"
            type="info"
            style="font-size: 14px; margin-bottom: 10px"
          >暂无</el-tag>
          <el-tag
            :disable-transitions="true"
            v-for="item in intentionAddData.locationFormated"
            v-bind:key="item.id"
            style="font-size: 14px; margin-bottom: 10px"
          >{{item}}</el-tag>
        </div>
      </el-form-item>
      <el-cascader
        style="width: 180px"
        v-model="location"
        :options="locationOptions"
        clearable
        :show-all-levels="false"
        placeholder="请选择"
        filterable
        collapse-tags
        :props="{'multiple': true}"
      ></el-cascader>
    </el-form-item>
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
          <el-button
            plain
            type="danger"
            size="mini"
            @click="deleteJob(scope.row.Value.ID.Value)"
          >删除经历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="typeValue==='social'"
      :data="socialData"
      border
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column prop="Value.JobName.Value" label="岗位名称"></el-table-column>
      <el-table-column prop="Value.CompanyName.Value" label="公司名称"></el-table-column>
      <el-table-column prop="Value.WorkLocation.Value" label="实习地点"></el-table-column>
      <el-table-column prop="Value.WorkContent.Value" label="实习内容"></el-table-column>
      <el-table-column prop="Value.StartAt.Value" label="开始时间"></el-table-column>
      <el-table-column prop="Value.EndAt.Value" label="结束时间"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            plain
            type="danger"
            size="mini"
            @click="deleteJob(scope.row.Value.ID.Value)"
          >删除经历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="typeValue==='volun'"
      :data="volunData"
      border
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column prop="Value.ActName.Value" label="活动名称"></el-table-column>
      <el-table-column prop="Value.Content.Value" label="活动内容"></el-table-column>
      <el-table-column prop="Value.ActDate.Value" label="活动日期"></el-table-column>
      <el-table-column prop="Value.ActLength.Value" label="志愿时长"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            plain
            type="danger"
            size="mini"
            @click="deleteJob(scope.row.Value.ID.Value)"
          >删除经历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="typeValue==='club'?'添加班团经历':(typeValue==='social'?'添加实习经历':'添加志愿经历')"
      :visible.sync="addDialogShow"
    >
      <h3 style="margin: 0 0 15px 20px; color: #F56C6C">注: 由于信息用于应聘岗位,所以请确保以下填写的信息真实可靠,否则后果自负</h3>
      <el-form v-show="typeValue==='club'" label-width="110px">
        <el-form-item label="工作名称:" style="width: 300px">
          <el-input maxlength="50" v-model="clubAddData.JobName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="组织名称:" style="width: 300px">
          <el-input maxlength="50" v-model="clubAddData.OrgName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="组织等级:">
          <el-select v-model="clubAddData.OrgLevel" placeholder="请选择">
            <el-option label="校级" value="校级"></el-option>
            <el-option label="院级" value="院级"></el-option>
            <el-option label="班级" value="班级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作时间:">
          <el-date-picker
            v-model="clubAddData.StartAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            @change="compareDate"
          ></el-date-picker>-
          <el-date-picker
            v-model="clubAddData.EndAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            @change="compareDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="save" type="primary">立即添加</el-button>
          <el-button @click="resetDialogForm()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form v-show="typeValue==='social'" label-width="110px">
        <el-form-item label="岗位名称:" style="width: 300px">
          <el-input maxlength="50" v-model="socialAddData.JobName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="公司名称:" style="width: 300px">
          <el-input maxlength="50" v-model="socialAddData.CompanyName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="实习地点:" style="width: 300px">
          <el-input maxlength="50" v-model="socialAddData.WorkLocation" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="实习时间:">
          <el-date-picker
            v-model="socialAddData.StartAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            @change="compareDate"
          ></el-date-picker>-
          <el-date-picker
            v-model="socialAddData.EndAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            @change="compareDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="工作内容" style="width: 500px">
          <el-input
            type="textarea"
            :rows="10"
            v-model="socialAddData.WorkContent"
            resize="none"
            show-word-limit
            maxlength="200"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="save" type="primary">立即创建</el-button>
          <el-button @click="resetDialogForm()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-show="typeValue==='volun'"
        label-width="140px"
        :model="volunAddData"
        :rules="rules"
      >
        <el-form-item label="活动名称:" style="width: 300px">
          <el-input maxlength="50" v-model="volunAddData.ActName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="工作时间:">
          <el-col :span="11">
            <el-date-picker
              v-model="volunAddData.ActDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="志愿时长(小时):" style="width: 300px" prop="ActLength">
          <el-input
            type="number"
            min="0"
            max="10000"
            v-model.number="volunAddData.ActLength"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动内容" style="width: 500px">
          <el-input
            type="textarea"
            :rows="5"
            v-model="volunAddData.Content"
            resize="none"
            show-word-limit
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="save" type="primary">立即添加</el-button>
          <el-button @click="resetDialogForm()">重置</el-button>
        </el-form-item>
      </el-form>
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
import { provinceAndCityData, CodeToText } from "element-china-area-data";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (isNaN(value) || value <= 0 || value > 1000) {
        this.volunAddData.ActLength = 0;
        callback(new Error('请输入合法数字'));
      }
    };
    return {
      holder: "请输入您的自我介绍，同样可以自由编辑样式(Markdown)",
      typeOptions: [{
        value: "intention",
        label: "就职意向"
      }, {
        value: "int",
        label: "自我介绍"
      }, {
        value: "club",
        label: "班团经历"
      }, {
        value: "social",
        label: "实习经历"
      }, {
        value: "volun",
        label: "志愿经历"
      }],
      jobOpitions: [[], [], [], [], []],
      typeValue: "intention",
      locationOptions: provinceAndCityData,
      clubData: [],
      socialData: [],
      volunData: [],
      job: [[], [], [], [], []],
      location: [],
      intentionAddData: {
        jobFormated: [],
        locationFormated: []
      },
      rules: {
        ActLength: [
          { validator: validateNum, trigger: 'blur' }
        ]
      },
      clubAddData: {
        JobName: "",
        OrgName: "",
        OrgLevel: "",
        StartAt: "",
        EndAt: ""
      },
      socialAddData: {
        JobName: "",
        EndAt: "",
        StartAt: "",
        CompanyName: "",
        WorkLocation: "",
        WorkContent: ""
      },
      volunAddData: {
        ActName: "",
        ActDate: "",
        ActLength: 0,
        Content: ""
      },
      addDialogShow: false,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: false, // 下划线
        mark: true, // 标记
        imagelink: true,
        code: true,
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        fullscreen: false, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        help: false, // 帮助
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
      translation: [{
        name: "不限",
        value: ["不限"]
      }, {
        name: "IT互联网",
        value: ["编程/IT开发", "测试", "IT运维", "通信工程", "数字多媒体", "产品", "运营"]
      }, {
        name: "会计管理",
        value: ["财务/会计", "金融", "审计", "出纳", "采购", "行政", "人力资源", "贸易/进出口", "质量管理", "项目管理", "项目实施"]
      }, {
        name: "设计制造",
        value: ["工业设计", "工程设计", "平面设计", "室内设计", "生产/制造"]
      }, {
        name: "其他",
        value: ["法务", "科研", "销售", "教师", "翻译", "编辑/文案", "培训", "其他"]
      }],
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
    compareDate() {
      if (this.typeValue === "club") {
        if (this.clubAddData.StartAt.length === 0 || this.clubAddData.StartAt.length === 0)
          return;
        if (new Date(this.clubAddData.StartAt) > new Date(this.clubAddData.EndAt)) {
          this.$message.error("时间信息选取有误");
          this.clubAddData.EndAt = "";
        }
      }
      else if (this.typeValue === "social") {
        if (this.socialAddData.StartAt.length === 0 || this.socialAddData.StartAt.length === 0)
          return;
        if (new Date(this.socialAddData.StartAt) > new Date(this.socialAddData.EndAt)) {
          this.$message.error("时间信息选取有误");
          this.socialAddData.EndAt = "";
        }
      }
    },
    imageFilter(file) {
      if (file.size >= 1000000) {
        this.$message.error("图片文件太大啦!换个试试吧~");
        return false;
      }
      return true;
    },
    imgAdd(filename, file) {
      // 第一步.将图片上传到服务器.
      let formdata = new FormData();
      formdata.append('image', file);
      this.axios({
          url: 'https://api.limkim.xyz/uploadImg',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' },
      }).then((response) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        const oldImg = "![image." + file.type.split("/")[1] + "]" + "(" + filename + ")";
        const newImg = oldImg.replace("(" + filename + ")", "(" + "https://api.limkim.xyz/data/eduPic/" + response.data.data.fileName + ")");
        this.content = this.content.replace(oldImg, newImg);
        // mavonEditor.methods.$img2Url(filename, response.data.data.fileName);
      });
    },
    resetDialogForm() {
      console.log(this.typeValue);
      if (this.typeValue === "club")
        this.clubAddData = {
          JobName: "",
          OrgName: "",
          OrgLevel: "",
          StartAt: "",
          EndAt: ""
        };
      else if (this.typeValue === "volun")
        this.volunAddData = {
          name: "",
          time: "",
          dura: 0,
          content: ""
        };
      else if (this.typeValue === "social") {
        this.socialAddData = {
          JobName: "",
          EndAt: "",
          StartAt: "",
          CompanyName: "",
          WorkLocation: "",
          WorkContent: ""
        };
      }

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
        this.$emit("func4", true);
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
    getIntention() {
      this.loading = true;
      this.axios({
        method: "get",
        url: "/job/type/list",
      }).then(response => {
        const data = response.data.data;
        this.jobOpitions = [[], [], [], [], []];
        this.job = [[], [], [], [], []];
        let other = null;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (this.translation[j].value.indexOf(data[i].Name) !== -1) {
              switch (data[i].Name) {
                case "编程/IT开发":
                  this.jobOpitions[j].unshift(data[i]);
                  break;
                case "测试":
                  if (this.jobOpitions[j][0].Name && this.jobOpitions[j][0].Name === "编程/IT开发")
                    this.jobOpitions[j].splice(1, 0, data[i]);
                  else
                    this.jobOpitions[j].unshift(data[i]);
                  break;
                case "其他":
                  other = data[i];
                  break;
                default:
                  this.jobOpitions[j].push(data[i]);
                  break;
              }
              break;
            }
          }
        }
        if (other)
          this.jobOpitions[4].push(other);
        return this.axios({
          method: "post",
          url: "/lookup?topic=career_intent",
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: JSON.stringify({
            SchoolCode: 1,
            StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
          })
        });
      }).then(response => {
        if (response.data.data.length === 0) {
          this.loading = false;
          return;
        }
        this.loading = false;
        const data = response.data.data[0].Value;
        this.intentionAddData.jobFormated = data.JobTypeIntent.Value;
        this.intentionAddData.locationFormated = data.LocationIntent.Value;
      }).catch(() => {
        this.$message.error("获取就职意向信息出错啦,请稍后再试");
        this.loading = false;
      });
    },
    typeChange() {
      let url = "";
      switch (this.typeValue) {
        case "int":
          url = "/lookup?topic=self_introduction";
          break;
        case "intention":
          return this.getIntention();
        case "club":
          url = "/lookup?topic=org_experience";
          break;
        case "volun":
          url = "/lookup?topic=voluntary_experience";
          break;
        case "social":
          url = "/lookup?topic=internship_experience";
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
        else if (this.typeValue === "volun") {
          if (response.data.data.length !== 0)
            for (let i = 0; i < response.data.data.length; i++) {
              response.data.data[i].Value.ActDate.Value = response.data.data[i].Value.ActDate.Value.substr(0, 10);
            }
          this.volunData = response.data.data;
          this.loading = false;
        }
        else if (this.typeValue === "social") {
          if (response.data.data.length !== 0)
            for (let i = 0; i < response.data.data.length; i++) {
              response.data.data[i].Value.StartAt.Value = response.data.data[i].Value.StartAt.Value.substr(0, 10);
              response.data.data[i].Value.EndAt.Value = response.data.data[i].Value.EndAt.Value.substr(0, 10);
            }
          this.socialData = response.data.data;
          this.loading = false;
        }
      }).catch(() => {
        this.$message.error("获取个人填写信息出错啦,请稍后再试");
        this.loading = false;
      });
    },
    deleteJob(ID) {
      this.$confirm("确定要删除此项经历吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        let url = "";
        let topic = "";
        switch (this.typeValue) {
          case "club":
            url = "/delete?topic=org_experience";
            topic = "org_experience";
            break;
          case "volun":
            url = "/delete?topic=voluntary_experience";
            topic = "voluntary_experience";
            break;
          case "social":
            url = "/delete?topic=internship_experience";
            topic = "internship_experience";
            break;
        }
        this.axios({
          method: "put",
          url,
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: {
            "Topic": topic,
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
        if (this.clubAddData.JobName.trim().length === 0 || this.clubAddData.OrgName.trim().length === 0 || this.clubAddData.OrgLevel.length === 0 || this.clubAddData.StartAt.length === 0 || this.clubAddData.EndAt.length === 0)
          return this.$message.error("请将表单填写完整");
      }
      else if (this.typeValue === "int") {
        if (this.content.trim().length === 0)
          return this.$message.error("请先填写你的自我介绍吧");
      }
      else if (this.typeValue === "intention") {
        if (this.intentionAddData.locationFormated.length === 0 || this.intentionAddData.jobFormated.length === 0)
          return this.$message.error("请先勾选你的求职意向岗位和工作城市");
      }
      else if (this.typeValue === "volun") {
        if (this.volunAddData.ActName.trim().length === 0 || this.volunAddData.ActDate.length === 0 || this.volunAddData.Content.trim().length === 0)
          return this.$message.error("请将表单填写完整");
      }
      else if (this.typeValue === "social") {
        if (this.socialAddData.JobName.trim().length === 0 || this.socialAddData.CompanyName.length === 0 || this.socialAddData.StartAt.trim().length === 0 || this.socialAddData.EndAt.trim().length === 0 || this.socialAddData.WorkLocation.trim().length === 0)
          return this.$message.error("请将表单填写完整");
      }
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
                "StartAt": this.clubAddData.StartAt,
                "ID": 0,
                "EndAt": this.clubAddData.EndAt
              }
            };
            break;
          case "intention":
            url = "/save?topic=career_intent";
            data = {
              "Topic": "career_intent",
              "ItemObj": {
                "LocationIntent": this.intentionAddData.locationFormated,
                "JobTypeIntent": this.intentionAddData.jobFormated
              }
            };
            break;
          case "volun":
            url = "/save?topic=voluntary_experience";
            this.volunAddData.ActDate = new Date(this.volunAddData.ActDate).toISOString().split(".")[0] + "+08:00";
            this.volunAddData.ID = 0;
            data = {
              "Topic": "voluntary_experience",
              "ItemObj": this.volunAddData
            };
            break;
          case "social":
            url = "/save?topic=internship_experience";
            this.socialAddData.StartAt = new Date(this.socialAddData.StartAt).toISOString().split(".")[0] + "+08:00";
            this.socialAddData.EndAt = new Date(this.socialAddData.EndAt).toISOString().split(".")[0] + "+08:00";
            this.socialAddData.ID = 0;
            data = {
              "Topic": "internship_experience",
              "ItemObj": this.socialAddData
            };
            break;
          default:
            return;
        }
        this.axios({
          method: "put",
          url,
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data
        }).then(() => {
          this.$message.success("保存成功,您可以随时回来修改");
          if (this.typeValue === "club" || this.typeValue === "social" || this.typeValue === "volun") {
            this.resetDialogForm();
            this.addDialogShow = false;
          }
          return this.typeChange();
        }).catch(() => {
          this.$message.error("保存个人填写信息出错啦,请稍后再试");
          this.loading = false;
        });
      });
    },
    confirm() {
      if (this.typeValue === "int") {
        if (this.content.trim().length === 0)
          return this.$message.error("请先填写你的自我介绍吧");
      }
      else if (this.typeValue === "intention") {
        if (this.intentionAddData.locationFormated.length === 0 || this.intentionAddData.jobFormated.length === 0)
          return this.$message.error("请先勾选你的求职意向岗位和工作城市");
      }
      let title = "";
      switch (this.typeValue) {
        case "int":
          title = "自我介绍";
          break;
        case "volun":
          title = "志愿经历";
          break;
        case "club":
          title = "班团经历";
          break;
        case "intention":
          title = "就职意向";
          break;
        case "social":
          title = "实习经历";
          break;
      }
      this.$confirm("请确认您已经将" + title + "信息完善, 是否继续确认?", "提示", {
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
          case "intention":
            url = "/save?topic=career_intent";
            data = {
              "Topic": "career_intent",
              "ItemObj": {
                "LocationIntent": this.intentionAddData.locationFormated,
                "JobTypeIntent": this.intentionAddData.jobFormated
              }
            };
            break;
          default:
            url = "https://api.limkim.xyz/put";
        }
        this.axios({
          method: "put",
          url,
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data
        }).then(() => {
          this.$emit("func2", false);
          this.$emit("func3", 3);
          let data = new FormData();
          data.append("dataFile", this.file);
          let url = "";
          switch (this.typeValue) {
            case "int":
              url = "/confirm?topic=self_introduction";
              break;
            case "club":
              url = "/confirm?topic=org_experience";
              break;
            case "volun":
              url = "/confirm?topic=voluntary_experience";
              break;
            case "intention":
              url = "/confirm?topic=career_intent";
              break;
            case "social":
              url = "/confirm?topic=internship_experience";
              break;
          }
          data.append("condMap", "{\"SchoolCode\": 1,\"StaffID\": " + JSON.parse(localStorage.getItem("jw_student_file")).staffID + "}");
          this.axios({
            method: "put",
            url,
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
          });
        });

      });
    }
  },
  watch: {
    job: {
      handler() {
        if (this.job[0].length !== 0) {
          let count = 0;
          for (let i = 1; i < 5; i++)
            if (this.job[i].length > 0)
              count++;
          if (count !== 0) {
            this.job = [["不限"], [], [], [], []];
          }
          this.intentionAddData.jobFormated = ["不限"];
        }
        else {
          this.intentionAddData.jobFormated = [];
          for (let i = 0; i < 5; i++)
            for (let j = 0; j < this.job[i].length; j++)
              this.intentionAddData.jobFormated.push(this.job[i][j]);
        }
      }
    },
    location: {
      handler() {
        if (this.location.length > 10) {
          this.location = this.location.splice(0, 10);
          this.$message.error("太多啦~");
        }
        this.intentionAddData.locationFormated = [];
        for (let i = 0; i < this.location.length; i++) {
          this.intentionAddData.locationFormated.push(CodeToText[this.location[i][0]] + (CodeToText[this.location[i][1]] === "市辖区" ? "" : CodeToText[this.location[i][1]]));
        }
      }
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
.el-checkbox {
  width: 155px;
  height: 40px;
  line-height: 40px;
}
.form1 .type {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(204, 204, 204, 0.336);
}
.form1 .el-checkbox {
  width: 100px;
}
</style>
<style>
.form1 .el-form-item__label {
  font-size: 16px;
  text-align: center;
}
</style>