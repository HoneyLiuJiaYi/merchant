//$ZEUUX: product/hacker/ss/bs/zeuux-com-upload.uncompressed.js,v 1.20 2010/06/22 02:10:21 xiawu Exp $

var now = new Date();
var g_random = Math.random() + "_" + now.getTime();
var SESSION_KEY = "miaid";
var TARGET_SERVER_URL = "http://uploads.miabaobei.com/upload_web_koubei.php";

var interval = null;
var QUERY_INTERVAL = 1000;
var BAR_WIDTH = 300;

var pic_num = 0;

function sprintf()
{
    var num = arguments.length;
    var str = arguments[0];
    for (var i = 1; i < num; ++i) {
        var pattern = "\\$\\(" + (i-1) + "\\)";
        var re = new RegExp(pattern, "g");
        str = str.replace(re, arguments[i]);
    }
    return str;
}


jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value == null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

jQuery.get_cookie = function(key){
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var c = cookies[i];
		var start = c.indexOf(key);
		if (start >= 0) {
			return c.substring(start + key.length + 1);
		} 
	}
	
	return null;
};

jQuery.gen_expire_time = function(seconds){
	var d = new Date();
	var t = d.getTime();

	t += seconds;
	d.setTime(t);
	
	return d;
};


UploadProgress = {
    is_in_progress:function(prefix){
	if (document.getElementById(prefix + '_progress'))
	    return true;
	return false;
    },
    gen_progress_bar_html:function(prefix, total_width){
	var html = '<span id="$(0)_progress" class="upload-loader" total_width="$(1)" style="width:$(2)px;">' 
	+ '<img id="$(3)_progressbar" style="height:12px;width:0px;" src="/resources/images/line12.png"></span>';
	return sprintf(html, prefix, total_width, total_width, prefix);
    },
    cleanup:function(prefix, is_success){
	if (interval) {
	    window.clearInterval(interval);
	    interval = null;
	}
	
	var bar = document.getElementById(prefix + '_progressbar');
	var w = jQuery('#' + prefix + '_progress').attr('total_width');
	if (bar != undefined) {
	    if (is_success)
		jQuery(bar).css('width', w + 'px');
	    setTimeout(function() {jQuery('#' + prefix + '_progress').remove()}, 1000);
	}
    },
    set_progress:function(prefix, percent){
	var bar = document.getElementById(prefix + '_progressbar');
	var w = jQuery('#' + prefix + '_progress').attr('total_width');
	var width = 0;
	if (bar != undefined) {
	    try {
		width = parseInt(w) * percent;
		if (percent > 0)
		    jQuery(bar).css('width', width + 'px');
	    } catch(e){
	    }     
	}
    }
};


var DEFAULT_MAX_FILE_LIMIT = 10;
var DEFAULT_MAX_PER_FILE_SIZE_LIMIT = 4 * 1024 * 1024;
var g_engine_cache = new Array();
var g_success_file = new Array();


function uploadError(file, errorCode, message) {
    try {		
	switch (errorCode) {
	case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
	    break;
	case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
	    break;
	case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
	    break;
	case SWFUpload.UPLOAD_ERROR.IO_ERROR:
	    break;
	case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
	    break;
	case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
	    break;
	case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
	    break;
	case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
	    break;
	case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
	    break;
	case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
	    break;
	default:
	    break;
	}
	$('#' + file.id + '_fail').show();
	$('#' + file.id + '_action').show();
	this.file_cache[file.id] = false;
    } catch (ex) {
    }
}


function fileDialogStart() {
    /* I don't need to do anything here */
}

function delete_file(num, container_id, file_id)
{
    var engine = g_engine_cache[container_id];
    var file_sn = g_success_file[file_id];

    engine.cancelUpload(file_id);
    $('#' + file_id).remove();

    $("#picnum_"+num).remove();
    engine.setFileUploadLimit(engine.settings.file_upload_limit + 1);

    var v = $(engine.value_container).val().split(',');
    var new_v = new Array();
    for (var i = 0; i < v.length; i++) {
	if (v[i] != file_sn)
	    new_v.push(v[i]);
    }
    new_v = new_v.join(',');
    $(engine.value_container).val(new_v);
    engine.file_cache[file_id] = false;
    
    if (engine.callback_delete)
	engine.callback_delete(file_sn);
}

function modify_file(num)
{
    var url = $("input[name='picture_origin["+num+"]']").val();
    // url = 'http://img.miabaobei.com/'+url;
    url = 'http://img.miabaobei.com/'+url;
    $("#mtBlock").show();
    useXiuxiu('mt',url,num);
}


function fileQueued(file) {
    try {
	var container = $("#" + this.container_id + "_fc");
	var s = this.file_cache[file.id];
	if (s){
	    alert(file.name + " 已经在列表中，请不要重复添加");
	    return;
	}

	var cnt = 0;
	for (var t in this.file_cache)
	    if (this.file_cache[t])
		cnt += 1;
	if (cnt >= this.MAX_UPLOAD_FILE) {
	    msg = "最多可上传" + this.MAX_UPLOAD_FILE + "张图片！";
	    alert(msg);
	    return;
	}

	this.file_cache[file.id] = true;
    
	var html = sprintf('<span id="$(0)" class="file_item">', file.id)
	    + sprintf('<span class="filename" title="$(0)">$(1)</span>', file.name, file.name)
	    + sprintf('&emsp;<span class="size">$(0)K</span>', ((file.size+1023)/1024).toFixed()) 
	    + sprintf('&emsp;<span class="action" id="$(0)_progress_container"></span>', file.id) 
	    + sprintf('&emsp;&emsp;<span id="$(0)_status"></span>', file.id) 
	    + sprintf('&emsp;&emsp;<span id="$(0)_fail" style="display:none;">上传失败</span>', file.id) 
	    + sprintf('&emsp;&emsp;<span id="$(0)_action"><a href="javascript:delete_file(\'$(1)\',\'$(2)\')">删除</a></span>', file.id, this.container_id, file.id) 
	    + '</span>';
    /*
	if (container.find('.file_item').get(0))
	    container.append("<br/>" + html);
	else
	    container.html(html);
    */
    } catch (e) {
    }
}


function fileQueueError(file, errorCode, message) {
    var msg = null;
    try {
	switch (errorCode) {
	case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
	    msg = "一次最多可上传" + this.MAX_UPLOAD_FILE + "个文件！";
	    alert(msg);
	    break;
	case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
	    msg = sprintf("抱歉，每个文件须小于$(0)MB。", (this.MAX_PER_FILE_SIZE_LIMIT / (1024 * 1024)));
	    alert(msg);
	    break;
	case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
	    alert("空文件");
	    break;
	case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
	    alert("文件类型不支持");
	    break;
	case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
	    break;
	default:
	    alert("未知错误");
	    break;
	}
    } catch (e) {
	alert(e);
    }
}


function fileDialogComplete(numFilesSelected, numFilesQueued) {
     this.removePostParam('selcount');
     this.addPostParam('selcount', numFilesQueued);
     this.addPostParam(SESSION_KEY, UploadApp.get_session_id());
     
     if (numFilesQueued > 0) {
	 this.startUpload();
     }
}


function uploadStart(file) {
    try {
	jQuery('#' + file.id + '_status').hide();
	jQuery('#' + file.id + '_progress_container').show();
    }
    catch (ex) {
    }	    
    return true;
}


function uploadProgress(file, bytesLoaded, bytesTotal) {
    if (!UploadProgress.is_in_progress(file.id)) {
	var html = UploadProgress.gen_progress_bar_html(file.id, 100);
	jQuery('#' + file.id + '_progress_container').html(html).show();	       
    }
    var percent = bytesLoaded / bytesTotal;
    UploadProgress.set_progress(file.id, percent);
}


/*function uploadSuccess(file, serverData) {
    if (serverData.substring(0, 7) === "FILEID:") {
        var fileId = serverData.substring(7);
    }
    doInsertUpLoad(fileId);
}*/

function uploadSuccess(file, serverData) {
    if (serverData.indexOf("FILEID:") >= 0) {
        var s_con = serverData.split('FILEID:');
        if (this.callback_success) {
            this.callback_success(s_con[1], 0);
        } else {
            var ss_con = s_con[1].split('||');
            // var imgs_path = 'http://img.miabaobei.com/'+ss_con[1];    // for test
            var imgs_path = 'http://img.miabaobei.com/'+ss_con[1];
            var imgs = "<div class='queue' id='picnum_"+pic_num+"'><span class='cancel ver f14' onclick=delete_file('"+pic_num+"','id_upload_img_index','SWFUpload_0_"+pic_num+"')>×</span>";
            imgs += "<span class='modify ver f5' onclick=modify_file('"+pic_num+"','id_upload_img_index','SWFUpload_0_"+pic_num+"')>美</span><img src="+imgs_path+" width='100' height='100'/><input type=hidden name=picture["+pic_num+"] value="+ss_con[1]+"><input type=hidden name=picture_large["+pic_num+"] value="+ss_con[2]+"><input type=hidden name=picture_origin["+pic_num+"] value="+ss_con[0]+"><input type=hidden name=picture_middle["+pic_num+"] value="+ss_con[3]+"></div>";
            $("#up_p").show();
            $(imgs).appendTo("#image_index");
            pic_num = pic_num + 1;
        }
        
        //javascript:delete_file('id_upload_img_index','SWFUpload_0_0')
    }
}


function uploadComplete(file) {
    try {
        /*  I want the next upload to continue automatically so I'll call startUpload here */
        if (this.getStats().files_queued === 0) {
            document.getElementById(this.customSettings.cancelButtonId).disabled = true;
        } else {    
            this.startUpload();
        }
    } catch (ex) {
        this.debug(ex);
    }
}

UploadApp = {
    init:function(container_id,value_container_id, max_file, privacy, file_type, file_type_description, img_type, resource_id, callback_success, callback_delete, show_queue){
    	var html = sprintf('<span id="$(0)_bc"></span><div id="$(1)_fc"></div>', container_id, container_id);
    	jQuery('#' + container_id).html(html);
    	
    	var button_container_id = sprintf('$(0)_bc', container_id);

    	var current_max_file_limit = DEFAULT_MAX_FILE_LIMIT;
    	var current_max_per_file_size_limit = DEFAULT_MAX_PER_FILE_SIZE_LIMIT;

    	var file_types = "*.*";
    	var file_types_description = "all";
    	var button_image_url = '/resources/images/open_file_file.png';
    	if (!privacy)
    	    privacy = 1;
    	if (max_file)
    	    current_max_file_limit = max_file;
    	if (file_type)
    	    file_types = file_type;
    	if (file_type_description)
    	    file_types_description = file_types_description;
        //alert(value_container_id);alert(container_id);
    	var settings = {
    	    // Backend Settings
    	    upload_url: sprintf("$(0)", TARGET_SERVER_URL),
    	    post_params: {
                "PHPSESSID" : UploadApp.get_session_id(),
                "up_type": img_type,
                "resource_id":resource_id
    	    },
    	    // File Upload Settings
    	    file_size_limit : DEFAULT_MAX_PER_FILE_SIZE_LIMIT,	
    	    file_types : file_types,
    	    file_types_description : file_types_description,
    	    file_upload_limit : current_max_file_limit,
    	    file_queue_limit : "10",
    	    
    	    file_dialog_start_handler : fileDialogStart,
    	    file_queued_handler : fileQueued,
    	    file_queue_error_handler : fileQueueError,
    	    file_dialog_complete_handler : fileDialogComplete,
            prevent_swf_caching : false,
    	    upload_start_handler : uploadStart,
    	    upload_progress_handler : uploadProgress,
    	    upload_error_handler : uploadError,
    	    upload_success_handler : uploadSuccess,
    	    upload_complete_handler : uploadComplete,

    	    // Button Settings
    	    button_image_url : button_image_url,
    	    button_placeholder_id : button_container_id,
    	    button_width: 80,
    	    button_height: 22,
            button_action : SWFUpload.BUTTON_ACTION.SELECT_FILES,
    	    
    	    
    	    // Flash Settings
    	    flash_url : "http://uploads.miabaobei.com/flash/swfupload.swf",
    	    //custom_settings : {progressTarget : "id_fs_upload_progress"},
            custom_settings : {
                progressTarget : "fsUploadProgress1",
                cancelButtonId : "btnCancel1"
            },
    	    // Debug Settings
    	    debug: false
    	};

    	try {
    	    var upload_engine = null;
            if (show_queue) {
                settings.file_queued_handler = show_queue;
            }
            
    	    upload_engine = new SWFUpload(settings);
    	    upload_engine.container_id = container_id;
    	    upload_engine.file_cache = new Array();
    	    upload_engine.MAX_UPLOAD_FILE = current_max_file_limit;
    	    upload_engine.MAX_PER_FILE_SIZE_LIMIT = current_max_per_file_size_limit;
    	    upload_engine.value_container = '#' + value_container_id;
    	    if (callback_success)
    		upload_engine.callback_success = callback_success;
    	    if (callback_delete)
    		upload_engine.callback_delete = callback_delete;


    	    g_engine_cache[container_id] = upload_engine;
    	} catch(e) {
    	    alert(e);
    	}
    },
    get_session_id:function(){
//    	return "m32b3a34a59m5fos4p0lip48s5";
	var sessionid = jQuery.get_cookie(SESSION_KEY);
	if (!sessionid)
	    sessionid = jQuery.get_cookie('miaid');
	return sessionid;
    }
};
