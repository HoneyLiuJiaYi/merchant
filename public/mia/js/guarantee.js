(function(b){var c={imgarr:[],desarr:[],imgdomain:"",desLen:172,showDesCount:5};function a(e,d){this.opts=b.extend({},c,d);this.wrap=b(e);this.imgId="mysgimg";this.desId="mysgtab";this._index=0;this._left=0;this._count=this.opts.imgarr.length;this.lock=false;this.half_count=Math.floor(this.opts.showDesCount/2);this.limit_min=this._count-this.half_count;this._init()}a.prototype={_createHtml:function(){var e=this.opts;var d='<div class="mysgroll">            <a href="javascript:;" class="sl_left"></a><a href="javascript:;" class="sl_right"></a>            <div class="mysgcon" id="'+this.imgId+'"></div><div class="mysgdeswrap"><table class="mysgdes" id="'+this.desId+'">            <tr></tr></table></div></div>';this.wrap.html(d);d="";d+='<div class="mysgitem"><img src="'+e.imgdomain+e.imgarr[0]+'"></div>';b("#"+this.imgId).html(d);d="";b.each(e.desarr,function(f,g){if(f==0){d+='<td class="sel">'+g+"</td>"}else{d+="<td>"+g+"</td>"}});b("#"+this.desId).find("tr").html(d);d=null},_changeImg:function(){b("#"+this.imgId).find("img").attr("src",this.opts.imgdomain+this.opts.imgarr[this._index])},_toPre:function(){var f=this,d=100,e=b("#"+f.desId);if(f.lock||f._index<=0){return false}f.lock=true;f._index--;if(f._index>=f.limit_min-1||f._index<f.half_count){f._left+=0}else{f._left+=f.opts.desLen;d=150}e.animate({left:f._left},d,"",function(){e.find("td:eq("+f._index+")").addClass("sel").siblings().removeClass("sel");f._changeImg();f.lock=false})},_toNext:function(){var f=this,d=100,e=b("#"+f.desId);if(f.lock||f._index>=f._count-1){return false}f.lock=true;f._index++;if(f._index>=f.limit_min||f._index<=f.half_count){f._left-=0}else{f._left-=f.opts.desLen;d=150}e.animate({left:f._left},d,"",function(){e.find("td:eq("+f._index+")").addClass("sel").siblings().removeClass("sel");f._changeImg();f.lock=false})},_init:function(){console.log(this.limit_min);this._createHtml();this.wrap.find(".sl_left").on("click",b.proxy(this._toPre,this));this.wrap.find(".sl_right").on("click",b.proxy(this._toNext,this))}};b.fn.mysgroll=function(d){return new a(this,d)}})(jQuery);$(function(){$(".moduleFixed").moduleFixed({Zindex:5});var b=window.location.href.indexOf("#");if(b>0){var c=window.location.href.split("#");setTimeout(function(){$(window).scrollTop($("#"+c[1]).position().top-120)},0)}$(".moFixed li").click(function(){var f=$(this),e=f.index(),g=$(".datacon").eq(e).offset().top-120;$("html,body").stop().animate({scrollTop:g},1000);d()});$(window).scroll(function(){d()});$(window).resize(function(){d()});function d(){var e=$(document).scrollTop()+120;$(".datacon").each(function(g,f){var h=$(f).offset().top;if(e>=h){a(g)}})}function a(e){var f=$(".moFixed li");f.each(function(g){if(e!=g&&$(this).hasClass("current")){f.removeClass("current")}else{if(!$(this).hasClass("current")&&e==g){$(this).addClass("current")}}})}});$(function(){if(!$(".scroller").length){return}var a=$(".scroller");var m=a.find(".scrollwidth");var c=a.find(".prev");var f=a.find(".next");var g=m.find(".scrollitem");var d=g.width();var b=0;g.each(function(){b+=$(this).width()});m.css("width",b);var k=g.length;var i=1;var l=Math.ceil(k/i);var j=0;if(k>i){c.show();f.show()}function h(o){if(o==0){c.hide()}else{if(o==l-1){f.hide()}else{f.show();c.show()}}}h(0);function e(n){if(!m.is(":animated")){if(n=="left"){j--;if(j<=-1){j=0;return false}m.animate({left:"+="+d});h(j)}if(n=="right"){j++;if(j>=l){j=l-1;return false}m.animate({left:"-="+d});h(j)}}}c.click(function(n){n.preventDefault();e("left")});f.click(function(n){n.preventDefault();e("right")})});