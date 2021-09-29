<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>毕业信息统计</el-breadcrumb-item>
      <el-breadcrumb-item>往年统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form
      status-icon
      class="ruleForm"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
    <h4 style="color:#606266;">选择筛选条件:</h4>
      <el-form-item style="margin: 20px 0 0 20px">
        选择年份:
        <el-select v-model="yearvalue" style="width: 110px" @change="gender">
          <el-option
            v-for="item in yearoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    <el-divider></el-divider>
      <el-form-item v-show="!byyear">
        <div class="row">
          <div>
            <div
              id="main1"
              style="float: left; width: 600px; height: 300px; margin-left: 40px"
            ></div>
          </div>
          <div>
            <div
              id="main2"
              style="float: left; width: 600px; height: 300px; margin-left: 100px"
            ></div>
          </div>
          <div>
            <div
              id="main3"
              style="float: left; width: 600px; height: 300px; margin-left: 40px"
            ></div>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="byyear" style="margin-top: 140px">
        <div class="row">
          <div>
            <div
              id="main4"
              style="float: left; width: 400px; height: 400px;"
            ></div>
          </div>
          <div>
            <div
              id="main5"
              style="float: left; width: 400px; height: 400px; margin-left: 50px"
            ></div>
          </div>
          <div>
            <div
              id="main6"
              style="float: left; width: 400px; height: 400px; margin-left: 50px"
            ></div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      yearData: [],
      byyear: false,
      year: "",
      loading: false,
      isDisabled: false,
      address: "",
      yearoptions: [
        {
          value: "all",
          label: "近5年",
        },
        {
          value: "2019",
          label: "2019",
        },
        {
          value: "2018",
          label: "2018",
        },
        {
          value: "2017",
          label: "2017",
        },
        {
          value: "2016",
          label: "2016",
        },
        {
          value: "2015",
          label: "2015",
        },
      ],
      yearvalue: "all",
    };
  },
  methods: {
    getYearData(year){
      var that = this;
      var keystore = localStorage.getItem("keystore");
      var code = localStorage.getItem("code");
      this.axios({
          method: "post",
          url: "https://api-vnt.fdkevin.xyz/getInfoChainByEnYear",
          headers: { Authorization: keystore, code: code },
          data: { enrollmentYear: year },
        }).then(function (response) {
          var data = {
            total: Number(response.data.studentNumberEnYear),
            graduated: Number(response.data.graduateStudentNumberEnYear),
            ungraduated: Number(response.data.ungraduateStudentNumberEnYear),
            DROP: Number(response.data.SPE_DROP),
            SUS: Number(response.data.SPE_SUS),
            TEST: Number(response.data.TEST),
            OTHER: Number(response.data.OTHER),
            PUNI_CHEAT: Number(response.data.PUNI_CHEAT),
            PUNI_OTHER: Number(response.data.PUNI_OTHER),
          };
          that.yearData[year-2015] = data;
          if (that.yearData[4] != undefined && that.yearData[3] != undefined && that.yearData[2] != undefined && that.yearData[1] != undefined && that.yearData[0] != undefined) {
            that.loading = false;
            that.drawLine(that.yearData);
            that.drawLine2(that.yearData);
            that.drawLine3(that.yearData);
            sessionStorage.removeItem('yearData');
            sessionStorage.setItem('yearData',JSON.stringify(that.yearData));
          }
      });
    },
    gender(){
      this.byyear = this.yearvalue != 'all'
      console.log(this.yearvalue);
      this.drawSector(JSON.parse(sessionStorage.getItem('yearData'))[this.yearvalue-2015]);
      this.drawSector2(JSON.parse(sessionStorage.getItem('yearData'))[this.yearvalue-2015]);
      this.drawSector3(JSON.parse(sessionStorage.getItem('yearData'))[this.yearvalue-2015]);
    },
    submitForm() {
      this.loading = true;
      if(sessionStorage.getItem('yearData') != null){
        this.loading = false;
        this.drawLine(JSON.parse(sessionStorage.getItem('yearData')))
        this.drawLine2(JSON.parse(sessionStorage.getItem('yearData')))
        this.drawLine3(JSON.parse(sessionStorage.getItem('yearData')))
      }
      else{
        for (var i = 2015; i <= 2019; i++) {
          this.getYearData(i)
        }
      }
    },
    drawLine(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "近五年毕业人数",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["总学生数", "毕业人数", "未毕业人数", "退学人数", "休学人数"],
          left: "right",
        },
        grid: {
          x: 50,
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["2016", "2017", "2018", "2019", "2020"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "总学生数",
            type: "line",
            data: [
              data[0].total,
              data[1].total,
              data[2].total,
              data[3].total,
              data[4].total,
            ],
          },
          {
            name: "毕业人数",
            type: "line",
            data: [
              data[0].graduated,
              data[1].graduated,
              data[2].graduated,
              data[3].graduated,
              data[4].graduated,
            ],
          },
          {
            name: "未毕业人数",
            type: "line",
            data: [
              data[0].ungraduated,
              data[1].ungraduated,
              data[2].ungraduated,
              data[3].ungraduated,
              data[4].ungraduated,
            ],
          },
          {
            name: "退学人数",
            type: "line",
            data: [
              data[0].DROP,
              data[1].DROP,
              data[2].DROP,
              data[3].DROP,
              data[4].DROP,
            ],
          },
          {
            name: "休学人数",
            type: "line",
            data: [
              data[0].SUS,
              data[1].SUS,
              data[2].SUS,
              data[3].SUS,
              data[4].SUS,
            ],
          },
        ],
      });
    },
    drawLine2(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main2"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "近五年毕业相关比率(%)",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["毕业率", "退学率", "休学率"],
          left: "right",
        },
        grid: {
          x: 50,
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["2016", "2017", "2018", "2019", "2020"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "毕业率",
            type: "line",
            data: [
              (data[0].graduated/data[0].total*100).toFixed(2),
              (data[1].graduated/data[1].total*100).toFixed(2),
              (data[2].graduated/data[2].total*100).toFixed(2),
              (data[3].graduated/data[3].total*100).toFixed(2),
              (data[4].graduated/data[4].total*100).toFixed(2),
            ],
            itemStyle: {
              normal: {
                color: '#91cc75'
              },
            },
          },
          {
            name: "退学率",
            type: "line",
            data: [
              (data[0].DROP/(data[0].total + data[0].DROP + data[0].SUS)*100).toFixed(2),
              (data[1].DROP/(data[1].total + data[1].DROP + data[1].SUS)*100).toFixed(2),
              (data[2].DROP/(data[2].total + data[2].DROP + data[2].SUS)*100).toFixed(2),
              (data[3].DROP/(data[3].total + data[3].DROP + data[3].SUS)*100).toFixed(2),
              (data[4].DROP/(data[3].total + data[4].DROP + data[4].SUS)*100).toFixed(2),
            ],
            itemStyle: {
              normal: {
                color: '#fac858'
              },
            },
          },
          {
            name: "休学率",
            type: "line",
            data: [
              (data[0].SUS/(data[0].total + data[0].DROP + data[0].SUS)*100).toFixed(2),
              (data[1].SUS/(data[1].total + data[1].DROP + data[1].SUS)*100).toFixed(2),
              (data[2].SUS/(data[2].total + data[2].DROP + data[2].SUS)*100).toFixed(2),
              (data[3].SUS/(data[3].total + data[3].DROP + data[3].SUS)*100).toFixed(2),
              (data[4].SUS/(data[3].total + data[4].DROP + data[4].SUS)*100).toFixed(2),
            ],
            itemStyle: {
              normal: {
                color: '#d48265'
              },
            },
          },
        ],
      });
    },
    drawLine3(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main3"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "近五年各专业人数",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["所有专业", "区块链技术与应用", "其他专业"],
          left: "right",
        },
        grid: {
          x: 50,
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["2016", "2017", "2018", "2019", "2020"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "所有专业",
            type: "line",
            data: [
              data[0].total,
              data[1].total,
              data[2].total,
              data[3].total,
              data[4].total,
            ],
          },
          {
            name: "区块链技术与应用",
            type: "line",
            data: [
              data[0].TEST,
              data[1].TEST,
              data[2].TEST,
              data[3].TEST,
              data[4].TEST,
            ],
          },
          {
            name: "其他专业",
            type: "line",
            data: [
              data[0].OTHER,
              data[1].OTHER,
              data[2].OTHER,
              data[3].OTHER,
              data[4].OTHER,
            ],
          },
        ],
      });
    },
    drawSector(data) {
      var myChart = this.$echarts.init(document.getElementById("main4"));
      var option;
      option = {
        title: {
          text: "所有学生毕业情况",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ["#91cc75", "#fac858", "#ee6666", "#73c0de"],
        legend: {
          orient: "vertical",
          left: "left",
        },

        series: [
          {
            name: "人数",
            type: "pie",
            radius: "50%",

            data: [
              { value: data.graduated, name: "已毕业" },
              { value: data.ungraduated, name: "未毕业" },
              { value: data.DROP, name: "退学" },
              { value: data.SUS, name: "休学" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    drawSector2(data) {
      var myChart = this.$echarts.init(document.getElementById("main5"));
      var option;
      option = {
        title: {
          text: "所有学生各专业占比",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ["#91cc75", "#fac858"],
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "人数",
            type: "pie",
            radius: "50%",
            data: [
              { value: data.TEST, name: "区块链技术与应用" },
              { value: data.OTHER, name: "其他专业" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (v) {
                    //让series 中的文字进行换行
                    //文字中遇到空格就换行
                    let text = v.name;
                    if (text.length <= 5) {
                      return text;
                    } else if (text.length > 5 && text.length <= 10) {
                      return (text = `${text.slice(0, 5)}\n${text.slice(5)}`);
                    } else if (text.length > 10 && text.length <= 15) {
                      return (text = `${text.slice(0, 8)}\n${text.slice(5,10)}\n${text.slice(10)}`);
                    }
                  },
                },
                labelLine: {
                  show: true,
                },
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    drawSector3(data) {
      var myChart = this.$echarts.init(document.getElementById("main6"));
      var option;
      option = {
        title: {
          text: "所有学生各惩罚情况",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ["#91cc75", "#fac858"],
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "人数",
            type: "pie",
            radius: "50%",
            data: [
              { value: data.PUNI_CHEAT, name: "作弊处罚" },
              { value: data.PUNI_OTHER, name: "其他处罚" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
  mounted() {
    //写在mounted或者activated生命周期内即可
    this.submitForm();
  },
};
</script>

<style scoped>
.el-form {
  margin: 0px 5%;
  width: 1500px;
  height: 774px;
  padding: 20px 0px 0px 60px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
}
.ruleForm .el-input {
  width: 170px;
}
.el-breadcrumb__item {
  font-size: 16px !important;
}
</style>
