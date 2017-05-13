//默认弹出层注册送188，用户点击关闭或已经登录不弹出,默认15天有效期过

(function(window){

    var _device = (window.location.href.indexOf('m.mia.com') > -1 || window.location.href.indexOf('m.miabaobei.com') > -1) ? 'app' : 'pc';

    //物料地址
    var sImgPc = 'http://img.miabaobei.com/d1/p3/2016/06/08/79/29/792938fee4bd578909e69a7df29c1099523274335.png',
        sImgApp = 'http://img.miabaobei.com/d1/p3/2016/06/08/d6/06/d60659a61957c6fb5906ddb646932f57523503061.png',
        sImgPcKaTiao = 'http://img.miabaobei.com/d1/p3/2016/06/08/ab/c5/abc52541b53a4fd880f7f6366aad1950523708756.png';

    var pupop =  function($btn) {
        this.$btn = $btn || '';
        if (_device == 'app') {
            this.pop = $('<div id="bi-middle" class="app_down" style="display:none;width:100%;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);z-index:1010;text-align:center;max-width:640px;"><img src="'+ sImgApp +'" width="100%" alt=""><a  style="position:absolute;top:0;left:0;width:100%;height:100%;" href="javascript:;" class="btn" id="down_app"></a><a href="javascript:;" style="display:block;width:10%;height:12%;position:absolute;right:10.8%;top:20%;" id="close_ldy_tc"></a></div>').appendTo(document.body);
            this.mask = $('<div class="mask" style="display:none;width:100%;height:100%;top:0px;left:0px; position:fixed;background:rgba(0,0,0,.7);z-index:1005;"></div>').appendTo(document.body);
        } else {
            this.pop = $('<div style="display:none;width:702px;height:513px;left:50%;top:50%;margin:-285px 0 0 -351px; background:url('+ sImgPc +') no-repeat;position:fixed;z-index:1005;"><a style="display:block;width:100%;height:100%;position:absolute;top:0;left:0;background:url(about:blank)" href="/app.html" target="_blank" id="regist_ldy_tc"></a><a href="javascript:;" style="display:block;width:54px;height:54px;position:absolute;right:76px;top:103px;background:url(about:blank)" id="close_ldy_tc"></a></div>').appendTo(document.body);
            this.mask = $('<div class="mask" style="display:none;width:100%;height:100%;top:0px;left:0px;position:fixed;filter:Alpha(opacity=60);-moz-opacity: 0.6;opacity:0.6;background:#000000;z-index:1000;"></div>').appendTo(document.body);
            this.katiao = $('<div style="display:none;height:120px;width:100%;position:fixed;left:0;bottom:0;background:#000;opacity: 0.65;filter:alpha(opacity=50);z-index:100"></div><div style="display:none;position:fixed;bottom:0;left:50%;margin-left:-500px;width:1000px;height:122px;z-index:102;background:url('+ sImgPcKaTiao +') center top no-repeat;"><a style="display:block;width:41px;height:41px;position:absolute;left:50%;margin-left: 454px;top:5px;background: url(about:blank);" href="javascript:;" class="katiao_close"></a><a style="display:block;width:940px;height:100px;position:absolute;top:20px;left:50%;margin-left:-490px;background:url(about:blank)" href="/app.html" target="_blank" id="regist_katiao"></a></div>').appendTo(document.body);
        }
        this.init();
    };

    pupop.prototype = {
        init: function() {
            var that = this;
            var isNewUser = getcookie('username');
            var display = getcookie('display');
            var kt_display = getcookie('display_katiao');
            if (!isNewUser) {
                if (!display) {
                    that.show();
                    //ajax 
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        platform = 'wx' + platform;
                    }
                    $from = getcookie('sitefrom');
                    $.ajax({
                        url: '/ajaxdownload/index/'+$from,
                        type: 'get',
                        dataType: "json",
                        data: {},
                        success: function(results) {
                            switch (platform) {
                                case "android":
                                    $('.app_down .btn').attr('href', results.android_url);
                                    break;
                                case "ios":
                                    $('.app_down .btn').attr('href', setDownLink(results.ios_url).wap);
                                    break;
                                case "wxandroid":
                                    $('.app_down .btn').attr('href', results.android_wx);
                                    break;
                                case "wxios":
                                    $('.app_down .btn').attr('href', setDownLink(results.ios_wx).wap);
                                    break;
                                default:
                            }
                        }
                    });

                } else {
                    if (_device == 'pc' && !kt_display) {
                        this.getImg();
                        this.katiao.show();
                    };
                }
            }
            $('#close_ldy_tc,#close_app').on('click', function() {
                var date = new Date();
                date.setTime(date.getTime() + 15 * 24 * 3600 * 1000);
                setcookie("display", '1', date.toGMTString());
                that.hide();
            });
            $('#regist_ldy_tc').on('click', function() {
                var prevhref = window.location.href;
                var date = new Date();
                setcookie("display", '1', date.toGMTString());
                // window.location.href = 'http://local.naiya.cc/register?url=' + encodeURIComponent(prevhref);
            });
            if (_device == 'app') {
                //ajax获取链接在 apptips_top_new.js内
            };
            $('#down_app, #bi-middle #down_app').on('click', function() {
                var date = new Date();
                setcookie("display", '1', date.toGMTString());
            });
            $('#regist_katiao').on('click', function() {
                var prevhref = window.location.href;
                setcookie("display_katiao", '1');
                // window.location.href = 'http://local.naiya.cc/register?url=' + encodeURIComponent(prevhref);
            });
            $('.katiao_close').on('click', function() {
                that.katiao.hide();
                setcookie("display_katiao", '1');
            });

        },
        show: function() {
            var _this = this;
            this.pop.css('display', 'block');
            this.mask.css('display', 'block');
            document.body.addEventListener('touchmove', _this.stop, false);
        },
        hide: function() {
            var _this = this;
            this.pop.hide();
            this.mask.hide();
            document.body.removeEventListener('touchmove', _this.stop, false);
        },
        getImg: function() {
            //获取pc底部卡条的二维码图片
            var sitefrom = getcookie('sitefrom'),
                $img = $('#katiao_code');
            $.ajax({
                url: '/ajaxdownload/codeimg',
                type: 'get',
                data: {
                    code: sitefrom
                },
                dataType: 'json',
                success: function(data) {
                    if (!data) {
                        return false
                    };
                    $img.prop('src', data.codeimg);
                }
            });
        },
        stop: function(event) {
            event.preventDefault();
        }
    };

    //window.ldy_pupop = pupop;
    new pupop();

})(this);