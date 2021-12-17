if (location.search.split("?")[1] !== undefined) {
    if (location.search.split("?")[1].split("=")[0] === "from")
        sessionStorage.setItem("jw_from", "hduhelp");
    const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { "Authorization": "token " + location.search.split("?")[1].split("&")[0].split("=")[1] }
    };
    fetch("https://api.hduhelp.com/base/person/info", requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.parse(result).data.STAFFTYPE === "1") {
                localStorage.setItem("jw_student_file", JSON.stringify({
                    token: location.search.split("?")[1].split("&")[0].split("=")[1],
                    staffID: location.search.split("?")[1].split("&")[1].split("=")[1]
                }));
                if (sessionStorage.getItem("jw_from") && sessionStorage.getItem("jw_from") === "hduhelp") {
                    sessionStorage.removeItem("jw_from");
                    window.location.href = "https://edu.limkim.cn/student/infoShare";
                }
                else
                    window.location.href = "https://edu.limkim.cn/student";
            }
            else if (JSON.parse(result).data.STAFFTYPE === "2") {
                localStorage.setItem("jw_manager_file", JSON.stringify({
                    token: location.search.split("?")[1].split("&")[0].split("=")[1],
                    uname: location.search.split("?")[1].split("&")[1].split("=")[1]
                }));
                window.location.href = "https://edu.limkim.cn/manager";
            }
        }).catch(error => {
            alert(error);
        });
    return
}
if (localStorage.getItem("jw_student_file") !== null)
    return window.location.href = "https://edu.limkim.cn/student";
if (localStorage.getItem("jw_ent_file") !== null)
    return window.location.href = "https://edu.limkim.cn/company";
if (localStorage.getItem("jw_manager_file") !== null)
    return window.location.href = "https://edu.limkim.cn/manager";
window.location.href = "https://edu.limkim.cn/sign";