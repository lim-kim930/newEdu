<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>添加学生</el-breadcrumb-item>
      <el-breadcrumb-item>批量添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form
      status-icon
      label-width="125px"
      class="ruleForm"
      v-loading="loading"
    >
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="500"
        border
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="staff_id" label="学号" width="180">
        </el-table-column>
        <el-table-column prop="staff_name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="major" label="专业">
        </el-table-column>
        <el-table-column prop="enrollmentYear" label="入学年份" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="schoolYear" label="学制" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="learnType" label="学习类型" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="educationalLevel" label="培养层次" width="150" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-button type="primary" @click="submitForm()" :disabled="isDisabled" style="width: 150px"><i class="el-icon-postcard el-icon--left"></i>批量生成</el-button>
      </div>
      <el-dialog title="交易详情" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" v-loading="diaLoading">
          <el-table-column
            property="name"
            label="交易信息"
            width="150"
          ></el-table-column>
          <el-table-column property="value" label="对应值"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false" v-show="diaLoading">取 消</el-button>
          <el-button type="primary" @click="dialogClose" v-show="!diaLoading">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      txHash: '',
      gridData: [
        {
          name: "交易哈希值",
          value: "",
        },
        {
          name: "状态",
          value: "",
        },
        {
          name: "时间戳",
          value: "",
        },
        {
          name: "区块编号",
          value: "",
        },
        {
          name: "发送方",
          value: "",
        },
        {
          name: "接收方",
          value: "",
        },
        {
          name: "燃料限制",
          value: "",
        },
        {
          name: "实际消耗燃料",
          value: "",
        },
        {
          name: "合约地址",
          value: "",
        },
        {
          name: "交易序号",
          value: "",
        },
      ],
      dialogTableVisible: false,
      diaLoading: false,
      isDisabled: false,
      loading: false,
      params: [],
      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    dialogClose() {
      this.dialogTableVisible = false;
      this.$router.go(0);
    },
    hashInfo() {
      this.diaLoading = true;
      this.dialogTableVisible = true;
      var that = this;
      var keystore = localStorage.getItem("keystore");
      var code = localStorage.getItem("code");
      this.axios({
        method: "post",
        url: "https://api-vnt.fdkevin.xyz/getReceipt",
        data: {
          txHash: this.txHash
        },
        headers: { Authorization: keystore, code: code },
      }).then(function (response) {
        var timestamp =new Date().getTime();
        that.gridData[0].value=response.data.transactionHash
        that.gridData[1].value=response.data.status
        that.gridData[2].value=timestamp.toString().substr(0,10);
        that.gridData[3].value=response.data.blockNumber
        that.gridData[4].value=response.data.from
        that.gridData[5].value=response.data.to
        that.gridData[6].value=response.data.cumulativeGasUsed
        that.gridData[7].value=response.data.gasUsed
        that.gridData[8].value=response.data.contractAddress||"-"
        that.gridData[9].value=response.data.transactionIndex
        that.diaLoading = false;
      });
    },
    toggleSelection(rows) {
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitForm() {
      var that = this;
      this.isDisabled = true;
      this.loading = true;
      var keystore = localStorage.getItem("keystore");
      var code = localStorage.getItem("code");
      for(var i = 0;i<this.multipleSelection.length;i++){
        this.params.push(Number(this.multipleSelection[i].staff_id))
      }
      console.log(this.params);
      this.axios({
        method: "post",
        url: "https://api-vnt.fdkevin.xyz/generateCertificateNumber",
        headers: { Authorization: keystore, code: code },
        data: {studentInfo: this.params},
      })
      // .then(function () {
      //   that.isDisabled = false;
      //   that.loading = false;
      //   that.$alert("批量生成毕业证书成功!", "提示", {
      //     confirmButtonText: "确定",
      //     type: "success",
      //     callback: () => {
      //       that.$router.go(0);
      //     },
      //   });
      // });
      .then(function (response) {
          that.txHash = response.data.txHash
          that.isDisabled = false;
          that.loading = false;
          that.$confirm("此次交易号: " + response.data.txHash + "</a>","批量生成毕业证书成功!",
        {
          confirmButtonText: "确定",
          cancelButtonText: "查看交易详情",
          dangerouslyUseHTMLString: true,
          customClass: "message_box_confirm",
          type: "success",
        }
      )
        .then(() => {
          that.$router.go(0);
        })
        .catch(() => {
          that.hashInfo();
        });
        })
    },
  },
  mounted() {
    //写在mounted或者activated生命周期内即可
    var that = this;
    this.loading = true;
    // var range = ['姓名 ', '部门 ', '证书编号 ', '发证时间 ', '身份证号 ', '特殊情况 ', '处罚情况 ', '院校名称 ', '学历类别 ', '培养层次 ', '学制 ', '入学年份 ', '是否毕业 ', '照片 '];
    // var getRange = [];
    var keystore = localStorage.getItem("keystore");
    var code = localStorage.getItem("code");
    // localStorage.removeItem('tokenInfo')
    this.axios
      .get("https://api-vnt.fdkevin.xyz/getDBStudent", {
        headers: { Authorization: keystore, code: code },
      })
      .then(
        function (response) {
          console.log(response.data[0]);
          for(var i = 0; i<response.data.length;i++){
            if(response.data[i].major === 'TEST')
              response.data[i].major = '区块链技术与应用'
            that.tableData.push(response.data[i])
          }
          console.log(that.tableData);
          // var rname = Object.keys(response.data);
          // sessionStorage.setItem("studentInfo", JSON.stringify(response.data));
          that.loading = false;
        },
        function (err) {
          that.$alert("未查询到数据库中的学生信息", "警告", {
            confirmButtonText: "确定",
            type: "warning",
          });
        }
      );
  },
};
</script>

<style scoped>
.el-form {
  margin: 30px 7%;
  width: 1400px;
  padding: 80px 100px 60px 100px;
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
<style>
.message_box_confirm {
  word-break: break-all !important;
}
</style>