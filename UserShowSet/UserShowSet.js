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
 * 填充个人头像、姓名等信息
 */
function fillProfile() {
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/user/show',
        dataType: "json",
        success: function(res) {
            var usr = res.data;
            var jo = $('#profile');
            jo.find('#name1').html(usr.name);
            jo.find('#name2').html(usr.name);
            jo.find('#avatar').attr('src', usr.thum || 'http://www.xmgc360.com/_imgs/thumtemp.jpg');
            if(usr.video) {
                jo.find('#vbtn').show();
                jo.find('#vbtn').attr('href', usr.video);
            } else {
                jo.find('#vbtn').hide();
            };
            if(usr.cv) {
                jo.find('#cvbtn').show();
                jo.find('#cvbtn').attr('href', usr.cv);
            } else {
                jo.find('#cvbtn').hide();
            };
        },
    });
};
fillProfile();



/**
 * 填充展示列表数据
 */
function fillTable() {
    var table = $('#showTable');
    var hd = $('#tableTemp').find('#showListHeader').clone(true, true);
    table.empty();
    table.append(hd);
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/userresult/lists',
        dataType: "json",
        success: function(res) {
            res.data.forEach(function(item) {
                var jo = $('#tableTemp').find('#showItem').clone(true, true);
                jo.attr('id', item.id);
                jo.find('#order').html(item.order);
                jo.find('#title').html(item.title);
                jo.find('#upbtn').attr('onclick', 'moveUp(' + item.id + ')');
                jo.find('#downbtn').attr('onclick', 'moveDown(' + item.id + ')');
                jo.find('#delbtn').attr('onclick', 'deleteItem(' + item.id + ')');
                table.append(jo);
            });
        },
        error: function(err) {
            toastr.error('读取展示列表失败:\n' + String(err.message));
        }
    });
};

fillTable();


/**
 * 启动上传视频的方法
 */
$('#uploadVideo').click(function() {
    $('#uploadVideoIpt').click();
});

$('#uploadVideoIpt').change(function(evt) {
    var file = evt.target.files[0]

    $('#uploadVideo').attr("disabled", true);
    $('#uploadVideo #txt').html("正在启动...");
    $('#uploadVideoIpt').files = [];

    $QUNP.upload(file, {
        complete: function(evt) {
            $('#uploadVideo').removeAttr("disabled");
            $('#uploadVideo #txt').html("上传个人视频");
            $('#uploadVideoIpt').files = [];
        },
        success: function(evt) {
            getFileId(file.name, $QUNP.domain + evt.key, saveVideoId);
        },
        progress: function(evt) {
            var per = Math.floor(evt.loaded / evt.total * 100) + '%';
            $('#uploadVideo #txt').html("已完成" + per);
        },
    }, 'myphotos')
});

function saveVideoId(res) {
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/user/updatevideo',
        data: {
            videoid: res.id,
        },
        dataType: "json",
        success: function(data) {
            if(data.code == 1) {
                toastr.success('上传视频成功！');
                $('#profile #vbtn').show();
                $('#profile #vbtn').attr('href', res.url);
            } else {
                alert('保存视频文件失败:\n' + String(err.message));
            };
        },
        error: function(err) {
            alert('保存视频文件失败:\n' + String(err.message));
        }
    });
};


/**
 * 启动上传简历的方法
 */
$('#uploadResume').click(function() {
    $('#uploadResumeIpt').click();
});

$('#uploadResumeIpt').change(function(evt) {
    var file = evt.target.files[0]

    $('#uploadResume').attr("disabled", true);
    $('#uploadResume #txt').html("正在启动...");
    $('#uploadResumeIpt').files = [];

    $QUNP.upload(file, {
        complete: function(evt) {
            $('#uploadResume').removeAttr("disabled");
            $('#uploadResume #txt').html("上传个人简历");
            $('#uploadResumeIpt').files = [];
        },
        success: function(evt) {
            getFileId(file.name, $QUNP.domain + evt.key, saveResumeId);
        },
        progress: function(evt) {
            var per = Math.floor(evt.loaded / evt.total * 100) + '%';
            $('#uploadResume #txt').html("已完成" + per);
        },
    }, 'myphotos')
});

function saveResumeId(res) {
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/user/updatecv',
        data: {
            cvid: res.id,
        },
        dataType: "json",
        success: function(data) {
            if(data.code == 1) {
                toastr.success('上传简历成功！');
                $('#profile #cvbtn').show();
                $('#profile #cvbtn').attr('href', res.url);
            } else {
                alert('保存简历失败:\n' + String(err.message));
            };
        },
        error: function(err) {
            alert('保存简历失败:\n' + String(err.message));
        }
    });
};


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

    //发送数据到接口
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/userresult/create',
        data: {
            title: dialog.find('#titleIpt').val(),
            brief: dialog.find('#briefIpt').val(),
            fileid: dialog.find('#file').attr('fid'),
            url: dialog.find('#linkIpt').val(),
        },
        dataType: "json",
        success: function(res) {
            if(res.code == 1) {
                dialog.modal('hide')
                toastr.success('创建展示项成功,正在自动刷新');
                fillTable();
            } else {
                alert('添加展示项失败:\n' + res.text);
            };
        },
        error: function(err) {
            alert('添加展示项失败:\n' + String(err.message));
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
    var dialog = $('#addItemModal');
    var file = evt.target.files[0];
    $QUNP.upload(file, {
        complete: function(evt) {
            $('#uploadPic').removeAttr("disabled");
            $('#uploadPic #txt').html("上传个人视频");
            $('#uploadPic').files = [];
        },
        success: function(evt) {
            var furl = $QUNP.domain + evt.key;
            getFileId(file.name, furl, function(res) {
                dialog.find('#file').attr('fid', res.id);
                dialog.find('#file').html(file.name);
            });
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
            alert('删除失败:\n' + String(err.message));
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
            toastr.success('下移成功,自动刷新');
            fillTable();
        },
        error: function(err) {
            alert('下移失败:\n' + String(err.message));
        }
    });
};

function deleteItem(id) {
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/userresult/delete',
        data: {
            id: id,
        },
        dataType: "json",
        success: function(data) {
            toastr.success('删除成功,自动刷新');
            fillTable();
        },
        error: function(err) {
            alert('上移失败:\n' + String(err.message));
        }
    });
};


/**
 * 用url和文件名兑换file对象的id
 * @param {string}   fname 文件名
 * @param {string}   furl  七牛地址
 * @param {function} cb    回调函数
 */
function getFileId(fname, furl, cb) {
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/common/uploadfileV2',
        data: {
            filename: fname,
            fileurl: furl,
        },
        dataType: "json",
        success: function(res) {
            if(cb) cb(res.data);
        },
        error: function(err) {
            console.log('>保存文件数据失败:' + String(err.message));
        }
    });
};




//
