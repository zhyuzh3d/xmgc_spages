//填充页面
var classId = $.url().param('id');

function fillPage() {
    var api = 'http://www.xmgc360.com/project/index.php/api/clas/users';
    var dt = {
        classid: classId
    };

    //填充成员信息
    $.post(api, dt, function(res) {
        var users = res.data.users;
        for(var i = 0; i < users.length; i++) {
            var card = genCard(users[i]);
            $('#cardList').append(card);
        }
    }, 'json');

    fillClass();

};

function fillClass() {
    var api = 'http://www.xmgc360.com/project/index.php/api/school/getclassdetails';
    var dt = {
        id: classId
    };
    //填充班级信息
    $.post(api, dt, function(res) {
        var cls = res.data;
        var box = $('#topBox');
        box.find('#title').html(cls.name);
        box.find('#subtitle').html(cls.brief);
        box.find('#finiTime').html(cls.graduationdate || '2017年8月23日');
        box.find('#count').html(cls.usercount);
    }, 'json');
};

function genCard(user) {
    var card = $('#temp #userCard').clone(true, true);
    var avatar = (user.thum && user.thum != '') ? user.thum : 'http://www.xmgc360.com/_imgs/thumtemp.jpg';

    card.find('#pic').css('background', 'url("' + avatar + '") 0% 0% / cover #1d768a');
    card.find('#name').html(user.name);
    card.find('#avatar').attr('src', avatar);
    if(user.video) {
        card.find('#video').attr('href', user.video);
    } else {
        card.find('#playBtn').hide();
    };
    card.find('#link').attr('href', 'http://www.xmgc360.com/spages/UserShow/UserShow.html?id=' + user.id);
    return card;
};


//执行
fillPage();


//动态背景



//--
