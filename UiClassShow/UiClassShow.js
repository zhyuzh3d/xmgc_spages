//模拟数据
var dat = {
    class: {
        id: '223',
            title: '2017-UI0612',
            subtitle: 'UIUE设计技术班',
            finiTime: '2017年8月23日', //这个日期可以暂时锁定，稍后有时间再添加设定入口
            count: '23', //班级人数
    },
    users: [{ //不分页，一次拉取全部
        id: '12',
        name: '王小花猫',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/6404F19CE0FBE213665094E6A3CA23B4/100',
        video: 'http://files.xmgc360.com/coding.%E9%99%88%E5%AE%872016-09-17-22-16-37%E6%96%B0%E9%97%BB%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%AD%94%E8%BE%A9%E8%A7%86%E9%A2%91.mp4.mp4'
        }],
};

for(var i = 0; i < 13; i++) {
    var p = dat.users[0];
    dat.users.push(p);
};


//填充页面
var classId = $.url().param('id');

function fillPage() {
    fillClass(dat.class);
    for(var i = 0; i < dat.users.length; i++) {
        var card = genCard(dat.users[i]);
        $('#cardList').append(card);
    }
};

function fillClass(cls) {
    var box = $('#topBox');
    box.find('#title').html(cls.title);
    box.find('#subtitle').html(cls.subtitle);
    box.find('#finiTime').html(cls.finiTime);
    box.find('#count').html(cls.count);
};

function genCard(user) {
    var card = $('#temp #userCard').clone(true, true);
    card.find('#pic').css('background', 'url("' + user.avatar + '") 0% 0% / cover #1d768a');
    card.find('#name').html(user.name);
    card.find('#avatar').attr('src', user.avatar);
    card.find('#video').attr('href', user.video);
    card.find('#link').attr('href', 'http://www.xmgc360.com/spages/UserShow/UserShow.html?id=' + user.id);
    return card;
};


//执行
fillPage();


//动态背景



//--
