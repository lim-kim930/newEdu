<template>
  <div class="chain">
    <h4>企业认证</h4>
    <el-divider></el-divider>
    <el-result icon="success" title="你已完成企业认证!" v-show="created">
      <template slot="extra">
        <el-button type="primary" size="medium">点击更改</el-button>
      </template>
    </el-result>
    <el-result icon="warning" title="你尚未完成企业认证" v-show="!created">
      <template slot="extra">
        <el-button type="primary" size="medium" @click="submit()">前往认证</el-button>
      </template>
    </el-result>
  </div>
</template>
<script>
export default {
  data() {
    return {
      created: false,
    };
  },
  methods: {
    submit() {

    }
  },
  mounted() {

  },
};
</script>

<style scoped>
.pwd,
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
.pwd .el-input {
  width: 250px;
}
</style>
