<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>添加学生</el-breadcrumb-item>
      <el-breadcrumb-item>手动添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form
      status-icon
      label-width="135px"
      class="ruleForm"
      v-loading = 'loading'
      element-loading-text="拼命加载中"
    >
    <el-steps :active="stepActive"  align-center finish-status="success" style="height: 70px">
      <el-step title="步骤 1" description="人脸校验完成" icon="el-icon-user"></el-step>
      <el-step title="步骤 2" description="请录入要添加学生的各项信息" icon="el-icon-edit"></el-step>
    </el-steps>
    <el-divider></el-divider>
    <el-row style="margin: 80px 0 0 150px">
      <el-col :span="10">
        <el-form-item label="学生姓名" required>
          <el-input v-model="studentInfo.studentName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="学生身份证号码" required>
          <el-input v-model="studentInfo.IDNumber" clearable style="width: 260px;" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="学生学号" required>
          <el-input v-model="studentInfo.address" placeholder="请输入" clearable style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="学生专业" required>
          <el-input v-model="studentInfo.department" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="学生学年" required>
          <el-input v-model="studentInfo.schoolYear" placeholder="请输入" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="入学年份" required>
          <el-input v-model="studentInfo.enrollmentYear" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="height: 377px">
        <el-form-item label="选择学生类型" required>
          <el-select v-model="studentInfo.learnType" clearable placeholder="请选择">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择学生培养层次" required>
          <el-select v-model="studentInfo.educationalLevel" clearable placeholder="请选择">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传学生照片" required>
        <el-upload class="upload-demo" drag action='' :auto-upload="false" accept=".png, .jpg, .jpeg" :limit="1" :on-change="getFile" >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()" :disabled = 'isDisabled' style="width: 150px;"><i class="el-icon-circle-plus el-icon--left"></i>点击添加</el-button>
        </el-form-item>
      </el-col>
    </el-row>
      
      <el-dialog title="交易详情" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" v-loading="diaLoading" element-loading-text="拼命加载中">
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
        stepActive: 1,
        token: '',
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
        loading: false,
        diaLoading: false,
        isDisabled: false,
        loading: false,
        studentInfo:{
          picture:'',
          address: '',
          studentName: '',
          department: '',
          schoolYear: '',
          enrollmentYear: '',
          IDNumber: '',
          learnType: '',
          educationalLevel: '',
        },
        disabled: false,
        options1: [{
          value: '1',
          label: '普通高等教育'
        }, {
          value: '2',
          label: '博士'
        }, {
          value: '3',
          label: '硕士'
        }, {
          value: '4',
          label: '学士学位'
        }, {
          value: '5',
          label: '成人高等教育'
        }, {
          value: '6',
          label: '自学考试'
        }, {
          value: '7',
          label: '网络教育'
        }],
        options2: [{
          value: '01',
          label: '博士生'
        }, {
          value: '02',
          label: '硕士生'
        }, {
          value: '03',
          label: '学士学位'
        }, {
          value: '04',
          label: '本科'
        }, {
          value: '05',
          label: '专科(含高职)'
        }],
      };
    },
    methods: {
      dialogClose() {
        this.dialogTableVisible = false;
        this.$router.push("/faceRec");
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
        this.loading = true
        // localStorage.removeItem('tokenInfo')
        this.axios({
          method: "post",
          url: "https://api-vnt.fdkevin.xyz/addStudent",
          data: this.studentInfo,
          headers: { Authorization: keystore, code: code },
        })
        .then(function (response) {
          that.stepActive = 2
          that.txHash = response.data.txHash
          that.loading = false
          that.$confirm("此次交易号: " + response.data.txHash + "</a>","新的学生添加成功!",
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
          this.$router.push("/faceRec");
        })
        .catch(() => {
          that.hashInfo();
        });
        })
      },
      getFile(file, fileList) {
        this.getBase64(file.raw).then(res => {
          this.studentInfo.picture = res
        });
      },
      getBase64(file) {
        return new Promise(function(resolve, reject) {
          let reader = new FileReader();
          let imgResult = "";
          reader.readAsDataURL(file);
          reader.onload = function() {
            imgResult = reader.result;
          };
          reader.onerror = function(error) {
            reject(error);
          };
          reader.onloadend = function() {
            resolve(imgResult);
          };
        });
      },
    },
};
</script>

<style scoped>
.el-form {
  margin: 30px 5%;
  width: 1500px;
  height: 769px;
  padding: 30px 50px 30px 50px;
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
</style>
<style>
.message_box_confirm {
  word-break: break-all !important;
}
</style>

