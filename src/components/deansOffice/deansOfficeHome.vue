<template>
  <el-row>
    <el-col :span="5" @click.native="redirect(1)">
      <el-card :body-style="{ padding: '20px 20px 0 20px' }">
        <div class="image" id="s3"></div>
        <div style="padding-top: 10px; text-align: center;">
          <span>添加学生</span>
          <div class="bottom clearfix">
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="5" @click.native="redirect(2)">
      <el-card :body-style="{ padding: '20px 20px 0 20px' }">
        <div class="image" id="s1"></div>
        <div style="padding-top: 10px; text-align: center;">
          <span>信息管理</span>
          <div class="bottom clearfix">
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="5" @click.native="redirect(3)">
      <el-card :body-style="{ padding: '20px 20px 0 20px' }">
        <div class="image" id="s2"></div>
        <div style="padding-top: 10px; text-align: center;">
          <span>毕业证书</span>
          <div class="bottom clearfix">
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    redirect(index){
      switch(index){
        case 1 :
          this.$router.push("/faceRec");
          break
        case 2 :
          this.$router.push("/checkCourse");
          break
        case 3 :
          this.$router.push("/IsGrad");
          break
      }
    }
  },
};
</script>

<style scoped>
.el-col {
  margin: 150px 20px 150px 5%;
  cursor: pointer;
}
.el-col:first-child {
  margin-left: 12%;
}
.el-row {
  background-color: #fff;
  margin: 100px 10% 0 10%;
  border-radius: 10px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 234px;
}
#s3 {
  background: url('../../img/home/deansoffice/t2.jpg') no-repeat;
  background-size: contain;
}
#s2 {
  background: url('../../img/home/deansoffice/t3.jpg') no-repeat;
  background-size: contain;
}
#s1 {
  background: url('../../img/home/deansoffice/t1.jpg') no-repeat;
  background-size: contain;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.el-breadcrumb__item {
  font-size: 16px !important;
}
</style>
