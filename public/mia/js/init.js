$(document).ready(function() {
    $("#backToMobile").click(function(b) {
        setwm("mobile");
        var a = $(this).data("domain");
        if (!a) {
            a = "<?php echo MAIN_DOMAIN;?>"
        }
        window.location.href = "http://m." + a + "?device=m_web";
        b.preventDefault()
    })
});
var wom = getcookie("wom");
// if (wom == "") {
    // var p_url = location.pathname;
    // if (p_url == "/") {
        // p_url = ""
    // }
    // if (p_url == "/dutyfree.html") {
        // p_url = "/app/dutyfree"
    // }
    // if (p_url == "/formulas.html") {
        // p_url = "/formulas"
    // }
    // platform = identifyUA();
    // if (platform != "" && (platform == "web" || platform == "mobile")) {
        // setwm(platform);
        // var url = platform == "web" ? "http://www.miabaobei.com": "http://m.miabaobei.com";
        // if (url == "http://m.miabaobei.com" || url == "http://m.mia.com") {
            // window.location.href = url + p_url + "?device=a_web"
        // } else {
            // window.location.href = nextUrl
        // }
    // }
} else {
    var c_url = location.hostname;
    if (wom != "web" && wom != "mobile") {
        delcookie("wom");
        window.location.href = c_url
    }
    platform = identifyUA();
    if (platform != "" && platform == "mobile" && wom != "web") {
        var p_url = location.pathname;
        if (p_url == "/") {
            p_url = ""
        }
        if (p_url == "/dutyfree.html") {
            p_url = "/app/dutyfree"
        }
        if (p_url == "/formulas.html") {
            p_url = "/formulas"
        }
        setwm(platform);
        var url = platform == "web" ? "http://" + c_url: "http://m." + c_url.substring(4, 20);
        if (url == "http://m.miabaobei.com" || url == "http://m.mia.com") {
            window.location.href = url + p_url + "?device=a_web"
        } else {
            window.location.href = url + p_url
        }
    }
}

function identifyUA() {
    var b = navigator.userAgent.toLowerCase();
    var a = "";
    if (b == null || b == "") {
        a = "web"
    } else {
        if (b.indexOf("android") != -1) {
            a = "mobile"
        } else {
            if (b.indexOf("ios") != -1 || b.indexOf("iphone") != -1) {
                a = "mobile"
            } else {
                if (b.indexOf("ipad") != -1) {
                    a = "web"
                } else {
                    if (b.indexOf("windows phone") != -1) {
                        a = "web"
                    } else {
                        a = "web"
                    }
                }
            }
        }
    }
    return a
}
function setcookie(b, d, a) {
    var c = window.location.host;
    c = c.replace("http://", "");
    c = c.replace("www", "");
    if (!c) {
        c = ".miabaobei.com"
    }
    document.cookie = b + "=" + d + ";path=/;domain=" + c + ";expires=" + a + ";"
}
function setwm(a) {
    if (a || a != "") {
        var b = new Date();
        var c = 30;
        b.setTime(b.setTime(b.getTime() + c * 24 * 3600 * 1000));
        setcookie("wom", a, b.toGMTString())
    }
    return a
}
function getcookie(b) {
    var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
    if (a != null) {
        return unescape(a[2])
    } else {
        return ""
    }
}
function delcookie(a) {
    var c = new Date();
    var b = getcookie(a);
    if (b != "") {
        document.cookie = a + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=.miabaobei.com"
    }
};