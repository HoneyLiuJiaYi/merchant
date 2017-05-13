
$(function() {
    //delegate
    $('.adress').live('mouseenter', function() {
        var _this = $(this);
        //jCar ();
        $(this).addClass('adressover').parent().siblings().find('.adress').removeClass('adressover');
        //是否显示"设为默认"
        if ($(this).find('.szmr').hasClass('isDefault')) {
            //$(this).find('.editor').show();
            //$(this).find('.szmr').show();
        }else{
            $(this).find('.editor,.szmr').css('color','#fa4b9b').show();
        }
        $(this).find('.szmr').click(function(_this) {
            $(this).parents().siblings('.curRadio').attr('checked', true);
            //$(this).parents('li').siblings('li').find('.moren').hide();
            //$(this).parents('li').siblings('li').find('.szmr').hide();
        })
    }).live('mouseleave', function() {
        $(this).removeClass('adressover').siblings().removeClass('adressover');
        //$(this).find('.editor,.szmr').hide();
    })
    setTimeout(function(){
        $('.adress').live('click', function() {
            adressClick($(this));
        })
    },100);

})


//点击编辑按钮时
function setSelect(spanEdit){
	$('.newadress').hide();
	var obj = spanEdit.closest('.adress');
	obj.parents().siblings().find('.adress').removeClass('f2');
	obj.find('.defaultRad').attr('checked',true);
	obj.addClass('f2');
	showAddress();
	setAddressId(obj.parent().attr('rowid'));
}
function adressClick(obj) {
    addr_jump(obj.parent().attr('rowid'));//直接跳转
    
	$('.newadress').hide();
	clearAddressForm();
	obj.addClass('f2').parents().siblings().find('.adress').removeClass('f2');
	obj.find('.defaultRad').attr('checked',true);
	showAddress();
	setAddressId(obj.parent().attr('rowid'));
}
/*
var scrollHeight = 0;
function getScrollBar(){
	
	    var h = scrollHeight;
        var ih = $("#divcontent").height(); 
		
        var mh = parseInt(h*h/ih); 
        var h1 = parseInt($("#ypThumbContainer").height())-mh;//图片与div的高度差值

        var h2 = parseInt(ih - h);//内容与边框div的高度差值
        $(function(){ 
                if(ih > h){ 
                    $("#ypThumbContainer").show(); 
                    $("#ypThumb").find("img").height(mh); 
                    $("#ypThumb").show("slow"); 
                    //begin 
                    var oDiv = document.getElementById("ypThumbContainer"); 
                    var oDiv2 = document.getElementById("ypThumb"); 
                    var mouseStart={}; 
                    var divStart={}; 
                    var rightStart={}; 
                    var bottomStart={}; 
                    $(oDiv2).mousedown(function(ev){ 
                        var oEvent = ev||event; 
                        mouseStart.x = oEvent.clientX; 
                        mouseStart.y = oEvent.clientY; 
                        divStart.x = parseInt($(oDiv2).css("left")); 
                        divStart.y = parseInt($(oDiv2).css("top")); 
                        if(oDiv2.setCapture){ 
                            oDiv2.setCapture(); 
                            oDiv2.onmousemove = doDrag3; 
                            oDiv2.onmouseup = stopDrag3; 
                        }else{ 
                            $(oDiv).bind("mousemove",doDrag3).bind("mouseup",stopDrag3); 
                        } 
                        oEvent.preventDefault(); 
                    }); 
                    function doDrag3(ev) { 
                        var oEvent = ev||event; 
                        var t = oEvent.clientY-mouseStart.y+divStart.y; 
                        if(t < 0){ 
                            t = 0;                          
                        }else if(t >= $(oDiv).height()-$(oDiv2).height()){ 
                            t = $(oDiv).height()-$(oDiv2).height(); 
                        } 
                        //错误提示框用到
                        scrollTop = (t*h2/h1);
                        $(oDiv2).css("top",t+"px"); 
                        if(scrollTop == 0)scrollTop = scrollTop -8;
                        $("#divcontent").css("top",-(scrollTop+8)+"px"); 
                    }                 
                    function stopDrag3(){ 
                        if(oDiv2.releaseCapture){ 
                            oDiv2.releaseCapture(); 
                            oDiv2.onmousemove = null; 
                            oDiv2.onmouseup = null; 
                        }else{ 
                            $(oDiv).unbind("mousemove",doDrag3).unbind("mouseup",stopDrag3); 
                        } 

                    } 
                    //end 
                } 
            },function(){ 
                $("#ypThumbContainer").hide("slow"); 
                $("#ypThumb").hide("slow"); 
         });
	
}
*/
$(function(){
	$('.problemicon').hover(
		function(){$(".freightip.shipping_a").slideDown(200);},
		function(){$(".freightip.shipping_a").slideUp(200);}
	)

	
  var StringUtil = function(){
      this.LenB = function(str){
         return str.replace(/[^\x00-\xff]/g,"**").length;
      }
      this.subStr = function(str,size){
            if(str == null)
            {
                return "";
            }
            if(LenB(str) > size)
            {
                var l = 0;
                var lStr = "";
                var c;
                for(var i=0;i<str.length;i++)
                {
                    c = str.charAt(i);
                    l += LenB(c);
                    if(l>=size)
                    {
                        lStr = str.substring(0,i+1);
                        break;
                    }
                }
                lStr += "...";
                return lStr;
            }else
            {
                return str;
            }
      }
      return this;
  }();
	
})



//滚动条div
var check = false, scrollTop = 0;//是否可移动
$(document).ready(function(){ 
	//getScrollBar();
}); 
	//点击使用按钮弹出提示
		$(function(){
			
			$('.btnuser').live('click',function(e){
				var tr = $(this).closest('tr');
				var code = tr.find('td:first');
				$('input[name="couponCode"]').val(code.text());
				checkCoupon(code.text(),e);

			});
		})
	


//地址截断	

var StringUtil = function(){
      this.LenB = function(str){
         return str.replace(/[^\x00-\xff]/g,"**").length;
      }
      this.subStr = function(str,size){
            if(str == null)
            {
                return "";
            }
            if(LenB(str) > size)
            {
                var l = 0;
                var lStr = "";
                var c;
                for(var i=0;i<str.length;i++)
                {
                    c = str.charAt(i);
                    l += LenB(c);
                    if(l>=size)
                    {
                        lStr = str.substring(0,i+1);
                        break;
                    }
                }
                lStr += "...";
                return lStr;
            }else
            {
                return str;
            }
      }
      return this;
  }();

function strCut() {
	$('.adressall li').each(function() {
        _this = $(this);
		
		var ele = _this.find('.adr1');
		var ele2 = _this.find('.tplDetail');
		
		//alert(ele.html());
		var str = ele.html();
		ele.attr('title',str);
		ele.html(StringUtil.subStr(str, 80));
		
		var str = ele2.html();
		ele2.attr('title',str);
		ele2.html(StringUtil.subStr(str, 80));	  
    });
}
strCut();	

		