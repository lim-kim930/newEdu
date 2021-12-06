<template>
  <el-form
    class="form"
    :model="form"
    label-width="100px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{'max-height': this.wh - 105 + 'px'}"
  >
    <h4 style="margin: 10px; display: inline">{{step===0?"已录入企业的相关信息":"请填写企业的相关信息"}}</h4>
    <el-button
      type="primary"
      style="float: right; margin-bottom: 10px"
      @click="step = step===0?1:0"
    >{{step===0?"添加企业":"返回"}}</el-button>
    <el-table
      v-show="step === 0"
      :data="tableData"
      style="width: 100%"
      :max-height="this.wh - 240"
      border
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" label-width="80px">
            <el-form-item label="公司名称">
              <span>{{ props.row.Name }}</span>
            </el-form-item>
            <el-form-item label="公司账号">
              <span>{{ props.row.CompanyCode }}</span>
            </el-form-item>
            <el-form-item label="公司简介">
              <span>{{ props.row.Description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" prop="Name" sortable></el-table-column>
      <el-table-column label="公司账号" prop="CompanyCode" sortable></el-table-column>
      <el-table-column label="创建时间" prop="CreatAt" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="handleEdit(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="step === 1" style="margin-top: 30px">
      <el-form-item label="企业名称">
        <el-input v-model="form.Name" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="企业账号">
        <el-input v-model="form.CompanyCode" style="width: 200px;" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="企业密码">
        <el-input v-model="form.Passphrase" style="width: 200px;" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="企业简介">
        <el-input
          type="textarea"
          v-model="form.Description"
          :rows="4"
          resize="none"
          show-word-limit
          maxlength="500"
          style="width: 400px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="margin-top: 20px">点击录入</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      step: 0,
      loading: false,
      tableData: [],
      form: {
        Name: "",
        CompanyCode: "",
        Passphrase: "",
        Description: ""
      },
    };
  },
  props: ["wh"],
  methods: {
    onSubmit() {
      if (this.form.Name.trim().length === 0 || this.form.CompanyCode.trim().length === 0 || this.form.Passphrase.trim().length === 0)
        return this.$message.warning("请将内容填写完成！");
      this.loading = true
      this.axios({
        method: "put",
        url: "https://api.hduhelp.com/gormja_wrapper/company/put",
        headers: {
          "Authorization": "token " + JSON.parse(localStorage.getItem("jw_manage_file")).token
        },
        data: {
          CompanyCode: this.form.CompanyCode,
          Name: this.form.Name,
          Passphrase: this.form.Passphrase,
          Description: this.form.Description
        }
      }).then(() => {
        this.$message({
          message: "注册成功！",
          type: "success"
        });
        setTimeout(function () {
          location.reload()
        }, 1000)
        this.loading = false
      }).catch(() => {
        this.$message.error("添加企业出错啦,请稍后再试");
        this.loading = false
      });
    }
  },
  mounted() {
    this.loading = true
    this.axios({
      method: "get",
      url: "https://api.hduhelp.com/gormja_wrapper/company/lookup",
    }).then((response) => {
      this.tableData = response.data.data
      this.loading = false
    }).catch((error) => {
      this.$message.error("获取企业列表出错啦,请稍后再试");
      this.loading = false
    })
  },
};
</script>

<style scoped>
.form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.el-table {
  margin: 0 !important;
}
</style>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  margin-left: 20px;
}
.demo-table-expand .el-form-item {
  margin: 0;
  width: 50%;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-form-item__content {
  padding-left: 20px;
}
.cell {
  font-size: 17px;
}
</style>