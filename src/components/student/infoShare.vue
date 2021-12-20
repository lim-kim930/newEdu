<template>
  <div>
    <el-form
      :model="ruleForm"
      v-loading="loading"
      element-loading-text="拼命加载中"
      ref="ruleForm"
      label-width="150px"
      :style="{'max-height': this.wh - 105 + 'px'}"
    >
      <el-steps
        :active="stepActive"
        align-center
        finish-status="success"
        style="height: 70px; margin-bottom: 30px"
      >
        <el-step title="步骤 1" description="请上传您之前生成的学业文件" icon="el-icon-user"></el-step>
        <el-step title="步骤 2" description="请确定此次分享的各项信息" icon="el-icon-edit"></el-step>
      </el-steps>
      <div v-show="stepActive===0">
        <el-upload
          class="upload"
          action="#"
          :http-request="getFile"
          :limit="1"
          :on-change="change"
          :on-remove="remove"
          :file-list="fileList"
          accept=".enc"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传enc格式的学业文件</div>
        </el-upload>
        <el-button class="next" type="primary" plain v-show="btnShow" @click="next()">下一步</el-button>
      </div>
      <div
        v-show="stepActive===1"
        class="info-select"
        :style="{overflow: 'auto', 'max-height': this.wh-280+'px'}"
      >
        <el-form-item label="要分享的学籍信息" required>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="CheckAllChange($event, 1)"
            border
            v-show="profileData.length !== 0"
            style="width: 80px"
          >全选</el-checkbox>
          <el-checkbox-group
            v-model="ruleForm.profileType"
            style="margin-left: 30px; width: 80%"
            @change="CheckedChange($event, 1)"
          >
            <el-checkbox
              v-for="item in profileData"
              v-bind:key="item.value"
              :label="item.value"
              style="width: 150px"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="课程成绩信息" required>
          <h4 v-show="scoreData.length === 0">暂无信息</h4>
          <el-table
            ref="multipleTable"
            border
            :data="scoreData"
            v-show="scoreData.length !== 0"
            tooltip-effect="dark"
            style="width: 90%"
            @selection-change="handleSelectionChange1"
            :max-height="500"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="课程名"></el-table-column>
            <el-table-column prop="value" label="选课号"></el-table-column>
            <el-table-column prop="gp" label="绩点" width="100"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="等级考试信息" required>
          <h4 v-show="levelData.length === 0">暂无信息</h4>
          <el-table
            ref="multipleTable"
            border
            :data="levelData"
            v-show="levelData.length !== 0"
            tooltip-effect="dark"
            style="width: 90%"
            @selection-change="handleSelectionChange2"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="考试名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="value" label="考试时间"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="个人荣誉信息" required>
          <h4 v-show="rewardData.length === 0">暂无信息</h4>
          <el-table
            ref="multipleTable"
            border
            :data="rewardData"
            v-show="rewardData.length !== 0"
            tooltip-effect="dark"
            style="width: 90%"
            @selection-change="handleSelectionChange3"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="项目名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="yearValue" label="获得年份"></el-table-column>
            <el-table-column prop="semValue" label="获得学期"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="创新学分信息" required>
          <h4 v-show="raceData.length === 0">暂无信息</h4>
          <el-table
            ref="multipleTable"
            border
            :data="raceData"
            v-show="raceData.length !== 0"
            tooltip-effect="dark"
            style="width: 90%"
            @selection-change="handleSelectionChange4"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="项目名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="value" label="获得时间"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item class="md" label="自我介绍" required>
          <h4 v-show="!selfData[0].md">暂无信息</h4>
          <el-checkbox v-show="selfData[0].md" v-model="ruleForm.selfChecked">选择</el-checkbox>
          <mavonEditor
            :toolbars="toolbars"
            :autofocus="false"
            defaultOpen="preview"
            :editable="false"
            v-show="selfData[0].md"
            v-model="selfData[0].md"
            :style="{'width': '90%', 'margin-top': '10px', 'height': this.wh - 300 + 'px'}"
          />
        </el-form-item>
        <el-form-item class="md" label="班团工作" required>
          <h4 v-show="clubData.length === 0">暂无信息</h4>
          <!-- <el-checkbox v-show="selfData[1].data" v-model="ruleForm.clubChecked">选择</el-checkbox> -->
          <el-table
            :data="clubData"
            tooltip-effect="dark"
            style="width: 90%"
            border
            v-show="clubData.length !== 0"
            @selection-change="clubSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="JobName" label="工作名称"></el-table-column>
            <el-table-column prop="OrgName" label="组织名称"></el-table-column>
            <el-table-column prop="OrgLevel" label="组织等级"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="排名信息" required>
          <h4 v-show="rankData.length === 0">暂无信息</h4>
          <el-table
            :data="rankData"
            tooltip-effect="dark"
            style="width: 90%"
            border
            v-show="rankData.length !== 0"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="GPA" label="绩点"></el-table-column>
            <el-table-column prop="Rank" label="专业排名"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="目的企业和岗位" required>
          <span
            v-show="target_show"
            style="color: #67C23A; background-color: #f0f9eb; padding: 10px; border-radius: 5px;"
          >{{ target }}</span>
          <br v-show="target_show" />
          <el-cascader
            style=" margin-top: 5px"
            v-model="ruleForm.hr"
            :options="options"
            :props="props"
            collapse-tags
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="有效时间"
          prop="date"
          :rules="[
        { type: 'number', message: '有效日期须为数字', trigger: 'change'},
        { type: 'number', max: 9999, message: '数值过大', trigger: 'change'}
      ]"
        >
          <el-input v-model.number="ruleForm.date" style="width: 150px" placeholder="默认为10天"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()"
            style="margin: 0 0 30px 50px; width: 150px"
          >预览</el-button>
          <!-- <el-button type="primary" @click="stepActive = 0" style="width: 100px">上一步</el-button> -->
        </el-form-item>
      </div>
    </el-form>
    <el-dialog :visible.sync="previewVisible">
      <span style="font-size: 18px; font-weight: 700; margin-left: 10px">分享预览,请确认无误后点击分享</span>
      <el-button
        type="primary"
        plain
        @click="dialogSwitch()"
        :disabled="!this.ruleForm.selfChecked && this.clubValue.length === 0"
        style="width: 150px; margin-bottom: 10px; margin-left: calc(100% - 630px)"
      >{{(this.ruleForm.selfChecked || this.clubValue.length !== 0)?(this.switch === 1?"查看个人填写预览":"返回"):"未选择个人信息"}}</el-button>
      <el-button
        type="primary"
        @click="confirm()"
        style="width: 150px; margin-bottom: 10px; margin-left: 10px"
      >立即分享</el-button>
      <div v-show="this.switch === 1">
        <div
          id="mycanvas"
          v-show="!tableShow"
          :style="{background: 'url('+ url +') no-repeat', height: table_height}"
          @contextmenu.prevent
        ></div>
        <div
          class="table"
          v-show="tableShow"
          :style="{height: table_height}"
          style="width: 1166px;"
        >
          <div class="hash">
            <span class="title">交易哈希</span>
            <span
              id="hash_content"
            >0x****************************************************************</span>
          </div>
          <div class="name">
            <span class="title">姓名</span>
            <span class="content">{{profileValue.Name}}</span>
          </div>
          <div class="sex">
            <span class="title">性别</span>
            <span class="content">{{profileValue.Sex}}</span>
          </div>
          <div class="nation">
            <span class="title">民族</span>
            <span class="content">{{profileValue.Nation}}</span>
          </div>
          <div class="classCode">
            <span class="title">GPA</span>
            <span class="content">{{rankValue.GPA}}</span>
          </div>
          <div class="className">
            <span class="title">班级名称</span>
            <span class="content">{{profileValue.ClassName}}</span>
          </div>
          <div class="pic" :style="{background: 'url('+ profileValue.Photo +') no-repeat' }"></div>

          <div class="schoolCode">
            <span class="title">学校代码</span>
            <span class="content">{{profileValue.SchoolCode}}</span>
          </div>
          <div class="staffID">
            <span class="title">学号</span>
            <span class="content">{{profileValue.StaffID}}</span>
          </div>
          <div class="unitCode">
            <span class="title">学院代码</span>
            <span class="content">{{profileValue.UnitCode}}</span>
          </div>
          <div class="unitName">
            <span class="title">学院名称</span>
            <span class="content">{{profileValue.UnitName}}</span>
          </div>
          <div class="majorCode">
            <span class="title">GPA排名</span>
            <span class="content">{{rankValue.Rank}}</span>
          </div>
          <div class="majorName">
            <span class="title">专业名称</span>
            <span class="content">{{profileValue.MajorName}}</span>
          </div>
          <div class="score" :style="{height: score_height}">
            <span class="title" :style="{height: score_height, paddingTop: title_paddingTop}">成绩单</span>
            <div class="score_content" :style="{height: score_height}">
              <div class="part1" :style="{height: score_height}">
                <span class="course_name">课程名</span>
                <span class="course_score">成绩</span>
                <span class="course_gp">绩点</span>
                <span class="score_value" v-for="item in scoreDataPart1" :key="item.id">
                  <span
                    class="course_name_value"
                    :style="{lineHeight: item.name.length<=8?'50px':item.name.length<=16?'25px':'16px'}"
                    :title="item.name"
                  >{{item.name}}</span>
                  <span class="course_score_value">{{item.score}}</span>
                  <span class="course_gp_value">{{item.gp}}</span>
                </span>
              </div>
              <div class="part2" :style="{height: score_height}">
                <span class="course_name">课程名</span>
                <span class="course_score">成绩</span>
                <span class="course_gp">绩点</span>
                <span class="score_value" v-for="item in scoreDataPart2" :key="item.id">
                  <span
                    class="course_name_value"
                    :style="{lineHeight: item.name.length<=8?'50px':item.name.length<=16?'25px':'16px'}"
                    :title="item.name"
                  >{{item.name}}</span>
                  <span class="course_score_value">{{item.score}}</span>
                  <span class="course_gp_value">{{item.gp}}</span>
                </span>
              </div>
              <div class="part3" :style="{height: score_height}">
                <span class="course_name">课程名</span>
                <span class="course_score">成绩</span>
                <span class="course_gp">绩点</span>
                <span class="score_value" v-for="item in scoreDataPart3" :key="item.id">
                  <span
                    class="course_name_value"
                    :style="{lineHeight: item.name.length<=8?'50px':item.name.length<=16?'25px':'16px'}"
                    :title="item.name"
                  >{{item.name}}</span>
                  <span class="course_score_value">{{item.score}}</span>
                  <span class="course_gp_value">{{item.gp}}</span>
                </span>
              </div>
              <div class="part4" :style="{height: score_height}">
                <span class="course_name">课程名</span>
                <span class="course_score">成绩</span>
                <span class="course_gp">绩点</span>
                <span class="score_value" v-for="item in scoreDataPart4" :key="item.id">
                  <span
                    class="course_name_value"
                    :style="{lineHeight: item.name.length<=8?'50px':item.name.length<=16?'25px':'16px'}"
                    :title="item.name"
                  >{{item.name}}</span>
                  <span class="course_score_value">{{item.score}}</span>
                  <span class="course_gp_value">{{item.gp}}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="level" :style="{top: level_top, height: level_height}">
            <span class="title" :style="{height: level_height, paddingTop: level_paddingTop}">等级考试</span>
            <div class="level_content" :style="{height: level_height}">
              <span class="level_name">考试名称</span>
              <span class="level_score">考试成绩</span>
              <span class="level_year">考试时间</span>
              <span class="level_value" v-for="item in levelValue" :key="item.id">
                <span class="level_name_value">{{item.name}}</span>
                <span class="level_score_value">{{item.score}}</span>
                <span class="level_year_value">{{item.date}}</span>
              </span>
            </div>
          </div>
          <div class="reward" :style="{top: reward_top, height: reward_height}">
            <span class="title" :style="{height: reward_height, paddingTop: reward_paddingTop}">综合素质</span>
            <div class="reward_content" :style="{height: reward_height}">
              <div class="rewardPart" :style="{height: reward_height}">
                <h4>个人荣誉</h4>
                <span class="reward_name">奖项名称</span>
                <span class="reward_level">奖项等级</span>
                <span class="reward_year">获奖年份</span>
                <span class="reward_value" v-for="item in rewardValue" :key="item.id">
                  <span class="reward_name_value">{{item.name}}</span>
                  <span class="reward_level_value">{{item.level}}</span>
                  <span class="reward_year_value">{{item.date}}</span>
                </span>
              </div>
              <div class="racePart" :style="{height: reward_height}">
                <h4>创新学分</h4>
                <span class="race_name">项目名称</span>
                <span class="race_level">奖项等级</span>
                <span class="race_year">获奖时间</span>
                <span class="race_value" v-for="item in raceValue" :key="item.id">
                  <span class="race_name_value">{{item.name}}</span>
                  <span class="race_level_value">{{item.level}}</span>
                  <span class="race_year_value">{{item.date}}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="info" :style="{top: info_top}">
            <span class="title">注意事项</span>
            <div class="info_content">
              <span>1.该信息仅供高校学业核验系统核验使用,禁止他用</span>
              <span>1.该信息仅供高校学业核验系统核验使用,禁止他用</span>
              <span>1.该信息仅供高校学业核验系统核验使用,禁止他用</span>
            </div>
            <div class="end_time">
              <span>有效期至:</span>
              <span>{{profileValue.expired_at}}</span>
            </div>
          </div>
        </div>
      </div>
      <h3 style="margin-left: 5%" v-show="this.switch===2 && selfData[0].md">自我介绍</h3>
      <mavonEditor
        :toolbars="toolbars"
        :autofocus="false"
        defaultOpen="preview"
        :editable="false"
        v-show="this.switch===2 && selfData[0].md"
        v-model="selfData[0].md"
        :style="{'width': '90%', 'margin': ' 10px 5%', 'height': this.wh - 300 + 'px'}"
      />
      <h3 style="margin-left: 5%" v-show="this.switch===2 && clubValue.length !== 0">班团工作</h3>
      <el-table
        :data="clubValue"
        tooltip-effect="dark"
        :style="{'width': '90%', 'margin': ' 10px 5%'}"
        border
        v-show="this.switch===2 && clubValue.length !== 0"
      >
        <el-table-column prop="JobName" label="工作名称"></el-table-column>
        <el-table-column prop="OrgName" label="组织名称"></el-table-column>
        <el-table-column prop="OrgLevel" label="组织等级"></el-table-column>
        <el-table-column prop="StartAt" label="开始时间"></el-table-column>
        <el-table-column prop="EndAt" label="结束时间"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog class="share" title="提示" :visible.sync="dialogVisible" width="35%">
      <span>
        <i class="el-icon-success el-icon--left" style="color: #67C23A"></i>分享成功! 此次分享链接为:
      </span>
      <span>
        <el-popover placement="bottom" width="500" trigger="hover" :content="shareLink">
          <i id="shareLink" slot="reference">{{shareLink}}</i>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="复制" placement="right">
          <el-button
            v-clipboard:copy="shareLink"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
          >
            <i class="el-icon-document-copy"></i>
          </el-button>
        </el-tooltip>
      </span>
      <span>请将此链接妥善保存,线下分享给企业即可</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let FormData = require("form-data");
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { Base64 } from "js-base64";
export default {
  data() {
    let that = this;
    return {
      data: "",
      url: "",
      tableShow: true,
      score_height: "",
      title_height: "",
      title_paddingTop: "",
      score_content_height: "",
      table_height: "",
      level_top: "",
      level_paddingTop: "",
      level_height: "",
      reward_top: "",
      reward_paddingTop: "",
      reward_height: "",
      info_top: "",
      profileValue: {},
      levelValue: [],//等级考试信息数据
      rewardValue: [],
      raceValue: [],
      rankValue: {},
      selfValue: {},
      scoreDataPart1: [],
      scoreDataPart2: [],
      scoreDataPart3: [],
      scoreDataPart4: [],
      previewVisible: false,
      stepActive: 0,//步骤数
      checkAll: false,//学籍信息全选
      isIndeterminate: false,//学籍全选按钮的不确定状态
      shareLink: "",//分享链接
      content: "",//学业文件内容
      fileList: [],//upload文件列表
      dataFile: "",//文件
      btnShow: false,//下一步按钮显示
      target: "",
      target_show: false,
      ruleForm: {//表单选中数据
        date: "",
        hr: [],
        profileType: [],
        scoreType: [],
        levelType: [],
        rewardType: [],
        rankType: [],
        selfChecked: false,
        clubType: [],
        raceType: []
      },
      profileData: [],//学籍信息数据
      profileDataValue: [],//学籍全选辅助
      levelData: [],//等级考试信息数据
      scoreData: [],
      rewardData: [],
      raceData: [],
      rankData: [],
      selfData: [{}],
      clubData: [],
      clubValue: [],
      options: [],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          that.target_show = false;
          const { data, level } = node;
          if (data === undefined)
            return;
          that.axios({
            method: "post",
            url: "https://api.hduhelp.com/gormja_wrapper/job/lookup",
            // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
            data: {
              "CompanyCode": data.value
            }
          }).then((response) => {
            let nodes = [];
            const type = Object.keys(response.data.data);
            for (let i = 0; i < type.length; i++)
              for (let j = 0; j < response.data.data[type[i]].length; j++)
                nodes.push({
                  value: response.data.data[type[i]][j].JobID,
                  label: response.data.data[type[i]][j].Name,
                  leaf: level >= 1
                });
            resolve(nodes);
          }).catch(() => {
            this.$message.error("获取岗位信息错误");
          });
        }
      },
      loading: false,
      dialogVisible: false,
      toolbars: {
        readmodel: true
      },
      switch: 1
    };
  },
  props: ["wh", "file"],
  components: { mavonEditor },
  methods: {
    handleSelectionChange(val) {
      this.ruleForm.rankType = [];
      val.forEach(item => {
        this.ruleForm.rankType.push(item.value);
      });
    },
    handleSelectionChange1(val) {
      this.ruleForm.scoreType = [];
      val.forEach(item => {
        this.ruleForm.scoreType.push(item.value);
      });
    },
    handleSelectionChange2(val) {
      this.ruleForm.levelType = [];
      val.forEach(item => {
        this.ruleForm.levelType.push(item.key);
      });

    },
    handleSelectionChange3(val) {
      this.ruleForm.rewardType = [];
      val.forEach(item => {
        this.ruleForm.rewardType.push(item.key);
      });
    },
    handleSelectionChange4(val) {
      this.ruleForm.raceType = [];
      val.forEach(item => {
        this.ruleForm.raceType.push(item.key);
      });
    },
    clubSelectionChange(val) {
      this.ruleForm.clubType = [];
      val.forEach(item => {
        this.ruleForm.clubType.push(item.key);
      });
    },
    CheckAllChange(val) {
      this.ruleForm.profileType = val ? this.profileDataValue : [];
      this.isIndeterminate = false;
    },
    CheckedChange(val) {
      this.checkAll = val.length === this.profileDataValue.length;
      this.isIndeterminate = val.length > 0 && val.length < this.profileDataValue.length;
    },
    //复制成功提示
    onCopy() {
      this.$notify({
        title: "成功",
        message: "复制成功,快去分享吧",
        type: "success"
      });
    },
    //复制失败提示
    onCopyError() {
      this.$notify.error({
        title: "错误",
        message: "复制失败,请手动选中复制"
      });
    },
    //关闭分享成功的dialog
    closeDialog() {
      this.dialogVisible = false;
      this.loading = false;
    },
    //文件加载完成,出现下一步按钮
    getFile() {
      this.btnShow = true;
    },
    //将文件放到file变量中
    change(response, file) {
      this.dataFile = file[0].raw;
      this.$emit("func", this.dataFile);
    },
    //删除文件
    remove() {
      this.dataFileList = [];
      this.dataFile = "";
      this.$emit("func", this.dataFile);
    },
    //重置
    resetForm() {
      this.ruleForm = {
        date: "",
        hr: [],
        profileType: [],
        scoreType: [],
        levelType: [],
        rewardType: [],
        rankType: [],
        selfChecked: false,
        clubType: [],
        raceType: []
      };
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    dialogSwitch() {
      this.switch = this.switch === 1 ? 2 : 1;
    },
    //下一步
    next() {
      this.stepActive = 1;
      this.loading = true;
      var data = new FormData();
      data.append("dataFile", this.dataFile);
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data
      }).then((response) => {
        this.content = response.data.data.Body.data_map;
        this.axios({
          method: "get",
          url: "https://api.hduhelp.com/gormja_wrapper/company/lookup",
        }).then((response) => {
          for (let i = 0; i < response.data.data.length; i++)
            this.options.push({
              value: response.data.data[i].CompanyCode,
              label: response.data.data[i].Name
            });
          this.resetForm();
          if (sessionStorage.getItem("com")) {
            if (JSON.parse(sessionStorage.getItem("com")).Name === "") {
              for (let i = 0; i < this.options.length; i++)
                if (this.options[i].value === JSON.parse(sessionStorage.getItem("com")).CompanyCode) {
                  this.target = "正在回应" + (this.options[i].label || this.options[i].value) + "的简历请求, 已为您选择对应企业和岗位, 你也可以自由选择:";
                  break;
                }
            }
            else {
              this.target = "已为您选择: " + JSON.parse(sessionStorage.getItem("com")).Name + "/" + JSON.parse(sessionStorage.getItem("com")).job + ", 你也可以自由选择:";
              this.ruleForm.hr = [JSON.parse(sessionStorage.getItem("com")).CompanyCode, JSON.parse(sessionStorage.getItem("com")).JobID];
            }
            this.target_show = true;
            sessionStorage.removeItem("com");
          }
          var range = Object.keys(this.content);
          for (var i = 0; i < range.length; i++) {
            if (range[i] === "profile") {
              const translation = {
                ClassCode: "班级号码",
                ClassName: "班级名称",
                SchoolCode: "学校代码",
                StaffID: "学号",
                UnitCode: "学院代码",
                UnitName: "学院名称",
                MajorCode: "专业代码",
                MajorName: "专业名称",
                Sex: "性别",
                Name: "姓名",
                Photo: "照片",
                Nation: "民族",
              };
              const sort = ["Name", "Sex", "Nation", "Photo", "StaffID", "ClassName", "MajorName", "UnitName", "UnitCode", "SchoolCode"];
              const profile = Object.keys(this.content.profile[Object.keys(this.content.profile)]);
              this.profileData = [];
              this.profileDataValue = [];
              for (let i = 0; i < sort.length; i++) {
                if (profile.indexOf(sort[i])) {
                  this.profileDataValue.push(sort[i]);
                  this.profileData.push({
                    value: sort[i],
                    name: translation[sort[i]]
                  });
                }
              }
            }
            else if (range[i] === "score") {
              this.scoreData = [];
              var score = Object.keys(this.content.score);
              for (var j = 0; j < score.length; j++) {
                this.scoreData.push({
                  value: score[j],
                  name: this.content.score[score[j]].CourseName,
                  gp: this.content.score[score[j]].GP
                });
              }
            }
            else if (range[i] === "level_exam") {
              this.levelData = [];
              var level = Object.keys(this.content.level_exam);
              for (var j = 0; j < level.length; j++) {
                this.levelData.push({
                  value: this.content.level_exam[level[j]].ExamDate,
                  name: this.content.level_exam[level[j]].ExamName,
                  key: level[j]
                });
              }
            }
            else if (range[i] === "reward") {
              this.rewardData = [];
              var reward = Object.keys(this.content.reward);
              for (var j = 0; j < reward.length; j++) {
                this.rewardData.push({
                  yearValue: this.content.reward[reward[j]].SchoolYear,
                  semValue: this.content.reward[reward[j]].Semester === 0 ? "第一学期" : "第二学期",
                  name: this.content.reward[reward[j]].RewardName,
                  key: reward[j]
                });
              }
            }
            else if (range[i] === "race_reward") {
              this.raceData = [];
              var race = Object.keys(this.content.race_reward);
              for (var j = 0; j < race.length; j++) {
                this.raceData.push({
                  value: this.content.race_reward[race[j]].RewardDate,
                  name: this.content.race_reward[race[j]].RaceName,
                  key: race[j]
                });
              }
            }
            else if (range[i] === "rank") {
              this.rankData = [];
              this.rankData.push({
                value: "GPA",
                GPA: this.content.rank[Object.keys(this.content.rank)[0]].GPA.toFixed(2),
                Rank: this.content.rank[Object.keys(this.content.rank)[0]].Rank,
                key: Object.keys(this.content.rank)[0]
              });
            }
            else if (range[i] === "self_introduction") {
              this.selfData = [];
              this.selfData.push({
                md: Base64.decode(this.content.self_introduction[Object.keys(this.content.self_introduction)[0]].SelfIntroduction),
                key: Object.keys(this.content.self_introduction)[0]
              });
            }
            else if (range[i] === "org_experience") {
              this.clubData = [];
              const keys = Object.keys(this.content.org_experience);
              for (let i = 0; i < keys.length; i++) {
                this.content.org_experience[keys[i]].key = keys[i];
                this.clubData.push(this.content.org_experience[keys[i]]);
              }
            }
          }
          this.loading = false;
        }).catch(() => {
          this.$message.error("获取公司列表或者数据处理出错啦,请稍后再试");
          this.loading = false;
        });
      }).catch((err) => {
        if (err.response.data.msg === "file hash does not equal to chain")
          this.$message.error("学业文件错误或者过期,请检查后再试");
        else
          this.$message.error("获取学业文件信息出错啦,请稍后再试");
        this.stepActive = 0;
        this.loading = false;
      });
    },
    // 提交按钮
    submitForm() {
      if (this.ruleForm.hr === "")
        return this.$message.error("请选择要分享的企业");
      if ((!(/(^[1-9]\d*$)/.test(this.ruleForm.date)) && this.ruleForm.date != "") || this.ruleForm.date > 9999)
        return this.$message.error("分享时长填写有误,请检查");
      this.$confirm("请确认信息选填无误,是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.switch = 1;
        let ShareItems = [];
        let Path = [];
        let data = new FormData();
        data.append("dataFile", this.dataFile);
        data.append("companyCode", this.ruleForm.hr[0]);
        data.append("jobID", this.ruleForm.hr[1]);
        if (this.ruleForm.profileType.length != 0) {
          if (this.checkAll1 === true)
            ShareItems.push({ "Path": ["profile", Object.keys(this.content.profile)[0]] });
          else
            for (var i = 0; i < this.ruleForm.profileType.length; i++) {
              Path = ["profile", Object.keys(this.content.profile)[0]];
              Path.push(this.ruleForm.profileType[i]);
              ShareItems.push({ "Path": Path });
            }
        }
        if (this.ruleForm.scoreType.length !== 0) {
          for (var i = 0; i < this.ruleForm.scoreType.length; i++) {
            Path = ["score"];
            Path.push(this.ruleForm.scoreType[i]);
            ShareItems.push({ "Path": Path });
          }
        }
        if (this.ruleForm.levelType.length !== 0) {
          for (var i = 0; i < this.ruleForm.levelType.length; i++) {
            Path = ["level_exam"];
            Path.push(this.ruleForm.levelType[i]);
            ShareItems.push({ "Path": Path });
          }
        }
        if (this.ruleForm.rewardType.length !== 0) {
          for (var i = 0; i < this.ruleForm.rewardType.length; i++) {
            Path = ["reward"];
            Path.push(this.ruleForm.rewardType[i]);
            ShareItems.push({ "Path": Path });
          }
        }
        if (this.ruleForm.raceType.length !== 0) {
          for (var i = 0; i < this.ruleForm.raceType.length; i++) {
            Path = ["race_reward"];
            Path.push(this.ruleForm.raceType[i]);
            ShareItems.push({ "Path": Path });
          }
        }
        if (this.ruleForm.rankType.length !== 0) {
          Path = ["rank", Object.keys(this.content.rank)[0]];
          ShareItems.push({ "Path": Path });
        }
        if (this.ruleForm.selfChecked) {
          Path = ["self_introduction", Object.keys(this.content.self_introduction)[0]];
          ShareItems.push({ "Path": Path });
        }
        if (this.ruleForm.clubType.length !== 0) {
          for (var i = 0; i < this.ruleForm.clubType.length; i++) {
            Path = ["org_experience"];
            Path.push(this.ruleForm.clubType[i]);
            ShareItems.push({ "Path": Path });
          }
        }
        data.append("body", JSON.stringify({ "ShareItems": ShareItems }));
        this.axios({
          method: "get",
          url: "https://api.limkim.xyz/getSysTime"
        }).then((response) => {
          if (this.ruleForm.date === "")
            var nextDate = new Date((response.data.Systime2 + 10 * 86400000));
          else
            var nextDate = new Date((response.data.Systime2 + this.ruleForm.date * 86400000));
          data.append("expireAtStr", "{\"Time\":\"" + nextDate.toISOString() + "\"}");
          this.data = data;
          const newdata = JSON.parse(data.get("body")).ShareItems;
          this.scoreDataPart1 = [];
          this.scoreDataPart2 = [];
          this.scoreDataPart3 = [];
          this.scoreDataPart4 = [];
          this.levelValue = [];
          this.rewardValue = [];
          this.raceValue = [];
          this.rankValue = {};
          this.selfValue = {};
          let count = 2;
          let count2 = 1;
          let count3 = 2;
          let count4 = 2;
          let flag = 1;
          let date = new Date(JSON.parse(data.get("expireAtStr")).Time).toJSON();
          this.profileValue.expired_at = new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
          for (let i = 0; i < newdata.length; i++) {
            if (newdata[i].Path[0] === "profile") {
              if (newdata[i].Path[2] === "Photo")
                this.profileValue[newdata[i].Path[2]] = "data:image/png;base64," + Base64.decode(this.content[newdata[i].Path[0]][newdata[i].Path[1]][newdata[i].Path[2]]);
              else
                this.profileValue[newdata[i].Path[2]] = this.content[newdata[i].Path[0]][newdata[i].Path[1]][newdata[i].Path[2]];
            }
            else if (newdata[i].Path[0] === "score") {
              let score = this.content.score;
              if (flag === 5) {
                flag = 1;
                count++;
              }
              this["scoreDataPart" + flag].push({
                name: score[newdata[i].Path[1]].CourseName,
                score: score[newdata[i].Path[1]].ScoreMakeup === "" ? score[newdata[i].Path[1]].ScoreFinal : score[newdata[i].Path[1]].ScoreMakeup,
                gp: score[newdata[i].Path[1]].GP
              });
              flag++;
            }
          }
          let range = [];
          for (let i = 0; i < newdata.length; i++) {
            if (range.indexOf(newdata[i].Path[0]) === -1)
              range.push(newdata[i].Path[0]);
          }
          if (range.indexOf("level_exam") !== -1) {
            const level_exam = this.content.level_exam;
            for (let i = 0; i < this.ruleForm.levelType.length; i++) {
              this.levelValue.push({
                name: level_exam[this.ruleForm.levelType[i]].ExamName,
                score: level_exam[this.ruleForm.levelType[i]].Score,
                date: level_exam[this.ruleForm.levelType[i]].ExamDate
              });
              count2++;
            }
          }
          if (range.indexOf("reward") !== -1) {
            const reward = this.content.reward;
            for (let i = 0; i < this.ruleForm.rewardType.length; i++) {
              this.rewardValue.push({
                name: reward[this.ruleForm.rewardType[i]].RewardName,
                level: reward[this.ruleForm.rewardType[i]].RewardLevel,
                date: reward[this.ruleForm.rewardType[i]].SchoolYear
              });
              count3++;
            }
          }
          if (range.indexOf("race_reward") !== -1) {
            const race_reward = this.content.race_reward;
            for (let i = 0; i < this.ruleForm.raceType.length; i++) {
              this.raceValue.push({
                name: race_reward[this.ruleForm.raceType[i]].RaceName,
                level: race_reward[this.ruleForm.raceType[i]].RaceLevel + " " + race_reward[this.ruleForm.raceType[i]].RewardLevel,
                date: race_reward[this.ruleForm.raceType[i]].RewardDate
              });
              count4++;
            }
          }
          if (range.indexOf("rank") !== -1)
            this.rankValue = {
              GPA: this.rankData[0].GPA,
              Rank: this.rankData[0].Rank
            };
          if (range.indexOf("self_introduction") !== -1)
            this.selfValue = { md: this.selfData[0].md };
          if (range.indexOf("org_experience") !== -1) {
            console.log(range);
            const club = this.content.org_experience;
            for (let i = 0; i < this.ruleForm.clubType.length; i++) {
              this.clubValue.push(club[this.ruleForm.clubType[i]]);
            }
          }
          if (count < 4)
            count = 4;
          if (count2 < 5)
            count2 = 5;
          count3 = count3 >= count4 ? count3 : count4;
          if (count3 < 5)
            count3 = 5;
          this.form_height = "750px";
          this.score_height = count * 51 + "px";
          this.title_height = count * 51 + "px";
          this.title_paddingTop = (count * 51 / 2 - 82) + "px";
          this.score_content_height = (count * 51 + 1) + "px";
          this.table_height = (count * 51 + (count2 + count3) * 41 + 500) + "px";
          this.level_top = (count * 51 + 240) + "px";
          this.level_paddingTop = (count2 * 41 / 2 - 100) + "px";
          this.level_height = count2 * 41 + "px";
          this.reward_top = (count * 51 + 240) + count2 * 41 + "px";
          this.reward_paddingTop = (count3 * 41 / 2 - 100) + "px";
          this.reward_height = count3 * 41 + "px";
          this.info_top = (count * 51 + (count2 + count3) * 41 + 240) + "px";
          // this.creat22();
          // this.emptyShow = false;
          // this.tableShow = true;
          // setTimeout(() => {
          //   this.saveImg(".table")
          // }, 50)
          this.previewVisible = true;
        }).catch(() => {
          this.$message.error("数据处理或者加载预览出错啦，请稍后重试");
        });
      });
    },
    confirm() {
      this.loading = true;
      this.previewVisible = false;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/share/share?topic=profile&staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: this.data
      }).then((response) => {
        this.shareLink = "https://api.hduhelp.com/gormja_wrapper/share/verify?fileID=" + response.data.data.Body.FileID + "&encryptedK1S=" + response.data.data.Body.EncryptedK1S;
        this.axios({
          method: "post",
          url: "https://api.hduhelp.com/gormja_wrapper/share/lookupShareLinkForSelf",
          headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
          data: { "StaffID": JSON.parse(localStorage.getItem("jw_student_file")).staffID }
        }).then((response) => {
          sessionStorage.setItem("sent", JSON.stringify(response.data.data));
          this.dialogVisible = true;
          this.loading = false;
        }).catch(() => {
          this.$message.error("获取站内信息出错啦,请稍后再试");
          this.loading = false;
        });
      }).catch(() => {
        this.$message.error("出错啦,请稍后再试");
        this.loading = false;
      });
    }
  },
  mounted() {
    if (this.file) {
      this.dataFile = this.file;
      this.next();
    }
  }
};
</script>

<style scoped>
.el-form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  min-height: 500px;
  padding: 30px 40px 0 40px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}
.upload,
.next {
  margin: 30px 0 0 calc(50% - 180px);
  width: 360px;
}
.info-select {
  margin: 40px;
}
.line {
  text-align: center;
  margin-top: 50px;
}
.el-checkbox {
  width: 300px;
  margin-right: 20px;
}

.el-dialog span:nth-child(2) {
  display: inline-block;
}
.el-dialog span:nth-child(2) span {
  display: inline-block;
  margin: 0;
}
.el-dialog span i:nth-child(2) {
  cursor: pointer;
}
.el-dialog span .el-button:nth-child(2) {
  vertical-align: text-top;
  border: none;
  width: 14px;
  height: 14px;
  padding: 0;
  text-align: center;
  line-height: 14px;
}
#shareLink {
  display: inline-block;
  cursor: pointer;
  font-style: normal;
  color: #909399;
  height: 25px;
  width: 500px;
  margin-left: 10px !important;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.table {
  margin: 0 1%;
  border: 1px solid rgb(221, 221, 221);
  box-shadow: 0 0px 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: #ccc;
  position: relative;
  border-collapse: collapse;
  box-sizing: border-box;
}
.table div {
  position: absolute;
  box-sizing: border-box;
}
.title {
  display: inline-block;
  margin: 0;
  width: 87px;
  height: 60px;
  line-height: 60px;
  color: black;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-collapse: collapse;
  box-sizing: border-box;
}
#hash_content {
  display: inline-block;
  width: 810px;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  background: linear-gradient(
    -45deg,
    rgba(212, 212, 212, 0.5) 0,
    rgba(212, 212, 212, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(212, 212, 212, 0.5) 50%,
    rgba(212, 212, 212, 0.5) 75%,
    transparent 75%,
    transparent
  );
  background-size: 30px 30px;
}
.content {
  display: inline-block;
  width: 158px;
  height: 60px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  line-height: 60px;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
}
.hash .title {
  width: 174px;
}
.name {
  height: 60px;
  top: 60px;
}
.sex {
  top: 60px;
  left: 246px;
}
.nation {
  top: 60px;
  left: 492px;
}
.staffID {
  left: 738px;
  top: 60px;
}
.staffID .content,
.majorName .content,
.schoolCode .content {
  border-right: none;
}
.pic {
  left: 984px;
  width: 180px;
  height: 240px;
  border-left: 1px solid #ccc;
  background-size: 180px !important;
}
.className {
  top: 120px;
}
.classCode {
  top: 120px;
  left: 246px;
}
.majorCode {
  top: 120px;
  left: 492px;
}
.majorName {
  top: 120px;
  left: 738px;
}
.unitCode {
  top: 180px;
}
.unitCode .content,
.unitCode .title,
.schoolCode .content,
.schoolCode .title {
  border-bottom: none;
}
.unitName {
  top: 180px;
  left: 246px;
}
.unitName .title {
  border-bottom: none;
}
.unitName .content {
  width: 404px;
  border-bottom: none;
}
.schoolCode {
  top: 180px;
  left: 738px;
}

.score {
  top: 240px;
}
.score .title {
  width: 100px;
  /* height: 500px; */
  line-height: 50px;
  text-align: center;
  border-top: 1px solid #ccc;
  padding: 0 40px;
  margin-top: 0;
}
.score .score_content {
  position: relative;
  width: 1064px;
  margin-left: 100px;
  /* height: 500px; */
  overflow: hidden;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
/* .score_content {
  display:flex !important;
  align-items:center;
} */
.score_content span {
  display: inline-block;
  margin: 0;
  height: 50px;
  width: 81px;
  text-align: center;
  line-height: 50px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  background-color: rgb(249, 249, 249);
  box-sizing: content-box;
}
.score_content .course_name {
  border-left: none;
  width: 101px;
}
.score_content .course_name_value,
.score_content .course_score_value,
.score_content .course_gp_value {
  width: 81px;
  border-top: none;
  height: 50px;
  border-bottom: none;
  border-left: 1px solid rgb(230, 230, 230);
  background-color: #fff;
  color: rgb(126, 126, 126);
  /* line-height: 40px !important; */
  font-size: 14px;
  box-sizing: content-box;
  overflow: hidden;
  /* white-space: pre-wrap; */
  /* text-overflow: ellipsis;
  -o-text-overflow: ellipsis; */
  margin: 0;
}
.score_content .course_name_value {
  text-indent: 3px;
  cursor: pointer;
  border-left: none;
  line-height: 13px;
  font-size: 10px;
  width: 101px;
}
.score_content .score_value {
  /* overflow: auto; */
  background-color: #fff;
  border-bottom: 1px solid rgb(230, 230, 230) !important;
  display: block;
  width: 265px;
  border: none;
  margin: 0;
}
.part1,
.part2,
.part3,
.part4 {
  display: block !important;
  border-right: 1px solid rgb(134, 134, 134) !important;
  width: 266px;
}
.part2 {
  margin-left: 266px !important;
}
.part3 {
  margin-left: 532px !important;
}
.part4 {
  border-right: none !important;
  margin-left: 798px !important;
}
.level .title,
.reward .title {
  width: 100px;
  /* height: 500px; */
  line-height: 50px;
  text-align: center;
  padding: 0 40px;
}
.level .level_content,
.reward .reward_content {
  position: relative;
  width: 1064px;
  margin-left: 100px;
  /* height: 500px; */
  overflow: hidden;
  border-bottom: 1px solid rgb(230, 230, 230);
  box-sizing: border-box;
}
.level .level_name,
.level .level_score,
.level .level_year,
.reward .reward_name,
.reward .reward_level,
.reward .reward_year,
.reward .race_name,
.reward .race_level,
.reward .race_year {
  display: inline-block;
  margin: 0;
  height: 40px;
  width: 354px;
  text-align: center;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  background-color: rgb(249, 249, 249);
  box-sizing: content-box;
}
.reward .reward_name,
.reward .reward_level,
.reward .reward_year,
.reward .race_name,
.reward .race_level,
.reward .race_year {
  width: 176px;
}
.level .level_year,
.reward .reward_year {
  border-right: none;
}
.level .level_value,
.reward .reward_value,
.reward .race_value {
  float: left;
  display: block;
  width: 100%;
  height: 41px;
  border-bottom: 1px solid rgb(230, 230, 230) !important;
}
.reward .reward_value,
.reward .race_value {
  width: 532px;
}
.level_value span,
.reward_value span,
.race_value span {
  display: inline-block;
  margin: 0;
  height: 40px;
  line-height: 40px;
  width: 354px;
  text-align: center;
  border-right: 1px solid rgb(230, 230, 230);
  overflow: hidden;
  box-sizing: content-box;
}

.level_value .level_year_value,
.reward_value .reward_year_value {
  border-right: none;
}
.rewardPart,
.racePart {
  width: 532px;
  font-size: 13px;
}
.rewardPart {
  border-right: 1px solid rgb(134, 134, 134);
}
.racePart {
  margin-left: 532px;
}
.reward h4 {
  margin: 0;
  display: inline-block;
  width: 531px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: rgb(249, 249, 249);
  border-bottom: 1px solid #ccc;
}
.reward .reward_name,
.reward .reward_name_value,
.reward .race_name,
.reward .race_name_value {
  width: 269px;
}
.reward .reward_level,
.reward .reward_year,
.reward .reward_level_value,
.reward .reward_year_value,
.reward .race_level,
.reward .race_year,
.reward .race_level_value,
.reward .race_year_value {
  width: 130px;
}
.reward .race_year,
.reward .race_year_value {
  width: 131px;
  border-right: none;
}
.info {
  top: 740px;
  width: 100%;
  height: 259px;
}
.info .title {
  width: 100px;
  height: 259px;
  border-bottom: none;
  padding: 10px 40px;
}
.info_content {
  margin: 70px 120px;
}
.end_time {
  width: 200px;
  height: 200px;
  margin: 100px 0 0 900px;
}
.info_content span,
.end_time span {
  display: block;
  text-align: center;
  height: 25px;
  margin: 10px 0px;
  font-weight: 700;
}
.end_time span {
  color: #ff0000;
}
#mycanvas {
  width: 1166px;
  margin: 0 5%;
  background-size: 100% !important;
}
</style>
<style>
.el-dialog {
  width: 1200px;
}
.el-dialog__body {
  padding: 10px 0;
}
.el-form-item .el-form-item__label {
  width: 150px;
}
.message_box_confirm {
  word-break: break-all;
}
.share .el-dialog {
  min-width: 598px;
}
.share .el-dialog__body {
  min-width: 480px;
  font-size: 18px;
  padding: 10px 30px;
}
.share .el-dialog__body span {
  display: block;
  height: 30px;
}
</style>
<style>
.md .v-note-edit,
.el-dialog .v-note-edit {
  display: none !important;
}
.md .v-note-show,
.el-dialog .v-note-show {
  flex-basis: 100% !important;
}
</style>