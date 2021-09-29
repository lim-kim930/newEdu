function windowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
}
window.onpageshow = window.onload = window.onresize = function () {
    var wh = windowHeight();
    if (wh > 915)
        document.querySelector(".el-container").style.height = wh - 61 + "px";
}
