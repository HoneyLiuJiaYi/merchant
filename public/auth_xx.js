
function logout() {
    localStorage.clear();
    window.location.href = "./login.html";
}
$(function () {
    if(localStorage.length == 0){
        alert('请登录！');
        window.location.href = "./login.html";
    }
    var m_id = localStorage.m_id;
    var m_nick = localStorage.nick
    var mail = localStorage.mail;
    var mobile = localStorage.mobile;
    var rename =  localStorage.rename;
    var license = localStorage.license;
    var comment =  localStorage.comment;
    var logo =  localStorage.logo;
    var card =   localStorage.card;
    var sex =   localStorage.sex;
    if (sex == 'female') {
        sex = '女';
    }else {
        sex = '男';
    }
    var title = $("#title").text();
    if (title == "享洗小组-工厂站点管理页") {
        merchantStationList();
    }
    if (title == "享洗小组-骑手站点添加") {
        riderStationAdd();
    }
    if (title == "享洗小组-工厂站点添加") {
        merchantStationAdd();
    }
    var sidebar = '<section class="sidebar" style="height: auto;"><div class="user-panel"><div class="pull-left image"><img id="logo1"src="./public/1492093906700198.jpeg" class="logo img-circle" alt="User Image"></div><div class="pull-left info"><p class="user_local">享洗</p><a href=""><i class="fa fa-circle text-success"></i> Online</a></div></div><!-- search form --><form action="" method="get" class="sidebar-form"><div class="input-group"><input type="text" name="q" class="form-control" placeholder="Search..."><span class="input-group-btn"><button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button></span></div></form><!-- /.search form --><!-- sidebar menu: : style can be found in sidebar.less --><ul class="sidebar-menu"><li class="header">主功能区</li>' +
        '<li class="treeview"><a href=""><i class="fa fa-bars"></i><span> 品类</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./category_list.html"><i class="fa fa-reorder"></i> 所有品类</a></li></ul></li>' +
        '<li class="treeview"><a href=""><i class="fa fa-bars"></i><span> 商品管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./my_product_list.html"><i class="fa fa-reorder"></i> 我的商品</a></li><li><a href="./not_product_list.html"><i class="fa fa-plus"></i>添加商品</a></li></ul></li>' +
        '<li class="treeview"><a href=""><i class="fa fa-reorder"></i><span>站点管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./merchant_stations_list.html"><i class="fa fa-users"></i> 站点列表</a></li></ul></li><li class=" treeview"><a href=""><i class="fa fa-group"></i> <span> 订单管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./order_list.html"><i class="fa fa-reorder"></i> 订单列表</a></li><li class="active"><a href="./my_order.html"><i class="fa fa-reorder"></i> 我的订单</a></li></ul></li>' +
        '<li class="treeview"><a href=""><i class="fa fa-truck"></i> <span> 物流管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href=""><i class="fa fa-reorder"></i> 物流列表</a></li></ul></li><li class="treeview"><a href=""><i class="fa fa-user"></i> <span> 评价管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href=""><i class="fa fa-users"></i> 评价列表</a></li></ul></li><li class="treeview"><a href=""><i class="fa fa-user"></i> <span> 退货管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href=""><i class="fa fa-users"></i> 退货列表</a></li></ul></li></ul></section>';
    $(".main-sidebar").html(sidebar);
    $('.user_local').text(m_nick);
    $('#mail').text(mail);
    $('#mobile').text(mobile);
    $('#rename').text(rename);
    $('#sex').text(sex);
    $('#comment').text(comment);
//    alert(license);
//    alert($('#license').attr('src'));
    $('#license').attr('src', license);
    $('.logo').attr('src', logo);
    $('#card').attr('src', card);
    $('#logo1').attr('src', logo);
});

function merchantStationAdd() {
    $.ajax({
        url: 'http://180.76.141.171:81/merchant/unstation',
        type: 'post',
        dataType: 'json',
        data: {"merchant_id": localStorage.m_id},
        success: function (data) {
            var table = $("#example1 tbody")[0]

            var product_list = data.data.stations;//admins
            for (var i = 0; i < product_list.length; i++) {
                var tr = $("<tr></tr>");
                tr.appendTo(table);

                //添加id
                var td_product_id = $("<td>" + product_list[i].id + "</td>");
                td_product_id.appendTo(tr);
                //nick
                $("<td>" + product_list[i].name + "</td>").appendTo(tr);
                $('<td><a class="btn btn-danger btn-xs bind">绑定</a>').appendTo(tr);

            }

            $(".bind").each(function(event){
                $(this).click(function(event){

                    var station_id = $(this).parent().siblings(":first").text();
                    $.ajax({
                        url:'http://180.76.141.171:81/merchant/bind',
                        type:'post',
                        dataType: 'json',
                        data: {"merchant_id": localStorage.m_id, "station_id": station_id},
                        success:function(data){
                            if(data.status==0){
                                window.location.href = "merchant_stations_list.html";
                                alert("绑定成功");
                            }
                        },
                        error:function(){
                            alert("绑定失败");
                        }
                    });
                });
            });

        },
        error: function () {
            alert("error");
        }
    });

}
function merchantStationList() {
    $.ajax({
        url: 'http://180.76.141.171:81/merchant/station',
        type: 'post',
        dataType: 'json',
        data: {"merchant_id": localStorage.m_id},
        success: function (data) {
            var table = $("#example1 tbody")[0]
            var product_list = data.data.stations;//admins
            for (var i = 0; i < product_list.length; i++) {
                var tr = $("<tr></tr>");
                tr.appendTo(table);

                //添加id
                var td_product_id = $("<td>" + product_list[i].id + "</td>");
                td_product_id.appendTo(tr);
                //nick
                $("<td>" + product_list[i].name + "</td>").appendTo(tr);
                $('<td><a class="btn btn-danger btn-xs delete">解绑</a>').appendTo(tr);
            }

            $(".delete").each(function(event){
                $(this).click(function(event){

                    var station_id = $(this).parent().siblings(":first").text();
                    $.ajax({
                        url:'http://180.76.141.171:81/merchant/unbind',
                        type:'post',
                        dataType: 'json',
                        data: {"merchant_id": localStorage.m_id, "station_id": station_id},
                        success:function(data){
                            if(data.status==0){
                                window.location.href = "merchant_stations_list.html";
                                alert("解绑成功");
                            }
                        },
                        error:function(){
                            alert("解绑失败");
                        }
                    });
                });
            });



        },
        error: function () {
            alert("error");
        }
    });


    $('a[action="delete"]').on('click', function () {
        var id = $(this).attr('data');
        var me = $(this).parent().parent();
        $.ajax({
            url: './manager/user',
            type: 'get',
            dataType: 'json',
            success: function (data) {

                var product_list = data.admins;
                alert(product_list.length);
                for (var i = 0; i < product_list.length; i++) {
                    var tr = $("<tr></tr>");
                    tr.appendTo(table);

                    //添加id
                    var td_category_id = $("<td>" + product_list[i].id + "</td>");
                    td_category_id.appendTo(tr);
                    //
                    $("<td>" + product_list[i].nick + "</td>").appendTo(tr);

                }
            },
            error: function () {

            }
        });
    });
}