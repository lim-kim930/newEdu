<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>管理学生信息</el-breadcrumb-item>
      <el-breadcrumb-item>录入学分</el-breadcrumb-item>
      <el-breadcrumb-item>手动录入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form
      status-icon
      label-width="125px"
      class="ruleForm"
      v-loading = 'loading'
    >
      <el-form-item label="学生学号" required>
        <el-input
          v-model="credit.address"
          autocomplete="off"
          placeholder="请输入"
          clearable
          style="width: 200px;"
          requ
        ></el-input>
      </el-form-item>
      <el-form-item label="课程层级" required>
        <el-radio-group v-model="iLevel[0]">
          <el-radio label="a">课内教学</el-radio>
          <el-radio label="b">实践教学</el-radio>
          <el-radio label="c">课外教育</el-radio>
          <el-radio label="g">交叉与个性发展学分</el-radio>
        </el-radio-group>
        <el-divider></el-divider>
        <el-radio-group v-model="iLevel[1]">
          <el-radio label="d">通识教育课</el-radio>
          <el-radio label="e">学科基础课</el-radio>
          <el-radio label="f">专业课</el-radio>
          <el-radio label="b">实践教学</el-radio>
          <el-radio label="c">课外教育</el-radio>
          <el-radio label="g">交叉与个性发展学分</el-radio>
        </el-radio-group>
        <el-divider></el-divider>
        <el-radio-group v-model="iLevel[2]">
          <el-radio label="h">通识公共课</el-radio>
          <el-radio label="i">通识选修课</el-radio>
          <el-radio label="j">专业必修课</el-radio>
          <el-radio label="k">专业选修课</el-radio>
          <el-radio label="b">实践教学</el-radio>
          <el-radio label="c">课外教育</el-radio>
          <el-radio label="e">学科基础课</el-radio>
          <el-radio label="g">交叉与个性发展学分</el-radio>
        </el-radio-group>
        <el-divider></el-divider>
        <el-radio-group v-model="iLevel[3]">
          <el-radio label="l">必修课</el-radio>
          <el-radio label="m">选修课</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="课程号" required>
        <el-input v-model="credit.courseNumber" clearable style="width: 150px; " placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="获得学分" required>
        <el-input v-model="prCredit" clearable style="width: 100px;" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" style="width: 150px;" :disabled = 'isDisabled'><i class="el-icon-upload2 el-icon--left"></i>点击录入</el-button>
      </el-form-item>
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
        prCredit: '',
        credit: {
          i: '',
          address: '',
          credit: '',
          courseNumber: '',
        },
        iLevel: [],
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
      submitForm() {
        var that = this
        var keystore = localStorage.getItem('keystore')
        var code = localStorage.getItem('code')
        for(var i=0;i<this.iLevel.length;i++)
          this.credit.i += this.iLevel[i]
        this.credit.credit = JSON.stringify(this.prCredit*2)
        this.loading = true
        console.log(this.credit.i);
        switch(this.credit.i){
          case 'adhl':
            this.credit.i = '1';
            break
          case 'adhm':
            this.credit.i = '2';
            break
          case 'adim':
            this.credit.i = '3';
            break
          case 'aeel':
            this.credit.i = '4';
            break
          case 'afjl':
            this.credit.i = '5';
            break
          case 'afkm':
            this.credit.i = '6';
            break
          case 'gggm':
            this.credit.i = '7';
            break
          case 'bbbl':
            this.credit.i = '8';
            break
          case 'bbbm':
            this.credit.i = '9';
            break
          case 'cccc':
            this.credit.i = '10';
            break
        }
        this.credit.address = "0x"+this.credit.address;
        console.log(this.credit);
         this.axios({
          method: "post",
          url: "https://api-vnt.fdkevin.xyz/checkCourse",
          data: this.credit,
          headers: { Authorization: keystore, code: code },
        })
        // .then(function (response) {
        //   that.loading = false
        //   that.$alert("学分录入成功!", "提示", {
        //     confirmButtonText: "确定",
        //     type: "success",
        //     callback: () => {
        //       that.isDisabled = true
        //       that.$router.go(0);
        //     }
        //   })
        //   console.log(response);
        // })
        .then(function (response) {
          that.txHash = response.data.txHash
          that.loading = false
          that.$confirm("此次交易号: " + response.data.txHash + "</a>","学分录入成功!",
        {
          confirmButtonText: "确定",
          cancelButtonText: "查看交易详情",
          dangerouslyUseHTMLString: true,
          customClass: "message_box_confirm",
          type: "success",
        }
      )
        .then(() => {
          that.isDisabled = true;
          that.$router.go(0);
        })
        .catch(() => {
          that.hashInfo();
        });
        })
      },
    }
};
</script>

<style scoped>
.el-form {
  margin: 30px 7%;
  width: 1400px;
  padding: 80px 110px 60px 120px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
}
.ruleForm .el-input{
    width: 170px;
}
.el-breadcrumb__item {
  font-size: 16px !important;
}
.el-form .el-divider--horizontal {
     margin: 0;
     border-top: 1px dashed #f1f3f5;
 } 
</style>
<style>
.message_box_confirm {
  word-break: break-all !important;
}
</style>
