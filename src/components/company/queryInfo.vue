<template>
  <div>
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="margin: 10px; border-radius: 10px;"
    >
      <el-form status-iconc lass="ruleForm" :style="{'max-height': this.wh - 105 + 'px'}">
        <span style="font-size: 18px; font-weight: 700; display: inline-block; margin-bottom: 40px">
          {{title}}
          <el-popover
            placement="right-start"
            title="注意: "
            width="200"
            trigger="hover"
            content="此信息仅用于有效期内核验使用, 请勿随意泄露"
          >
            <i
              slot="reference"
              class="el-icon-warning-outline"
              style="cursor: pointer; color: #E6A23C"
            ></i>
          </el-popover>
        </span>
        <el-input
          placeholder="请输入要核验的链接"
          v-model="queryUrl"
          clearable
          style="width: 20%; margin: 0 10px 0 40%"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="query()">查询</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="blockInfoDialogShow = true"
          v-show="blockInfoBtnShow"
        >查看交易详情</el-button>
        <br />
        <el-button
          type="primary"
          style="margin-left: calc(5% + 980px)"
          :icon="this.switch===1?'el-icon-search':'el-icon-arrow-left'"
          :disabled="!this.selfData.md && this.clubData.length === 0&& this.volunData.length === 0"
          v-show="btnShow"
          plain
          @click="dialogSwitch()"
        >{{(this.selfData.md || this.clubData.length !== 0|| this.volunData.length !== 0)?(this.switch===1?"查看个人填写的信息":"查看经过验证的信息"):"未分享个人填写信息"}}</el-button>
        <el-empty :image-size="200" description="输入链接即可核验" v-show="emptyShow"></el-empty>
        <div v-show="this.switch === 1">
          <div
            id="mycanvas"
            v-show="!tableShow"
            :style="{background: 'url('+ canvasUrl +') no-repeat', height: table_height, 'margin-top': '10px'}"
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
              <span id="hash_content">{{blockData.blockHash}}</span>
            </div>
            <div class="name">
              <span class="title">姓名</span>
              <span class="content">{{profileData.Name}}</span>
            </div>
            <div class="sex">
              <span class="title">性别</span>
              <span class="content">{{profileData.Sex}}</span>
            </div>
            <div class="nation">
              <span class="title">民族</span>
              <span class="content">{{profileData.Nation}}</span>
            </div>
            <div class="classCode">
              <span class="title">GPA</span>
              <span class="content">{{rankData.GPA}}</span>
            </div>
            <div class="className">
              <span class="title">班级名称</span>
              <span class="content">{{profileData.ClassName}}</span>
            </div>
            <div class="pic" :style="{background: 'url('+ profileData.Photo +') no-repeat' }"></div>

            <div class="schoolCode">
              <span class="title">学校代码</span>
              <span class="content">{{profileData.SchoolCode}}</span>
            </div>
            <div class="staffID">
              <span class="title">学号</span>
              <span class="content">{{profileData.StaffID}}</span>
            </div>
            <div class="unitCode">
              <span class="title">学院代码</span>
              <span class="content">{{profileData.UnitCode}}</span>
            </div>
            <div class="unitName">
              <span class="title">学院名称</span>
              <span class="content">{{profileData.UnitName}}</span>
            </div>
            <div class="majorCode">
              <span class="title">GPA排名</span>
              <span class="content">{{rankData.Rank}}</span>
            </div>
            <div class="majorName">
              <span class="title">专业名称</span>
              <span class="content">{{profileData.MajorName}}</span>
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
                <span class="level_value" v-for="item in levelData" :key="item.id">
                  <span class="level_name_value">{{item.name}}</span>
                  <span class="level_score_value">{{item.score}}</span>
                  <span class="level_year_value">{{item.date}}</span>
                </span>
              </div>
            </div>
            <div class="reward" :style="{top: reward_top, height: reward_height}">
              <span
                class="title"
                :style="{height: reward_height, paddingTop: reward_paddingTop}"
              >综合素质</span>
              <div class="reward_content" :style="{height: reward_height}">
                <div class="rewardPart" :style="{height: reward_height}">
                  <h4>个人荣誉</h4>
                  <span class="reward_name">奖项名称</span>
                  <span class="reward_level">奖项等级</span>
                  <span class="reward_year">获奖年份</span>
                  <span class="reward_value" v-for="item in rewardData" :key="item.id">
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
                  <span class="race_value" v-for="item in raceData" :key="item.id">
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
              </div>
              <div class="end_time">
                <span>有效期至:</span>
                <span>{{profileData.expired_at}}</span>
              </div>
            </div>
          </div>
        </div>
        <h3 style="margin-left: 5%" v-show="this.switch===2 && selfData.md">自我介绍</h3>
        <mavonEditor
          :toolbars="toolbars"
          :autofocus="false"
          defaultOpen="preview"
          :editable="false"
          v-show="this.switch===2 && selfData.md"
          v-model="selfData.md"
          :style="{'width': '1166px', 'margin': ' 10px 5%', 'height': this.wh - 300 + 'px'}"
        />
        <h3 style="margin: 10px 0 0 5%" v-show="this.switch===2 && clubData.length !== 0">班团经历</h3>
        <el-table
          :data="clubData"
          tooltip-effect="dark"
          :style="{'width': '1166px', 'margin': ' 10px 5%'}"
          border
          v-show="this.switch===2 && clubData.length !== 0"
        >
          <el-table-column prop="JobName" label="工作名称"></el-table-column>
          <el-table-column prop="OrgName" label="组织名称"></el-table-column>
          <el-table-column prop="OrgLevel" label="组织等级"></el-table-column>
          <el-table-column prop="StartAt" label="开始时间"></el-table-column>
          <el-table-column prop="EndAt" label="结束时间"></el-table-column>
        </el-table>
        <h3 style="margin-left: 5%" v-show="this.switch===2 && volunData.length !== 0">志愿经历</h3>
        <el-table
          :data="volunData"
          tooltip-effect="dark"
          :style="{'width': '90%', 'margin': ' 10px 5%'}"
          border
          v-show="this.switch===2 && volunData.length !== 0"
        >
          <el-table-column prop="ActName" label="活动名称"></el-table-column>
          <el-table-column prop="Content" label="活动内容"></el-table-column>
          <el-table-column prop="ActDate" label="活动日期"></el-table-column>
          <el-table-column prop="ActLength" label="志愿时长"></el-table-column>
        </el-table>
        <h3 style="margin-left: 5%" v-show="this.switch===2 && internshipData.length !== 0">实习经历</h3>
        <el-table
          :data="internshipData"
          tooltip-effect="dark"
          :style="{'width': '90%', 'margin': ' 10px 5%'}"
          border
          v-show="this.switch === 2 && internshipData.length !== 0"
        >
          <el-table-column prop="JobName" label="岗位名称"></el-table-column>
          <el-table-column prop="CompanyName" label="公司名称"></el-table-column>
          <el-table-column prop="WorkLocation" label="实习地点"></el-table-column>
          <el-table-column prop="WorkContent" label="实习内容"></el-table-column>
          <el-table-column prop="StartAt" label="开始时间"></el-table-column>
          <el-table-column prop="EndAt" label="结束时间"></el-table-column>
        </el-table>
      </el-form>
    </div>
    <el-dialog title="交易详情" :visible.sync="blockInfoDialogShow">
      <el-table :data="blockDataArray">
        <el-table-column property="name" label="交易信息" width="150"></el-table-column>
        <el-table-column property="value" label="对应值"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="blockInfoDialogShow = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setWaterMark } from "../../util/watermark";
import html2canvas from "html2canvas";
import { Base64 } from "js-base64";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  data() {
    return {
      loading: false,
      tableShow: false,// 信息表格
      blockInfoBtnShow: false,// 交易详情按钮
      blockInfoDialogShow: false,// 交易详情dialog
      emptyShow: true,
      switch: 1,
      title: "请输入要核验的链接",
      queryUrl: "",// 输入的核验链接
      canvasUrl: "",// canvas生成的图片
      file: "",
      profileData: {},
      rankData: {},
      selfData: {},
      clubData: [],
      volunData: [],
      internshipData: [],
      btnShow: false,
      toolbars: {
        readmodel: true
      },
      blockData: {},// 交易详情数据对象形式
      blockDataArray: [],// 交易详情数据数组形式
      scoreDataPart1: [],// 四列成绩单的数据
      scoreDataPart2: [],
      scoreDataPart3: [],
      scoreDataPart4: [],
      levelData: [],
      rewardData: [],
      raceData: [],
      form_height: "500px",
      score_height: "",
      title_paddingTop: "",
      table_height: "",
      level_top: "",
      level_paddingTop: "",
      level_height: "",
      reward_top: "",
      reward_paddingTop: "",
      reward_height: "",
      info_top: ""
    };
  },
  props: ["wh"],
  components: { mavonEditor },
  methods: {
    resetForm() {// 重置数据
      this.profileData = {};
      this.scoreDataPart1 = [];
      this.scoreDataPart2 = [];
      this.scoreDataPart3 = [];
      this.scoreDataPart4 = [];
      this.levelData = [];
      this.rewardData = [];
      this.raceData = [];
    },
    saveImg(id) {// 使用canvas将html转成图片
      window.pageYoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // 先获取你要转换为img的dom节点
      var node = document.querySelector(id);//传入的id名称
      var width = node.offsetWidth;//dom宽
      var height = node.offsetHeight;//dom高
      var scale = 2;//放大倍数 这个相当于清晰度 调大一点更清晰一点
      html2canvas(node, {
        width: width,
        heigth: height,
        backgroundColor: "#ffffff",//背景颜色 为null是透明
        dpi: window.devicePixelRatio * 2,//按屏幕像素比增加像素
        scale: scale,
        X: 0,
        Y: 0,
        scrollX: -3,//如果左边多个白边 设置该偏移-3 或者更多
        scrollY: 0,
        useCORS: true,//是否使用CORS从服务器加载图像
        allowTaint: true //是否允许跨域图像污染画布
      }).then(canvas => {
        this.canvasUrl = canvas.toDataURL();//这里上面不设值cors会报错
        this.resetForm();
        this.tableShow = false;
        this.loading = false;
        this.blockInfoBtnShow = true;
      });
    },
    dialogSwitch() {
      this.switch = this.switch === 1 ? 2 : 1;
    },
    query() {// 核验链接
      this.btnShow = false;
      this.blockInfoBtnShow = false;
      this.table_height = "";
      // 先简单判断连接正确性
      if (this.queryUrl.indexOf("/share/verify?fileID=") === -1)
        return this.$message.error("请输入正确的核验链接");
      this.loading = true;
      this.axios({
        method: "post",
        url: this.queryUrl,
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization }
      }).then((response) => {
        this.axios({
          method: "post",
          url: "/share/lookupShareLinkForCompany",
          headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
          data: { "schoolCode": "1" }
        }).then((response) => {
          let received = 0;
          for (let i = 0; i < response.data.data.length; i++)
            if (!response.data.data[i].Read)
              received++;
          this.$emit("func", received);
          sessionStorage.setItem("jw_req_msg", JSON.stringify(response.data.data));
        }).catch(() => {
          this.$message.error("获取站内信息出错啦,请稍后再试");
        });
        this.resetForm();
        // 先把过期时间拿出来放到profileData里
        const date = new Date(response.data.data.ShareFile.expired_at).toJSON();
        this.profileData.expired_at = new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
        // 拿到交易信息放到blockData和blockDataArray
        const block = response.data.data.TransactionDetail.detail.result[0];
        const blockName = Object.keys(block);
        const translation = {// 因为拿到的是英文，所以写一个翻译表
          blockHash: "区块哈希",
          blockNumber: "交易号",
          blockTimestamp: "区块时间",
          blockWriteTime: "写入时间",
          hash: "交易内容"
        };
        for (let i = 0; i < blockName.length; i++) {
          this.blockData[blockName[i]] = block[blockName[i]];
          this.blockDataArray.push({
            value: block[blockName[i]],
            name: translation[blockName[i]]
          });
        }
        // 学籍信息
        if (response.data.data.ShareFile.data_map.profile != undefined) {
          // 先把学籍信息抽离出来
          const profile = response.data.data.ShareFile.data_map.profile[Object.keys(response.data.data.ShareFile.data_map.profile)[0]];
          const profileName = Object.keys(profile);
          for (let i = 0; i < profileName.length; i++)
            this.profileData[profileName[i]] = profileName[i] === "Photo" ? ("data:image/png;base64," + Base64.decode(profile[profileName[i]])) : profile[profileName[i]];
        }
        // 接下来几项并没有固定数量，所以使用count来计数，实现高度自适应
        let count = 2;
        let count2 = 1;
        let count3 = 2;
        let count4 = 2;
        if (response.data.data.ShareFile.data_map.score != undefined) {
          const score = response.data.data.ShareFile.data_map.score;
          const scoreCode = Object.keys(score);
          let flag = 1;// 使用flag来实现四列从左到右放数据
          for (let i = 0; i < scoreCode.length; i++) {
            if (flag === 5) {
              flag = 1;
              count++;
            }
            this["scoreDataPart" + flag].push({
              name: score[scoreCode[i]].CourseName,
              score: score[scoreCode[i]].ScoreMakeup === "" ? score[scoreCode[i]].ScoreFinal : score[scoreCode[i]].ScoreMakeup,
              gp: score[scoreCode[i]].GP
            });
            flag++;
          }
        }
        if (response.data.data.ShareFile.data_map.level_exam != undefined) {
          const level_exam = response.data.data.ShareFile.data_map.level_exam;
          const level_examCode = Object.keys(level_exam);
          for (let i = 0; i < level_examCode.length; i++) {
            this.levelData.push({
              name: level_exam[level_examCode[i]].ExamName,
              score: level_exam[level_examCode[i]].Score,
              date: level_exam[level_examCode[i]].ExamDate,
            });
            count2++;
          }
        }
        if (response.data.data.ShareFile.data_map.reward != undefined) {
          const reward = response.data.data.ShareFile.data_map.reward;
          const rewardCode = Object.keys(reward);
          for (let i = 0; i < rewardCode.length; i++) {
            this.rewardData.push({
              name: reward[rewardCode[i]].RewardName,
              level: reward[rewardCode[i]].RewardLevel,
              date: reward[rewardCode[i]].SchoolYear,
            });
            count3++;
          }
        }
        if (response.data.data.ShareFile.data_map.race_reward != undefined) {
          const race_reward = response.data.data.ShareFile.data_map.race_reward;
          const race_rewardCode = Object.keys(race_reward);
          for (let i = 0; i < race_rewardCode.length; i++) {
            this.raceData.push({
              name: race_reward[race_rewardCode[i]].RaceName,
              level: race_reward[race_rewardCode[i]].RaceLevel + " " + race_reward[race_rewardCode[i]].RewardLevel,
              date: race_reward[race_rewardCode[i]].RewardDate,
            });
            count4++;
          }
        }
        if (response.data.data.ShareFile.data_map.rank != undefined) {
          const rank = response.data.data.ShareFile.data_map.rank;
          const rankCode = Object.keys(rank);
          this.rankData = {
            GPA: rank[rankCode[0]].GPA.toFixed(2),
            Rank: rank[rankCode[0]].Rank
          };
        }
        if (response.data.data.ShareFile.data_map.self_introduction != undefined) {
          const self_introduction = response.data.data.ShareFile.data_map.self_introduction;
          const selfCode = Object.keys(self_introduction);
          this.selfData = {
            md: Base64.decode(self_introduction[selfCode[0]].SelfIntroduction)
          };
        }
        if (response.data.data.ShareFile.data_map.org_experience != undefined) {
          const club = response.data.data.ShareFile.data_map.org_experience;
          const keys = Object.keys(club);
          for (let i = 0; i < keys.length; i++) {
            club[keys[i]].StartAt = club[keys[i]].StartAt.substr(0, 10);
            club[keys[i]].EndAt = club[keys[i]].EndAt.substr(0, 10);
            this.clubData.push(club[keys[i]]);
          }
        }
        if (response.data.data.ShareFile.data_map.voluntary_experience != undefined) {
          const volun = response.data.data.ShareFile.data_map.voluntary_experience;
          const keys = Object.keys(volun);
          for (let i = 0; i < keys.length; i++) {
            volun[keys[i]].ActDate = volun[keys[i]].ActDate.substr(0, 10);
            this.volunData.push(volun[keys[i]]);
          }
        }
        if (response.data.data.ShareFile.data_map.internship_experience != undefined) {
          const internship = response.data.data.ShareFile.data_map.internship_experience;
          const keys = Object.keys(internship);
          for (let i = 0; i < keys.length; i++) {
            internship[keys[i]].StartAt = internship[keys[i]].StartAt.substr(0, 10);
            internship[keys[i]].EndAt = internship[keys[i]].EndAt.substr(0, 10);
            this.internshipData.push(internship[keys[i]]);
          }
        }
        // 接下来对所有属于自适应高度的变量赋值
        count = count < 4 ? 4 : count;
        count2 = count2 < 5 ? 5 : count2;
        count3 = count3 >= count4 ? count3 : count4;
        count3 = count3 < 5 ? 5 : count3;
        this.form_height = "750px";
        this.score_height = count * 51 + "px";
        this.title_paddingTop = (count * 51 / 2 - 82) + "px";
        this.table_height = (count * 51 + (count2 + count3) * 41 + 500) + "px";
        this.level_top = (count * 51 + 240) + "px";
        this.level_paddingTop = (count2 * 41 / 2 - 100) + "px";
        this.level_height = count2 * 41 + "px";
        this.reward_top = (count * 51 + 240) + count2 * 41 + "px";
        this.reward_paddingTop = (count3 * 41 / 2 - 100) + "px";
        this.reward_height = count3 * 41 + "px";
        this.info_top = (count * 51 + (count2 + count3) * 41 + 240) + "px";
        // 设置水印
        setWaterMark("仅供高校学业核验系统核验使用", "有效期至:" + this.profileData.expired_at, (500 + count * 51 + (count2 + count3) * 41));
        this.createMySeal();
        this.title = "为您核验到以下信息: ";
        this.emptyShow = false;
        this.tableShow = true;
        this.btnShow = true;
        // 生成canvas图片链接
        setTimeout(() => {
          this.saveImg(".table");
        }, 50);
      }).catch(() => {
        this.$message.error("核验链接出错啦,请稍后再试");
      });
    },
    createMySeal() {
      if (document.querySelector("canvas"))
        document.querySelector("canvas").remove();
      const div = document.querySelector(".info");
      // 创建使用默认分辨率的画布
      div.appendChild(this.createHiDPICanvas(250, 250));
      this.createSeal("杭州电子科技大学", this.blockData.hash, "交易号", "※" + this.blockData.blockNumber.split("").reverse().join("") + "※");
    },
    createHiDPICanvas(w, h, ratio) {// 创建高清画布
      const PIXEL_RATIO = (() => {
        const c = document.createElement("canvas"),
          ctx = c.getContext("2d"),
          dpr = window.devicePixelRatio || 1,
          bsr = ctx["webkitBackingStorePixelRatio"] ||
            ctx["mozBackingStorePixelRatio"] ||
            ctx["msBackingStorePixelRatio"] ||
            ctx["oBackingStorePixelRatio"] ||
            ctx["backingStorePixelRatio"] || 1;
        return dpr / bsr;
      })();
      if (!ratio) { ratio = PIXEL_RATIO; }
      const can = document.createElement("canvas");
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";
      can.style.position = "absolute";
      // console.log(document.querySelectorAll("tbody").length * 25);
      // console.log(document.querySelector(".el-descriptions").style.width);
      can.style.top = "10px";
      can.style.left = "650px";//在页面中的位置
      can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      return can;
    },
    createSeal(company, ecompany, name, blockheight) {
      //要将 canvas 的宽高设置成容器宽高的 2 倍
      var canvas = document.querySelector("canvas");
      var context = canvas.getContext("2d");
      context.translate(0, 0);//移动坐标原点 
      // 绘制印章边框   
      var width = 125;
      var height = 125;
      //边框1
      context.lineWidth = 3;
      context.strokeStyle = "#f00";
      context.beginPath();
      context.arc(width, height, 100, 0, Math.PI * 2);
      context.stroke();
      context.save();

      //边框2
      context.lineWidth = 2;
      context.strokeStyle = "#f00";
      context.beginPath();
      context.arc(width, height, 72, 0, Math.PI * 2);
      context.stroke();
      context.save();


      //画中间标识
      var imgObj = new Image();
      imgObj.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA5LTA5VDE2OjM1OjQyKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0wOVQxNjozOTozMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0wOVQxNjozOTozMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDdhZTczZC1kNjhi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";
      //待图片加载完后，将其显示在canvas上
      imgObj.onload = function () {
        context.rotate(-115 * Math.PI / 180);
        context.drawImage(this, -35, -35, 70, 70);//this即是imgObj,保持图片的原始大小：470*480
      };

      // 绘制印章类型
      context.font = "bolder 16px SimSun";
      context.textBaseline = "middle";//设置文本的垂直对齐方式
      context.textAlign = "center"; //设置文本的水平对对齐方式
      context.lineWidth = 1;
      context.fillStyle = "#f00";
      context.fillText(name, width, height + 49);


      // 绘制印章中文单位   
      context.translate(width, height);// 平移到此位置, 
      context.font = "bolder 20px SimSun";
      var count = company.length;// 字数   
      var angle = 4 * Math.PI / (3 * (count - 1));// 字间角度   
      var chars = company.split("");
      var c;
      for (var i = 0; i < count; i++) {
        c = chars[i];// 需要绘制的字符   
        if (i == 0)
          context.rotate(5 * Math.PI / 6);
        else
          context.rotate(angle);
        context.save();
        // 平移到此位置,此时字和x轴垂直，第一个参数是与圆外边的距离，越大距离越近   
        context.translate(60, 0);
        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
        context.fillText(c, 0, 5);// 此点为字的中心点   
        context.restore();
      }
      //绘制印章英文单位
      context.translate(0, 0);// 平移到此位置,
      context.font = "normal 16px SimSun";
      var ecount = ecompany.length;// 字数
      var eangle = (4.9 * Math.PI) / (3 * (ecount));// 字间角度   
      var echars = ecompany.split("");
      var ec;
      for (var j = 0; j < ecount; j++) {
        ec = echars[j];// 需要绘制的字符
        if (j == 0)
          context.rotate(94 * Math.PI / 180);
        else
          context.rotate(eangle);
        context.save();
        // 平移到此位置,此时字和x轴垂直，第一个参数是与圆外边的距离，越大距离越近   
        context.translate(95, 0);
        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴   
        context.fillText(ec, 0, 10);// 此点为字的中心点   
        context.restore();
      }
      //绘制区块高度单位
      context.translate(0, 0);// 平移到此位置,
      context.font = "bolder 16px serif";
      var ecount = blockheight.length;// 字数   
      var eangle = (1.17 * Math.PI) / (4 * (ecount));// 字间角度   
      var echars = blockheight.split("");
      var ec;
      for (var j = 0; j < ecount; j++) {
        ec = echars[j];// 需要绘制的字符   
        if (j == 0)
          context.rotate(14 * Math.PI / 180);//第一个字旋转角度
        else
          context.rotate(eangle);
        context.save();
        // 平移到此位置,此时字和x轴垂直，第一个参数是与圆外边的距离，越大距离越近   
        context.translate(88, 0);
        context.rotate(-90 * Math.PI / 180);// 旋转90度,让字平行于x轴   
        context.fillText(ec, 0, 0);// 此点为字的中心点   
        context.restore();
      }
    },
  },
  mounted() {
    // url是否包含链接，即是否是信息中心跳转来的
    if (this.$route.query.url !== undefined) {
      this.queryUrl = this.$route.query.url;
      this.query();
    }
  }
};
</script>

<style scoped>
.el-form {
  position: relative;
  overflow: auto;
  min-width: 1100px;
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
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
.table {
  margin: 0 5%;
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
.v-note-edit {
  display: none !important;
}
.v-note-show {
  flex-basis: 100% !important;
}
</style>