$(document).ready(function() {
    $('#myEamil').blur(function(){
        verifyEmail();
             
    });
    
    $('#emailSubmit').click(function(e) {
        e.preventDefault();
        checkEmailIsVerified();
    });
    
    $('#emailVerifiedCode,#emailVerifiedRefresh').click(function(e){
        e.preventDefault();
        $('#emailVerifiedCode').attr("src","/account/login/authcode/"+Math.random());
    });
    
    
    $('#reSendEmail').click(function(e) {
        e.preventDefault();
        reSendEmail();
    });
    $('#truename').focus(function(event) {
         $('#nameError').hide();
    });
    $('#idnumber').focus(function(event) {
         $('#idnumberError').hide();
    });
    $('#idSubmit').click(function(event) {
        if (checktrueName() && checkIDNumber() ) {
            var imgname = [];
            $(".imgname").each(function(){
                imgname.push($(this).attr('title'));
            })            
            var _data = {
                truename:$('#truename').val(),
                idNumber:$('#idnumber').val(),
                imgname: imgname
            }
            $.ajax({
                url: '/instant/profile/idVerify',
                type: 'POST',
                dataType: 'json',
                data: _data,
                success:function(data){
                    if(data.code == 1) {
                        alert('实名认证提交成功');
                        window.location.href='/home/account/idStatus';
                    } else {
                        alert(data.msg);
                        window.location.reload();                        
                    }
                }
            })
        }else{
            $('body,html').stop().animate({scrollTop:0}, 250)
            return false
        }

    });
});
function checktrueName(){
    if (/^[\u4e00-\u9fa5]{2,4}$/.test($('#truename').val())) {
        return true
    }else{
        $('#nameError').show().text('请输入真实姓名');
        return false
    }
}
function checkIDNumber(){
    if (getIdCardInfo($('#idnumber').val())) {
        return true
    }else{
        $('#idnumberError').show().text('请输入正确的身份证号码');
    }
}
//--身份证号码验证-支持新的带x身份证
function getIdCardInfo(cardNo) {
    var info = {
        isTrue : false,
        year : null,
        month : null,
        day : null,
        isMale : false,
        isFemale : false
    };
    if (!cardNo && 15 != cardNo.length && 18 != cardNo.length) {
        info.isTrue = false;
        return info.isTrue;
    }
    if (15 == cardNo.length) {
        var year = cardNo.substring(6, 8);
        var month = cardNo.substring(8, 10);
        var day = cardNo.substring(10, 12);
        var p = cardNo.substring(14, 15); //性别位
        var birthday = new Date(year, parseFloat(month) - 1,
                parseFloat(day));
        // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法  
        if (birthday.getYear() != parseFloat(year)
                || birthday.getMonth() != parseFloat(month) - 1
                || birthday.getDate() != parseFloat(day)) {
            info.isTrue = false;
        } else {
            info.isTrue = true;
            info.year = birthday.getFullYear();
            info.month = birthday.getMonth() + 1;
            info.day = birthday.getDate();
            if (p % 2 == 0) {
                info.isFemale = true;
                info.isMale = false;
            } else {
                info.isFemale = false;
                info.isMale = true
            }
        }
        return info.isTrue;
    }
    if (18 == cardNo.length) {
        var year = cardNo.substring(6, 10);
        var month = cardNo.substring(10, 12);
        var day = cardNo.substring(12, 14);
        var p = cardNo.substring(14, 17)
        var birthday = new Date(year, parseFloat(month) - 1,
                parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (birthday.getFullYear() != parseFloat(year)
                || birthday.getMonth() != parseFloat(month) - 1
                || birthday.getDate() != parseFloat(day)) {
            info.isTrue = false;
            return info.isTrue;
        }
        var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子  
        var Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X 
        // 验证校验位
        var sum = 0; // 声明加权求和变量
        var _cardNo = cardNo.split("");
        if (_cardNo[17].toLowerCase() == 'x') {
            _cardNo[17] = 10;// 将最后位为x的验证码替换为10方便后续操作  
        }
        for ( var i = 0; i < 17; i++) {
            sum += Wi[i] * _cardNo[i];// 加权求和  
        }
        var i = sum % 11;// 得到验证码所位置
        if (_cardNo[17] != Y[i]) {
            return info.isTrue = false;
        }
        info.isTrue = true;
        info.year = birthday.getFullYear();
        info.month = birthday.getMonth() + 1;
        info.day = birthday.getDate();
        if (p % 2 == 0) {
            info.isFemale = true;
            info.isMale = false;
        } else {
            info.isFemale = false;
            info.isMale = true
        }
        return info.isTrue;
    }
    return info.isTrue;
}
function checkDate(strInputDate) {
  // 定义一个月份天数常量数组
  var DA = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // 统一日期格式
  strDate = strInputDate.replace(/-/g, "/");

  //判断日期是否是预期的格式
  if (strDate.indexOf("/") == -1) {
        return false;
  }

  // 分解出年月日
  arrD = strDate.split("/");
  if (arrD.length != 3) return false;
  y = parseInt(arrD[0], 10);
  m = parseInt(arrD[1], 10);
  d = parseInt(arrD[2], 10);

  //判断年月日是否是数字
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;

  // 判断月份是否在1-12之间
  if (m > 12 || m < 1) return false;
  //判断是否是闰年
  if (isLoopYear(y)) DA[2] = 29;

  //判断输入的日是否超过了当月月份的总天数。
  if (d > DA[m]) return false;

  //各种条件都验证了，则应该是一个合法的日期了。
  // 如果要对日期进行一次格式化，则可以在这里进行处理了，下面格式化成数据库识别的日期格式 yyyy-MM-dd
  // str = y + "-" + (m<10?"0":"") + m + "-" + (d<10?"0":"") + d;
  str = y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  alert(str)
  return true;
}
function isLoopYear(theYear) {
  return (new Date(theYear, 1, 29).getDate() == 29);
}
function verifyEmail() {
    if(checkEmail()) {
        return true;
    }
    return false;
}

function reSendEmail() {
    var email = $.trim($('#hiddenEamil').val());
    sendEmail(email,2,0);
}


function checkEmailIsVerified(){
    var email = $.trim($("#myEamil").val());
    var vc = $.trim($('#authCode').val());
    if(checkEmail() && checkAuthCode()) {
        $.ajax({
            url:"/instant/account/checkEmailIsVerifyCode",
            type:"POST",
            data: {'email':email,'ac':vc},
            dataType:"html",
            success:function(data){
                $('#acError').text('').hide();
                $("#emailError").text('').hide();
                if(data == 0){
                    sendEmail(email,2,1);
                }
                else if (data == -2){
                    $('#acError').text('验证码错误').show();
                    $('#emailVerifiedCode').attr("src","/account/login/authcode/"+Math.random());                    
                }
                else if (data == -1){
                    window.location.href="/login?url=/my_emailverify";
                }
                else {
                    $("#emailError").html("邮箱已被使用").show();
                    $('#emailVerifiedCode').attr("src","/account/login/authcode/"+Math.random());                    
                }
            }
        });
    }
}

function sendEmail (email,type,redirect)
{
    $.ajax({
        url:"/instant/account/sendCheckEmail",
        type:"POST",
        data: {'email':email,'type':type},
        dataType:"json",
        beforeSend:function(){
            $('#emailSubmit,#reSendEmail').unbind('click').attr('disabled',true).html('正在发送中');
        },        
        success:function(data){
            if(data.code == 1){
                if(redirect == 1) {
                    window.location.href="/my_emailsendsuccess?e="+email;
                } else {
                    $('#emailSubmit,#reSendEmail').unbind('click').attr('disabled',true).hide();
                }
            } else {
                alert('邮件发送失败，请5秒后重试');
                windows.location.reload();
            }
        }
    });
}

function checkEmail(){
	var email = $.trim($("#myEamil").val());
	if(!email){
		$("#emailError").html("请输入邮箱").show();
		return false;
	}
	if (email.replace(/[^\x00-\xff]/g, "**").length > 50) {
		$("#emailError").html("邮箱只能在50个字符以内").show();
		return false;
	}
	var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	if (email.replace(/[^\x00-\xff]/g, "**").length <= 4 || !reg.test(email)) {
		$("#emailError").html("邮箱格式不正确，请重新输入").show();
		return false;
	}
	$("#emailError").html("").hide();
	return true;
}

function checkAuthCode() {
    var vc = $.trim($('#authCode').val());
    var myreg = /^[0-9a-zA-Z]{4,6}$/;
    if (vc != '' && myreg.test(vc)){
        $('#acError').text('').hide();
        return true;
    }
    else {
        $('#acError').text('验证码错误').show();
        return false;
    }    
}