<template>
  <el-form
    ref="form"
    :model="form"
    label-width="80px"
    :style="{'max-height': this.wh - 105 + 'px'}"
  >
    <el-form-item label="学生学号">
      <el-input v-model="form.name" style="width: 150px"></el-input>
    </el-form-item>
    <el-form-item label="实习公司">
      <el-input v-model="form.name" style="width: 250px" disabled :placeholder="uName"></el-input>
    </el-form-item>
    <el-form-item label="实习时间">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="实习岗位">
      <el-checkbox-group v-model="form.type">
        <el-checkbox label="前端工程师" name="type"></el-checkbox>
        <el-checkbox label="UI设计师" name="type"></el-checkbox>
        <el-checkbox label="网络运营与维护" name="type"></el-checkbox>
        <el-checkbox label="会计" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="实习">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="备注">
      <el-input type="textarea" v-model="form.desc" resize="none" style="width: 350px;"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  props: ["wh", "uName"],
  methods: {
    onSubmit() {
    }
  }
};
</script>

<style scoped>
.el-form {
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