<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>毕业信息统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计概览</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form status-icon class="ruleForm" v-loading="loading" element-loading-text="拼命加载中">
      <el-form-item>
        <div class="row">
          <div>
            <div
              id="main1"
              style="float: left; width: 580px; height: 380px"
            ></div>
          </div>

          <div>
            <div
              id="main3"
              style="float: left; width: 400px; height: 380px"
            ></div>
          </div>
          <div>
            <div
              id="main4"
              style="float: left; width: 400px; height: 380px; margin: 0"
            ></div>
          </div>
          <div>
            <div
              id="main2"
              style="float: left; width: 750px; height: 400px;"
            ></div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div></div>
      </el-form-item>
      <el-form-item> </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {},
      major: {},
      yearData: [],
      loading: false,
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
            that.drawBar(that.data);
            that.drawSector(that.data);
            that.drawSector2(that.major);
            sessionStorage.removeItem('yearData');
            sessionStorage.setItem('yearData',JSON.stringify(that.yearData));
          }
      });
    },
    submitForm() {
      var that = this;
      this.yearData=[]
      this.loading = true;
      // localStorage.removeItem('tokenInfo')
      var keystore = localStorage.getItem("keystore");
      var code = localStorage.getItem("code");
      this.axios({
        method: "get",
        url: "https://api-vnt.fdkevin.xyz/getInfoChain",
        headers: { Authorization: keystore, code: code },
      }).then(function (response) {
        console.log(response.data);
        var data = {
          total: Number(response.data.studentNumber),
          graduated: Number(response.data.graduateStudentNumber),
          ungraduated: Number(response.data.ungraduateStudentNumber),
          SPE: Number(response.data.SPE),
          PUNI: Number(response.data.PUNI),
        };
        that.major = {
          main: Number(response.data.TEST),
          other: Number(response.data.OTHER),
        };
        that.data = data;
        console.log(data);
        if(sessionStorage.getItem('yearData') != null){
            that.loading = false;
            that.drawLine(JSON.parse(sessionStorage.getItem('yearData')));
            that.drawBar(that.data);
            that.drawSector(that.data);
            that.drawSector2(that.major);
          }
          else
            for (var i = 2015; i <= 2019; i++) {
              that.getYearData(i)
            }
      });
    },
    drawBar(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "所有学生毕业情况",
          left: "center",
        },
        tooltip: {},
        xAxis: {
          data: [
            "学生总数",
            "已毕业",
            "未毕业",
            "具有特殊情况",
            "具有惩罚情况",
          ],
        },
        grid: {
          x: 50,
        },
        yAxis: { minInterval: 1 },
        series: [
          {
            name: "人数",
            type: "bar",
            data: [
              data.total,
              data.graduated,
              data.ungraduated,
              data.SPE,
              data.PUNI,
            ],
            itemStyle: {
              normal: {
                //这里是重点
                color: function (params) {
                  var colorList = [
                    "#5470c6",
                    "#91cc75",
                    "#fac858",
                    "#d48265",
                    "#91c7ae",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      });
    },
    drawSector(data) {
      var myChart = this.$echarts.init(document.getElementById("main3"));
      var option;
      option = {
        title: {
          text: "所有学生毕业占比",
          left: "center",
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
              { value: data.graduated, name: "已毕业" },
              { value: data.ungraduated, name: "未毕业" },
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
      var myChart = this.$echarts.init(document.getElementById("main4"));
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
              { value: data.main, name: "区块链技术与应用" },
              { value: data.other, name: "其他专业" },
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
    drawLine(data) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main2"));
      // 绘制图表
      console.log(myChart);
      myChart.setOption({
        title: {
          text: "近五年毕业情况",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["总学生数", "毕业人数", "未毕业人数", "退学人数", "休学人数"],
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
  padding: 20px 0px 0px 60px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
}
.ruleForm .el-input {
  width: 170px;
}
.el-form-item {
  margin-bottom: 0;
}
.el-breadcrumb__item {
  font-size: 16px !important;
}
</style>
