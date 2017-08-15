//模拟数据
var dat = {
    user: {
        id: '12',
        name: '王小黑猫',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/6404F19CE0FBE213665094E6A3CA23B4/100',
        video: 'http://files.xmgc360.com/coding.%E9%99%88%E5%AE%872016-09-17-22-16-37%E6%96%B0%E9%97%BB%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%AD%94%E8%BE%A9%E8%A7%86%E9%A2%91.mp4.mp4',
        brief: '用户资料的个人介绍，可以在这里添加院校、专业、班级等信息；建议不超过200字',
        resume: 'http://7xnmfe.com1.z0.glb.clouddn.com/%E5%88%98%E4%B8%B92016-02-25-19-39-57%E9%A1%B9%E7%9B%AE%E5%88%86%E4%BA%AB%E4%B8%89%E7%BA%A7%E7%BC%93%E5%AD%98%E7%9A%84%E7%AE%80%E5%8D%95%E5%AE%9E%E7%8E%B0.zip', //简历文件doc
    },
    shows: [{ //不分页，一次拉取全部
        id: '23', //展示项的id
        order: '1',
        pic: 'http://files.xmgc360.com/1/56fe508757a0d_102420160701174330.jpg',
        title: '项目的标题小于10字',
        brief: '项目的简介，不超过200字',
        url: 'http://www.xmgc360.com/_pages/projectbrief/projectbrief.html?projectid=3202', //点击卡片跳转的地址，可以是url、图片地址、文件地址等
        }],
};

for(var i = 0; i < 5; i++) {
    var p = dat.shows[0];
    p.order = Number(p.order) + 1;
    dat.shows.push(p);
};



/**
 * 替换基础的alert方法
 */
window.alert = swal;


/**
 * 填充展示列表数据
 */
function fillTable() {
    var table = $('#showTable');
    var hd = $('#tableTemp').find('#showListHeader').clone(true, true);
    table.empty();
    table.append(hd);

    dat.shows.forEach(function(item) {
        var jo = $('#tableTemp').find('#showItem').clone(true, true);
        jo.attr('id', item.id);
        jo.find('#order').html(item.order);
        jo.find('#title').html(item.title);
        jo.find('#upbtn').attr('onclick', 'moveUp(' + item.id + ')');
        jo.find('#downbtn').attr('onclick', 'moveDown(' + item.id + ')');
        jo.find('#delbtn').attr('onclick', 'deleteItem(' + item.id + ')');
        table.append(jo);
    });
};

fillTable();


/**
 * 启动上传视频的方法
 */
$('#uploadVideo').click(function() {
    $('#uploadVideoIpt').click();
    $('#uploadVideo').attr("disabled", true);
    $('#uploadVideo #txt').html("正在启动...");
    $('#uploadVideoIpt').files = [];
});

$('#uploadVideoIpt').change(function(evt) {
    $QUNP.upload(evt.target.files[0], {
        complete: function(evt) {
            $('#uploadVideo').removeAttr("disabled");
            $('#uploadVideo #txt').html("上传个人视频");
            $('#uploadVideoIpt').files = [];
        },
        success: function(evt) {
            //发送接口上传{video:''}
            $.ajax({
                type: "POST",
                url: '',
                data: {
                    video: $QUNP.domain + '/' + evt.key,
                },
                dataType: "json",
                success: function(data) {
                    toastr.success('上传成功');
                },
                error: function(err) {
                    alert(String(err.message));
                }
            });
        },
        progress: function(evt) {
            var per = Math.floor(evt.loaded / evt.total * 100) + '%';
            $('#uploadVideo #txt').html("已完成" + per);
        },
    }, 'myphotos')
});

/**
 * 打开弹窗
 */
$('#openAddDialog').click(function() {
    var dialog = $('#addItemModal');
    dialog.find('#titleIpt').val('');
    dialog.find('#briefIpt').val('');
    dialog.find('#linkIpt').val('');
    dialog.find('#file').removeAttr('url');
    dialog.find('#file').html('');
    dialog.find('#uploadPic').removeAttr("disabled");
    dialog.modal();
});

$('#addItemBtn').click(function() {
    var dialog = $('#addItemModal');
    var dt = {
        title: dialog.find('#titleIpt').val(),
        brief: dialog.find('#briefIpt').val(),
        link: dialog.find('#linkIpt').val(),
    };

    //发送上面的数据到接口
    $.ajax({
        type: "POST",
        url: '',
        data: {
            title: dialog.find('#titleIpt').val(),
            brief: dialog.find('#briefIpt').val(),
            link: dialog.find('#linkIpt').val(),
            img: dialog.find('#file').attr('url'),
        },
        dataType: "json",
        success: function(data) {
            dialog.modal('hide')
            toastr.success('删除成功,自动刷新');
            fillTable();
        },
        error: function(err) {
            alert(String(err.message));
        }
    });
});

/**
 * 上传图片
 */

$('#uploadPic').click(function() {
    $('#uploadPicIpt').click();
    $('#uploadPic').attr("disabled", true);
    $('#uploadPic #txt').html("正在启动...");
    $('#uploadPic').files = [];
});

$('#uploadPicIpt').change(function(evt) {
    var file = evt.target.files[0];
    $QUNP.upload(file, {
        complete: function(evt) {
            $('#uploadPic').removeAttr("disabled");
            $('#uploadPic #txt').html("上传个人视频");
            $('#uploadPic').files = [];
        },
        success: function(evt) {
            $('#addItemModal #file').attr('url', $QUNP.domain + evt.key);
            $('#addItemModal #file').html(file.name);
        },
        progress: function(evt) {
            var per = Math.floor(evt.loaded / evt.total * 100) + '%';
            $('#uploadPic #txt').html("已完成" + per);
        },
    }, 'myphotos');
});


/**
 * 上下移动和删除
 */
function moveUp(id) {
    $.ajax({
        type: "POST",
        url: '',
        data: {
            id: id,
        },
        dataType: "json",
        success: function(data) {
            toastr.success('删除成功,自动刷新');
            fillTable();
        },
        error: function(err) {
            alert(String(err.message));
        }
    });
};

function moveDown(id) {
    $.ajax({
        type: "POST",
        url: '',
        data: {
            id: id,
        },
        dataType: "json",
        success: function(data) {
            toastr.success('删除成功,自动刷新');
            fillTable();
        },
        error: function(err) {
            alert(String(err.message));
        }
    });
};

function deleteItem(id) {
    $.ajax({
        type: "POST",
        url: '',
        data: {
            id: id,
        },
        dataType: "json",
        success: function(data) {
            toastr.success('删除成功,自动刷新');
            fillTable();
        },
        error: function(err) {
            alert(String(err.message));
            toastr.success(String(err.message));
        }
    });
};





//
