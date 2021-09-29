<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>管理学生信息</el-breadcrumb-item>
      <el-breadcrumb-item>其他</el-breadcrumb-item>
      <el-breadcrumb-item>添加学生惩罚情况</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form
      status-icon
      label-width="125px"
      class="ruleForm"
      v-loading = "loading"
    >
      <el-form-item label="学生学号"  required>
        <el-input
          v-model="params.address"
          autocomplete="off"
          placeholder="请输入"
          clearable
          style="width: 220px;"
          required
        ></el-input>
      </el-form-item>
      <el-form-item label="填写惩罚情况"  required>
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 7}"
          placeholder="请输入"
          v-model="params.situtation"
          style="width: 360px;">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" :disabled = "isDisabled" style="width: 150px;"><i class="el-icon-circle-plus el-icon--left"></i>点击添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
      return {
        isDisabled: false,
        loading: false,
        params: {
          address: '',
          situtation: '',
        },
      };
    },
    methods: {
      submitForm() {
        if(this.params.address == ''){
          this.$message({
            message: '请填写学生地址哦',
            type: 'warning'
          });
          return false
        }
        if(this.params.situtation == ''){
          this.$message({
            message: '请填写要添加的惩罚情况',
            type: 'warning'
          });
          return false
        }
        var that = this
        var keystore = localStorage.getItem('keystore')
        var code = localStorage.getItem('code')
        this.loading = true
        // localStorage.removeItem('tokenInfo')
        this.axios({
          method: "post",
          url: "https://api-vnt.fdkevin.xyz/modifyPunishment",
          data: this.params,
          headers: { Authorization: keystore, code: code },
        })
        .then(function () {
          that.loading = false
          that.$alert("特殊情况添加成功!", "提示", {
            confirmButtonText: "确定",
            type: "success",
            callback: () => {
              that.isDisabled = true
              that.$router.go(0);
            }
          })
        })
      },
    }
};
</script>

<style scoped>
.el-form {
  margin: 170px 7%;
  width: 1400px;
  padding: 80px 110px 60px 190px;
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
