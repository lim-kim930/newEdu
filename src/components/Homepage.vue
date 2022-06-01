<template>
    <div class="htmleaf-container">
        <div class="div1">
            <p class="s1">正</p>
            <p class="s2">在</p>
            <p class="s3">加</p>
            <p class="s4">载</p>
            <p class="s5">中</p>
            <p class="s6">.</p>
            <p class="s7">.</p>
            <p class="s8">.</p>
        </div>
        <div class="error">
            <h1>出错啦,相关信息:</h1>
            <h1 id="errorInfo"></h1>
        </div>
        <div class="loading" style="min-height:350px;">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="loader">
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    created() {
        if (location.search.split("?")[1] !== undefined) {
            if (location.search.split("?")[1].split("=")[0] === "type") {
                sessionStorage.setItem("jw_from", "hduhelp");
                return window.location.href = "https://edu.limkim.cn/sign";
            }
            const requestOptions = {
                method: "GET",
                redirect: "follow",
                headers: { "Authorization": "token " + location.search.split("?")[1].split("&")[0].split("=")[1] }
            };
            return fetch("https://api.hduhelp.com/salmon_base/person/info", requestOptions).then(response => response.text()).then(result => {
                const data = JSON.parse(result).data;
                if (data.staffType)
                    data.STAFFTYPE = data.staffType;
                if (data.STAFFTYPE && data.STAFFTYPE === "1") {
                    localStorage.setItem("jw_student_file", JSON.stringify({
                        token: location.search.split("?")[1].split("&")[0].split("=")[1],
                        staffID: location.search.split("?")[1].split("&")[1].split("=")[1],
                        xjConfirmed: false
                    }));
                    if (sessionStorage.getItem("jw_from") && sessionStorage.getItem("jw_from") === "hduhelp") {
                        sessionStorage.removeItem("jw_from");
                        window.location.href = "https://edu.limkim.cn/student/#/infoShare";
                    }
                    else
                        window.location.href = "https://edu.limkim.cn/student";
                }
                else if (data.STAFFTYPE === "2") {
                    localStorage.setItem("jw_manager_file", JSON.stringify({
                        token: location.search.split("?")[1].split("&")[0].split("=")[1],
                        uname: location.search.split("?")[1].split("&")[1].split("=")[1]
                    }));
                    window.location.href = "https://edu.limkim.cn/manager";
                }
            }).catch(error => {
                document.querySelector(".error").style.display = "block";
                document.querySelector(".div1").style.display = "none";
                document.querySelector("#errorInfo").innerText = error;
            });
        }
        if (localStorage.getItem("jw_student_file") !== null)
            return window.location.href = "https://edu.limkim.cn/student";
        if (localStorage.getItem("jw_ent_file") !== null)
            return window.location.href = "https://edu.limkim.cn/company";
        if (localStorage.getItem("jw_manager_file") !== null)
            return window.location.href = "https://edu.limkim.cn/manager";
        window.location.href = "https://edu.limkim.cn/sign";
    }
};
</script>

<style scoped>
body {
    background-color: rgb(245, 245, 245);
}

.loader {
    --size: 32px;
    --duration: 800ms;
    width: 96px;
    height: 64px;
    margin: 50px auto;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
    position: relative;
}

.loader .box {
    width: 32px;
    height: 32px;
    transform-style: preserve-3d;
    position: absolute;
    top: 0;
    left: 0;
}

.loader .box:nth-child(1) {
    transform: translate(100%, 0);
    animation: box1 800ms linear infinite;
}

.loader .box:nth-child(2) {
    transform: translate(0, 100%);
    animation: box2 800ms linear infinite;
}

.loader .box:nth-child(3) {
    transform: translate(100%, 100%);
    animation: box3 800ms linear infinite;
}

.loader .box:nth-child(4) {
    transform: translate(200%, 0);
    animation: box4 800ms linear infinite;
}

.loader .box>div {
    --translateZ: calc(var(--size) / 2);
    --rotateY: 0deg;
    --rotateX: 0deg;
    background: #5c8df6;
    width: 100%;
    height: 100%;
    transform: rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ));
    position: absolute;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
}

.loader .box>div:nth-child(1) {
    top: 0;
    left: 0;
}

.loader .box>div:nth-child(2) {
    background: #145af2;
    right: 0;
    --rotateY: 90deg;
}

.loader .box>div:nth-child(3) {
    background: #447cf5;
    --rotateX: -90deg;
}

.loader .box>div:nth-child(4) {
    background: #dbe3f4;
    top: 0;
    left: 0;
    --translateZ: calc(var(--size) * 3 * -1);
}

@keyframes box1 {

    0%,
    50% {
        transform: translate(100%, 0);
    }

    100% {
        transform: translate(200%, 0);
    }
}

@keyframes box2 {
    0% {
        transform: translate(0, 100%);
    }

    50% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(100%, 0);
    }
}

@keyframes box3 {

    0%,
    50% {
        transform: translate(100%, 100%);
    }

    100% {
        transform: translate(0, 100%);
    }
}

@keyframes box4 {
    0% {
        transform: translate(200%, 0);
    }

    50% {
        transform: translate(200%, 100%);
    }

    100% {
        transform: translate(100%, 100%);
    }
}

div {
    margin: 0 auto;
}

.div1 {
    width: 300px;
    height: 50px;
    padding: 0 0 0 50px;
    margin-top: 200px;
    text-align: center;
}

.error {
    display: none;
}

.div1 p {
    float: left;
    font-size: 20px;
    padding-right: 16px;
    animation-name: myani;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease;
    animation-direction: alternate;
    animation-fill-mode: both;
}

.s1 {
    animation-delay: 0.2s;
}

.s2 {
    animation-delay: 0.4s;
}

.s3 {
    animation-delay: 0.6s;
}

.s4 {
    animation-delay: 0.8s;
}

.s5 {
    animation-delay: 1s;
}

.s6 {
    animation-delay: 1.2s;
}

.s7 {
    animation-delay: 1.4s;
}

.s8 {
    animation-delay: 1.6s;
}

@keyframes myani {

    0%,
    100% {
        padding-bottom: 0;
    }

    50% {
        transform: translateY(-50px);
    }
}
</style>