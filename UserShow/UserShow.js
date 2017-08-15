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
        pic: 'http://files.xmgc360.com/1/56fe508757a0d_102420160701174330.jpg',
        title: '项目的标题小于10字',
        brief: '项目的简介，不超过200字',
        url: 'http://www.xmgc360.com/_pages/projectbrief/projectbrief.html?projectid=3202', //点击卡片跳转的地址，可以是url、图片地址、文件地址等
        }],
};

for(var i = 0; i < 5; i++) {
    var p = dat.shows[0];
    dat.shows.push(p);
};


//填充页面
var userId = $.url().param('id');

function fillPage() {
    fillUser(dat.user);
    for(var i = 0; i < dat.shows.length; i++) {
        var card = genCard(dat.shows[i]);
        $('#cardList').append(card);
    }
};


function fillUser(user) {
    $('head title').html('项目工场 | ' + user.name + '作品展示');

    var box = $('#topBox');
    box.find('#name').html(user.name);
    box.find('#biref').html(user.brief);
    box.find('#avtar').attr('src', user.avatar);
    box.find('#video').attr('src', user.video);
    box.find('#resume').attr('href', user.resume);
};

function genCard(show) {
    var card = $('#temp #projectCard').clone(true, true);
    card.find('#title').html(show.title);
    card.find('#brief').html(show.brief);
    card.find('#pic').css('background', 'url("' + show.pic + '") 0% 0% / cover #1d768a');
    card.find('#link').attr('href', show.url);
    return card;
};



//执行
fillPage();



//背景
$(document).ready(function() {
    $('#aniBg').particleground({
        dotColor: '#ccdfe5',
        lineColor: '#d4e6eb',
        lineWidth: 1,
    });
});




//--
