//csrf
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')
    }
});

var $btm = $("#cashier_part");
if ($btm.length > 0) {
    var _btmheight = $btm.height();
    var winH = $(window).height();
    var _btmtop = $btm.position().top;
    var warehouse_id = 0;
    var popNotShow = 0
}
function scrollwrap(a) {
    var c = $("#cdspscroll");
    var b = c.find("li").length;
    var d = c.data("current") || 1;
    var e = parseInt(c.css("left"));
    if (a == "left") {
        if (d == 1) {
            return
        }
        d = d - 4;
        e = e < -960 ? e + 960 : 0;
        c.css("left", e + "px");
        d = d < 1 ? 1 : d;
        c.data("current", d)
    } else {
        if (d == b - 4) {
            return
        }
        d = d + 4;
        if (d > b - 4 || d == b - 4) {
            d = b - 4
        }
        c.css("left", e - 960 + "px");
        c.data("current", d)
    }
}
$(function() {
    $("#arrowr").click(function() {
        scrollwrap("right")
    });
    $("#arrowl").click(function() {
        scrollwrap("left")
    })
});
function showGiftPop(a) {
    var b = {
        init: function() {
            this.$mask = $(".popBg");
            this.$content = $("#pop_gift")
        },
        show: function() {
            this.$mask.show();
            var c = this.$content.width();
            var d = this.$content.height();
            this.$content.css({
                "margin-top": -d / 2 + "px",
                "margin-left": -c / 2 + "px"
            }).show()
        },
        hide: function() {
            this.$mask.hide();
            this.$content.hide()
        },
        setTxt: function(c) {
            this.$content.find(".pop_txt").text(c)
        }
    };
    b.init();
    b.setTxt(a);
    b.show()
}
$(document).ready(function() {
    var a = {
        init: function() {
            this.$mask = $(".popBg");
            this.$shui = $(".popShui")
        },
        show: function() {
            this.$mask.show();
            var b = this.$shui.width();
            var c = this.$shui.height();
            this.$shui.css({
                "margin-top": -c / 2 + "px",
                "margin-left": -b / 2 + "px"
            }).show()
        },
        hide: function() {
            this.$mask.hide();
            this.$shui.hide()
        }
    };
    a.init();
    $tipsDelay = 5500;
    _min = 1;
    _max = 99;
    $(".cashier_part").delegate(".btnJieSuan", "click",
    function(b) {
        warehouse_id = $(this).attr("data-warehouse");
        if ($("#taxes_price_" + warehouse_id).length) {
            taxes_price = parseFloat($("#taxes_price_" + warehouse_id).text().replace("¥", ""))
        }
        formSubmit(b);
        b.preventDefault()
    });
    $("body").delegate("#shopping_cart .selectBonus", "click",
    function(b) {
        b.preventDefault();
        var f = "";
        var h = $(this);
        var g = h.attr("data-pid");
        var j = $(".hidden_gift_list_" + g + " .items");
        if (j.length > 0) {
            f = '<div id="popWin" class="bounsPop"><div class="bounslist" style="height: 230px;overflow-y: auto;"><table><tbody>';
            var k = [];
            j.each(function() {
                var m = $(this);
                var l = {
                    pid: g,
                    sku: m.find(".sku").text(),
                    name: m.find(".name").text(),
                    pic: m.find(".pic").text(),
                    num: m.find(".num").text()
                };
                k.push(l)
            });
            for (var e = 0; e < k.length; e++) {
                var d = k[e];
                f += '<tr><td class="ck"><input type="radio" name="gifts_' + d.pid + '" value="' + d.sku + '"></td><td class="img"><img src="' + d.pic + '" alt=""></td><td><p>' + d.name + "<br>" + d.num + " 件</p></td></tr>"
            }
            f += '</tbody></table></div><div class="opline"><a href="#" class="okdiabled" data-pid="' + g + '">确定</a><a href="#" class="cancel">取消</a></div></div>';
            $("#dialog").html(f);
            $("#dialog").dialog({
                autoOpen: true,
                closeOnEscape: true,
                modal: true,
                width: 450,
                draggable: false,
                resizable: false,
                position: "center"
            }).dialog("open")
        } else {
            cartTips(b, "err", "已赠完")
        }
        return false;
        var c = {
            pid: h.closest(".cl_tit").data("promotion"),
            warehouse_id: h.parents(".c_list").attr("data-warehouse_id")
        };
        $.ajax({
            url: "/instant/cart/getGifts",
            type: "POST",
            dataType: "json",
            data: c,
            success: function(m) {
                if (m.code == 1) {
                    f = '<div id="popWin" class="bounsPop"><div class="bounslist" style="height: 230px;overflow-y: auto;"><table><tbody>';
                    for (var l = 0; l < m.bouns.length; l++) {
                        if (m.bouns[l]["status"] == 1) {
                            f += '<tr><td class="ck"><input type="radio" name="gifts_' + m.bouns[l].pid + '" value="' + m.bouns[l].sku + '"></td><td class="img"><img src="' + m.bouns[l].img + '" alt=""></td><td><p>' + m.bouns[l].name + "<br>" + m.bouns[l].num + " 件</p></td></tr>"
                        }
                    }
                    f += '</tbody></table></div><div class="opline"><a href="#" class="okdiabled" data-pid="' + m.bouns[0].pid + '" data-rowid="' + m.bouns[0].rowid + '" data-warehouse_id="' + m.warehouse_id + '">确定</a><a href="#" class="cancel">取消</a></div></div>';
                    $("#dialog").html(f);
                    $("#dialog").dialog({
                        autoOpen: true,
                        closeOnEscape: true,
                        modal: true,
                        width: 450,
                        draggable: false,
                        resizable: false,
                        position: "center"
                    }).dialog("open")
                } else {
                    cartTips(b, "err", m.msg)
                }
            }
        })
    });
    $("body").delegate('.bounsPop input[type="radio"]', "click",
    function(b) {
        $(".bounsPop .okdiabled").removeClass("okdiabled").addClass("ok")
    });
    $("body").delegate(".bounsPop .okdiabled", "click",
    function(b) {
        b.preventDefault();
        cartTips(b, "err", "请选择赠品")
    });
    $("body").delegate(".bounsPop .ok", "click",
    function(c) {
        c.preventDefault();
        var d = $(this);
        var b = {
            pid: d.data("pid"),
            product: $('.bounsPop input[type="radio"]:checked').val(),
            row_id: d.data("rowid"),
            warehouse_id: d.data("warehouse_id")
        };
        $.ajax({
            url: "/instant/cart/chooseGift",
            type: "POST",
            dataType: "json",
            data: b,
            success: function(e) {
                if (e.code == 1) {
                    w_p = $('#shopping_cart .cl_tit[data-promotion="' + e.pid + '"]');
                    w_p.find(".cl_words > .selectBonus").hide();
                    if (w_p.find(".cl_words_zp").length) {
                        w_p.find(".cl_words_zp").html("<em>[赠品]</em>" + e.gift_name + '<a href="javascript:void(0)" class="cart_zp_btn btn_xzzp selectBonus" data-pid="' + e.pid + '">重新选择</a>')
                    } else {
                        zp = '<span class="cl_words_zp" >';
                        zp += "<em>[赠品]</em>" + e.gift_name;
                        zp += '<a class="cart_zp_btn btn_xzzp selectBonus" href="javascript:void(0)" data-pid="' + e.pid + '">重新选择</a>';
                        zp += "</span>";
                        w_p.find(".cl_words").append(zp)
                    }
                    $("#dialog").dialog("close")
                } else {
                    cartTips(c, "err", e.msg)
                }
            }
        })
    });
    $("body").delegate(".bounsPop .cancel", "click",
    function(b) {
        b.preventDefault();
        $("#dialog").dialog("close")
    });
    $("#shopping_cart .modity").click(function(e) {
        e.preventDefault();
        var b = $(e.target).offset().top + 27,
        d = $(e.target).offset().left - 264,
        l;
        var m = $(this);
        var h = m.attr("data-opid");
        var p = m.closest("tr");
        var c = m.closest(".gooditem").find(".mck").val();
        var n = $(".hidden_promotion_list_" + c + " .item");
        if (n.length > 0) {
            var k = [];
            for (var j = 0; j < n.length; j++) {
                var f = n.eq(j);
                var o = {
                    id: f.find(".promotion_id").text(),
                    title: f.find(".promotion_title").text()
                };
                k.push(o)
            }
            var l = '<span class="arr"></span><div class="conn"><p class="promotionP"><b>活动优惠：</b><select name="promotionSelector" id="promotionSelector">';
            for (var j = 0; j < k.length; j++) {
                if (k[j].id == h) {
                    l += '<option selected value="' + k[j].id + '">' + k[j].title + "</option>"
                } else {
                    l += '<option value="' + k[j].id + '">' + k[j].title + "</option>"
                }
            }
            l += '</select></p></div><div class="opline"><a href="#" class="ok" data-opid="' + h + '" data-rowid="' + c + '" >确定</a><a href="#" class="cancel">取消</a></div>';
            $("#promotionLists").show().css({
                top: b,
                left: d
            }).show().empty().html(l)
        } else {
            cartTips(e, "err", "暂无优惠")
        }
        return false;
        var g = {
            row_id: c
        };
        if (m.closest(".cl_con").data("pid")) {
            g.opid = m.closest(".cl_con").data("pid")
        } else {
            g.opid = 0
        }
        $.ajax({
            url: "/instant/cart/getPromotions",
            type: "POST",
            dataType: "json",
            data: g,
            success: function(s) {
                if (s.code == 1) {
                    var r = '<span class="arr"></span><div class="conn"><p class="promotionP"><b>活动优惠：</b><select name="promotionSelector" id="promotionSelector">';
                    for (var q = 0; q < s.data.length; q++) {
                        if (s.data[q].id == g.opid) {
                            r += '<option selected value="' + s.data[q].id + '">' + s.data[q].title + "</option>"
                        } else {
                            r += '<option value="' + s.data[q].id + '">' + s.data[q].title + "</option>"
                        }
                    }
                    r += '</select></p></div><div class="opline"><a href="#" class="ok" data-opid="' + g.opid + '" data-rowid="' + g.row_id + '" >确定</a><a href="#" class="cancel">取消</a></div>';
                    $("#promotionLists").show().css({
                        top: b,
                        left: d
                    }).show().empty().html(r)
                } else {
                    cartTips(e, "err", s.msg)
                }
            }
        })
    });
    $("body").delegate("#promotionLists .ok", "click",
    function(c) {
        c.preventDefault();
        var d = $(this);
        var b = {
            pid: $("#promotionSelector").val(),
            row_id: d.data("rowid"),
            opid: d.data("opid")
        };
        if (b.pid != b.opid) {
            jQuery.ajax({
                url: "/instant/cart/getPromotionInfoByParams",
                type: "POST",
                dataType: "json",
                data: b,
                success: function(j) {
                    if (j.code == 1) {
                        return window.location.reload();
                        var k = {
                            pid: j.pid,
                            pname: j.pname,
                            opid: b.opid,
                            active: j.active,
                            type: j.gift,
                            rowid: b.row_id,
                            gift: j.gift,
                            diff: j.diff
                        };
                        var h;
                        var g = $('input[name="productcheck"]').filter('[value="' + b.row_id + '"]').closest(".gooditem");
                        if (j.pid != 0) {
                            if ($(".cl_con[data-pid=" + j.pid + "]").length > 0) {
                                var f = g.clone(true);
                                $(".cl_con[data-pid=" + j.pid + "]").find(".cl_items").append(f)
                            } else {
                                $(".cl_con[data-pid=" + k.pid + "]").find(".cl_tit").remove();
                                f = g.clone(true);
                                h = '<div class="cl_con" data-pid="' + k.pid + '">';
                                h += '<div class="cl_tit">';
                                h += '<div class="cl_mck"><input class="mck" type="checkbox" value="0"';
                                if ($(".cl_con[data-pid=" + k.opid + "]").find(".cl_mck .mck").prop("checked")) {
                                    h += " checked "
                                }
                                h += "></div>";
                                h += '<div class="cl_tag"><span>' + j.ptag + "</span></div>";
                                h += '<div class="cl_words">' + j.pname + "</span></div>";
                                h += "</div>";
                                h += '<div class="cl_items"></div></div>';
                                $(".c_list").append(h);
                                $(".cl_con[data-pid=" + j.pid + "]").find(".cl_items").append(f)
                            }
                        } else {
                            var f = g.clone(true);
                            if ($(".cl_con[data-pid=" + k.pid + "]").find(".gooditem").length < 1) {
                                h = '<div class="cl_con" data-pid="' + k.pid + '">';
                                h += '<div class="cl_tit">';
                                h += '<div class="cl_mck"><input class="mck" type="checkbox" value="0"';
                                if ($(".cl_con[data-pid=" + k.opid + "]").find(".cl_mck .mck").prop("checked")) {
                                    h += " checked "
                                }
                                h += "></div>";
                                h += '<div class="cl_words"><span>1</span>件商品</div>';
                                h += "</div>";
                                h += '<div class="cl_items"></div></div>';
                                $(".c_list").append(h)
                            }
                            $(".cl_con[data-pid=" + k.pid + "]").find(".cl_items").append(f);
                            g.remove()
                        }
                        var e = {
                            row_id: b.row_id,
                            num: Math.abs($('input[name="productcheck"][value="' + b.row_id + '"]').closest(".gooditem").find(".dp_num").val()),
                            opid: j.pid
                        };
                        c.target = $(c.target).parent(".num_box");
                        g.remove();
                        if ($(".cl_con[data-pid=" + k.opid + "]").find(".gooditem").length == 0) {
                            $(".cl_con[data-pid=" + k.opid + "]").remove();
                            changeTotal(c)
                        } else {
                            changePromotion(k, c)
                        }
                        changeNum($('input[name="productcheck"][value="' + e.row_id + '"]').closest(".gooditem").find(".dp_num"), e);
                        addPromotionInfo(k);
                        $("#promotionLists").hide()
                    } else {
                        cartTips(c, "err", j.msg)
                    }
                }
            })
        } else {
            $("#promotionLists").hide()
        }
    });
    $("body").delegate("#promotionLists .cancel", "click",
    function(b) {
        b.preventDefault();
        $("#promotionLists").hide()
    });
    changeBtmFixed();
    $(window).on("scroll",
    function() {
        changeBtmFixed()
    });
    $("#shopping_cart .delete").confirm({
        msg: "确定要删除该商品么？",
        modal: true,
        onOK: function(f) {
            var d = $(f.target);
            var c = [];
            c[0] = d.closest(".gooditem").find(".mck").val();
            opid = d.closest(".cl_con").data("pid");
            var b = {
                target: f,
                rowid: c,
                opid: opid
            };
            partDelete(b)
        },
        onCancel: function() {}
    });
    $("#shopping_cart .dp_jia").click(function(b) {
        b.preventDefault();
        var f = $(this);
        var j = f.closest(".it_num").find(".dp_num");
        var e = Math.abs(parseInt(j.val()));
        var g = f.data("max");
        e++;
        count = 1;
        if (g && e > g) {
            cartbehindTips(b, "err", "超出最大购买限制");
            return true
        }
        if (e > 99) {
            cartTips(b, "err", "商品数量必须大于1同时小于99");
            return true
        }
        var c = f.closest(".gooditem").find(".it_mck .mck").attr("cart-sku");
        var d = j.attr("warehouse_id");
        var k = f.closest(".gooditem").find(".it_size").text();
        if (!k) {
            k = "SINGLE"
        }
        var h = {
            id: c,
            count: count,
            num: e,
            size: k,
            warehouse_id: parseInt(d),
            opid: f.closest(".cl_con").data("pid")
        };
        if (!f.closest(".cl_con").data("pid")) {
            h.opid = 0
        }
        changeNum(j, h, b)
    });
    $("#shopping_cart #cart_deduct").click(function(g) {
        g.preventDefault();
        var j = $(this);
        var e = j.closest(".it_num").find(".dp_num");
        var c = Math.abs(parseInt(e.val()));
        c--;
        count = -1;
        if (c < 1) {
            cartTips(g, "err", "商品数量必须大于1同时小于99");
            return true
        }
        var f = j.closest(".gooditem").find(".it_mck .mck").attr("cart-sku");
        var b = e.attr("warehouse_id");
        var d = j.closest(".gooditem").find(".it_size").text();
        if (!d) {
            d = "SINGLE"
        }
        var h = {
            id: f,
            count: count,
            num: c,
            size: d,
            warehouse_id: parseInt(b),
            opid: j.closest(".cl_con").data("pid")
        };
        if (!j.closest(".cl_con").data("pid")) {
            h.opid = 0
        }
        changeNum(e, h, g)
    });
    $("#combination").delegate(".addToCart", "click",
    function(c) {
        c.preventDefault();
        var b = $(this).data("id");
        addToCart(b, c)
    });
    $(".removeAll").confirm({
        msg: "确定要删除已选中商品吗？",
        modal: true,
        before: function(b) {
            var c = $(b.target);
            if ($(".c_list").find('input[name="productcheck"]').length == 0) {
                cartTips(b, "err", "请选择要删除的商品！");
                return false
            }
        },
        onOK: function(d) {
            var f = $(d.target);
            var c = [];
            $(".c_list").find('input[name="productcheck"]').each(function() {
                if ($(this).prop("checked")) {
                    c.push($(this).val())
                }
            });
            var b = {
                target: d,
                rowid: c
            };
            partDelete(b)
        }
    });
    $(".removeFail").confirm({
        msg: "确定要删除失效的商品吗？",
        tit: "删除失效商品",
        before: function(b) {
            if ($(".gooditem[failrowid]").length == 0) {
                cartTips(b, "err", "没有已失效的商品！");
                return false
            }
        },
        onOK: function(d) {
            var f = $(d.target);
            var c = [];
            $("#shopping_cart .gooditem[failrowid]").each(function() {
                c.push($(this).attr("failrowid"))
            });
            var b = {
                target: d,
                rowid: c
            };
            partDelete(b)
        }
    });
    $(".batchAddMine").confirm({
        msg: "确定将选中的商品移入收藏夹吗？",
        tit: "移入收藏夹",
        before: function(b) {
            var c = $(b.target);
            if ($(".c_list").find('input[name="productcheck"]:checked').length == 0) {
                cartTips(b, "err", "请选择要移入收藏夹的商品！");
                return false
            }
        },
        onOK: function(f) {
            var g = $(f.target);
            var b = [];
            var d = [];
            $(".c_list").find('input[name="productcheck"]').each(function() {
                if ($(this).prop("checked")) {
                    b.push($(this).attr("cart-sku"));
                    d.push($(this).val())
                }
            });
            var c = {
                target: f,
                rowid: d
            };
            $.ajax({
                url: "/instant/collect/ajaxBatchAddMine",
                type: "POST",
                dataType: "json",
                data: {
                    item_id: b
                },
                success: function(e) {
                    if (e.res) {
                        partDelete(c)
                    }
                    cartTips(f, "err", e.data)
                }
            })
        }
    })
});
function formSubmit(b) {
    var a = [];
    $('input[name="productcheck"]').each(function() {
        if ($(this).prop("checked")) {
            a.push($(this).val())
        }
    });
    if (a.length < 1) {
        cartTips(b, "err", "请选择要结算的商品");
        return false
    }
    var c = 2000;
    $.ajax({
        url: "/user/cart/saveCartContents",
        cache: false,
        type: "POST",
        dataType: "json",
        data: {
            submit: 1,
            from: "pc"
        },
        beforeSend: function() {
            var d = $(".btnJieSuan");
            d.hide();
            $(".btnJieSuan").parent().append('<span id="submitloading" class="submitloading" style="float:right;height:59px;width:98px;font-size: 19.5px;">结算中</span>')
        },
        success: function(d) {
            popNotShow = 0;
            $(".btnJieSuan").show();
            $(".submitloading").remove();
            switch (d.code) {
            case 1:
                window.location.href = "/user/login";
                break;
            case 0:
                window.location.href = "/user/cartOrder/oid/"+d.oid;
                break;
            default:
                cartTips(b, "err", d.msg)
            }
        }
    })
}
function changePromotion(c, b) {
    var a = $("div.cl_con[data-pid=" + c.opid + "]").find(".cl_tag").length;
    if (a == 0) {
        getNoPromotionItemNum();
        changeTotal(b)
    } else {
        $.ajax({
            url: "/instant/cart/checkPromotions",
            type: "POST",
            dataType: "json",
            data: c,
            success: function(d) {
                if (d.code == 1) {
                    if (d.active != 1) {
                        var e = $("div.cl_con[data-pid=" + d.pid + "]");
                        e.find(".cl_tag").addClass("disabled_h");
                        e.find(".cl_words em").html("(还差" + d.diff + "元满足活动条件)");
                        e.find("div[data-gift=" + d.pid + "]").remove();
                        $("#shopping_cart div[data-fpid=" + d.pid + "]").remove()
                    } else {
                        var e = $("div.cl_con[data-pid=" + d.pid + "]");
                        e.find(".cl_tag").removeClass("disabled_h");
                        e.find(".cl_words span").remove();
                        if (d.gift == 1) {
                            if (e.find("div[data-gift=" + d.pid + "]").length == 0) {
                                html = '<div data-gift="' + d.pid + '"><a href="javascript:;" class="btn_xzzp selectBonus">选择赠品<i></i></a></div>';
                                e.find(".cl_tit").append(html)
                            }
                        }
                        if (d.gift == 2) {
                            if (e.find(".cl_mck .mck").prop("checked")) {
                                e.find(".cl_tag").removeClass("disabled_h");
                                if (e.find("div[data-gift=" + d.pid + "]").length == 0) {
                                    html = '<div data-gift="' + d.pid + '"><a href="javascript:;" class="btn_xzzp selectBonus">选择赠品<i></i></a></div>';
                                    e.find(".cl_tit").append(html)
                                }
                            } else {
                                e.find(".cl_tag").addClass("disabled_h");
                                e.find("div[data-gift=" + d.pid + "]").remove()
                            }
                        }
                    }
                    changeTotal(b)
                } else {
                    cartTips(b, "err", d.msg)
                }
            }
        })
    }
}
function addPromotionInfo(a) {
    makePromotion(a)
}
function makePromotion(c) {
    var b = $("#myShopPromotionArea .rim .l");
    th = $("thead[data-pid=" + c.pid + "]");
    if (c.pid != 0) {
        if (c.active == 1) {
            th.find(".diff").remove();
            if (b.find("p").length == 0) {
                b.html("<h6>已参与优惠活动</h6>")
            }
            var a;
            switch (c.gift) {
            case 0:
                if (b.find("p").filter('[data-pid="' + c.pid + '"]').length == 0) {
                    a = '<p data-pid="' + c.pid + '">' + c.pname + "</p>"
                }
                break;
            case 1:
                if (b.find("p").filter('[data-pid="' + c.pid + '"]').length == 0) {
                    a = '<p data-pid="' + c.pid + '">' + c.pname + '<a href="#" class="selectBonus">选赠品</a></p>'
                }
                break;
            case 2:
                if (b.find("p").filter('[data-rowid="' + c.row_id + '"]').length == 0 && c.row_id != undefined) {
                    a = '<p data-pid="' + c.pid + '" data-rowid="' + c.row_id + '">' + c.pname + '<a href="#" class="selectBonus">选赠品</a></p>'
                }
                break
            }
            b.append(a)
        } else {
            th.find(".promico").addClass("noEnough");
            if (typeof(c.diff) !== "undefined" && c.diff != 0) {
                th.find(".txt .diff").remove();
                th.find(".txt").append('<span class="diff">(还差' + c.diff + "元满足活动条件)</span>")
            }
            $("#myShopPromotionArea p[data-pid=" + c.pid + "]").remove()
        }
    }
}
function stockOver(a) {
    $("#dialog").html(a);
    $("#dialog").dialog({
        autoOpen: true,
        closeOnEscape: true,
        modal: true,
        width: 740,
        position: "center"
    }).dialog("open")
}
function ajaxLogin(a) {
    $.ajax({
        url: "/login/fast_login?jumpurl=" + a,
        success: function(b) {
            $("select.actionlist").hide();
            $("#dialog").html(b);
            $("#dialog").dialog({
                autoOpen: true,
                closeOnEscape: true,
                modal: true,
                width: 720,
                position: "center"
            }).dialog("open")
        }
    })
}
function addToCart(b, d) {
    var a = true;
    if (b == "" || typeof(b) == "undefined") {
        a = false;
        cartTips(d, "err", "请刷新重试")
    }
    if (a) {
        var c = {
            count: 1,
            size: "SINGLE",
            id: b
        };
        _tag.dcsMultiTrack("wt.pid", b, "wt.nu", 1, "wt.dl", "53");
        $.ajax({
            url: "/instant/cart/addToCartDirect",
            cache: false,
            dataType: "json",
            data: c,
            type: "POST",
            beforeSend: function() {
                $(d.target).css({
                    visibility: "hidden"
                }).before('<img src="/resources/images/ajax-loader.gif" class="loadimg" style="float:left;left:50px;position:relative;top:5px;">')
            },
            success: function(e) {
                setTimeout(function() {
                    $(d.target).css({
                        visibility: "visible"
                    });
                    $(".loadimg").remove()
                },
                800);
                cartRelated(d, e, c);
                window.location.reload()
            }
        })
    }
}
function cartRelated(f, d, c) {
    var b = $(f.target);
    var a = {
        left: b.offset().left,
        top: b.position().top,
        parent: b.parent(),
        _html: d.msg
    };
    if (d.code > 0) {
        $("<div />").addClass("addCartOk").css({
            top: a.top,
            left: a.left - a.parent.offset().left
        }).html("已加入购物车").appendTo(a.parent).delay(1200).animate({
            opacity: 0,
            left: "+=250",
            top: "-=450"
        },
        300,
        function() {
            $(this).remove();
            ajaxReq()
        });
        _tag.dcsMultiTrack("wt.pid", c.id, "wt.nu", c.count, "wt.dl", "52")
    } else {
        $("<div />").addClass("addCartErr").css({
            top: a.top - 10,
            left: a.left
        }).html("请刷新重试").appendTo(a.parent).delay(1000).animate({
            opacity: 0
        },
        500,
        function() {
            $(this).remove()
        })
    }
}
function changeSelect(a, b) {
    $.ajax({
        url: "/user/cart/changeSelect",
        type: "POST",
        dataType: "json",
        data: a,
        success: function(c) {
            if (c.code == 0) {
                changePromotion(a, b)
            } else {
                cartTips(b, "err", c.msg)
            }
        }
    })
}
function batchChangeSelect(a, b) {
    $.ajax({
        url: "/user/cart/changeSelect",
        type: "POST",
        dataType: "json",
        data: a,
        success: function(c) {
            if (c.code == 0) {
                batchChangePromotion(a, b)
            } else {
                cartTips(b, "err", c.msg)
            }
        }
    })
}
function getNoPromotionItemNum() {
    var a = 0;
    $("#shopping_cart .cl_con[data-pid=0] .it_mck .mck").each(function() {
        a += parseInt($(this).parents(".it_mck").siblings(".it_num").find(".dp_num").val())
    });
    $("#shopping_cart .cl_con[data-pid=0] .cl_words span").text(a)
}
function batchChangePromotion(b, a) {
    if (typeof(b.opid) == "undefined" || b.opid == "") {
        getNoPromotionItemNum();
        changeTotal(a)
    } else {
        $.ajax({
            url: "/instant/cart/batchCheckPromotions",
            type: "POST",
            dataType: "json",
            data: b,
            success: function(c) {
                if (c.code == 1) {
                    for (i = 0; i < c.data.length; i++) {
                        data = c.data[i];
                        if (data.active != 1) {
                            var d = $("div.cl_con[data-pid=" + data.pid + "]");
                            d.find(".cl_tag").addClass("disabled");
                            d.find(".cl_words span").remove();
                            d.find("div[data-gift=" + data.pid + "]").remove()
                        } else {
                            var d = $("div.cl_con[data-pid=" + data.pid + "]");
                            d.find(".cl_tag").removeClass("disabled");
                            d.find(".cl_words span").remove();
                            if (data.gift == 1) {
                                if (d.find("div[data-gift=" + data.pid + "]").length == 0) {
                                    html = '<div data-gift="' + data.pid + '"><a href="javascript:;" class="btn_xzzp selectBonus">选择赠品<i></i></a></div>';
                                    d.find(".cl_tit").append(html)
                                }
                            }
                            if (data.gift == 2) {
                                if (d.find(".cl_mck .mck").prop("checked")) {
                                    d.find(".cl_tag").removeClass("disabled");
                                    if (d.find("div[data-gift=" + data.pid + "]").length == 0) {
                                        html = '<div data-gift="' + data.pid + '"><a href="javascript:;" class="btn_xzzp selectBonus">选择赠品<i></i></a></div>';
                                        d.find(".cl_tit").append(html)
                                    }
                                } else {
                                    d.find(".cl_tag").addClass("disabled");
                                    d.find("div[data-gift=" + data.pid + "]").remove()
                                }
                            }
                        }
                    }
                    getNoPromotionItemNum();
                    changeTotal(a)
                } else {
                    cartTips(a, "err", c.msg)
                }
            }
        })
    }
    getNoPromotionItemNum()
}
function changeNum(e, c, d) {
    var a = null,
    b = e.attr("class");
    if (b == "dp_jian") {
        a = e
    } else {
        if (b == "dp_jia") {
            a = e.prev().prev()
        } else {
            a = e.prev()
        }
    }
    $.ajax({
        url: "/user/cart/addToCart",
        type: "POST",
        dataType: "json",
        data: c,
        success: function(h) {
            var g = e;
            if (h.code == 1) {
                e.val(c.num);
                var f = e.attr("rowid");
                $(".rowid-" + f).each(function() {
                    var j = $(this);
                    var k = j.find(".spuitem_num");
                    k.text(k.data("qty") * c.num)
                });
                if (parseInt(c.num) <= 1) {
                    a.addClass("disabled")
                } else {
                    a.removeClass("disabled")
                }
                cartTips(d, "success", "数量修改成功");
                if (g.data("ori")) {
                    g.data("ori", c.num)
                }
                e.closest(".gooditem").find(".subTotal .item_fee").text("￥" + h.subtotal);
                changePromotion(c, d)
            } else {
                cartTips(d, "err", h.msg);
                if (g.data("ori")) {
                    g.val(g.data("ori"))
                }
            }
        }
    })
}
function partDelete(a) {
    $.ajax({
        url: "/user/cart/removeItems",
        type: "POST",
        dataType: "json",
        data: {
            row_id: a.rowid
        },
        success: function(d) {
            switch (d.code) {
            case 0:
                var e = [];
                for (var f = 0; f < a.rowid.length; f++) {
                    var j = $("#shopping_cart input[value=" + a.rowid[f] + "]").closest(".gooditem");
                    var g = j.parents(".cl_con");
                    var b = j.parents(".cl_promotion");
                    var h = g.data("pid");
                    _btmtop -= j.outerHeight(true);
                    j.remove();
                    if (b.find(".gooditem").length == 0) {
                        _btmtop -= g.outerHeight(true);
                        b.remove()
                    }
                    if (g.find(".gooditem").length == 0) {
                        _btmtop -= g.outerHeight(true);
                        g.parent().remove();
                        $("#shopping_cart .c_list").eq(0).css("margin-top", "0px")
                    }
                }
                changeBtmFixed();
                if ($("#shopping_cart .gooditem").length < 1) {
                    window.location.reload()
                }
                var k = $(a.target).closest("td");
                var c = {
                    opid: h || 0,
                    row_id: a.rowid
                };
                changePromotion(c, a.target);
                break;
            default:
                cartTips(a.target, "err", d.msg)
            }
        }
    })
}
function formatUndefined(a) {
    if (typeof(a) == "undefined") {
        a = ""
    }
    return a
}
function concatParenttheses(b) {
    var a = 0;
    if (a) {
        return "(" + b + ")"
    }
    return b
}
function changeTotal(f) {
    var d = 0;
    var a = {
        row_id: []
    };
    $("#shopping_cart input[name=productcheck]").each(function() {
        if ($(this).prop("checked")) {
            a.row_id[d] = $(this).val();
            d++
        }
    });
    var c = true;
    var b = "/user/cart/getTotal";
    $.ajax({
        url: b,
        type: "POST",
        data: a,
        dataType: "json",
        beforeSend: function() {
            if (c == true) {
                c = false;
                return true
            } else {
                return false
            }
        },
        success: function(j) {
            if (j.code == 1) {
                var l = j.cartData;
                $(".newCart_select_quantity").text(l.cart_total.select_quantity);
                $(".newCart_settle_amount").text("¥" + l.cart_total.settle_amount);
                /*var g = $(".newCart");
                var h = g.find(".thrift_price"),
                k = 0,
                m = g.find(".taxes_price"),
                e = g.find(".dot"),
                o = g.find(".bracket");
                if (l.cart_total.thrift_price) {
                    k++;
                    h.text("已减：￥" + l.cart_total.thrift_price);
                    h.show()
                } else {
                    h.hide()
                }
                if (l.cart_total.taxes_price) {
                    k++;
                    m.text(l.cart_total.tax_name + "：￥" + l.cart_total.taxes_price);
                    m.show()
                } else {
                    m.hide()
                }
                if (k > 0) {
                    o.show()
                } else {
                    o.hide()
                }
                if (k > 1) {
                    e.show()
                } else {
                    e.hide()
                }
                var n = j.cartData.row_infos;
                $.each(n,
                function(s, E) {
                    var p = $(".store_" + E.store_id);
                    var u = E.item_group;
                    if (u.length > 0) {
                        for (d = 0; d < E.item_group.length; d++) {
                            var B = E.item_group[d]["items"];
                            if (B) {
                                for (var t = 0; t < B.length; t++) {
                                    var D = p.find(".gooditems_" + B[t].id + " .tax");
                                    if (D.length > 0) {
                                        if (B[t].taxes_price) {
                                            D.text(l.cart_total.tax_name + "¥" + B[t].taxes_price)
                                        } else {
                                            D.text("")
                                        }
                                    }
                                }
                            }
                            if (typeof(E.item_group[d]["promotion"]) != "undefined") {
                                var F = E.item_group[d]["promotion"];
                                var z = F.id;
                                var G = p.find('div[data-promotion="' + z + '"]');
                                var r = G.find(".cl_tag").attr("data-promotion_type");
                                if (F.seleted_gift && (r == "normal_gift" || r == "full_gift" || r == "ladder_full_gift")) {
                                    G.find(".cl_words span.full_diff_money").hide();
                                    G.find(".cl_words > a").hide()
                                }
                                if (r == "normal_gift" || r == "full_gift" || r == "ladder_full_gift") {
                                    G.find(".cl_words_zp").remove();
                                    var A = u[d]["promotion"]["gift_lists"];
                                    var q = "";
                                    if (A) {
                                        if (A.length > 0) {
                                            for (t = 0; t < A.length; t++) {
                                                if (A[t]["status"] == 1) {
                                                    q += '<div class="items"><div class="sku">' + A[t]["id"] + '</div><div class="name">' + A[t]["name"] + '</div><div class="pic">' + A[t]["pic"][0] + '</div><div class="num">1</div></div>'
                                                }
                                            }
                                        }
                                    }
                                    if (!F.is_valid) {
                                        if (typeof(E.item_group[d].full_diff_money) != "undefined") {
                                            G.find(".cl_words span.full_diff_money").text(concatParenttheses(E.item_group[d].full_diff_money)).show()
                                        } else {
                                            G.find(".cl_words span.full_diff_money").text(formatUndefined(F.exten ? F.exten: F.title)).show()
                                        }
                                        G.find(".cl_words span.full_diff_money").show();
                                        G.find(".cl_words .selectBonus").remove()
                                    }
                                    if (F.is_valid) {
                                        G.find(".cl_words > a").hide();
                                        G.find(".cl_words span.full_diff_money").hide()
                                    } else {
                                        G.find(".cl_words > a").show()
                                    }
                                    var w = false;
                                    p.find(".hidden_gift_list_" + z).html(q);
                                    if (G.find(".cl_words_zp").length && F.seleted_gift) {
                                        G.find(".cl_words_zp").show();
                                        G.find(".cl_words_zp .selectBonus").show()
                                    } else {
                                        if (G.find(".cl_words .selectBonus").length && F.seleted_gift && w) {
                                            G.find(".cl_words .selectBonus").show()
                                        } else {
                                            if ((E.item_group[d]["promotion"]["seleted_gift"] || A.length > 0) && F.is_valid) {
                                                var x = false;
                                                var C = '<span class="cl_words_zp">';
                                                C += "<em>[赠品]</em>";
                                                var y = false;
                                                if (A.length > 0) {
                                                    for (t = 0; t < A.length; t++) {
                                                        if (A[t]["status"] == 1 && A[t]["id"] == F.seleted_gift) {
                                                            C += A[t]["name"];
                                                            x = true
                                                        }
                                                        if (A[t]["status"] == 1) {
                                                            y = true
                                                        }
                                                    }
                                                }
                                                if (y) {
                                                    C += '<a class="cart_zp_btn btn_xzzp selectBonus" data-pid="' + z + '"href="javascript:void(0)">' + (F.seleted_gift ? "重新选择": "选择赠品") + "</a>"
                                                }
                                                C += "</span>";
                                                if ((!x && E.item_group[d]["promotion"]["seleted_gift"]) || !y) {
                                                    var C = '<span class="cl_words_zp">';
                                                    C += "<em>[赠品]</em>(已赠完)</span>"
                                                }
                                                G.find(".cl_words").append(C)
                                            } else {
                                                G.find(".cl_words .cl_words_zp").remove()
                                            }
                                        }
                                    }
                                } else {
                                    if (typeof(E.item_group[d].full_diff_money) != "undefined") {
                                        G.find(".cl_words span.full_diff_money").text(concatParenttheses(E.item_group[d].full_diff_money)).show()
                                    } else {
                                        G.find(".cl_words span.full_diff_money").text(formatUndefined(F.exten ? F.exten: F.title)).show()
                                    }
                                    if (F.is_valid) {
                                        G.find(".cl_words > a").hide()
                                    } else {
                                        G.find(".cl_words > a").show()
                                    }
                                }
                            }
                        }
                    }
                });
                changetotalheight();*/
                return true
            } else {
                return false
            }
        }
    })
}
function cartTips(d, b, f) {
    var c = 4000;
    $(".checkTipsErr").remove();
    $(".checkTips").remove();
    var g;
    if (b == "err") {
        _class = "checkTipsErr"
    } else {
        _class = "checkTips"
    }
    if (d) {
        $("<p />").addClass(_class).css({
            opacity: 0
        }).html(f).appendTo($("body")).append('<i class="arr" />');
        if (b == "err") {
            g = $(".checkTipsErr")
        } else {
            g = $(".checkTips")
        }
        g.css({
            top: $(d.target).offset().top,
            left: a(),
            "z-index": 9999,
            "margin-left": 0
        }).animate({
            opacity: 1,
            top: "-=30"
        },
        100).delay(c).animate({
            opacity: 0
        },
        500,
        function() {
            $(this).remove()
        })
    }
    function a() {
        return $(d.target).offset().left - g.width() / 2
    }
}
function cartbehindTips(d, b, f) {
    var c = 4000;
    $(".checkTipsErr").remove();
    $(".checkTips").remove();
    var g;
    if (b == "err") {
        _class = "checkTipsErr"
    } else {
        _class = "checkTips"
    }
    if (d) {
        $("<p />").addClass(_class).css({
            opacity: 0
        }).html(f).appendTo($("body")).append('<i class="arr" />');
        if (b == "err") {
            g = $(".checkTipsErr")
        } else {
            g = $(".checkTips")
        }
        g.css({
            top: $(d.target).offset().top,
            left: a(),
            "z-index": 9999,
            "margin-left": 0
        }).animate({
            opacity: 1,
            top: "+=30"
        },
        100).delay(c).animate({
            opacity: 0
        },
        500,
        function() {
            $(this).remove()
        })
    }
    function a() {
        return $(d.target).offset().left - g.width() / 2
    }
}
function changeBtmFixed() {
    var a = $(window).scrollTop();
    if ((a + winH) < (_btmheight + _btmtop)) {
        if (!$btm.hasClass("fixed_c_count")) {
            $btm.addClass("fixed_c_count")
        }
    } else {
        $btm.removeClass("fixed_c_count")
    }
};