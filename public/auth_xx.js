
function logout() {
    localStorage.clear();
    window.location.href = "./login.html";
}
$(function () {
    var title = $("#title").text();
    if(localStorage.length == 0){
        if (title != "享洗小组-工厂登录") {
            alert('请登录！');
            window.location.href = "./login.html";
        }
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
    if (title == "享洗小组-工厂站点管理页") {
        merchantStationList();//1
    }
    if (title == "享洗小组-骑手站点添加") {
        riderStationAdd();//1
    }
    if (title == "享洗小组-工厂站点添加") {
        merchantStationAdd();
    }
    if (title == "享洗小组-品类管理") {
        categoryList();
    }
    if (title == "享洗小组-商品添加") {
        notProductList();
    }
    if (title == "享洗小组-统计") {
        statisticLog();
    }
    if (title == "享洗小组-工厂驿站管理") {
        stationList();
    }
    if (title == "享洗小组-订单列表") {
        orderList();
    }
    if (title == "享洗小组-工厂注册") {
        // merchantLogin();
    }
    if (title == "享洗小组-商品列表") {
        goodList();
    }
    if (title == "享洗小组-其他商品列表") {
        notProductList();
    }
    if (title == "享洗小组-我的商品列表") {
        myProductList();
    }
    if (title == "享洗小组-日志") {
        merchantLog();
    }
    if (title == "享洗小组-我的订单列表") {
        myOrder();
    }
    if (title == "享洗小组-首页") {
        // merchantIndex();
    }
    if (title == "享洗小组-商户结算管理") {
        settlement();
    }
    var sidebar = '<section class="sidebar" style="height: auto;"><div class="user-panel"><div class="pull-left image"><img id="logo1"src="./public/1492093906700198.jpeg" class="logo img-circle" alt="User Image"></div><div class="pull-left info"><p class="user_local">享洗</p><a href=""><i class="fa fa-circle text-success"></i> Online</a></div></div><!-- search form --><form action="" method="get" class="sidebar-form"><div class="input-group"><input type="text" name="q" class="form-control" placeholder="Search..."><span class="input-group-btn"><button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button></span></div></form><!-- /.search form --><!-- sidebar menu: : style can be found in sidebar.less --><ul class="sidebar-menu"><li class="header">主功能区</li>' +
        '<li class="treeview"><a href=""><i class="fa fa-bars"></i><span> 品类</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./category_list.html"><i class="fa fa-reorder"></i> 所有品类</a></li></ul></li>' +
        '<li class="treeview"><a href=""><i class="fa fa-bars"></i><span> 商品管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./my_product_list.html"><i class="fa fa-reorder"></i> 我的商品</a></li><li><a href="./not_product_list.html"><i class="fa fa-plus"></i>添加商品</a></li></ul></li>' +
        '<li class="treeview"><a href=""><i class="fa fa-reorder"></i><span>站点管理</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu"><li class="active"><a href="./merchant_stations_list.html"><i class="fa fa-users"></i> 站点列表</a></li></ul></li><li class=" treeview"><a href=""><i class="fa fa-group"></i> <span> 订单管理</span> <i class="fa fa-angle-left pull-right"></i></a>' +
        '<ul class="treeview-menu"><li class="active"><a href="./order_list.html"><i class="fa fa-reorder"></i> 订单列表</a></li><li class="active"><a href="./my_order.html"><i class="fa fa-reorder"></i> 我的订单</a></li><li class="active"><a href="./merchant_log.html"><i class="fa fa-reorder"></i> 流水管理</a></li></ul></li>' +
        '<li class="treeview"><a href=""><i class="fa fa-user"></i> <span> 统计</span> <i class="fa fa-angle-left pull-right"></i></a>' +
        '<ul class="treeview-menu"><li class="active"><a href="./statistic_log.html"><i class="fa fa-users"></i> 收入统计</a></li></ul>' +
        '<ul class="treeview-menu"><li class="active"><a href="./settlement.html"><i class="fa fa-users"></i> 结算统计</a></li></ul>' +
        '</li>' +
        '</ul></section>';
    $(".main-sidebar").html(sidebar);
    $('.user_local').text(m_nick);
    $('#mail').text(mail);
    $('#mobile').text(mobile);
    $('#rename').text(rename);
    $('#sex').text(sex);
    $('#comment').text(comment);
    $('#license').attr('src', license);
    $('.logo').attr('src', logo);
    $('#card').attr('src', card);
    $('#logo1').attr('src', logo);
});

function settlement(){
    $.ajax({
        url: 'http://180.76.233.59/settlement/get',
        type: 'post',
        data: "merchant_id=" + localStorage.m_id,
        dataType: 'json',
        success: function (data) {
            $('#totalPrice').val(data.data.price);
            var table = $("tbody")[0];
            var settlements = data.data.settlement;//admins
            for (var i = 0; i < settlements.length; i++) {
                var tr = $("<tr></tr>");
                tr.appendTo(table);
                $("<td>" + settlements[i].price + "</td>").appendTo(tr);
                $("<td>" + settlements[i].product + "</td>").appendTo(tr);
                $("<td>" + settlements[i].category + "</td>").appendTo(tr);
                $("<td>" + settlements[i].product_num + "</td>").appendTo(tr);
                $("<td>" + settlements[i].time + "</td>").appendTo(tr);
                $("<td>" + settlements[i].order_id + "</td>").appendTo(tr);
                if(settlements[i].is_settlement == 0){
                    $('<td><button class="btn btn-danger btn-xs stop">已结算</button></td>').appendTo(tr);
                }else{
                    $('<td><button class="btn btn-danger btn-xs active">未结算</button></td>').appendTo(tr);
                }
            }
        },
        error: function () {
            alert("error");
        }
    });

    $.ajax({
        url: 'http://180.76.233.59:81/category/list',
        type: 'post',
        dataType: 'json',
        success: function (data) {
            var select = $("#sel");
            var category = data.data.categories;//admins
            for (var i = 0; i < category.length; i++) {
                $("<option value='" + category[i].id + "'>" + category[i].name + "</option>").appendTo(select);
            }
        },
        error: function () {
            alert("error");
        }
    });

     $('#from').datetimepicker();

    $('#make').click(function(){
        $('tbody').text('');
        var dataJson = {};
        dataJson.merchant_id = localStorage.m_id;
        if ($('.from').val() != null && $('.from').val() != "" && $('.from').val() != undefined){
            dataJson.data_from = $('.from').val();
        }
        if ($('#sel').val() != "全部品类"){
            dataJson.category_id = $('#sel').val();
        }
        $.ajax({
            url: 'http://180.76.233.59/settlement/get',
            type: 'post',
            data: dataJson,
            dataType: 'json',
            success: function (data) {
                $('#totalPrice').val(data.data.price);
                var table = $("tbody")[0];
                var settlements = data.data.settlement;//admins
                for (var i = 0; i < settlements.length; i++) {
                    var tr = $("<tr></tr>");
                    tr.appendTo(table);
                    $("<td>" + settlements[i].price + "</td>").appendTo(tr);
                    $("<td>" + settlements[i].product + "</td>").appendTo(tr);
                    $("<td>" + settlements[i].category + "</td>").appendTo(tr);
                    $("<td>" + settlements[i].product_num + "</td>").appendTo(tr);
                    $("<td>" + settlements[i].time + "</td>").appendTo(tr);
                    $("<td>" + settlements[i].order_id + "</td>").appendTo(tr);
                    if(settlements[i].is_settlement == 0){
                        $('<td><button class="btn btn-danger btn-xs stop">已结算</button></td>').appendTo(tr);
                    }else{
                        $('<td><button class="btn btn-danger btn-xs active">未结算</button></td>').appendTo(tr);
                    }
                }
            },
            error: function () {
                alert("error");
            }
        });
    });

    $('#download').click(function(){
        window.location.href="http://180.76.233.59/download";
    });

    $('#withdraw').click(function(){
        $.ajax({
            url:'http://180.76.233.59/withdraw',
            type:'post',
            dataType: 'json',
            data: "merchant_id=" + localStorage.m_id,
            success:function(data){
                if(data.status==0){
                    alert("成功结算" +　data.data.price + "元");
                    window.location.reload();
                }
            },
            error:function(){
                alert("error");
            }
        });
    });
}

function notProductList() {
    $.ajax({
        url: hostMerchantUrl+"/merchant/unproduct",
        type: "post",
        data: "merchant_id=" + localStorage.m_id,
        async: "false",
        dataType: "json",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var products = data.data.products;
                var tbody = $('tbody');
                for (var i = 0 ; i < products.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td name="id">' + products[i].id + '</td>').appendTo(tr);
                    $('<td>' + products[i].name + '</td>').appendTo(tr);
                    $('<td><img src="' + products[i].logo + '"/></td>').appendTo(tr);
                    $('<td>' + products[i].created_at + '</td>').appendTo(tr);
                    $('<td>' + products[i].updated_at + '</td>').appendTo(tr);
                    $('<td><input type="text" placeholder="价格" name="price"> <button class="btn btn-danger btn-xs stop" name="bind" >绑定</button></td>').appendTo(tr);
                }
                $('button[name=bind]').click(function(){
                    var id = $(this).parent().parent().find("td[name=id]").text();
                    var price = $(this).prev().val();
                    var dataJson = {};
                    dataJson.merchant_id = localStorage.m_id;
                    dataJson.product_id = id;
                    dataJson.price = price;
                    $.ajax({
                        url: hostMerchantUrl+"/merchant/product/bind",
                        type: "post",
                        data: dataJson,
                        dataType: "json",
                        async: "false",
                        success: function(data){
                            if (data.status == 0){
                                alert('绑定成功');
                                window.location.href='./my_product_list.html';
                            } else {
                                alert('绑定失败');
                            }
                        }
                    });
                });
            }
        },error: function(){
                alert("fuck");
        }
    });
}

function statisticLog() {
    var url = hostMerchantUrl + '/merchant/discount';
    var dataJson = {};
    dataJson.merchant_id = localStorage.m_id;
    $.ajax({
        cache: true,
        type: "GET",
        url:url,
        data: dataJson,
        async: true,
        error: function(request) {
            alert("Connection error");
        },
        success: function(data) {
            if (data.status=='0') {
                var male = data.data.price;
                var female = data.data.discount;
                localStorage.male = male;
                localStorage.female = female;

            }else{
                alert('获取信息失败！');
            }
        }
    });

    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
    var pieChart = new Chart(pieChartCanvas);
    var PieData = [
        {
            value: localStorage.male,
            color: "#f56954",
            highlight: "#f56954",
            label: "现金"
        },
        {
            value: localStorage.female,
            color: "#00a65a",
            highlight: "#00a65a",
            label: "折扣"
        },

    ];
    var pieOptions = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    pieChart.Doughnut(PieData, pieOptions);
    // barChartOptions.datasetFill = false;
    // barChart.Bar(barChartData, barChartOptions);
}

function stationList() {
    $.ajax({
        url: hostMerchantUrl+"/station/all",
        type: "post",
        dataType: "json",
        async: "false",
        success: function(data){
            var count = data.data.stations.length;
            alert(count);
            var stations = data.data.stations;
            var addresses = data.data.addresses;
            var table = $('table')[0];
            for (var i = 0 ; i < count ; i++){
                var tr = $("<tr></tr>");
                tr.appendTo(table);
                $('<td>' + stations[i].id + '</td>').appendTo(tr);
                $('<td>' + stations[i].name + '</td>').appendTo(tr);
                $('<td>' + addresses[i].lng + '</td>').appendTo(tr);
                $('<td>' + addresses[i].lat + '</td>').appendTo(tr);
                $('<td>' + stations[i].region_id + '</td>').appendTo(tr);
                $('<td>' + addresses[i].comment + "</td>").appendTo(tr);
                $('<td><button class="btn btn-danger btn-xs stop" onclick="deleteStation(' + stations[i].id + ')">删除</button></td>').appendTo(tr);
            }
        }
    })
}

function orderList() {
    var dataJson = {};
    dataJson.merchant_id = 2;
    $.ajax({
        url: hostMerchantUrl+"/order/all",
        post: "post",
        data: dataJson,
        dataType: "json",
        async: "false",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var orders = data.data.orders;
                var tbody = $('tbody');
                for (var i = 0 ; i < orders.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td name=orderId>' + orders[i].id + '</td>').appendTo(tr);
                    $('<td>' + orders[i].price + '</td>').appendTo(tr);
                    $('<td>' + orders[i].product_id + '</td>').appendTo(tr);
                    $('<td>' + orders[i].product_nums + '</td>').appendTo(tr);
                    $('<td>' + orders[i].created_at + '</td>').appendTo(tr);
                    $('<td>' + orders[i].updated_at + '</td>').appendTo(tr);
                    $('<tr><td colspan="6" ><button style="width:90%;height:35px;margin-left:40px;" class="btn btn-danger btn-xs stop" onclick="catchOrder(this)">接单</button></td></tr>').appendTo(tbody);
                }
            }
        }
    })

}

function merchantLog() {
    var dataJson = {};
    dataJson.merchant_id = localStorage.m_id;
    $.ajax({
        url: hostMerchantUrl+"/merchant/logs",
        post: "post",
        data: dataJson,
        dataType: "json",
        async: "false",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var logs = data.data.logs;
                var tbody = $('tbody');
                for (var i = 0 ; i < logs.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td>' + logs[i].id + '</td>').appendTo(tr);
                    $('<td>' + logs[i].money + '</td>').appendTo(tr);
                    $('<td>' + logs[i].user_id + '</td>').appendTo(tr);
                    $('<td>' + logs[i].product_id + '</td>').appendTo(tr);
                    $('<td>' + logs[i].created_at + '</td>').appendTo(tr);
                    $('<td>' + logs[i].updated_at + '</td>').appendTo(tr);
                }
            }
        }
    })
}

function myOrder() {
    var dataJson = {};
    dataJson.merchant_id = 2;
    $.ajax({
        url: hostMerchantUrl+"/order/my",
        post: "post",
        data: dataJson,
        dataType: "json",
        async: "false",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var orders = data.data.orders;
                var tbody = $('tbody');
                for (var i = 0 ; i < orders.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td name=orderId>' + orders[i].id + '</td>').appendTo(tr);
                    $('<td>' + orders[i].price + '</td>').appendTo(tr);
                    $('<td>' + orders[i].product_id + '</td>').appendTo(tr);
                    $('<td>' + orders[i].product_nums + '</td>').appendTo(tr);
                    $('<td>' + orders[i].created_at + '</td>').appendTo(tr);
                    $('<td>' + orders[i].updated_at + '</td>').appendTo(tr);
                    $('<tr><td colspan="6" ><button style="width:90%;height:35px;margin-left:40px;" class="btn btn-danger btn-xs stop" onclick="catchOrder(this)">洗完送还</button></td></tr>').appendTo(tbody);
                }
            }
        }
    })
}
function myProductList() {
    $.ajax({
        url: hostMerchantUrl+"/show/all/products",
        type: "post",
        data: "merchant_id=" + localStorage.m_id,
        async: "false",
        dataType: "json",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var products = data.data.products;
                var tbody = $('tbody');
                for (var i = 0 ; i < products.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td name="id">' + products[i].id + '</td>').appendTo(tr);
                    $('<td>' + products[i].name + '</td>').appendTo(tr);
                    $('<td><img src="' + products[i].logo + '"/></td>').appendTo(tr);
                    $('<td>' + products[i].price + '</td>').appendTo(tr);
                    $('<td><button class="btn btn-danger btn-xs stop" name="unbind" >解绑</button></td>').appendTo(tr);
                }
                $('button[name=unbind]').click(function(){
                    var product_id = $(this).parent().parent().find("td[name=id]").text();
                    var dataJson = {};
                    dataJson.merchant_id = localStorage.m_id;
                    dataJson.product_id = product_id;
                    $.ajax({
                        url: hostMerchantUrl+"/merchant/product/unbind",
                        type: "post",
                        data: dataJson,
                        dataType: "json",
                        async: "false",
                        success: function(data){
                            if (data.status == 0){
                                alert('解绑成功');
                                window.location.reload();
                            } else {
                                alert('解绑失败');
                            }
                        }
                    });
                });
            }
        }
    })


}

function goodList() {
    var category_id = getQueryString('category_id');
    var dataJson = {};
    dataJson.category_id = category_id;
    $.ajax({
        url: hostMerchantUrl+"/show/products",
        post: "post",
        data: dataJson,
        dataType: "json",
        async: "false",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var products = data.products;
                var tbody = $('tbody');
                for (var i = 0 ; i < products.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td>' + products[i].id + '</td>').appendTo(tr);
                    $('<td>' + products[i].name + '</td>').appendTo(tr);
                    $('<td><img src="' + products[i].logo + '"/></td>').appendTo(tr);
                    $('<td>' + products[i].created_at + '</td>').appendTo(tr);
                    $('<td>' + products[i].updated_at + '</td>').appendTo(tr);
                }
            }
        }
    })
}

function merchantStationAdd() {
    $.ajax({
        url: hostOperationUrl+'/merchant/unstation',
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
                        url:hostOperationUrl+'/merchant/bind',
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
        url: hostOperationUrl+'/merchant/station',
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
                        url:hostOperationUrl+'/merchant/unbind',
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

function categoryList() {
    $.ajax({
        url: hostMerchantUrl+"/category/all",
        type: "post",
        async: "false",
        dataType: "json",
        success: function(data){
            if (data.status != 0){
                alert("error");
                return;
            } else {
                var categories = data.data.categories;
                var tbody = $('tbody');
                for (var i = 0 ; i < categories.length ; i++){
                    var tr = $('<tr></tr>');
                    tr.appendTo(tbody);
                    $('<td>' + categories[i].id + '</td>').appendTo(tr);
                    $('<td>' + categories[i].name + '</td>').appendTo(tr);
                    $('<td><img src="' + categories[i].logo + '" style="width:35px;height:35px;"/></td>').appendTo(tr);
                    $('<td>' + categories[i].is_delete + '</td>').appendTo(tr);
                    $('<td>' + categories[i].created_at + '</td>').appendTo(tr);
                    $('<td>' + categories[i].updated_at + '</td>').appendTo(tr);
                    $('<td><button class="btn btn-danger btn-xs stop" onclick="jump(' + categories[i].id + ')">商品</button></td>').appendTo(tr);
                }
            }
        }
    })
}



function jump(id){
    window.location.href="good_list.html?category_id=" + id;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}

function catchOrder(ele){
    var order_id = $(ele).parent().parent().prev().find('td[name=orderId]').text();
    $.ajax({
        url: hostMerchantUrl+"/order/finsh",
        type: "post",
        data: "order_id=" + order_id + "&merchant_id=" + localStorage.m_id,
        dataType: "json",
        async: "false",
        success: function(data){
            if (data.status == 0){
                alert('送还成功');
                window.location.reload();
            } else {
                alert(data.msg);
            }
        }
    })
}

function catchOrder1(ele){
    var order_id = $(ele).parent().parent().prev().find('td[name=orderId]').text();
    $.ajax({
        url: hostMerchantUrl+"/order/catch",
        type: "post",
        data: "order_id=" + order_id + "&merchant_id=" + localStorage.m_id,
        dataType: "json",
        async: "false",
        success: function(data){
            if (data.status == 0){
                alert('接单成功');
                window.location.reload();
            } else {
                alert(data.msg);
            }
        }
    })
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}

function deleteStation(id){
    alert(id);
    $.ajax({
        url: hostMerchantUrl+"/station/destroy",
        type: "post",
        data: "station_id=" + id,
        dataType: "json",
        async: "false",
        success: function(data){
            alert(data.msg);
            if (data.status == 0){
                window.location.reload();
            }
        }
    })
}

function addStation(){
    window.location.href = superURL + "/product_category.html";
}

