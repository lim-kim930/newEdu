### 新学生用户登录及学籍确认的流程

- ##### 学生用户访问了edu.limkim.cn，index.js需要判断，有两种大致情况：
  
  * ###### 用户是直接访问网址，我们判断浏览器是不是已经有了token也就是已经登录过，按照token重定向到对应角色的页面，学生或者企业等。没有token，就直接去登录页面。
    
    ```javascript
    // index.js
    
    if (localStorage.getItem("jw_student_file") !== null)
        return window.location.href = "https://edu.limkim.cn/student";
    //......
    window.location.href = "https://edu.limkim.cn/sign";
    ```
    
    ###### 在对应页面，都会有二次验证token，不必担心token是否可用，因为错误的token会让请求返回错误，我们让用户重新登录就行。(依靠后端的错误信息，但是目前没有考虑好像)
    
    ```javascript
    // Student.vue
    
    created() {
        // 判断是否登录
        if (localStorage.getItem("jw_student_file") === null)
            this.$confirm("您还未登录,请前往登录", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning"
            }).then(() => {
                window.location.href = "https://edu.limkim.cn/sign";
            }).catch(() => {
                // 可以去除这里的取消功能 详见element-ui(2.*)文档
                window.location.href = "https://edu.limkim.cn/sign";
            });
    }
    ```
    
    ###### 在登录页面，使用数字杭电登录，就是访问一个具有重定向的链接，他会引导用户走一遍杭助通过cas.hdu.edu.cn来获取自己token的流程，这个token其实是杭电助手的token。
    
    ```javascript
    // signIn.vue
    
    byHDU() {
        window.location.href = "https://api.hduhelp.com/gormja_wrapper/oauth/request";
    },
    ```
  
  * ###### 另一种情况，用户是被杭电助手重定向过来的，此时url里会携带用户的token，解析url判断字段，就能知道这是被重定向来的。
    
    ```javascript
    // index.js
    
    if (location.search.split("?")[1] !== undefined) {
        if (location.search.split("?")[1].split("=")[0] === "type") {
            // 这里是微信简历邀请重定向来的判断，目前没有启用        
            sessionStorage.setItem("jw_from", "hduhelp");
            return window.location.href = "https://edu.limkim.cn/sign";
        }
    }
    ```
    
    ###### 然后判断是学生还是老师，方便定向到对应页面，老师目前是唯一管理员，并且将token存好。
    
    ```javascript
    // index.js
    
    const data = JSON.parse(result).data;
    if (data.staffType)
        data.STAFFTYPE = data.staffType;
    if (data.STAFFTYPE && data.STAFFTYPE === "1") {
        // 存token
        localStorage.setItem("jw_student_file", JSON.stringify({
            token: location.search.split("?")[1].split("&")[0].split("=")[1],
            staffID: location.search.split("?")[1].split("&")[1].split("=")[1],
            xjConfirmed: false
         }));
         window.location.href = "https://edu.limkim.cn/student";
    }
    else if (data.STAFFTYPE === "2") {
        localStorage.setItem("jw_manager_file", JSON.stringify({
            token: location.search.split("?")[1].split("&")[0].split("=")[1],
            uname: location.search.split("?")[1].split("&")[1].split("=")[1]
        }));
        window.location.href = "https://edu.limkim.cn/manager";
    }
    ```
+ ##### 首次登录需要学籍确认, 这里做举例是因为后面的很多逻辑都与之类似，参考价值比较大，<mark>大量重复的逻辑会标黄</mark>。
  
  + ###### 首先Student.vue在判断是否登录以后，进行了确认状态的获取，也就是全局变量:xjConfirmed (通过props传递，没有使用类似vuex的管理器，后续可以加上，如果版本迭代到vue3)，是个boolean，当时没有ts，也就不关心类型了。
    
    ```javascript
    // Student.vue
    
    this.axios({
        method: "get",
        url: "/dataFile/getFileID",
        headers: { "Authorization": "token " + userData.token },
    }).then((response) => {
        this.xjConfirmed = response.data.data.FileID === "null" ? false : true;
        userData.xjConfirmed = this.xjConfirmed;
        localStorage.setItem("jw_student_file", JSON.stringify(userData));
    })
    ```
    
    ###### 那么第一次登录，在学籍确认组件profileConfirm.vue里，就会通过propos拿到xjConfirmed=false。<mark>在mounted()里，获取学籍信息</mark>
    
    ```javascript
    // profileConfirm.vue
    
    this.axios({
        method: "post",
        url: "/lookup?topic=profile",
        headers: { Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: JSON.stringify({
            SchoolCode: 1,
            StaffID: JSON.parse(localStorage.getItem("jw_student_file")).staffID
        })
    })
    ```
    
    ###### <mark>确认信息按钮的显示自然也是通过xjConfirmed来控制的</mark>，只有没确认过的才能看到，并且已经确认的，需要看到提示。
    
    ```html
    <!-- profileConfirm.vue  -->
    
    <el-result icon="success" title="学籍信息已确认" v-show="confirmed"></el-result>
    <el-button
        type="primary"
        @click="submit()"
        plain
        v-show="!confirmed"
        :disabled="btnDisabled"
    >确认信息</el-button>
    ```
    
    ###### 确认信息，就是数据处理较为复杂的部分，<mark>转换成后端要求的格式</mark>，每个接口还可能不一样，需要注意，<mark>并且相关请求都需要携带Authorization头</mark>。
    
    ```javascript
    // profileConfirm.vue
    
    this.axios({
        method: "post",
        url: "/dataFile/new?schoolCode=1&staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { Authorization: "token " + JSON.parse(localStorage.getItem("jw_student_file")).token }
    })
    ```
    
    ###### <mark>区块交易详情信息解析出来</mark>，这段代码是重复代码，可以抽离。
    
    ```javascript
    // profileConfirm.vue
    
    var blockName = Object.keys(block);
        const translation = {
            blockHash: "区块哈希",
            blockNumber: "交易号",
            blockTimestamp: "区块时间",
            blockWriteTime: "写入时间",
            hash: "交易内容"
        };
    for (var i = 0; i < blockName.length; i++)
        this.blockDataInfo.push({
            value: block[blockName[i]],
            name: translation[blockName[i]]
        });
    ```
    
    ###### <mark>下载学业文件</mark>，也是重复代码
    
    ```javascript
    // profileConfirm.vue
    
    // 将后端返回的文件流转为file对象
    dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(","),
            bstr = atob(arr[0]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: "enc" });
    },
    
    // 利用a标签下载文件
    downloadFile(filename) {
        const Url = URL.createObjectURL(this.file);
        const eleLink = document.createElement("a");
        eleLink.download = filename;
        eleLink.style.display = "none";
        eleLink.href = Url;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
        setTimeout(() => {
            this.$emit("func4", true);
            this.$confirm("学业文件已经下载至浏览器默认下载位置,如未设置,请手动选择下载路径并妥善保存", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "success"
            });
        }, 400);
    },
    ```
    
    ###### <mark>很多地方都是类似的一整套逻辑框架</mark>，可以试着去理解，重复代码和调试的废弃代码都很多，可以自己改写抽离。


