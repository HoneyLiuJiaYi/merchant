//csrf
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')
    }
});
$(document).ready(function(){
    $('#loading').hide();
	$('#placeOrder').show();
    
    var n_add = $('#ckstep1').data('ck');
    if(n_add == '') {
      $(document).ready(function() {
            $('#ckstep1').find('.default,.change').hide();
            $('#ckstep1').find('.curSel').show();            
        });    
        
    }
	//代金券点击
    $('#getcouponlist').click(function(){
    	getUserCouponList();
    });
	//红包点击
    $('#getRedPaperList').click(function(){
    	getUserRedPaperList();
    });

    //账户余额
    $('#balance h5').click(function(){
        var _this = $(this);
        var $cont = _this.siblings(".cont");
        if ($cont.is(":hidden")) {
            $cont.show();
            _this.text('－使用账户余额');
        }else{
            $cont.hide();
            _this.text('+点击使用账户余额');
        }
    })

    $('.btnuser1').click(function(e){
            var redbagid=($(this).attr('dhref'));
            var redbagplatid=1;
            var redbagc = ($(this).attr('index'));
                            
//            $.ajax({
//                        url:'/order/getAjaxRedbaguse',
//                        dataType:'json',
//                        type:'POST',
//                        async:false,
//                        data:{redbagid:redbagid,redbagplatid:redbagplatid},
//                        success:function(data){
//                        if(data==false){
//                               var tip = $('.usertip2');
//    			       tip.show();
//                               tip.find('.usertipcon2').text('超时，请登录');
//                               setTimeout("$('.usertip2').fadeOut();",2000)
//                            }else{
//                               var tip = $('.usertip2');
//    			       tip.hide();
//                               tip.find('.usertipcon2').text('红包不存在！');
//                            }
//                        }
//            });
//            var tip = $('.usertip2');
//            var rederror=tip.find('.usertipcon2').text();
//            if(rederror=='超时，请登录'){
//                return false;
//            }
            var redbag_num = '';
            if($('#redbag_spec').val() != ''){
                redbag_num = 1;
            }else{
                redbag_num = 0;
            }
            var _data = {
                redbagid:redbagid,
                redbag_num:redbag_num,
            }
            
            $.ajax({
                        url:'/instant/redbag/checkRedbagNew',
                        dataType:'json',
                        type:'POST',
                        async:false,
                        data:_data,
                        success:function(data){
                        if(data.code == 1){
                            if($('#redbag_spec').val() != ''){
                                    $('#getRedPaperList strong').html("+使用红包抵消部分总额<span class='redIcoSp1'>"+$('#redbag_spec').val()+"</span>");
                            }else{
                                    $('#getRedPaperList strong').html("+使用红包抵消部分总额（您有<font color='red'>"+data.total+"</font>个红包可用）");
                            }
                            $('.redPapercon').hide();
                            var ele = $('.redbagsucess');
                            ele.find('strong').text(data.value);
                            ele.find('strong').attr('dhref',redbagid);
                            ele.find('strong').attr('plat',redbagplatid);
                            //ele.find('strong').attr('code',code);
                            ele.show();
                            //$('#coupon_price').data('price',parseInt(data.value));
                            $('#redbag_price').data('price',data.value);
                            $('#redbag_price span').text(data.value);
                            calPayPrice();
                           
                        }else{
                            var toppx = redbagc*35;
                            $('.usertip2').css('top',toppx);
                            $('.usertipcon2').html(data.msg);	
                            $('.usertip2').show();
                            setTimeout("$('.usertip2').fadeOut();",2000)
                        } 
                    }
                })
            
    });
    
    function deleteRedbag(code) {
                var ele = $('.redbagsucess');
                ele.find('strong').removeAttr('dhref')
                ele.find('strong').removeAttr('plat');
                ele.find('strong').text('0');
                ele.hide();
                $('#redbag_price').data('price','0');
                $('#redbag_price span strong').text('0');
                $('#redbag_td').hide();
                calPayPrice();
    }
    

    $('#checkout .tit').delegate('.change','click',function(e) {
        e.preventDefault();
        var _this = $(this);
        var stepId = _this.data('idx');
        //$('#new_address').attr("checked", false);
        $('#checkout .tab2').addClass('dn');
        checkStep(stepId);
    });
      
    
    $('#ckstep1').delegate('.addressList input','click',function(e){
        $('#new_address').attr("checked", false);
        $('#checkout .tab2').addClass('dn');
    });
    
    // $('#ckstep1').delegate('#ship_area','change',function(e){
        // check_shipping("area");
    // });   

    
    $('#saveAddress').click(function(e){
            save_address();
    });
    /*
    $('#address_area').delegate('#ship_province','change',function(e){
        e.preventDefault();
        load_cities();
    });
    $('#address_area').delegate('#ship_city','change',function(e){
        e.preventDefault();
        load_areas();
    });
    $('#address_area').delegate('#ship_area','change',function(e){
        e.preventDefault();
        load_towns();
    });
    */

    resetDeleteButton();
    checkLiLen();
    //新增地址
    $('.addnewadress').click(function(){
        //$('.tab2').removeClass('dn');
        //$('#ckstep1 input:radio[name="address_id"]').attr("checked", false);
        //$("#new_address").attr("checked", true);
        //$('#ckstep1').data('ck','');
    	if(checkLiMax()){
    		alert('只能添加10个收货地址');return false;
    	}
        clearAddressForm();
        //load_provinces();
        $('.newadress').show();	
    });
    
    //bianji
    $('.adressall').delegate('a.bianji','click',function(e){
    	e.preventDefault();
    	clearAddressForm();
    	setSelect($(this));
    	var id = $(this).closest('li').attr('rowid');
        $('#ckstep1').attr('currentRowid',id);
        $('#ckstep1').attr('data-ok',0);
        $("#new_address_type").val('edit');
        modifyaddress(id,e);
        $('.newadress').show();
        return false;
    });
    
    $('#cancelAddress').click(function(){
        addr_jump($('#new_address_id').val());//jump
        
    	clearAddressForm();
    	var l = $('.adressall').find('li').length;
    	if(l>0){
    		 $('#ckstep1').attr('data-ok',1);
    		 clearStep1Error();
    	}
    	
         $("#new_address_type").val('add');
		$('.newadress').hide();
		
    });
    
    //设置默认地址
    $('.adressall').delegate('.setDefault','click',function(e){
        e.preventDefault();
        var ts = $(this);
        var adid = ts.closest('li').attr('rowid');
        setDefaultAddress(adid);
    });
    
    //end 
    
    
    $('#ckstep1').delegate('.address .edit','click',function(e){
        e.preventDefault();
        var id = $(this).closest('.addressList').find('input').val();
        $('#ckstep1').data('ok',0);
        $(this).closest('.addressList').find('input').attr('checked', 'checked');
        $('.tab2').removeClass('dn');
        $("#new_address_type").val('edit');
        $('html,body').animate({scrollTop:$('.newadd').offset().top},400);
        modifyaddress(id,e);
    });

    
    $('#savePaywayAndShipping').click(function(e){
        e.preventDefault();
			var _form = $('.payment');
			var _data = {
                payway:_form.find('input[name="payway"]:checked').val(),
                shipping:_form.find('input[name="shipping"]:checked').val()
			}
			var def ='';
			var way = _form.find('input[name="shipping"]:checked');
			switch(_data.shipping){
				case 'common':
				def+='在线支付<br />普通快递 '+way.closest('.oldintro').find('.shipping_info').text();
				shippingPay = parseInt(way.closest('.oldintro').find('.shipping_fee').text());
				break;
				case 'sf':
				def+='在线支付<br />顺丰快递（到付）'+way.closest('.oldintro').find('.shipping_info').text();
				shippingPay = 0;
				break;
				default:
				def+='在线支付<br />普通快递 '+way.closest('.oldintro').find('.shipping_info').text();
				shippingPay = parseInt(way.closest('.oldintro').find('.shipping_info .shipping_fee').text());
			};
			_data.shippingPay = shippingPay ;
			$(this).closest('.curSel').hide();
			$('#ckstep2 .checkerr').hide();
			$('#ckstep2 .default').html(def).show();
			$('#total_shipping_fee span').text(shippingPay);//最后一步中运费显示
			
			//最后一步实付显示
			$('#ckstep2').data('ck',_data);
			$('#ckstep2').data('ok','1');
            $('#ckstep2 .change').show();
			// $('#ckstep2').removeClass('cur');
			calPayPrice();
			saveStep(1);
    });
    // $('#ship_province').change(function(){
        // load_citys();
    // })
    $('input[name="invoice"]').click(function(){
        if($(this).val()=='个人'){
            $('#invoiceCon').val('').hide();
            $('#ckstep3 #error_fp').hide();
        }else{
            $('#invoiceCon').show();
        }
    });
    //保存发票
    $('#saveInvoice').click(function(e){
        e.preventDefault();
        var _form = $('.invoice_w');
        var _data = {
            invoiceType:_form.find('input[name="invoice"]:checked').val(),
            invoicecon:_form.find('input[name="invoiceCon"]').val() 
        }
        if(_data.invoiceType=='单位'&&_data.invoicecon==''){
            $('#ckstep3 #error_fp').html('请输入单位名称').show();
            return false;
        }else{
            var count = _data.invoicecon.replace(/[^\x00-\xff]/g,"**").length;
            if(count>40){
                $('#ckstep3 #error_fp').html('单位名称过长，字数不超过20个汉字或40个字母!').show();
                return false;
            }
            $('#ckstep3 #error_fp').hide();
            var def ='';
            var way = _form.find('input[name="invoice"]:checked');
            switch(_data.invoiceType){
                case '个人':
                def+='普通发票  商品分类  '+_data.invoiceType;
                break;
                case '单位':
                def+='普通发票  商品分类  单位：'+_data.invoicecon;
                break;
                default:
            };
            $(this).closest('.curSel').hide();
            $('#ckstep3 .checkerr').hide();
            $('#ckstep3 .default').html(def).show();
            $('#ckstep3 .change').show();
            $('#ckstep3').attr('data-ck',_data.invoicecon);
            $('#ckstep3').data('ok','1');
            saveStep(2); 
        }
        
    });
    $('#placeOrder').click(function(e) {
        e.preventDefault();
        var tmpStep1 = $('#ckstep1');
        tmpStep1.data('ck', tmpStep1.attr('data-ck'));
        tmpStep1.data('ok', tmpStep1.attr('data-ok'));
        if(!finalCheckStep(1)||!finalCheckStep(3)) return false;   //只需要确认地址，配送支付信息目前无其他可选
        var _this = $(this);  
        var _data = {
            w : $(this).data('w'),//v2 houseid
            oid : $('#ckstep1').data('ck'),
            spid : $('#ckstep2').data('ck'),    //shipping and payment
            fp:$('#ckstep3').data('ck'),
            itemType:$('#itemType').data('ck')
        }
        /*if (!$('#ckContent #couponDiv').is(":hidden")) {
            _data.coupon = $('#couponDiv span.couponActive').data('code');
        }*/
        var useCode = $('.couponsucess span strong').attr('code');
        if(useCode != ''){
        	_data.coupon = useCode;
        }
        //红包
        var ele = $('.redbagsucess');
        var usrRedbagid=ele.find('strong').attr('dhref')
        if(usrRedbagid != ''){
        	_data.redbag_id = usrRedbagid;
        }
        //余额
        var balancePrice = $('#balance_price').data('price');
        if($('#c1').is(':checked') &&  balancePrice > 0) {
            _data.balance_price = balancePrice;
        }
        if(_data.itemType == 2){//直接购买
            _data.item_id = $('#itemDirect').data('id');
            _data.item_size = $('#itemDirect').data('size');
            _data.quantity = $('#itemDirect').data('quantity');
        }
        checkoutSubmit(_data,_this,e);
    });
    
    $('#couponFunc').click(function(){
        $('#couponDiv').show();
    });
    
    $('#couponDiv').delegate('#useCoupon','click',function(e){
        e.preventDefault();
        var code = $(this).prev('input').val();
        checkCoupon(code,e);
    });
    
    /*$('#couponDiv').delegate('.delCoupon','click',function(e){
        e.preventDefault();
        var code = $.trim($('#couponDiv span.couponActive').data('code'));
        deleteCoupon(code,e)
    });*/
    //取消使用代金券
    $('.couponsucess').delegate('.delCoupon','click',function(e){
        e.preventDefault();
        var code = $.trim($('.couponsucess strong').attr('code'));
        deleteCoupon(code,e)
    });
    //取消使用红包
    $('.redbagsucess').delegate('.delCoupon1','click',function(e){
        e.preventDefault();
        var code = $.trim($('.redbagsucess strong').text());
        deleteRedbag(code)
    });
    $('#checkout .delete').confirm({
        // alert('aa');
        msg:'确定要删除此地址？',
        onOK:function(e){
            var target = $(e.target);
            var id = target.data('ad');
            removeaddress(id,e);
        },
        onCancel:function(){
        }
    });    
    
});


function addressInfo(){
    var code = '';
    for (var i = 0; i < 4; i++) {
        code += parseInt(Math.random() * 9).toString();
    }
    var ret = {};
    $.ajax({
        url:"/user/cartOrder/getAddressInfo",
        type:"POST",
        data:{'code':code},
        dataType:"json",
        async:false,
        success:function(data){
            ret = data;
        }
    });
    return ret;
}


function clearStep1Error() {
	$('#ckstep1 .message').text('');
}

//重设默认地址
function resetDefaultAddress(id) {
	var searchEle = $('.adressall .f2');
	var targetEle = $('.adressall li[rowid="'+id+'"]');
    searchEle.find('.moren').hide();
	$('#ckstep1').find('.isDefault').removeClass('isDefault');
	searchEle.removeClass('f2');
	targetEle.find('.adress').addClass('f2');
	targetEle.find('.moren').show();
	targetEle.find('.setDefault').removeClass('isDefault').addClass('isDefault').hide();
}

//设置默认地址
function setDefaultAddress(id,e) {
    var _data = {aid:id};
    $.ajax({
        url: "/instant/order/setAjaxDefaultAdress",
        type:'POST',
        dataType:'json',
        data:_data,
        success: function(data){
        	if(data.code) {
        		resetDefaultAddress(id);
        	}
        	
        }
    });
}

function checkCurrentEle(a){
	var ele = $('#ckstep1');
	var b = ele.attr('currentRowid');
	if(a == b) {
		$('.newadress').hide();
		setAddressId(0);
		clearAddressForm();
	}
	if(ele.attr('data-ck') == a){
		ele.attr('data-ck','');
		ele.attr('data-ok',0);
	}
}
function resetDeleteButton(){
    $('.adressall .newdelete').confirm({
        msg:'确定要删除此地址？',
        onOK:function(e){
            var target = $(e.target);
            var id = target.closest('li').attr('rowid');
            removenewaddress(id,e);
            checkCurrentEle(id);
            checkLiLen();
            addr_jump(0);
        },
        onCancel:function(){
        }
    });
}

function reloadCarouselLite(){
	
	 $('#demo-01').jCarouselLite({
         btnPrev: '#prev-01',
         btnNext: '#next-01',
         visible:4,
		 scroll: 4,
		circular: false
     });
	 //$('#demo-01').unbind();
}

function checkLiMax() {
	if(arguments[0] == 'save')return false;
	
	var l = $('.adressall').find('li').length;
	var info = addressInfo();
	if(l != info.num) {
		l = parseInt(info.num);
	}
	return l >= 10 ? true : false;
}

function checkLiLen() {
	var l = $('.adressall').find('li').length;
	var prev = $('#prev-01'),next = $('#next-01');
        if(l > 3){
            $('.addres').show();
        }else{
            $('.addres').hide();
        }
	if(l <= 0){
		$('#demo-01').css('height','50px');
	}else{
		if(l <= 4) {
			prev.hide();
			next.hide();
			//$('#demo-01').css('margin-left','37px');
		}else{
			//prev.show();
			//next.show();
			//$('#demo-01').css('margin-left','9px');
		}
	}
	
}

//new delete
function removenewaddress(id,e) {
    var _data = {id:id};
    $.ajax({
        url: "/user/cartOrder/removeAddress",
        type:'POST',
        dataType:'json',
        context: document.body,
        data:_data,
        success: function(data){
			
			
			
            if (data.code == 0) {
                $('.adressall li[rowid="'+id+'"]').fadeOut("300", function (){
                    $(this).remove();
					
                    checkLiLen();
                    showAddress();
					
                    var l =  $('.adressall').find('li').length;
					//alert(l);
                    if(l<=0){
                    	initAddress();
                    }
					if (l==4 || l==8){
						//reloadCarouselLite();
					}
					if (l==8) {
						$('#next-01').trigger('click');
					}
					//reloadCarouselLite();
					checkLiLen();
                });
            }
        }
    });
}

//初始化地址
function initAddress(){
	  //$('.tab2').removeClass('dn');
      //$('#ckstep1 input:radio[name="address_id"]').attr("checked", false);
      //$("#new_address").attr("checked", true);
      $('#ckstep1').data('ck','');
      clearAddressForm();
      //load_provinces();
      $('.newadress').show();
}

function checkCoupon(code,e){
    //v2 add w
    var _data = {code:code, 'w' : $('#placeOrder').data('w'),itemType:$('#itemType').data('ck'),aid : $('#ckstep1').data('ck'),};
    if(_data.itemType == 2){//直接购买
        _data.item_id = $('#itemDirect').data('id');
        _data.item_size = $('#itemDirect').data('size');
        _data.quantity = $('#itemDirect').data('quantity');
    }
    $.ajax({
        url:'/instant/coupon/checkCouponNew',
        dataType:'json',
        type:'POST',
        data:_data,
        success:function(data){
            if (data.code<0) {
                var ele = $(e.target);
                var cName = (ele.attr('class'));
                if('btnuser' == cName) {
                	var y =ele.position().top+35;
                	var tip = $('.usertip');
                	if( scrollTop > 0)y = y - scrollTop -8;
    				tip.css('top',y).show();
    				tip.find('.usertipcon').text(data.msg);
    			   setTimeout("$('.usertip').fadeOut();",2000)
                }else if(ele.attr('id') == 'useCoupon'){
                	//cartTips(e,'err',data.msg);
					$('.useCouErrHtm').html(data.msg);	
					$('.useCouErr').show();
					setTimeout("$('.useCouErr').fadeOut();",2000)
                }
              
            }else if (data.code==1) {
               // $('#couponDiv').empty().append('<span class="couponActive" data-code="'+code+'" data-reduce="'+data.value+'">代金券减免 '+data.value+' 元 </span>&nbsp;<a class="delCoupon" href="javascript:;">取消</a>');
            	$('#couponDiv').empty();
            	var ele = $('.couponsucess');
                ele.find('strong').text(data.value);
                ele.find('strong').attr('code',code);
                ele.show();
            	//$('#coupon_price').data('price',parseInt(data.value));
                $('#getcouponlist strong').text('+点击使用代金券');
            	$('#coupon_price').data('price',data.value);
                $('#coupon_price span').text(data.value);
                calPayPrice();
                $('.ajaxcoupon').hide();
            }
            
           
        }
    })
}

function showCouponDiv(status) {
	var code = $('#couponsucess strong:first').attr('code');
	if(status == 3) {
		$('#couponDiv').toggle();
	}else{
		if(!code || code == '' ){
			$('#couponDiv').css('display', status == 1 ? 'block' : 'none');
		}
	}
}

//获取用户可用代金券
function getUserCouponList(){
	
	var a = $('.ajaxcoupon');
	if(a.length >0){
		a.toggle();
		if(a.is(':hidden')){
			$('.couponcon').hide();
			$('#getcouponlist strong').text('+点击使用代金券');
                        return false;
		}else{
			showCouponDiv(1);
			$('#getcouponlist strong').text('－使用代金券');
		}
	}
    var _data = {
        w : $('#placeOrder').data('w'),//v2 houseid
        aid : $('#ckstep1').data('ck'),
        spid : $('#ckstep2').data('ck'),    //shipping and payment
        fp:$('#ckstep3').data('ck'),
        itemType:$('#itemType').data('ck')
    }
    $.ajax({
        url:'/instant/coupon/getAjaxUserCouponList',
        dataType:'json',
        type:'POST',
        async:false,
        data:_data,
        success:function(data){
            if(data.content != '') {
            	var line = $('#coupon_line');
            	$('.ajaxcoupon').hide();
            	$(data.content).insertBefore(line);
            	$('#getcouponlist strong').text('－使用代金券');
            	scrollHeight = $("#scrollContent").height();
            	if(scrollHeight == 225){
            		$("#scrollContent").css('height','225px');
            		$('#divcontent').css('position','absolute');
            		getScrollBar();
            	}
            }else{
                return false;
            }
            if($('#couponDiv').is(':hidden')){
            	showCouponDiv(1);
            }else{
            	showCouponDiv(0);
            }
            
        }
    })
}

//获取用户可用红包
function getUserRedPaperList(){
	var a = $('.redPapercon');
        if(a.length >0){
            a.toggle();
            if(a.is(':hidden')){
                if($('#redbag_spec').val() != ''){
            
                        $('#getRedPaperList strong').html("+使用红包抵消部分总额<span class='redIcoSp1'>"+$('#redbag_spec').val()+"</span>");
                        return false;
                }else{
                        $.ajax({
                        url:'/order/getAjaxRedbagnum',
                        dataType:'json',
                        type:'POST',
                        async:false,
                        success:function(data){

                        $('#getRedPaperList strong').html("+使用红包抵消部分总额（您有<font color='red'>"+data+"</font>个红包可用）");

                        $('.redPapercon').hide();    
                         }
                     })
                 }

            }else{
                    $('#getRedPaperList strong').html('－使用红包<span class="redIcoSp2">&nbsp;</span>');
                    $('.redPapercon').show();
            }
            return false;
        }
	
}



function deleteCoupon(code,e) {
    var _data ={code:code}
    $.ajax({
        url:'/instant/coupon/cancelCoupon',
        dataType:'json',
        type:'POST',
        data:_data,
        success:function(data){
            if (data.code ==1) {
                $('#couponDiv').empty().append('<input type="text" value="" name="couponCode" placeholder="请输入代金券" class="inp w138"/><a href="#" id="useCoupon">使用代金券</a>');
                var coupon = $('#coupon_price').data('price');
                if(data.reduce == coupon) {
                    $('#coupon_price').data('price',0);
                    $('#coupon_price span').text(0);
                } else {   //for notice
                    $('#coupon_price').data('price',0);
                    $('#coupon_price span').text(0);
                }
                var ele = $('.couponsucess');
                ele.find('strong:first').attr('code','');
                ele.find('strong:first').text(0);
                ele.hide();
                calPayPrice();
                getUserCouponList();
            }else{
                window.location.href="/order"
            };
        }
    })
}


function checkoutSubmit(_data,_this,event){
    $.ajax({
            url:'/user/cartOrder/makeOrder',
            data:_data,
            dataType:'json',
            type:'POST',
            beforeSend:function(){
                _this.hide();
                _this.parent().append('<span class="spanloading" style="color:#c00;display:block;position:absolute;right:20px;bottom:20px;margin:10px 0">正在提交订单...</span>')
            },
            success:function(data){
               //*
               if (data.code==0) {
                   window.location.href="/user/cartOrder/pay/oid/"+data.oid;
               } else{
                    _this.show();
                    _this.parent().find('span.spanloading').remove();
                    cartTips(event,'err',data.msg);
                };
                //*/
               /**
                if (data.code==0) {
                    //window.location.href='/order/success/'+data.oc;
                    var i=0;
                     var inter = setInterval(function(){
                        if(i < data.polling_amount){
                             makeOrderResult(data.oc,inter,event);
                        }else{
                            _this.show();
                            _this.parent().find('span.spanloading').remove();
                            cartTips(event,'err',"服务器繁忙");
                            clearInterval(inter);
                        }
                       i++
                    },data.polling_interval)
                } else if(data.code == '-3'){
                	//_this.addClass('disabled');
                	 _this.show();
                     _this.parent().find('span.spanloading').remove();
                     //_this.unbind('click');
                     var ele = $('.custWarning');
                     ele.find('.skus').text(data.msg);
                	ele.show();
                } else if (data.code == '-9') {
                    window.location.reload();
                } else{
                    _this.show();
                    _this.parent().find('span.spanloading').remove();
                    cartTips(event,'err',data.msg);

                    if(data.changeStock) {
                        setTimeout(function(){
                            window.location.href='/cart';
                        },3000);
                    }    
                    
                };
                //*/
            }
        })
}
function makeOrderResult(ck_superior_order_code,inter,event){
        var _data ={ck_superior_order_code:ck_superior_order_code}
        var _this= $('#placeOrder');
        var ajax;
        if(ajax)
        {
            ajax.abort();
        }
        ajax =$.ajax({
            url:'/instant/order/makeOrderResult',
            data:_data,
            dataType:'json',
            type:'POST',
            beforeSend:function(){
                _this.hide();
                _this.parent().append('<span class="spanloading" style="color:#c00;display:block;position:absolute;right:20px;bottom:20px;margin:10px 0">正在提交订单...</span>')
            },
            success:function(data){
                if(data){
                    clearInterval(inter);
                    if (data.code==0) {
                        window.location.href='/order/success/'+data.oc;

                    } else{
                        _this.show();
                        _this.parent().find('span.spanloading').remove();
                        cartTips(event,'err',data.msg);

                        if(data.changeStock) {
                            setTimeout(function(){
                                window.location.href='/cart';
                            },3000);
                        }    

                    };
                }
            }
        })
}

function cartTips(e,flag,msg){
    var $tipsDelay  = 4000;
    $('.checkTipsErr').remove();
    $('.checkTips').remove();
    var _this;
    if (flag =="err") {
        _class = 'checkTipsErr'
    }else{
        _class = 'checkTips';
    };
    //console.log(e)
    if (e) {
        $('<p />')
            .addClass(_class)
            .css({opacity:0})
            .html(msg)
            .appendTo($('body'))
            .append('<i class="arr" />');
        
            if (flag =="err") {
                _this = $('.checkTipsErr');
            }else{
                _this = $('.checkTips');
            };
        _this.css({top:$(e.target).offset().top,left:_getLeft(),'z-index':9999,'margin-left':0})
        .animate({opacity:1,top:"-=30"},100)
        .delay($tipsDelay)
        .animate({opacity:0},500,function(){
            $(this).remove();
        });
    }
    function _getLeft(){
        return  $(e.target).offset().left - _this.width()/2;
    }
}
function modifyaddress(id,e) {
    var _data = {id:id};
    $.ajax({
        url: "/instant/order/editAddresss",
        type:'POST',
        dataType:'json',
        context: document.body,
        data:_data,
        success: function(data){
            if (data.code == 0) {
                $("#address_area").html(data.data.area);
                $("#new_address_id").val(data.data.info.id);
                if(data.data.info.name != '') {
                    $("#ship_name").val(data.data.info.name);
                }
                if(data.data.info.address != '') {
                    $("#ship_address_detail").val(data.data.info.address);
                }
                if(data.data.info.cell != '') {
                    $("#ship_mobile").val(data.data.info.cell);
                }
                if(data.data.info.phone !='') {
                    $("#ship_phone").val(data.data.info.phone);
                }
            }
        }
    });
}



function checkStep(stepIndex){
    var idx = parseInt(stepIndex);
    var errIdx = 0;
    for (var i = 0; i < stepIndex; i++) {
        var flag_ok = $('#checkout .conBlock').eq(i).attr('data-ok');
        if (flag_ok=='0') {
            errIdx = i+1;
            break;
        }
    };
    if (errIdx==0) {
        $('#ckstep'+stepIndex).data('ok',0);
        $('#ckstep'+stepIndex).find('.default,.change').hide();
        $('#ckstep'+stepIndex).find('.curSel').show();
    }else{
        //返回未完成步骤位置
        $('#checkout .conBlock').eq(errIdx-1).find('.checkerr').show();
        posY = $('#checkout .conBlock').eq(errIdx-1).position().top;
        $('html,body').animate({scrollTop:posY},400);
    };
}

function finalCheckStep(stepIndex){
    var idx = parseInt(stepIndex);
    var errIdx = 0;
    for (var i = 0; i < stepIndex; i++) {
        var flag_ok = $('#checkout .conBlock').eq(i).data('ok');
        if (flag_ok=='0') {
            errIdx = i+1;
            break;
        }
    };
    if (errIdx==0) {
        return true;
    } else {
        //返回未完成步骤位置
        $('#checkout .conBlock').eq(errIdx-1).find('.checkerr').show();
        posY = $('#checkout .conBlock').eq(errIdx-1).position().top;
        $('html,body').animate({scrollTop:posY},400,function(){
            return false;
        });
    }

}
$('#c1').click(function(){
        calPayPrice();
});
function calPayPrice(){
    var itemType = $('#itemType').data('ck');
    if(itemType > 0){
        var dealPrice = $('#pay_total').data('price');
    }else{
        var dealPrice = new Number($('#deal_price').data('price'));
    }

    var reduce_price = $('#reduce_price').data('price');
    if(!reduce_price || reduce_price == 'undefined'){
        reduce_price = 0; 
    }else{
        reduce_price = new Number(reduce_price);
    }
    

    var couponPrice = $('#coupon_price').data('price');
    var redbagPrice = $('#redbag_price').data('price');
    couponPrice = new Number(couponPrice);
    if(couponPrice != '' && couponPrice != 0) {
    	$('#coupon_td').show();
    }else{
    	$('#coupon_td').hide();
    }
    redbagPrice = new Number(redbagPrice);
    if(redbagPrice != '' && redbagPrice != 0) {
        $('#redbag_td').show();
    }else{
        $('#redbag_td').hide();
    }
    var shipping = $('#ckstep2').data('ck');
    if(typeof(shipping) != 'undefined' && shipping != '') {
        var shippingPrice = shipping;
    } else {
        var shippingPrice = $('#total_shipping_fee').data('price');
    }
     //税费
    var tax_price = $('#tax_price').data('price');
    var limit_tax = $('.taxrate').data('tax');
     if(!tax_price || tax_price == 'undefined'){
        tax_price = 0; 
    }
    tax_price = new Number(tax_price);
    if(tax_price <= limit_tax){
        tax_price = 0; 
    }
    if(!shippingPrice)shippingPrice=0;
    dealPrice = new Number(dealPrice);
    shippingPrice = new Number(shippingPrice);
    
    if($('#c1').is(':checked')) {
        var finalToal = dealPrice+shippingPrice+tax_price-couponPrice -reduce_price -redbagPrice;
        if(finalToal > 0){
            
            $.ajax({
                url:'/order/getUseBalance',
                dataType:'json',
                type:'POST',
                async:false,
                success:function(data){
                    if(data.status == 1){
                        $('#c1').next().html(data.balance_total);
                        if(data.balance_total > finalToal){
                            $('#balance_price').data('price',finalToal.toFixed(2));
                            $('#balance_price').find('span').html(finalToal.toFixed(2));
                        }else if(data.balance_total < finalToal){
                            $('#balance_price').data('price',data.balance_total);
                            $('#balance_price').find('span').html(data.balance_total);
                        }
                        $('#balance_td').show();
                    }
                }
            });
        }else{
            $("#c1").attr("disabled","disabled");
            $("#c1").attr("checked",false);
            $('#balance_price').data('price','0');
            $('#balance_price').find('span').html('0');
            $('#balance_td').hide();
        }
    }else{
        $('#balance_price').data('price','0');
        $('#balance_price').find('span').text('0');
        $('#balance_td').hide();
    }
    //检测账户余额
    var balancePrice = $('#balance_price').data('price');
    balancePrice = new Number(balancePrice);
    if(balancePrice != '' && balancePrice != 0) {
        $('#balance_td').show();
    }else{
        $('#balance_td').hide();
    }
    
    var finalToal = dealPrice+shippingPrice+tax_price-redbagPrice-couponPrice- reduce_price - balancePrice;
    
    finalToal = new Number(finalToal);
    finalToal = parseFloat(finalToal.toFixed(2));
    if(finalToal < 0) {
        finalToal = 0;
    }

    $('#pay_total span span').text(finalToal.toFixed(2));
    $('#lastPart .pink').text(finalToal.toFixed(2));
    if(finalToal == 0 && couponPrice >= (dealPrice + shippingPrice+tax_price)){
        $('#getRedPaperList strong').hide();
        var code = $.trim($('.redbagsucess strong').text());
        var ele = $('.redbagsucess');
                ele.find('strong').removeAttr('dhref')
                ele.find('strong').removeAttr('plat');
                ele.find('strong').text('0');
                ele.hide();
                $('#redbag_price').data('price','0');
                $('#redbag_price span strong').text('0');
                $('#redbag_td').hide();
                $("#c1").attr("disabled","disabled");
                $("#c1").attr("checked",false);
    }else{
        $('#getRedPaperList strong').show();
        $("#c1").removeAttr("disabled");
    }
}

function saveStep(n){
    posY = $('#checkout .conBlock').eq(n).position().top;
    $('html,body').animate({scrollTop:posY},400);
}

function save_address() {
	if (checkLiMax('save')) {
		return;
	}
	var isHidden = $(".tab2").is(":hidden");
	// 如果不隐藏重新获取用户填写的信息
	var shipping_id = null;
	var shipping_type = null;
	var shipping_provinceId = null;
	var shipping_cityId = null;
	var shipping_areaId = null;
	var shipping_townId = null;
	var shipping_name = null;
	var shipping_email = null;
	var shipping_address = null;
	var shipping_mobile = null;
	var shipping_phone = null;
	var shipping_provinceName = null;
	var shipping_cityName = null;
	var shipping_countyName = null;
	var shipping_townName = null;
	var is_default = 0;

    var is_check = true;
    // 验证收货人信息是否正确
    if (!check_shipping("name")) {
        is_check = false;
    }
    // 验证地区是否正确
    if (!check_shipping("area")) {
        is_check = false;
    }
    // 验证收货人地址是否正确
    if (!check_shipping("address")) {
        is_check = false;
    }
    // 验证手机号码是否正确
    if (!check_shipping("mobile")) {
        is_check = false;
    }
    // 验证电话是否正确
    if (!check_shipping("phone")) {
        is_check = false;
    }
    if (!is_check) {
        return;
    }
    
    is_default = 1;
    shipping_id = $("#new_address_id").val();
    shipping_type = $("#new_address_type").val();
    shipping_province_id = $("#ship_province").find("option:selected").val();
    shipping_city_id = $("#ship_city").find("option:selected").val();
    shipping_area_id = $("#ship_area").find("option:selected").val();
    shipping_town_id = typeof($("#ship_town").find("option:selected").val())!='undefined' ? $("#ship_town").find("option:selected").val():0;
    shipping_province_name = $("#ship_province").find("option:selected").text();
    shipping_city_name = $("#ship_city").find("option:selected").text();
    shipping_area_name = $("#ship_area").find("option:selected").text();
    shipping_town_name = !isEmpty(shipping_town_id)?$("#ship_town").find("option:selected").text():'';
    shipping_name = $("#ship_name").val();
    shipping_address = $("#ship_address_detail").val();
    shipping_mobile = $("#ship_mobile").val();
    shipping_phone = $("#ship_phone").val();
    if (shipping_phone == null || shipping_phone == "undefined") {
        shipping_phone = "";
    }
    
    var areaName = null;
    areaName = shipping_province_name + shipping_city_name + shipping_area_name;
    if (shipping_town_name != null && shipping_town_name != "") {
        areaName = areaName + shipping_town_name;
    }
    if(isEmpty(shipping_town_id)||$("#span_town").is(":hidden")) {
        shipping_town_id = 0;
    }
    var _data = {
        'addressid':shipping_id,
        'type':shipping_type,
        'truename':shipping_name,
        'prov':shipping_province_id,
        'city':shipping_city_id,
        'area':shipping_area_id,
        'town':shipping_town_id,
        'address':shipping_address,
        'mobile':shipping_mobile,
        'phone':shipping_phone,
        'from_cart':1
    };
	var url = '/user/cartOrder/saveAddress';
	$(".loading").css("display", "block");
	$.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : _data,
		cache : false,
		success : function(data) {
			if (data.code == 0) {
                window.location.reload();
                /*
                var tel;
                if (data.data.cell != '') {
                    tel = data.data.cell;
                }else{
                    tel = data.data.phone;
                };
                
                makeAddressEle(data.data,shipping_type);
                var addressword = data.data.provname+' '+data.data.cityname+' '+data.data.areaname+' '+data.data.townname+' '+data.data.address;
                var def='';
                def = data.data.name+'   '+tel;
                def +='<br />'+addressword;
                //edit
                if(shipping_id != '') {
                
                } else {
                	//add
               
                }
                $('#ckstep1').data('ok','1');
                $('#ckstep1').data('ck',data.data.id);
                
                /*$('#ckstep1 .checkerr').hide();
                $('#ckstep1 .curSel').hide();
                $('#ckstep1 .default').html(def).show();
                $('#ckstep1 .change').show();*/
                //clearAddressForm();       
			} else {
                if(data.msg) {
                    alert(data.msg);
                } else {
                    alert("系统繁忙，请稍后再试");
                }
			}
		},
		error : function(error) {
			alert("系统繁忙，请稍后再试");
		}
	});
}


function makeAddressEle(res, editType){
	var tpl = $('#tplAddr li:first');
	var phone = res.cell != '' ? res.cell : res.phone;
	var area =  res.provname+' '+res.cityname;
	var addressDetail = ' '+res.areaname+' '+res.townname;
	if(editType == 'add') {
        addr_jump(res.id);//直接跳转
		tpl = tpl.clone();
		var addUName = res.name;
		//判断name 小于8个字符
		tpl.find('.tplName').text(res.name);
        tpl.find('.adr1').text(res.address);
		tpl.find('.tplPhone').text(phone);
		tpl.find('.tplArea').text(area);
		tpl.find('.tplDetail').text(addressDetail+' '+res.address);
		tpl.attr('rowid', res.id);
		var len = $('.adressall').find('li').length;
		if (len > 0) {
			tpl.insertBefore($('.adressall li:first'));
		}else{
			$('.adressall').find('ul').append(tpl);
			//$('#prev-01').show();
			//$('#next-01').show();
			$('#demo-01').css('height','167px');
		}
		//jCar();
		checkLiLen();
		resetDeleteButton();

		var o = $('.adressall li[rowid="'+res.id+'"] .adress');
		adressClick(o);
		//reloadCarouselLite();
	}else{
		//编辑
		addr_jump(res.id);//直接跳转
		var b = $('.adressall li[rowid="'+res.id+'"]');
		var ele = b.find('.adress');
		ele.find('strong:first').text(res.name);

		ele.find('.area').text(area);
		ele.find('.phone').text(phone);
		ele.find('.adr1').text(addressDetail +' '+ res.address);
		showAddress();
	}
	strCut();//地址截断 orderxg.js		
	setAddressId(res.id);
	$('#ckstep1').attr('data-ok',1);
	$('.newadress').hide();
	clearAddressForm();
}

function addr_jump(aid) {
    window.location.href = '/user/cartOrder/changeAddr/'+aid;
}

function setAddressId(id) {
	var ele = $('#ckstep1');
	ele.attr('data-ck',id);
	ele.attr('data-ok', id ? 1 : 0);
    //addr_jump(id);
}

//显示选择的收货地址
function showAddress(){
	
	var ele = $('.adressall');
	var selectAddress = ele.find('.f2');
	var str = '';
	if(selectAddress.length > 0) {
		var name = selectAddress.find('strong:first').text();
		var phone = selectAddress.find('.phone').text();
        var area = selectAddress.find('.area > input').val();
		var adr1 = selectAddress.find('.adr1').text();
		var detail = selectAddress.find('strong').eq(1).text();
		str += '寄送至：';
        str += area; 
		str += adr1; 
		str += detail; 
		str += '<br/>收件人：';
		str += name;str += ' '+ phone;
        console.log(area);
		$('#ckstep1 span.checkerr').hide();
	}else{
		$('#addnewadress').trigger('click');
		//$('#ckstep1 span.checkerr').show();
	}
	$('.custWarning').hide();
	$('.sureaddress').html(str);
}

function check_shipping(tag) {
	var errorFlag = false;
	var errorMessage = null;
	var value = null;
    
	if (tag == "name") {
		value = $("#ship_name").val();
		if (isEmpty(value)) {
			errorFlag = true;
			errorMessage = "请您填写收货人姓名";
		}
		if (value.length > 25) {
			errorFlag = true;
			errorMessage = "收货人姓名不能大于25位";
		}
		if (!is_forbid(value)) {
			errorFlag = true;
			errorMessage = "收货人姓名中含有非法字符";
		}
	}
	else if (tag == "area") {
		var provinceId = $("#ship_province").find("option:selected").val();
		var cityId = $("#ship_city").find("option:selected").val();
		var areaId = $("#ship_area").find("option:selected").val();
		//var townId = $("#span_town").find("option:selected").val();
		// 验证地区是否正确
		if (isEmpty(provinceId) || isEmpty(cityId) || isEmpty(areaId)) {
			errorFlag = true;
			errorMessage = "请您填写完整的地区信息";
		}
	}
	// 验证收货人地址
	else if (tag == "address") {
		value = $("#ship_address_detail").val();
		if (isEmpty(value)) {
			errorFlag = true;
			errorMessage = "请您填写收货人详细地址";
		}
		if (!is_forbid(value)) {
			errorFlag = true;
			errorMessage = "收货人详细地址中含有非法字符";
		}
		if (value.length>50) {
			errorFlag = true;
			errorMessage = "收货人详细地址过长";
		}
	}
	// 验证手机号码
	else if (tag == "mobile") {
		value = $("#ship_mobile").val();
		if (isEmpty(value)) {
			errorFlag = true;
			errorMessage = "请填写收货人手机号码";
		} else {
			if (!check_mobile(value)) {
				errorFlag = true;
				errorMessage = "手机号码格式不正确";
			}
		}
		if (!errorFlag) {
			value = $("#ship_phone").val();
			if (!isEmpty(value)) {
				if (!is_forbid(value)) {
					errorFlag = true;
					errorMessage = "固定电话号码中含有非法字符";
				}
				if (!checkPhone(value)) {
					errorFlag = true;
					errorMessage = "固定电话号码格式不正确";
				}
			}
		}
	}
	// 验证电话号码
	else if (tag == "phone") {
        if(!$("#new_mobile_error").hasClass("message")) {
            value = $("#ship_phone").val();
            if (!isEmpty(value)) {
                if (!is_forbid(value)) {
                    errorFlag = true;
                    errorMessage = "固定电话号码中含有非法字符";
                }
                if (!checkPhone(value)) {
                    errorFlag = true;
                    errorMessage = "固定电话号码格式不正确";
                }
            }
            if (!errorFlag) {
                value = $("#ship_mobile").val();
                if (isEmpty(value)) {
                    errorFlag = true;
                    errorMessage = "请您填写收货人手机号码";
                } else {
                    if (!check_mobile(value)) {
                        errorFlag = true;
                        errorMessage = "手机号码格式不正确";
                    }
                }
            }
        }
	}
    
	if (errorFlag) {
		$("#new_" + tag + "_error").addClass("message").html(errorMessage);
		return false;
	} else {
		$("#new_" + tag + "_error").removeClass("message").html('');
	}
	return true;
}




function load_provinces() {
	var url = '/instant/order/get_provinces';
	$.ajax( {
		type : "POST",
		dataType : "text",
		url : url,
		data : null,
		cache : false,
		success : function(data, t) {
        if (data == -1) {
            redirectLogin();
            return;
        } else {
            $("#ship_province").html(data);
		}
	},
	error : function(e) {
		alert("系统繁忙，请稍后再试！");
		return false;
	}
	});
}


/**
 * 获取城市列表
 */
function load_cities() {
	var provinceId = $("#ship_province").find("option:selected").val();
	var provinceName=isEmpty(provinceId)?"":$("#ship_province").find("option:selected").text();
	$("#address_prefix").html(provinceName);
	if (provinceId == null || provinceId == "") {
		$("#ship_city").html("<select id=\"ship_city\" name=\"ship_city\"><option selected=\"\" value=\"\">请选择：</option></select>");
		$("#ship_area").html("<select id=\"ship_area\" name=\"ship_area\"><option selected=\"\" value=\"\">请选择：</option></select>");
		$("#span_town").html("");
		return;
	}
	var param = "province_id="+provinceId;
	var url = '/instant/order/get_cities';
	$.ajax( {
        type : "POST",
        dataType : "text",
        url : url,
        data : param,
        cache : false,
        success : function(data,t) {
            if (data == -1) {
                redirectLogin();return;
            } else if (data == -2) {
                alert("系统繁忙，请稍后再试！");return;
            } else {
                $("#ship_city").html(data);
                $("#ship_area").html("<select id=\"ship_area\" name=\"ship_area\"><option selected=\"\" value=\"\">请选择：</option></select>");
                $("#span_town").html("");
            }
        },
        error : function(e) {
            alert("系统繁忙，请稍后再试！");
            return false;
        }
		});
}


function load_areas() {
	var cityId = $("#ship_city").find("option:selected").val();
	var provinceName=$("#ship_province").find("option:selected").text();
	var cityName = isEmpty(cityId)? "": $("#ship_city").find("option:selected").text();
	$("#address_prefix").text(provinceName+cityName);    
	var param = "city_id="+cityId;
	var url = "/instant/order/get_areas";
	jQuery.ajax( {
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		cache : false,
		success : function(data,t) {
            if (data == -1) {
                redirectLogin();return;
            } else if (data == -2) {
                alert("系统繁忙，请稍后再试！");return;
            } else {
                $("#ship_area").html(data);
                $("#span_town").html('');
            }
	},
	error : function(e) {
		alert("系统繁忙，请稍后再试！");
		return false;
	}
	});
}


function load_towns() {
	var areaId = $("#ship_area").find("option:selected").val();
	var provinceName=$("#ship_province").find("option:selected").text();
	var cityName =  $("#ship_city").find("option:selected").text();
	var areaName =isEmpty(areaId)? "": $("#ship_area").find("option:selected").text();
	$("#address_prefix").text(provinceName+cityName+areaName);    
	var param = "area_id=" + areaId;
	var url = "/instant/order/get_towns";
	$.ajax( {
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		cache : false,
		success : function(data,t) {
            if (data == -1) {
                redirectLogin();return;
            } else if (data == -3) {
                $("#span_town").hide();
            } else if (data == -2) {
                alert("系统繁忙，请稍后再试！");return;
            } else {
                if (data != null && data != '') {
                    $("#span_town").html(data);
                    $("#span_town").show();
                } else {
                    $("#span_town").html("");
                    $("#span_town").hide();
                }
            }
	},
	error : function(e) {
		alert("系统繁忙，请稍后再试！");
		return false;
	}
	});
}

function redirectLogin() {
	window.location.href = '/login?url=/order&rid=' + Math.random();
}

function isEmpty(value) {
	if(value == null || value == "" || typeof(value) == "undefined" || value == "undefined" || value == undefined || value == "null"){
		return true;
	} else{
		value = value.replace(/\s/g,"");
		if(value == ""){
			return true;
		}
		return false;
	}
}

function is_forbid(temp_str){
    temp_str=trimTxt(temp_str);
	temp_str = temp_str.replace('*',"@");
	temp_str = temp_str.replace('--',"@");
	temp_str = temp_str.replace('/',"@");
	temp_str = temp_str.replace('+',"@");
	temp_str = temp_str.replace('\'',"@");
	temp_str = temp_str.replace('\\',"@");
	temp_str = temp_str.replace('$',"@");
	temp_str = temp_str.replace('^',"@");
	temp_str = temp_str.replace('.',"@");
	temp_str = temp_str.replace(';',"@");
	temp_str = temp_str.replace('<',"@");
	temp_str = temp_str.replace('>',"@");
	temp_str = temp_str.replace('"',"@");
	temp_str = temp_str.replace('=',"@");
	temp_str = temp_str.replace('{',"@");
	temp_str = temp_str.replace('}',"@");
	var forbid_str=new String('@,%,~,&');
	var forbid_array=new Array();
	forbid_array=forbid_str.split(',');
	for(i=0;i<forbid_array.length;i++){
		if(temp_str.search(new RegExp(forbid_array[i])) != -1)
		return false;
	}
	return true;
}

function trimTxt(txt){
    return txt.replace(/(^\s*)|(\s*$)/g,'');
}

function checkPhone(str){
   if(str.length > 20){
    return false;
   }
   var patternStr = "(0123456789-)";
   var  strlength=str.length; 
   for(var i=0;i<strlength;i++){ 
        var tempchar=str.substring(i,i+1); 
		if(patternStr.indexOf(tempchar)<0){
		    return false;
		}
   } 
   return true ; 
}


function check_mobile(mobile){
  var regu = /^\d{11}$/;
  var re = new RegExp(regu);
  if(!re.test(mobile)){
	 return  false;
  }
  var res = /^((13[0-9])|(15[0-9])|(14[57])|(17[0-9])|(18[0-9]))\d{8}$/;
  if (!res.test(mobile)) {
         return  false;
  }
  return true;
}


function checkMaxAddressNum(type) {
	var is_max = false;
	var current_num = $("#hidden_address_size").val();
	if (type == 'new') {
		if (current_num >= 10) {
			is_max = true;
		}
	} else if (type == 'save') {
		if (current_num > 10) {
			is_max = true;
		}
	}
	if (is_max) {
		$("#exceed_max_address_notice").css("display", "block");
		$("#tab2").hide();
	}
	return is_max;
}

function F(e,flag,msg){
    var $tipsDelay  = 3000;
    if (flag =="err") {
        _class = 'checkTipsErr'
    }else{
        _class = 'checkTips'
    };
    $('<p />')
        .addClass(_class)
        .css({opacity:0})
        .html(msg)
        .prependTo($('#lastPart'));

    if (flag == 'err') {
        _this = $('#lastPart').find('p.checkTipsErr').eq(0);
    }else{
        _this = $('#lastPart').find('p.checkTips').eq(0);
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

function removeaddress(id,e) {
    var _data = {id:id};
    $.ajax({
        url: "/instant/order/removeAddress",
        type:'POST',
        dataType:'json',
        context: document.body,
        data:_data,
        success: function(data){
            if (data.code == 0) {
                $('#ckstep1 .addressList #address_'+id).parent().fadeOut("500", function (){
                    $(this).remove()
                });
            }
        }
    });
}

function clearAddressForm() {
    $("#address_area select").find("option:selected").attr('selected',false);
    var a = $("#address_area");
    a.find('#ship_city option[value!=""]').remove();
    a.find('#ship_area option[value!=""]').remove();
    a.find('#span_town').hide();
    a.find('#ship_town option[value!=""]').remove();
    $("#new_address_id").val('');
    $("#ship_name").val('');
    $("#ship_address_detail").val('');
    $("#ship_mobile").val('');
    $("#ship_phone").val('');
    $("#address_prefix").empty();
    $("#new_address_type").val('add');      
}