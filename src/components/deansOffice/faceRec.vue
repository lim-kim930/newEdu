<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
      <el-breadcrumb-item>添加学生</el-breadcrumb-item>
      <el-breadcrumb-item>手动添加</el-breadcrumb-item>
      <el-breadcrumb-item>人脸比对</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-form status-icon label-width="160px" class="ruleForm">
      <!-- <div style="width: 260px">
        <el-alert title="请先完成该学生的人脸校验" type="warning" :closable="false" show-icon></el-alert>
      </div> -->
      <el-steps :active="0"  align-center finish-status="success" style="height: 70px">
        <el-step title="步骤 1" description="请先完成要添加学生的人脸校验" icon="el-icon-user"></el-step>
        <el-step title="步骤 2" description="请录入要添加学生的各项信息" icon="el-icon-edit"></el-step>
      </el-steps>
    <el-divider></el-divider>
      <div class="renlian">
        <div style="margin: 0 0 10px 20px; width: 135px; height: 32px">
          <el-tag type="danger" v-show="tag1_in"
            ><i class="el-icon-warning"></i> 请选择图片文件</el-tag
          >
          <el-tag type="warning" v-show="tag1_up"
            ><i class="el-icon-loading"></i> 正在提取人脸信息...</el-tag
          >
          <el-tag type="danger" v-show="tag1_no"
            ><i class="el-icon-warning"></i> 未检测到人脸信息</el-tag
          >
          <el-tag type="success" v-show="tag1_ok"
            ><i class="el-icon-success"></i> 已识别到一处人脸</el-tag
          >
        </div>
        <div class="box" :style="{ backgroundImage: 'url(' + imgUrl1 + ')' }">
          <div
            id="pointer1"
            :style="{
              top: top1 + 'px',
              left: left1 + 'px',
              width: width1 + 'px',
              height: height1 + 'px',
            }"
            v-show="p1Show"
          ></div>
          <span
            v-for="value in position1"
            :key="value.key"
            :style="{ top: value.y + 'px', left: value.x + 'px' }"
          ></span>
        </div>
      </div>
      <div class="renlian">
        <div style="margin: 0 0 10px 20px; width: 135px; height: 32px">
          <el-tag type="danger" v-show="tag2_in"
            ><i class="el-icon-warning"></i> 请选择图片文件</el-tag
          >
          <el-tag type="warning" v-show="tag2_up"
            ><i class="el-icon-loading"></i> 正在提取人脸信息...</el-tag
          >
          <el-tag type="danger" v-show="tag2_no"
            ><i class="el-icon-warning"></i> 未检测到人脸信息</el-tag
          >
          <el-tag type="success" v-show="tag2_ok"
            ><i class="el-icon-success"></i> 已识别到一处人脸</el-tag
          >
        </div>
        <div class="box" :style="{ backgroundImage: 'url(' + imgUrl2 + ')' }">
          <div
            id="pointer2"
            :style="{
              top: top2 + 'px',
              left: left2 + 'px',
              width: width2 + 'px',
              height: height2 + 'px',
            }"
            v-show="p2Show"
          ></div>
          <span
            v-for="value in position2"
            :key="value.key"
            :style="{ top: value.y + 'px', left: value.x + 'px' }"
          ></span>
        </div>
      </div>
      <div class="renlian">
        <div style="margin: 0 0 10px 20px; width: 135px; height: 32px">
          <el-tag type="danger" v-show="tag3_in"
            ><i class="el-icon-warning"></i> 点击拍照采集人脸</el-tag
          >
          <el-tag type="warning" v-show="tag3_up"
            ><i class="el-icon-loading"></i> 正在提取人脸信息...</el-tag
          >
          <el-tag type="danger" v-show="tag3_no"
            ><i class="el-icon-warning"></i> 未检测到人脸信息</el-tag
          >
          <el-tag type="success" v-show="tag3_ok"
            ><i class="el-icon-success"></i> 已识别到一处人脸</el-tag
          >
        </div>
        <div class="box" :style="{ backgroundImage: 'url(' + imgSrc + ')' }">
          <div
            id="pointer3"
            :style="{
              top: top3 + 'px',
              left: left3 + 'px',
              width: width3 + 'px',
              height: height3 + 'px',
            }"
            v-show="p3Show"
          ></div>
          <span
            v-for="value in position3"
            :key="value.key"
            :style="{ top: value.y + 'px', left: value.x + 'px' }"
          ></span>
        </div>
      </div>
      <div class="camera_outer">
        <div style="margin: 0 0 10px 20px; width: 135px; height: 32px">
          <el-tag type="warning" v-show="tag4_no"
            ><i class="el-icon-warning"></i> 相机未开启</el-tag
          >
          <el-tag type="success" v-show="tag4_ok"
            ><i class="el-icon-success"></i> 相机已开启</el-tag
          >
        </div>
        <video
          id="videoCamera"
          :width="videoWidth"
          :height="videoHeight"
          autoplay
          :style="{ backgroundImage: 'url(' + imgUrl3 + ')' }"
        ></video>
        <div
          id="mask"
          v-show="videoWidth === 0"
          :style="{ backgroundImage: 'url(' + imgUrl3 + ')', zIndex: 99 }"
        ></div>
        <canvas
          style="display: none"
          id="canvasCamera"
          :width="videoWidth"
          :height="videoHeight"
        ></canvas>
      </div>
      <el-upload
        action=""
        :on-change="getFile1"
        :limit="1"
        :auto-upload="false"
        accept=".png, .jpg, .jpeg"
        :show-file-list="false"
        ref="upload1"
        class="inline-block"
        style="margin-left: 80px"
      >
        <el-button type="primary"
          ><i class="el-icon-upload el-icon--left"></i
          >点击上传准考证照片</el-button
        >
      </el-upload>
      <el-upload
        action=""
        :on-change="getFile2"
        :limit="1"
        :auto-upload="false"
        accept=".png, .jpg, .jpeg"
        :show-file-list="false"
        ref="upload2"
        class="inline-block"
        style="margin-left: 135px"
      >
        <el-button type="primary"
          ><i class="el-icon-upload el-icon--left"></i
          >点击上传身份证照片</el-button
        >
      </el-upload>
      <el-button type="primary" @click="setImage()" style="margin-left: 170px"
        ><i class="el-icon-picture-outline el-icon--left"></i
        >点击拍照</el-button
      >
      <el-button
        type="primary"
        @click="getCompetence()"
        style="margin-left: 125px"
        ><i class="el-icon-camera el-icon--left"></i>打开摄像头</el-button
      >
      <el-button type="primary" @click="stopNavigator()"
        ><i class="el-icon-error el-icon--left"></i>关闭摄像头</el-button
      >
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm()"
          :loading="loading"
          style="margin: 10px 0 0 930px; width: 150px"
          ><i class="el-icon-connection el-icon--left" v-show="!loading"></i
          >{{ placeholder }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
let scan = null;
export default {
  data() {
    return {
      top1: "",
      left1: "",
      width1: "",
      height1: "",
      tag1_in: true,
      tag1_up: false,
      tag1_no: false,
      tag1_ok: false,
      p1Show: false,
      position1: [],
      top2: "",
      left2: "",
      width2: "",
      height2: "",
      tag2_in: true,
      tag2_up: false,
      tag2_no: false,
      tag2_ok: false,
      p2Show: false,
      position2: [],
      top3: "",
      left3: "",
      width3: "",
      height3: "",
      tag3_in: true,
      tag3_up: false,
      tag3_no: false,
      tag3_ok: false,
      p3Show: false,
      position3: [],
      tag4_no: true,
      tag4_ok: false,
      placeholder: "点击校验",
      videoWidth: 300,
      videoHeight: 400,
      imgSrc: "images/人脸核身.png",
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      isDisabled: false,
      loading: false,
      imgUrl1: "images/身份证人像面.png",
      imgUrl2: "images/身份证人像面.png",
      imgUrl3: "images/拍照.png",
    };
  },
  methods: {
    submitForm() {
      this.stopNavigator();
      var that = this;
      this.loading = true;
      this.placeholder = "正在检验中";
      this.axios({
        method: "post",
        url: "https://api-cn.faceplusplus.com/facepp/v3/compare",
        data: that.$qs.stringify({
          api_key: "PRNA1wgDSB9iCn0oVW6RMDiRNpU42SzF",
          api_secret: "yNRiYEIr0ZS_TsTSqEUI29wq3orEiQKb",
          image_base64_1: that.imgUrl1,
          image_base64_2: that.imgUrl2,
        }),
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      }).then(function (response) {
        console.log(response.data.confidence);
        if (response.data.confidence >= 80) {
          that
            .axios({
              method: "post",
              url: "https://api-cn.faceplusplus.com/facepp/v3/compare",
              data: that.$qs.stringify({
                api_key: "PRNA1wgDSB9iCn0oVW6RMDiRNpU42SzF",
                api_secret: "yNRiYEIr0ZS_TsTSqEUI29wq3orEiQKb",
                image_base64_1: that.imgUrl2,
                image_base64_2: that.imgSrc,
              }),
              headers: {
                "Content-type": "application/x-www-form-urlencoded",
              },
            })
            .then(function (response) {
              console.log(response.data.confidence);
              if (response.data.confidence >= 80) {
                that
                  .$alert("人脸校验成功", "提示", {
                    confirmButtonText: "确定",
                    type: "success",
                  })
                  .then(() => {
                    that.$router.push("/addStudent");
                  });
              } else {
                that
                  .$alert("人脸校验失败", "提示", {
                    confirmButtonText: "确定",
                    type: "error",
                  })
                  .then(() => {
                    that.$router.go(0);
                  });
              }
            });
        } else {
          that
            .$alert("人脸校验失败", "提示", {
              confirmButtonText: "确定",
              type: "error",
            })
            .then(() => {
              that.$router.go(0);
            });
        }
      });
    },
    getFile1(file) {
      var that = this;
      this.$refs.upload1.clearFiles();
      this.p1Show = false;
      this.position1 = [];
      this.tag1_in = false;
      this.tag1_no = false;
      this.tag1_ok = false;
      setTimeout(function () {
        that.tag1_up = true;
      }, 100);
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function () {
        that.imgUrl1 = reader.result;
        that
          .axios({
            method: "post",
            url: "https://api-cn.faceplusplus.com/facepp/v3/detect",
            data: that.$qs.stringify({
              api_key: "PRNA1wgDSB9iCn0oVW6RMDiRNpU42SzF",
              api_secret: "yNRiYEIr0ZS_TsTSqEUI29wq3orEiQKb",
              image_base64: reader.result,
              return_landmark: 2,
              return_attributes: "gender,age,eyestatus,mouthstatus",
            }),
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          })
          .then(function (response) {
            setTimeout(function () {
              that.tag1_up = false;
            }, 400);
            const face = response.data.faces;
            if (face.length === 0) {
              setTimeout(function () {
                that.tag1_no = true;
              }, 500);
            } else {
              setTimeout(function () {
                that.tag1_ok = true;
                that.top1 = face[0].face_rectangle.top - 2;
                that.left1 = face[0].face_rectangle.left - 2;
                that.width1 = face[0].face_rectangle.width;
                that.height1 = face[0].face_rectangle.height;
                that.p1Show = true;
                var landmarks = Object.keys(face[0].landmark);
                for (var i = 0; i < landmarks.length; i++) {
                  that.position1.push({
                    x: face[0].landmark[landmarks[i]].x,
                    y: face[0].landmark[landmarks[i]].y,
                    key: i,
                  });
                }
              }, 500);
            }
          });
      };
    },
    getFile2(file) {
      var that = this;
      this.$refs.upload2.clearFiles();
      this.p2Show = false;
      this.position2 = [];
      this.tag2_in = false;
      this.tag2_no = false;
      this.tag2_ok = false;
      setTimeout(function () {
        that.tag2_up = true;
      }, 100);
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function () {
        that.imgUrl2 = reader.result;
        that
          .axios({
            method: "post",
            url: "https://api-cn.faceplusplus.com/facepp/v3/detect",
            data: that.$qs.stringify({
              api_key: "PRNA1wgDSB9iCn0oVW6RMDiRNpU42SzF",
              api_secret: "yNRiYEIr0ZS_TsTSqEUI29wq3orEiQKb",
              image_base64: reader.result,
              return_landmark: 2,
              return_attributes: "gender,age,eyestatus,mouthstatus",
            }),
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          })
          .then(function (response) {
            setTimeout(function () {
              that.tag2_up = false;
            }, 400);
            const face = response.data.faces;
            if (face.length === 0) {
              setTimeout(function () {
                that.tag2_no = true;
              }, 500);
            } else {
              setTimeout(function () {
                that.tag2_ok = true;
                that.top2 = face[0].face_rectangle.top - 2;
                that.left2 = face[0].face_rectangle.left - 2;
                that.width2 = face[0].face_rectangle.width;
                that.height2 = face[0].face_rectangle.height;
                that.p2Show = true;
                var landmarks = Object.keys(face[0].landmark);
                for (var i = 0; i < landmarks.length; i++) {
                  that.position2.push({
                    x: face[0].landmark[landmarks[i]].x,
                    y: face[0].landmark[landmarks[i]].y,
                    key: i,
                  });
                }
              }, 500);
            }
          });
      };
    },
    getCompetence() {
      this.videoWidth = 300;
      var _this = this;
      this.thisCancas = document.getElementById("canvasCamera");
      this.thisContext = this.thisCancas.getContext("2d");
      this.thisVideo = document.getElementById("videoCamera");
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia;
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: "scaleX(-1)",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in _this.thisVideo) {
            _this.thisVideo.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream);
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play();
          };
          _this.tag4_no = false;
          setTimeout(function () {
            _this.tag4_ok = true;
          }, 200);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 绘制图片（拍照功能）
    setImage() {
      var _this = this;
      // 点击，canvas画图
      this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      );
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL("image/jpg");
      this.imgSrc = image;
      this.$emit("refreshDataList", this.imgSrc);
      this.p3Show = false;
      this.position3 = [];
      this.tag3_in = false;
      this.tag3_no = false;
      this.tag3_ok = false;
      setTimeout(function () {
        _this.tag3_up = true;
      }, 100);
      _this
        .axios({
          method: "post",
          url: "https://api-cn.faceplusplus.com/facepp/v3/detect",
          data: _this.$qs.stringify({
            api_key: "PRNA1wgDSB9iCn0oVW6RMDiRNpU42SzF",
            api_secret: "yNRiYEIr0ZS_TsTSqEUI29wq3orEiQKb",
            image_base64: image,
            return_landmark: 2,
            return_attributes: "gender,age,eyestatus,mouthstatus",
          }),
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        })
        .then(function (response) {
          setTimeout(function () {
            _this.tag3_up = false;
          }, 400);
          const face = response.data.faces;
          if (face.length === 0) {
            setTimeout(function () {
              _this.tag3_no = true;
            }, 500);
          } else {
            setTimeout(function () {
              _this.tag3_ok = true;
              _this.top3 = face[0].face_rectangle.top - 2;
              _this.left3 = face[0].face_rectangle.left - 2;
              _this.width3 = face[0].face_rectangle.width;
              _this.height3 = face[0].face_rectangle.height;
              _this.p3Show = true;
              var landmarks = Object.keys(face[0].landmark);
              for (var i = 0; i < landmarks.length; i++) {
                _this.position3.push({
                  x: face[0].landmark[landmarks[i]].x,
                  y: face[0].landmark[landmarks[i]].y,
                  key: i,
                });
              }
            }, 500);
          }
        });
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // 关闭摄像头
    stopNavigator() {
      this.videoWidth = 0;
      this.tag4_ok = false;
      var that = this;
      setTimeout(function () {
        that.tag4_no = true;
      }, 200);
      this.thisVideo.srcObject.getTracks()[0].stop();
    },
  },
};
</script>

<style scoped>
.el-form {
  margin: 30px 5%;
  width: 1500px;
  padding: 30px 50px 30px 50px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
}
.ruleForm .el-input {
  width: 170px;
}
.renlian {
  float: left;
  width: 300px;
  margin: 20px 0 10px 25px;
  background-size: 100%;
}
.renlian .box {
  width: 300px;
  height: 400px;
  position: relative;
  overflow: hidden;
  background-color: #ebebeb;
}
div[id^="pointer"] {
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
  border: 2px solid #409eff;
}
.box span {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: pink;
  border-radius: 50%;
}
.camera_outer {
  margin: 20px 0 10px 25px;
  display: inline-block;
}
.el-breadcrumb__item {
  font-size: 16px !important;
}
.inline-block {
  display: inline-block;
}
.tx_img {
  display: block;
}
.img_bg_camera {
  width: 300px;
  margin-right: 25px;
  display: inline-block;
}
#mask {
  width: 300px;
  height: 400px;
  display: inline-block;
}
</style>
<style>
.el-alert__title {
  font-size: 16px !important;
}
</style>
