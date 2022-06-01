/**  水印添加方法  */

let setWatermark = (str1, str2, height) => {
    let id = "watermark";

    if (document.getElementById(id) !== null) {
        document.querySelector(".table").removeChild(document.getElementById(id));
    }

    let can = document.createElement("canvas");
    // 设置canvas画布大小
    can.width = 400;
    can.height = 250;

    let cans = can.getContext("2d");
    cans.rotate(-20 * Math.PI / 180); // 水印旋转角度
    cans.font = "18px Vedana";
    cans.fillStyle = "#5a5a5a";
    cans.textAlign = "center";
    cans.textBaseline = "Middle";
    cans.fillText(str1, can.width / 2, can.height); // 水印在画布的位置x，y轴
    cans.fillText(str2, can.width / 2, can.height + 25);

    let div = document.createElement("div");
    div.id = id;
    div.style.pointerEvents = "none";
    div.style.top = "-40px";
    div.style.left = "-100px";
    div.style.opacity = "0.25";
    div.style.position = "absolute";
    div.style.zIndex = "99";
    div.style.width = "1266px";
    div.style.height = height + 40 + "px";
    div.style.background = "url(" + can.toDataURL("image/png") + ") left top repeat";
    document.querySelector(".table").appendChild(div);
    return id;
};

// 添加水印方法
export const setWaterMark = (str1, str2, height) => {
    let id = setWatermark(str1, str2, height);
    if (document.getElementById(id) === null) {
        id = setWatermark(str1, str2, height);
    }
};

// 移除水印方法
export const removeWatermark = () => {
    let id = "1.23452384164.123412415";
    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id));
    }
};