<template>
  <div class="chain" v-loading="loading" element-loading-text="拼命加载中">
    <h4>更改密码</h4>
    <el-divider></el-divider>
    <el-form>
      <el-form-item label="输入新密码">
        <el-input show-password v-model="form.Passphrase" style="width: 200px;" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input
          show-password
          v-model="form.confirmPassphrase"
          style="width: 200px;"
          maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePwd">确认修改</el-button>
      </el-form-item>
    </el-form>
    <h4>更改公司介绍</h4>
    <el-divider></el-divider>
    <el-form>
      <el-form-item label="企业简介">
        <el-input
          type="textarea"
          v-model="form.Description"
          :rows="10"
          resize="none"
          show-word-limit
          maxlength="500"
          style="width: 400px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeDes">确认修改</el-button>
      </el-form-item>
    </el-form>
    <h4>企业认证</h4>
    <el-divider></el-divider>
    <el-result icon="success" title="你已完成企业认证!" v-show="created">
      <template slot="extra">
        <el-button type="primary" size="medium">点击更改</el-button>
      </template>
    </el-result>
    <el-result icon="warning" title="你尚未完成企业认证" v-show="!created">
      <template slot="extra">
        <el-button type="primary" size="medium">前往认证</el-button>
      </template>
    </el-result>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      created: false,
      form: {
        Passphrase: "",
        confirmPassphrase: "",
        Description: ""
      }
    };
  },
  methods: {
    resetForm() {
      this.form = {
        Passphrase: "",
        confirmPassphrase: "",
        Description: ""
      };
    },
    changePwd() {
      if (this.form.Passphrase !== this.form.confirmPassphrase)
        return this.$message.error("两次输入的密码不一样");
      this.loading = true;
      this.axios({
        method: "put",
        url: "/company/putForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: {
          Passphrase: this.form.Passphrase
        }
      }).then(() => {
        localStorage.removeItem("jw_ent_file");
        this.$confirm("成功修改! 请重新登录", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        }).then(() => {
          window.location.href = "https://edu.limkim.cn/sign";
        }).catch(() => {
          window.location.href = "https://edu.limkim.cn/sign";
        });
        window.location.href = "https://edu.limkim.cn/sign";
        this.resetForm();
        this.loading = false;
      }).catch(() => {
        this.$message.error("修改失败,请稍后重试");
        this.loading = false;
      });
    },
    changeDes() {
      if (this.form.Description.trim().length === 0)
        return this.$message.error("不能为空哦");
      this.loading = true;
      this.axios({
        method: "put",
        url: "/company/putForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: {
          Description: this.form.Description
        }
      }).then(() => {
        localStorage.removeItem("jw_ent_file");
        this.$message.success("修改成功!");
        this.resetForm();
        this.loading = false;
      }).catch(() => {
        this.$message.error("修改失败,请稍后重试");
        this.loading = false;
      });
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.chain {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 750px;
}
</style>
