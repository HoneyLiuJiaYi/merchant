$(document).ready(function(){
    setAmount();
     var sku_id = $("#item_id").val();
	 var _discountF=$('.discount_f');
     $.ajax({
        url: "/instant/item/info/"+sku_id,
        context: document.body,
        dataType: 'json',
        success: function(data) {
            ajaxItemInfo(data);
			//alert(data.p);
			if(data.p==''){
				_discountF.hide();
			}else{
                $('.i_youhui').show();
				var f_html ='';
                if(!data.p){
                    $('.i_youhui .num_name').remove();
                }else{
                    for(var i=0;i<data.p.length;i++){
                        var first_dis= data.p[i];
                        if(first_dis.maodian == true){
                            f_html +='<a href="#F">';
                        }else if(first_dis.web_url != ''){
                            f_html +='<a href="'+first_dis.web_url+'">';
                        }else{
                            f_html +='<a href="/promotion-'+first_dis.promotion_id+'.html">';
                        }
                        //todo:修改涉及页面的iteminfo.css和main.css版本号
                        f_html +='<div class="markwarp"><i class="mark-'+first_dis.color+'" >'+first_dis.type+'</i>'+first_dis.name+'</div></a>';
                    }
                }
                /*
                if(first_dis.outlet_id != '' && first_dis.outlet_id > 0){
                    f_html +="<div class='iyh_zeng'><a href = '/list-"+ first_dis.outlet_id+".html' target='_blank'><i>"+first_dis.type+"</i>"+first_dis.name+"</a></div>";
                }else{*/
                //}
				$('.i_youhui').find('dt:last').append(f_html);
                $('.i_youhui a').click(function(){
                    setTimeout(function(){
                        var hash  = location.hash;
                        if(hash =='#F'){
                            $(window).scrollTop($("div[name='#F']").offset().top);
                        }
                    },0)

                })
			}
        }
    });    
    
    //getrec(sku_id);


    // $('#detail_size').delegate('a.item_size_list','click',function(e){
        // $("#item_size").val(this.id);
        // var _this = $('a.item_size_list');
        // $(_this).removeClass('selected').filter('[id="' + this.id + '"]').addClass('selected');
        // $('#stockTips').hide();
        // if($(this).data('show') == 'yes') {
            // var index = $(this).parent('.size_text').index();
            // $('#stock span').hide();
            // $('#stockTips,#stock span:eq('+index+')').show();
        // }
    // });
    

    //spubuy
    $('#itemProcess').delegate('#spu_J_cartAdd_submit','click',function(e){
        e.preventDefault();
        addSpuToCart($(this),e);
    });
    
    
    $('#itemProcess').delegate('#J_cartAdd_submit','click',function(e){
        e.preventDefault();
        addToCart(e);
    });
    
	//优惠
	var more_globle;
	$(".more_dis_f").live('hover',function(event){
		if(event.type=='mouseenter'){
			var $_this=$(this);
			more_globle=''
			var showObj=$_this.parent().parent().siblings('.discount_con_f');
			$_this.find('i').addClass("behind");
			showObj.show();
			showObj.hover(function(){
				$(this).show();
			},function(){
				$(this).hide();
				$_this.find('i').removeClass("behind");
			});
		}else if(event.type='mouseout'){
			var $_this=$(this);
				more_globle=true;
			var showObj=$_this.parent().parent().siblings('.discount_con_f');
				showObj.hover(function(){
					$(this).show();
					more_globle=false;
				},function(){
					$(this).hide();
					$_this.find('i').removeClass("behind");
				});
			setTimeout(function(){
				if(more_globle){
					showObj.hide();
					$_this.find('i').removeClass("behind");
				}
			},800);
		}
	});
    /* 点赞 */
    $('.inf .zan').click(function(event) {
        event.preventDefault();
        var _this = $(this);
        if (_this.data('zan')) {
            return false
        }
        var url = '/instant/koubei/zan';
        var num = true;
        zan(_this,url,num);
    });
	
	//关注商品
	$('#attend_submit').click(function(){
		var _this=$(this);
		var item_id = $("#item_id").val();
		$.ajax({
			url:'/instant/collect/ajaxAddMine/?t='+Math.random(999999),
			type:'post',
			dataType:'json',
			data:{item_id:item_id},
			 beforeSend:function(){
                _this.html('<img src="/resources/images/ajax-loader.gif" class="loadimg" style="">').css("background",'none');
            },
			success:function(result){
				_this.html('收藏').css({'background':'#35bef2'});
				if(result.res== false){
					if (result.data == 'haved') {
					//alert("您已关注！");
					var html='<div class="popwin colDialog1"><div class="popconn">';
						html+='<h2><p class="popconn_title">商品已收藏</p><p>您已收藏'+result.collectnum+'个商品 - <a href="/my_collect.html" target="_blank">查看我收藏的商品>></a>  </p></h2>'
						html+='<div class="clearfix attend_other">'
						html+='<p><span>收藏此商品的人还收藏了</span></p>'
						html+='<div class="attend_product">'					
                    for(i=0;i < result.other.length;i++){
						var content=result.other[i];   
							html +='<div class="l attend_one"><a href="/item-'+content.id+'.html" target="_blank" ><img src="'+content.image+'" width="90" height="90" alt="'+content.name+'" title="'+content.name+'"></a>'
							if(content.name.length >= 10) {
								content.name = content.name.substr(0,10)+'...';
								html +='<a href="/item-'+content.id+'.html" target="_blank">'+content.name+'</a><span id="sale_price">￥'+parseInt(content.sale_price)+'</span></div>'
							}else{
								html +='<a href="/item-'+content.id+'.html" target="_blank">'+content.name+'</a><span id="sale_price">￥'+parseInt(content.sale_price)+'</span></div>'
							}
					}
						html += '</div></div></div></div>'
                        if ($('#dialog').length == 0) {
                            $('<div id="dialog" />').appendTo('body').html(html);
                        }else{
                            $('#dialog').html(html);
                        }
                        $("#dialog").dialog({
                            autoOpen:true,
                            closeOnEscape:true,
                            modal:true,
                            width:'440px',
                            draggable:false,
                            position:'center',
                            resizable:false,
                            title:'商品已收藏'
                        }).dialog("open");
					return false;
					} else if(result.data == 'not_login') {
						alert("请登录后再收藏！");
						var curUrl = encodeURIComponent(window.location.href);
						window.location.href="/login?url="+curUrl;
						return false;                    
					} else {
						alert("收藏商品失败！");
						return false;
					}
				}else{
					//alert('您已成功关注！');
					var html='<div class="popwin"><div class="popconn">';
						html+='<h2><p class="popconn_title">商品已收藏</p><p>您已收藏'+result.collectnum+'个商品 - <a href="/my_collect.html" target="_blank">查看我收藏的商品>></a>  </p></h2>'
						html+='<div class="clearfix attend_other">'
						html+='<p><span>收藏此商品的人还收藏了</span></p>'
						html+='<div class="attend_product">'
                        
                    for(i=0;i < result.other.length;i++){
						var content=result.other[i];   
							html +='<div class="l attend_one"><a href="/item-'+content.id+'.html" target="_blank" ><img src="'+content.image+'" width="90" height="90" alt="'+content.name+'" title="'+content.name+'"></a>'
							if(content.name.length >= 10) {
								content.name = content.name.substr(0,10)+'...';
								html +='<a href="/item-'+content.id+'.html" target="_blank">'+content.name+'</a><span id="sale_price">￥'+parseInt(content.sale_price)+'</span></div>'
							}else{
								html +='<a href="/item-'+content.id+'.html" target="_blank">'+content.name+'</a><span id="sale_price">￥'+parseInt(content.sale_price)+'</span></div>'
							}
					}
						html += '</div></div></div></div>'
                        if ($('#dialog').length == 0) {
                            $('<div id="dialog" />').appendTo('body').html(html);
                        }else{
                            $('#dialog').html(html)
                        }
                        $("#dialog").dialog({
                            autoOpen:true,
                            closeOnEscape:true,
                            modal:true,
                            width:'440px',
                            draggable:false,
                            position:'center',
                            resizable:false,
                            title:'商品收藏成功'
                        }).dialog("open");
				}
			}
		});		
	});
    
    
    
    
});

function setAmount(){
    var t = $("#buyAmount");
    var min = 1;
    var max = 99;
    function reg_test(){
        return new RegExp("^[1-9]\\d*$").test(t.text());
    }
    $(".num_add").click(function(){
        if (parseInt(t.text()) < max && reg_test()) {
            t.text(parseInt(t.text())+1);
            $(".num_reduce").removeClass('num_reduce_disabled');
        }else if(!reg_test()){
            t.text(min);
            $(".num_reduce").addClass('num_reduce_disabled');
        }else{
            t.text(max);
            $(".num_reduce").removeClass('num_reduce_disabled');
        };
    })
    $(".num_reduce").click(function(){
        if(parseInt(t.text()) > min && reg_test()){
            t.text(parseInt(t.text()) - min);
            if (parseInt(t.text()) == 1) {
                $(this).addClass('num_reduce_disabled');
            }
        }else{
            t.text(min);
            $(this).addClass('num_reduce_disabled');
        }
    })
    $("#buyAmount").blur(function(){
        if (!reg_test()) {
            t.text(min);
        }else if(parseInt(t.text()) < min){
            t.text(min);
        }else if(parseInt(t.text()) > max){
            t.text(max);
        };
    })
}

function timedown() {
    var start = $('#outletStart').val();
    var end = $('#outletEnd').val();
    $('#counter').timer({
         starTime: start,
         endTime: end,
         digitItvWidth: 25,
         digitWidth: 45,
         digitHeight: 46,
         id:1,
         timerEnd:function(){
             
             }
         });
}


//获取是否订阅
function isSaveTel (){
var itemId = $('#item_id').val();
    var _data = {
        itemid : itemId

    }
    $.ajax({
            url:'/item/detail/isSavePhone',
            data: _data,
            type: "POST",
            success:function(data){
                if(data == 1){
                    //已经订阅
                    var itemBtnh = '<a href="javascript:void(0)" class="btn_08_f02b" onclick="javascript:getTel()">已订阅</a>';
                    $('#itemProcess').html(itemBtnh);
                    $('.dialogAddTelW').hide();
                    $('.dialogAddTelWoverlay').hide();                
                }else{
                    //2 订阅失败(重复手机号)
                    var outstock = '<a href="javascript:void(0)" class="btn_08_f02" onclick="javascript:getTel()">开售通知</a>';
                    $('#itemProcess').html(outstock);
                }
            }
        });
    //item/detail/isSavePhone   需要参数itemId  返回1已订阅2未订阅

}
function ajaxItemInfo(data) {
    var sku_id = $("#item_id").val();
    if(typeof(data.os != "undefined")) {
        var info = $('#detailOutletInfo');
        $('#outletStart').val(data.curtime);
        $('#outletEnd').val(data.outlets_time);        
        switch (data.o_s) {
            case 0:
            info.find('#counter').remove();break;
            case 1:
            info.find('h5').text('距特卖结束还剩:');break;
            case 2:
            info.find('h5').text('距特卖开始还有:');break;
            case 3:
            case 4:
            info.find('#counter').remove();break;
        }
        timedown();
        info.show();
    }
    if(data.p !='') {
        var promotion = '';
        if(data.p){
                len = data.p.length;
        }else{
                len = 0;
        }
        for(n=0;n<len;n++) {
            if(data.p[n].web_url != ''){
                promotion += '<dl><dt><a href='+data.p[n].web_url+'>'+data.p[n].type+'</a></dt><dd>'+data.p[n].name+'</dd></dl>';
            }else{
                promotion += '<dl><dt>'+data.p[n].type+'</dt><dd>'+data.p[n].name+'</dd></dl>';
            }

        }
      //  $('#detail_promotion').html(promotion).show();
    }
    // console.log(data);
    if((data.status == 1 && data.o_s == 1) || data.status == 2 || (data.status == 1 && data.o_s == 4)) {
        var _this = $("#detail_size");
        if(typeof data.price != "undefined") {
            if(data.price >= 0) {
                $("#item_price").text(data.price);
                if(typeof NO_MARKET_PRICE != "undefined" ){
                	if(!NO_MARKET_PRICE){
                		$(".pbox_off").text((data.price / data.m_price * 10).toFixed(1) + '折');
                		$(".pbox_market").html('市场价:¥<del>' + data.m_price + '</del>');
            		}
            	}
            } else {
                $("#item_price").text('暂无售价');
            }
            if(data.s > 0 || data.s == 'f') {
                $("#item_size").val('SINGLE');
            }
            var html ='<dt class="">规格：</dt><dd id="detail_size_list">';
            var si = '';
            if(data.sizes != '' && data.sizes != 'SINGLE') {
                $.each(data.sizes,function(a,b){
                    var t = a;
                    if (a.length>18) {
                        t = a.substr(0,18);
                    }
                    if(b > 0 || b =='f') {
                        if(b == 'f') {
                            html += '<p class="size_text"><a class="item_size_list" id="'+a+'" data-show="no" title="'+a+'"href="javascript:void(0)"><b></b><span>'+t+'</span></a></p>';
                        } else {
                            html += '<p class="size_text"><a class="item_size_list" id="'+a+'" data-show="yes" title="'+a+'"href="javascript:void(0)"><b></b><span>'+t+'</span></a></p>';
                        }
                    } else {
                        html += '<p class="size_text"><span class="outOfStock" title="该规格商品已售罄"><b></b><span>'+t+'</span></span></p>';
                    }
                    si += '<span>'+b+'</span>'
                });

                //get size
                if($('#size_sheet thead').length > 0) {
                     html += '<dd id="ui_new_lz">查看尺码表&gt;</dd></dd>';
                }
                _this.html(html).show();
                $('#stockTips #stock').html(si);
            } else {
                if(data.s > 0 && data.s != 'f') {
                    $('#stock').text(data.s).show();
                    $('#stockTips').show();
                }
            }
            if(data.mb != '') {
                var notice = '温馨提示：本商品每账户每日最多可购买'+data.mb+'件，敬请谅解。';
                $('#itemProcess #sepcailNotice').text(notice).show();
            }
            if(data['item_type'] == 1 || data.taxInfo.item_info.direct_checkout == true || data.isShipping == true){
                $('.num_add').remove();
                $('.num_reduce').remove();
                $('.num_box').css('border','0');
                $('#J_num_select').hide();
                $('#J_cartAdd_submit').attr('disabled',false).text('立即购买');
            }else{
                $('#J_cartAdd_submit').attr('disabled',false).text('加入购物车');
            }
        }
    } else if(data.status == 0 && data.o_s == 2){
        var _this = $("#detail_size");
        var html ='<dt class="">规格：</dt><dd id="detail_size_list">';
        if(data.sizes != '' && data.sizes != 'SINGLE') {
            $.each(data.sizes,function(a,b){
                var t = a;
                if (a.length>18) {
                    t = a.substr(0,18);
                }
                html += '<p class="size_text"><span class="outOfStock" title="该规格商品已售罄"><b></b><span>'+t+'</span></span></p>';
            });
            html += '</dd>';
            _this.html(html).show();
        }        
        var coming = '<a href="/koubei/'+sku_id+'" class="btn_08_f">特卖尚未开始</a>';
        //$('#itemProcess').html(coming); 
        isSaveTel();       
    } else if(data.status == 5){

        if(data.taxInfo.item_info.direct_checkout == true || data.isShipping == true){
            $('.num_add').remove();
            $('.num_reduce').remove();
            $('.num_box').css('border','0');
            $('#J_num_select').hide();
            var h = '<a href="javascript:void(0)" class="spubuy btn_07" id="spu_J_cartAdd_submit" data-sid="'+sku_id+'">立即购买</a><p id="sepcailNotice"></p>';
            $('#itemProcess').html(h);
        }else{
            var h = '<a href="javascript:void(0)" class="spubuy btn_07" id="spu_J_cartAdd_submit" data-sid="'+sku_id+'">加入购物车</a><p id="sepcailNotice"></p>';
            $('#itemProcess').html(h);
        }

    } 
    else {
        isSaveTel();
    }
}

//telInp
function getTel() {
    $('.dialogAddTelW').show();
    $('.dialogAddTelWoverlay').show();
    $('.erro').hide();
    var getTel = '';
    $.ajax({
            url:'/item/detail/getphone',
            dataType: 'json',
            type: "POST",
            success:function(data){
                if(data == 1){
                    $('#telInp').attr('value',''); 
                }else{
                    $('#telInp').attr('value',data);     
                }
            }
        });
}
// 提交参数 phone 手机号 item_id 对应商品id     返回 1成功 2失败
function telSub(){
    var phoneNum = $('#telInp').val();
    var itemId = $('#item_id').val();
    if(!phoneNum){
        $("#telInp").next('.erro').html('请输入正确的手机号码!').show();
        return false;
    }
    var _data = {
        phone : phoneNum , 
        item_id : itemId
    }
    $.ajax({
            url:'/koubei/save_item_phone',
            data: _data,
            type: "POST",
            success:function(data){
                if(data == 3){
                    $('.dialogAddTel .erro').html('网络繁忙，请稍后再试').show();
                    return false;
                }
                if(data == 1){
                    //已经订阅
                    var itemBtnh = '<a href="javascript:void(0)" class="btn_08_f02b" onclick="javascript:getTel()">已订阅</a>';
                    $('#itemProcess').html(itemBtnh);
                    $('.dialogAddTelW').hide();
                    $('.dialogAddTelWoverlay').hide();                
                }else{
                    //2 订阅失败(重复手机号)
                    var itemBtnh = '<a href="javascript:void(0)" class="btn_08_f02b" onclick="javascript:getTel()">已订阅</a>';
                    $('#itemProcess').html(itemBtnh);
                    $('.dialogAddTelW').hide();
                    $('.dialogAddTelWoverlay').hide(); 
                }
            }
        });
}

//spu
function addSpuToCart(obj,e) {
	var ele = obj;
    var flag = true;
    var min = 1;
    var max = 99;
    var countText = $("#buyAmount").text();
    var reg = new RegExp('^[0-9.]*$','gi');
    if (!reg.test(countText)) {
        flag = false;
        alert('商品数量必须是数字！');
        countText.focus();
        //return;
    }else if (countText < min) {
        flag = false;
        alert('商品数量必须大于'+min+'！');
        countText.focus();
        //return;
    } else if (countText > max) {
        flag = false;
        alert('商品数量过多！');
        countText.focus();
        //return;
    }

    //all infos are correct submit to ajax
    if (flag) {
        var _data = {
            count: $('#buyAmount').text(),
            size : 'SINGLE',
            id : ele.data('sid'),
            is_spu:1
        }

       
        var wtcode ='52';
        $.ajax({
            url:'/instant/cart/addToCart',
            cache:false,
            dataType: 'json',
            data: _data,
            type: "POST",
            beforeSend:function(){
            	ele.text('正在提交');
            },
            success:function(data){
                if(data.code == -2){
                    var curUrl = encodeURIComponent(window.location.href);
                    window.location.href = '/login?url='+curUrl; return;
                }
                //添加直接购买商品
                if(data.code == 4){

                    window.location.href = '/order/index/2?item_id='+data.item_id+'&item_size='+data.item_size+'&quantity='+data.quantity; return;
                }
                //添加购物车浮层
            	ele.text('加入购物车');
            	cartRelated(e,data);
            	/*setTimeout(function(){
                    $('#J_cartAdd_submit').css({visibility: 'visible'});
                    $('.loadimg').remove()
                },1000)
                cartRelated(e,data);*/
            },
            complete:function () {
                 _tag.dcsMultiTrack('wt.pid', _data.id, 'wt.nu',_data.count, 'wt.dl',wtcode );
            }
        });
    }
}


function addToCart(e) {
    var flag = true;
    var min = 1;
    var max = 99;
    var countText = $("#buyAmount").text();
    var reg = new RegExp('^[0-9.]*$','gi');
    if (!reg.test(countText)) {
        flag = false;
        alert('商品数量必须是数字！');
        countText.focus();
        //return;
    }else if (countText < min) {
        flag = false;
        alert('商品数量必须大于'+min+'！');
        countText.focus();
        //return;
    } else if (countText > max) {
        flag = false;
        alert('商品数量过多！');
        countText.focus();
        //return;
    }

    //check out product size
    var sizeText = $("#item_size").val();
    if (sizeText == '' || sizeText == '未选择') {
        flag = false;
        cartTips(e,'err','请选择规格');
        //return;
    }

    //all infos are correct submit to ajax
    if (flag) {
        var _data = {
            count: $('#buyAmount').text(),
            size : $('#item_size').val(),
            id : $('#item_id').val()
        }

        _tag.dcsMultiTrack('wt.pid', $('#item_id').val(), 'wt.nu', $('#buyAmount').html(), 'wt.dl', '52');

        $.ajax({
            url:'/instant/cart/addToCart',
            cache:false,
            dataType: 'json',
            data: _data,
            type: "POST",
            beforeSend:function(){
                $('#J_cartAdd_submit').css({visibility: 'hidden'}).before('<img src="/resources/images/ajax-loader.gif" class="loadimg" style="float:left;left:80px;position:absolute;top:25px;">');
            },
            success:function(data){
                if(data.code == -2){
                    var curUrl = encodeURIComponent(window.location.href);
                    window.location.href = '/login?url='+curUrl; return;
                }
                //添加虚拟购物车
                if(data.code == 3){
                    window.location.href = '/order?type=1'; return;
                }
                //添加直接购买商品
                if(data.code == 4){
                    window.location.href = '/order/index/2?item_id='+data.item_id+'&item_size='+data.item_size+'&quantity='+data.quantity; return;
                }
                //添加购物车浮层
                setTimeout(function(){
                    $('#J_cartAdd_submit').css({visibility: 'visible'});
                    $('.loadimg').remove()
                },1000)
                cartRelated(e,data);
            }
        });
    }
}

function cartRelated(e,data){
    var targetelement = $(e.target);
    var _target={
        left   : targetelement.position().left,
        top    : targetelement.position().top + 10,
        parent : targetelement.parent(),
        _html  : data.msg
    };
    if (data.code > 0 ) {
        $('<div />')
            .addClass('addCartOk')
            .css({top:_target.top-10,left:_target.left - 0})
            .html(_target._html)
            .appendTo(_target.parent)
            .delay(1200)
            .animate({opacity:0,left:'+=250',top:'-=450'},300,function(){
            $(this).remove();
            ajaxReq();
        });
    }else{
        $('<div />')
            .addClass('addCartErr')
            .css({top:_target.top-10,left:_target.left - 0})
            .html(_target._html)
            .appendTo(_target.parent)
            .delay(1000)
            .animate({opacity:0},500,function(){
                $(this).remove();
            });
    };

}

function cartTips(e,flag,msg){
    var $tipsDelay  = 1000;
    if (flag =="err") {
        _class = 'checkTipsErr'
    }else{
        _class = 'checkTips'
    };
    $('<p />')
        .addClass(_class)
        .css({opacity:0})
        .html(msg)
        .prependTo($('#itemProcess'))
    if (flag == 'err') {
        _this = $('#itemProcess').find('p.checkTipsErr').eq(0);
    }else{
        _this = $('#itemProcess').find('p.checkTips').eq(0);
    };

    _this
    .css({top:$(e.target).position().top,left:_getLeft(e)})
        .animate({opacity:1,top:"-=30"},100)
        .delay($tipsDelay)
        .animate({opacity:0},500,function(){
            $(this).remove();
        });
    function _getLeft(e){
        return	$(e.target).position().left - (_this.width() - $(e.target).width() )/2
    }

}

function getrec(sku_id){
    $.ajax({
       url: "/instant/item/getRecItemsByItemid/"+sku_id,
       context: document.body,
       dataType: 'json',
       success: function(data) {
           var f_html = '';
		   if(data.res == 1){
		       var sw_items = data.rec.sw_items;
               var depth_items = data.rec.depth_items;
               var new_items = data.rec.new_items;
           
               for(i=0;i<sw_items.length;i++){
                   var item = sw_items[i];
                   f_html += '<div class="cell">';
                   f_html += '<a href="/item-' + item.id + '.html" target="_blank" title="' + item.name + '"><img src="' + item.pic_url + '" alt="' + item.name + '" width="217" class="img"></a>';
                   f_html += '<p class="p1"><a href="/item-' + item.id + '.html">' + item.name + '</a></p>';
                   f_html += '<p class="p2">&yen;' + item.sale_price + '（' + (item.sale_price/item.market_price).toFixed(1) + '折）</p>';
                   f_html += '<span class="mk mkb"></span><span class="mk">爆款!必抢!</span></div>';
                   f_html += '</div>';
               }
           
           
               for(i=0;i<depth_items.length;i++){
                   var item = depth_items[i];
                   f_html += '<div class="cell">';
                   f_html += '<a href="/item-' + item.id + '.html" target="_blank" title="' + item.name + '"><img src="' + item.pic_url + '" alt="' + item.name + '" width="217" class="img"></a>';
                   f_html += '<p class="p1"><a href="/item-' + item.id + '.html">' + item.name + '</a></p>';
                   f_html += '<p class="p2">&yen;' + item.sale_price + '（' + (item.sale_price/item.market_price).toFixed(1) + '折）</p>';
                   f_html += '<span class="mk mkb"></span><span class="mk">囤货必备</span>';
                   f_html += '</div>';
               }
           
               for(i=0;i<new_items.length;i++){
                   var item = new_items[i];
                   f_html += '<div class="cell">';
                   f_html += '<a href="/item-' + item.id + '.html" target="_blank" title="' + item.name + '"><img src="' + item.pic_url + '" alt="' + item.name + '" width="217" class="img"></a>';
                   f_html += '<p class="p1"><a href="/item-' + item.id + '.html">' + item.name + '</a></p>';
                   f_html += '<p class="p2">&yen;' + item.sale_price + '（' + (item.sale_price/item.market_price).toFixed(1) + '折）</p>';
                   f_html += '<span class="mk mkb"></span><span class="mk">新品上市，火热出炉</span>';
                   f_html += '</div>';
               }
               $('.poppro').html(f_html);
           }
		}
   });
}


$(function(){
	var au_len=$('.author_ul li').length;
	var authUlWidth=$('.author_ul li').length*$('.author_ul li').width();
			$('.author_ul').css({'width':''+authUlWidth+'px'});
	 var author_count=0;
	$(".author_left").click(function(){
		if(author_count>0&&author_count<au_len){
			$(".author_ul").animate({
				left:'+=304px'
			},400);
			author_count--;
		}
	});
	$(".author_right").click(function(){
		if(author_count<au_len-1){
			$(".author_ul").animate({
				left:'-=304px'
			},400);
			author_count++;
		}
	});
});

//验证手机号
function yTel(){
    var isMobile=/^(?:13\d|15\d|18\d|17\d)\d{5}(\d{3}|\*{3})$/; //手机号码验证规则
    var dianhua = $("#telInp").val();                   //获得用户填写的号码值 赋值给变量dianhua   
    if(!isMobile.test(dianhua) || !dianhua ){ //如果用户输入的值不同时满足手机号和座机号的正则
        $("#telInp").next('.erro').html('请输入正确的手机号码!').show();
        $('#telSub').attr('onclick','');
        $("#telInp").focus();       //输入框获得光标
        return false;         //返回一个错误，不向下执行
    }
    else {
        $('#telSub').attr('onclick','telSub()');
        $("#telInp").next('.erro').hide();
    }
}
function closeAddTelW(){
    $('.dialogAddTelW').hide();
    $('.dialogAddTelWoverlay').hide();
}

/*增加查看尺码表 2015111 begin lz*/
function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function(string) {
            return string.replace(/-(\w)/g, function($0, $1) {
                return $1.toUpperCase();
            });
        };
    for (i in prefix){
        humpString.push(_toHumb(prefix[i] + '-' + style));
    }
    humpString.push(_toHumb(style));
    for (i in humpString){
        if (humpString[i] in htmlStyle) return true;
    }
    return false;
}
$(function(){

    if (!supportCss3('transform')) {
        var $sheet = $('.size_sheet');
        var num = $sheet.find("th").children().length;
        $('.size_sheet').css('margin', '' + (-$sheet.outerHeight()/2) + 'px 0 0 ' + (-$sheet.outerWidth()/2) + 'px');
    };
})

$(function(){
    var size_mask=$("#size_mask");
    $(document).on("click","#ui_new_lz",function(){
        size_mask.show().siblings("#size_sheet").show();
    });
    $("#Table_close").click(function(){
       $(this).parent().hide().siblings("#size_mask").hide()
    });
})
/*增加查看尺码表 2015111 end lz*/