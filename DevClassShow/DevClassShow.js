//模拟数据
var dat = {
    class: {
        id: '22',
            title: '2017-JAVA0612',
            subtitle: 'JAVA开发技术班',
            finiTime: '2017年8月23日', //这个日期可以暂时锁定，稍后有时间再添加设定入口
            count: '23', //班级人数
    },
    projects: [{ //不分页，一次拉取全部schedule及对应的project信息
        id: '12', //项目id
        title: '项目的名称',
        icon: 'http://files.xmgc360.com/1/56fe508757a0d_102420160701174330.jpg',
        brief: '项目简介，建议100～200字；超过显示尺寸将需要滚动才能显示；项目简介，建议100～200字；超过显示尺寸将需要滚动才能显示',
        video: 'http://files.xmgc360.com/coding.%E9%99%88%E5%AE%872016-09-17-22-16-37%E6%96%B0%E9%97%BB%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%AD%94%E8%BE%A9%E8%A7%86%E9%A2%91.mp4.mp4', //上传的schedule整体答辩视频
        members: [{
            id: '33',
            name: '王小白猫',
            avatar: 'http://q.qlogo.cn/qqapp/101297684/6404F19CE0FBE213665094E6A3CA23B4/100',
            videoShow: 'http://files.xmgc360.com/coding.%E9%99%88%E5%AE%872016-09-17-22-16-37%E6%96%B0%E9%97%BB%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%AD%94%E8%BE%A9%E8%A7%86%E9%A2%91.mp4.mp4', //schedule内每个用户的答辩视频
        }], //组长第一位
    }],
};

for(var n = 0; n < 4; n++) {
    var p = dat.projects[0];
    var u = p.members[0];
    p.members.push(u);
};

for(var i = 0; i < 5; i++) {
    var p = dat.projects[0];
    dat.projects.push(p);
};


//填充页面
var classId = $.url().param('id');
var scId = $.url().param('scid');

function fillPage() {
    fillClass(dat.class);

    var api = 'http://www.xmgc360.com/project/index.php/api/clas/scollection';
    var dt = {
        classid: classId,
        scollectionid: scId,
    };
    $.post(api, dt, function(res) {
        if(res.code == 1) {
            var slist = res.data.schedules;
            for(var i = 0; i < slist.length; i++) {
                var card = genCard(slist[i]);
                $('#pcardList').append(card);
            };
        } else {
            console.log('>读取班级信息失败:', res.text);
        };
    }, 'json');
};

/**
 * 填充班级基本信息
 */
function fillClass() {
    var api = 'http://www.xmgc360.com/project/index.php/api/school/getclassdetails';
    var dt = {
        id: classId
    };
    //填充班级信息
    $.post(api, dt, function(res) {
        if(res.code == 1) {
            var cls = res.data;
            var box = $('#topBox');
            box.find('#title').html(cls.name);
            box.find('#subtitle').html(cls.brief);
            box.find('#finiTime').html(cls.finiTime || '2017年8月23日');
            box.find('#count').html(cls.usercount);
        } else {
            console.log('>读取班级信息失败:', res.text);
        };
    }, 'json');
};



function genCard(schedule) {
    var project = schedule.project;
    var pcard = $('#temp #pcard').clone(true, true);
    pcard.find('#pic').css('background', 'url("' + project.thum + '") 0% 0% / cover #1d768a');
    pcard.find('#title').html(project.title);
    pcard.find('#brief').html(project.brief);
    var purl = 'http://www.xmgc360.com/_pages/projectbrief/projectbrief.html?projectid=' + project.id;
    pcard.find('#plink').attr('href', purl);
    if(schedule.video) {
        pcard.find('#vlink').attr('href', schedule.video);
    } else {
        pcard.find('#playbtn').hide();
        pcard.find('#vlink').attr('href', purl);
    };

    var users = schedule.joinusers || [];
    users.unshift(schedule.author);

    for(var i = 0; i < users.length; i++) {
        var ucard = genUcard(users[i]);
        pcard.find('#userList').append(ucard);
    };
    return pcard;
};


function genUcard(user) {
    var ucard = $('#temp #ucard').clone(true, true);
    ucard.find('#name').html(user.name);
    if(user.thum && user.thum != '') {
        ucard.find('#avatar').attr('src', user.thum);
    }
    ucard.attr('href', 'http://www.xmgc360.com/spages/UserShow/UserShow.html?id=' + user.uid);
    return ucard;
};


//执行
fillPage();






//--
