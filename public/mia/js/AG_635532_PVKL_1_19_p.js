try {
    (function(a,b,c,d){
    a[c]=function(){a[c]['ar']=a[c]['ar']||[];a[c]['ar'].push(arguments);};
    var s=b.createElement('script');s.async = 1;s.src='//t.agrantsem.com/js/agt.js';
    var r=b.getElementsByTagName('script')[0];r.parentNode.insertBefore(s,r);
    })(window,document,'_agtjs','script');
    _agtjs('init','AG_635532_PVKL','$website$');
    _agtjs('trackPv');
    
    var agtGetTopUrl = function() {
        var win=window;
        var doc=document;
        var topwin=window.top || window.parent || window;
    
        var localUrl = "";
        try{
            localUrl=topwin.location.href;
        }catch(err){
            localUrl=doc.referrer || win.location.href;
        }
        return localUrl;
    };
    var agtTopUrl = agtGetTopUrl();
    
    var agtCheckString = function(regular, str) {
        var re = new RegExp(regular);
        return re.test(str);
    };
    
    var agtBindClick = function(element,fn){
        if(element.attachEvent){
            element.attachEvent('onclick',fn);
        }else if(element.addEventListener){
            element.addEventListener('click',fn);
        }
    };
    
    var agtBindEventByTimer = function(selector,fn){
        var interval=setInterval(function(){
            var elements=_agtjs.Sizzle(selector);
            if(elements && elements.length>0){
                clearInterval(interval);
                for(var i in elements){
                    agtBindClick(elements[i],fn);
                }
            }
        },1000);
    };

    function getOrderNumber(){
		var index = agtTopUrl.indexOf('/order/success');
		if(index == -1)
		{
			return google_tag_params.agt_atsnum;
		}
		else
		{
			var orderNumber = agtTopUrl.substr(agtTopUrl.indexOf('/order/success')+15,19);
			if(orderNumber == '')
				orderNumber = google_tag_params.agt_atsnum;
			return orderNumber;
		}
	};

    function agt_102(){
        _agtjs('loadEvent',{atsev:102,'atssum':google_tag_params.agt_atssum,'atsnum':getOrderNumber(),'atsftb':google_tag_params.isolduser});
    }
    if (agtCheckString('/order/success',agtTopUrl)) {
        agt_102();
    }

    function agt_101(){
        _agtjs('loadEvent',{atsev:101,'atsusr':getcookie('sid')});
    }
    if (agtCheckString('/register/success',agtTopUrl)) {
        agt_101();
    }
	
    function agt_201(){
        _agtjs('loadEvent',{atsev:201,'atsowp':'$涓嬭浇娆℃暟$'});
    }
    if (agtCheckString('m',agtTopUrl)) {
agtBindEventByTimer('.btn',agt_201);
agtBindEventByTimer('#down_app',agt_201);
    }


    function agt_104(){
        _agtjs('loadEvent',{atsev:104,'atsbas':'$URL$'});
    }
    if (agtCheckString('m',agtTopUrl)) {
agtBindEventByTimer('#itemProcess',agt_104);
    }
    if (agtCheckString('m',agtTopUrl)) {
agtBindEventByTimer('.Fbutton btn-cart addShoppingCart',agt_104);
    }
    if (agtCheckString('m',agtTopUrl)) {
agtBindEventByTimer('.Fbutton',agt_104);
    }
    if (agtCheckString('m',agtTopUrl)) {
agtBindEventByTimer('.addToCart',agt_104);
    }



} catch (err) {
    console.log('err:' + err);
}