function setcookie(b, d, a) {
  var c = window.location.host;
  c = c.replace("http://", "");
  c = c.replace("www", "");
  if (!c) {
    c = ".mia.c"
  }
  document.cookie = b + "=" + d + ";path=/;domain=" + c + ";expires=" + a + ";"
}
function getcookie(b) {
  var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
  if (a != null) {
    return unescape(a[2])
  } else {
    return ""
  }
}
var str = location.href;
var re = /from=([\w_\-\.\\\+\%]*)/i;
var rs = str.match(re);
var curUrl = window.location.href;
var from = curUrl.indexOf("from");
var sugs = {},
sugsArray = [];
var parms = [];
var addons = "";
var origin = curUrl;
var nextUrl = "";
if (curUrl.indexOf("?") > 0) {
  if (curUrl.indexOf("#") > 0) {
    sugsArray = curUrl.split("?")[1].split("#")[0].split("&");
    addons = "#" + curUrl.split("#")[1]
  } else {
    sugsArray = curUrl.split("?")[1].split("&")
  }
  for (var i = 0; i < sugsArray.length; i++) {
    if (sugsArray[i].indexOf("=") != -1) {
      var k = sugsArray[i].substr(0, sugsArray[i].indexOf("="));
      var v = sugsArray[i].substr(sugsArray[i].indexOf("=") + 1);
      sugs[k] = v
    }
  }
  origin = curUrl.split("?")[0]
} else {
  if (curUrl.indexOf("#") > 0) {
    addons = "#" + curUrl.split("#")[1];
    origin = curUrl.split("#")[0]
  }
}
if (from != -1) {
  var date = new Date();
  if (rs && sugs.from != "") {
    var from_type = sugs.from.substr(0, 2);
    if (from_type == "2c") {
      var expireDays = 14
    } else {
      var expireDays = 1
    }
    date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000);
    setcookie("sitefrom", sugs.from, date.toGMTString());
    var webunion_stfrom = ["duomai", "yiqifa", "cn360", "linktech", "chanet", "chanetwap", "zhituicps", "weiyicps", "1c00220000034200131054f19455ceb0a", "shande", "1c0022310003a4001c94551153736ca04", "547bd910145f3", "3c00228000042a003fbb553daa3592fc2", "2c0012400003ce001cbf5523ab1fcacbe"];
    if (sugs.from == "2c0012400003ce001cbf5523ab1fcacbe") {
      sugs.wu_source = "bdmy";
      sugs.wu_channel = "cps";
      sugs.wu_cid = "";
      sugs.wu_wi = "";
      if (sugs.baidu_token != "" && typeof(sugs.baidu_token) != "undefined") {
        sugs.wu_wi = sugs.baidu_token
      }
    }
    if (sugs.from && webunion_stfrom.indexOf(sugs.from) != -1) {
      var date = new Date();
      var expireDays = 1;
      date.setTime(date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000));
      var myreg = /^[a-zA-Z0-9\_\=\^\-\|]+$/;
      if (sugs.wu_source != "" && typeof(sugs.wu_source) != "undefined" && myreg.test(sugs.wu_source)) {
        setcookie("web_union_source", sugs.wu_source, date.toGMTString())
      }
      if (sugs.wu_channel != "" && typeof(sugs.wu_channel) != "undefined" && myreg.test(sugs.wu_channel)) {
        setcookie("web_union_channel", sugs.wu_channel, date.toGMTString())
      }
      if (sugs.wu_cid != "" && typeof(sugs.wu_cid) != "undefined" && myreg.test(sugs.wu_cid)) {
        setcookie("web_union_cid", sugs.wu_cid, date.toGMTString())
      }
      if (sugs.wu_wi != "" && typeof(sugs.wu_wi) != "undefined" && myreg.test(sugs.wu_wi)) {
        setcookie("web_union_wi", sugs.wu_wi, date.toGMTString())
      }
      if (sugs.union_uid != "" && typeof(sugs.union_uid) != "undefined" && myreg.test(sugs.union_uid)) {
        setcookie("union_uid", sugs.union_uid, date.toGMTString())
      }
      if (sugs.union_planid != "" && typeof(sugs.union_planid) != "undefined" && myreg.test(sugs.union_planid)) {
        setcookie("union_planid", sugs.union_planid, date.toGMTString())
      }
    }
  }
  delete sugs.from;
  for (i in sugs) {
    nextUrl += "&" + i + "=" + sugs[i]
  }
  if (nextUrl.length > 0) {
    nextUrl = "?" + nextUrl.substr(1)
  } else {
    nextUrl = origin
  }
  if (addons != "") {
    nextUrl = nextUrl + addons
  }
} else {
  var last_url = document.referrer;
  if (last_url != "") {
    var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    var url = urlReg.exec(last_url);
    var domain = url[0];
    var keyval = last_url.substr(last_url.indexOf("?") + 1, last_url.length);
    var arr = keyval.split("&");
    var miauuid = getcookie("miauuid");
    var sitefrom = getcookie("sitefrom");
    var siteforms = ["2c009307000452003fe3557fb8185917d", "2c009309000453003fe4557fbbe1d65f8", "2c009310000454003fe5557fbc3331bb2", "2c009311000455003fe6557fbc8340b5a", "2c009312000456003fe7557fbd2534d53", "2c009313000457003fe8557fbd9b32e30"];
    var domain_names = ["www.baidu.com", "m.baidu.com", "www.haosou.com", "m.haosou.com", "www.sogou.com", "m.sogou.com", "wap.sogou.com", "cn.bing.com", "m.bing.com", "www.bing.com", "www.google.com", "m.sm.cn"];
    var dataInfo = [];
    for (var i = 0; i < arr.length; i++) {
      var splitInfo = arr[i].split("=");
      var key = splitInfo[0];
      var val = splitInfo[1];
      k;
      dataInfo[key] = val
    }
    if (domain_names.indexOf(domain) != -1) {
      if (siteforms.indexOf(sitefrom) != -1 || sitefrom == "") {
        var searchWord = "";
        var cookieval = "";
        var never = new Date();
        never.setTime(never.getTime() + 3600 * 24 * 14 * 1000);
        switch (domain) {
        case "www.baidu.com":
          cookieval = "2c009307000452003fe3557fb8185917d";
          searchWord = dataInfo.wd;
          break;
        case "m.baidu.com":
          cookieval = "2c009307000452003fe3557fb8185917d";
          searchWord = dataInfo.word;
          break;
        case "www.haosou.com":
          cookieval = "2c009309000453003fe4557fbbe1d65f8";
          searchWord = dataInfo.q;
          break;
        case "m.haosou.com":
          cookieval = "2c009309000453003fe4557fbbe1d65f8";
          searchWord = dataInfo.q;
          break;
        case "www.sogou.com":
          cookieval = "2c009310000454003fe5557fbc3331bb2";
          searchWord = dataInfo.query;
          break;
        case "m.sogou.com":
          cookieval = "2c009310000454003fe5557fbc3331bb2";
          searchWord = dataInfo.keyword;
          break;
        case "wap.sogou.com":
          cookieval = "2c009310000454003fe5557fbc3331bb2";
          searchWord = dataInfo.keyword;
          break;
        case "cn.bing.com":
          cookieval = "2c009311000455003fe6557fbc8340b5a";
          searchWord = dataInfo.q;
          break;
        case "www.google.com":
          cookieval = "2c009312000456003fe7557fbd2534d53";
          searchWord = dataInfo.q;
          break;
        case "sm.cn":
          cookieval = "2c009313000457003fe8557fbd9b32e30";
          searchWord = dataInfo.q;
          break;
        default:
          break
        }
        setcookie("sitefrom", cookieval, never.toGMTString())
      }
    }
  }
}
var flag = false;
var slideuptime;
var poptime;
var pop = $("#shop_cart");
var mouseenterflag = false;
var oh;
$(document).ready(function() {
  //logininfo();
  function a() {
    ajaxReq()
  }
  $(".ShoppingCart").hover(function(b) {
    b.stopPropagation();
    mouseenterflag = true;
    ajaxReq(mouseenterflag);
    oh = true
  },
  function(b) {
    b.stopPropagation();
    var c;
    if ($("#cart_num").text() != 0) {
      c = $("#shop_cart")
    } else {
      c = $(".NoProducts")
    }
    slideuptime = setTimeout(function() {
      c.slideUp(400)
    },
    300);
    oh = false
  });
  pop.hover(function() {
    clearTimeout(slideuptime);
    clearTimeout(poptime);
    clearTimeout(mouseenterflag)
  },
  function() {
    poptime = setTimeout(function() {
      if (!oh) {
        pop.slideUp(400)
      }
    },
    200)
  });
  $("#cartpop").delegate("#reflash", "click",
  function(b) {
    b.preventDefault();
    ajaxReq()
  });
  $("#cart_num_box").click(function() {
    window.location.href = "/cart"
  });
  $("#shop_cart").delegate(".close", "click",
  function(b) {
    b.preventDefault();
    var c = $(this);
    $.ajax({
      url: "/instant/cart/removeCartItem",
      type: "POST",
      data: "row_id=" + c.attr("row_id"),
      cache: false,
      dataType: "json",
      success: function(d) {
        c.parent().fadeOut(400,
        function() {
          c.parents("tr").remove();
          genHtml(d)
        });
        if (d != null && typeof(d.row_id) != "undefined") {
          $("#cart_num").text(d.total_num)
        } else {
          $("#cart_num").text("0")
        }
      }
    })
  });
  $(".pd").mouseover(function() {
    var c = $(this);
    c.addClass("currentHOver").find(".pullDownCon").show();
    var b = $(this).index();
    if (b == 2) {
      c.find(".arrow").css({
        left: "8px"
      })
    }
    if (b == 3) {
      c.find(".arrow").css({
        left: "50px",
        top: "19px"
      })
    }
  }).mouseout(function() {
    var c = $(this);
    c.removeClass("currentHOver").find(".pullDownCon").hide();
    var b = $(this).index();
    if (b == 2) {
      c.find(".arrow").css({
        left: "10px"
      })
    }
    if (b == 3) {
      c.find(".arrow").css({
        left: "50px",
        top: "16px"
      })
    }
  });
  hpop()
});
ajaxReq = function(a) {
  $.ajax({
    url: "/instant/cart/getCartContents",
    type: "POST",
    dataType: "json",
    success: function(b) {
      if (typeof(b.row_id) != "undefined") {
        genHtml(b);
        $("#shop_cart").slideDown(400,
        function() {
          flag = true
        });
        if (typeof(a) == "undefined") {
          setTimeout(function() {
            $("#shop_cart").slideUp(400)
          },
          6500)
        }
      } else {
        $(".NoProducts").slideDown(100,
        function() {})
      }
    },
    error: function() {
      $(".NoProducts").empty().text('<div class="loading">载入购物车失败，请手动<a href="#" id="reflash">刷新</a></div>').fadeOut(400)
    }
  })
};
genHtml = function(e) {
  if (typeof(e.row_id) != "undefined") {
    var a = '<div class="title">最近加入的商品</div><div class="content">';
    for (var c = 0; c < e.row_id.length; c++) {
      var d = "/item-" + e.sku[c] + ".html";
      var b = "";
      if (e.size[c] != "SINGLE") {
        b = e.size[c]
      }
      a += '<div class="block"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
      a += '<td width="17%" valign="top"><a href="' + d + '"><img src="' + e.img[c] + '" alt="' + e.name[c] + '" height="50" width="50"/></a></td><td width="61%" valign="middle"><div class="con"><a href="' + d + '">' + e.name[c] + "</a><br />" + b + '</div></td><td width="25%" valign="middle" class="tr"><span class="pink f14"><strong>&yen;' + e.cost[c] + "</strong></span>x" + e.num[c] + '<br><a href="javascript:void(0)" class="close pink" row_id="' + e.row_id[c] + '">删除</a></td></tr></table></div>'
    }
    if (e.more == 1) {
      a += '<p class="more"><a href="/cart" rel="nofollow">购物车内所有商品&gt;&gt;</a></p>'
    }
    a += '</div><div class="foot"><div class="settlement">共 <span class="pink ver blod">' + e.total_num + '</span> 件商品　共计<span class="pink ver f20">￥</span> <span class="pink ver blod f20">' + e.total_cost + '</span></div><div class="btn"><a href="/cart" class="btnSettlement" rel="nofollow" title="去购物车">去购物车结算</a></div>';
    $("#shop_cart").empty().append(a);
    $("#cart_num").text(e.total_num)
  } else {
    $("#cart_num").text(e.total_num);
    $("#shop_cart").hide()
  }
};
function logininfo() {
  $.ajax({
    url: "/login/info",
    type: "POST",
    context: document.body,
    dataType: "json",
    success: function(a) {
      if (a.cart_num > 0) {
        $("#cart_num").text(a.cart_num)
      }
      var b = a.is_login;
      if (b == 1) {
        var c = a.username;
        if (c.length > 8) {
          c = c.substr(0, 15) + ".."
        }
        $("#logined").text(c);
        $("#unlogin").hide();
        $(".logout").show()
      } else {
        $("#unlogin").show();
        $(".logout").hide()
      }
    }
  })
}
function hpop() {
  var b = $("#hpop .sp");
  var a = $("body").width();
  if (b.length > 0) {
    $("#hpop").css({
      height: "50px",
      width: a
    });
    b.css({
      width: a,
      height: "50px"
    });
    jQuery(document).ready(function(d) {
      if (d(".mainHeader").hasClass("pull")) {
        var c = new Image();
        if (b.attr("data-bimg")) {
          c.src = b.attr("data-bimg");
          d(c).load(function() {
            if (c.src) {
              var f = d('<span style="background-image:url(' + c.src + ');background-repeat:no-repeat;background-position:center top;position:relative;background-color:#ff5521" />');
              var e = d('<span id="closehpop"></span>');
              e.appendTo(f).css({
                position: "absolute",
                bottom: 3 + "px",
                left: (a - 1000) / 2 + 1000 - 80,
                color: "#000",
                display: "block",
                height: "40px",
                width: "60px",
                padding: "0 6px",
                "line-height": "20px"
              });
              d("body").delegate("#closehpop", "click",
              function(g) {
                g.preventDefault();
                f.hide()
              });
              f.css({
                width: a
              }).appendTo("#hpop .sp").eq(0).css({
                display: "block",
                height: "50px",
                position: "relative"
              }).animate({
                height: "545px"
              },
              400, "linear",
              function() {
                setTimeout(function() {
                  f.slideUp(400)
                },
                6000)
              })
            }
          })
        }
      }
    })
  }
};