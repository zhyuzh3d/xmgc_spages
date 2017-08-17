//填充页面
var userId = $.url().param('id');

function fillPage() {
    fillUser();
    var api = 'http://www.xmgc360.com/project/index.php/api/userresult/lists';
    var dt = {
        uid: userId,
    };
    $.post(api, dt, function(res) {
        if(res.code == 1) {
            var shows = res.data;
            for(var i = 0; i < shows.length; i++) {
                var card = genCard(shows[i]);
                $('#cardList').append(card);
            }
        } else {
            console.log('>读取展示列表失败:', res.text);
        };
    }, 'json');
};


function fillUser() {
    $.ajax({
        type: "POST",
        url: 'http://www.xmgc360.com/project/index.php/api/user/show',
        data: {
            uid: userId,
        },
        dataType: "json",
        success: function(res) {
            if(res.code == 1) {
                var usr = res.data;
                $('head title').html('项目工场 | ' + usr.name + '作品展示');
                var jo = $('#topBox');
                jo.find('#name').html(usr.name);
                jo.find('#avatar').attr('src', usr.thum || 'http://www.xmgc360.com/_imgs/thumtemp.jpg');
                jo.find('#brief').html(usr.about);
                if(usr.video) {
                    jo.find('#video').show();
                    jo.find('#video').attr('src', usr.video);
                } else {
                    jo.find('#video').hide();
                };
                if(usr.cv) {
                    jo.find('#resume').show();
                    jo.find('#resume').attr('href', usr.cv);
                } else {
                    jo.find('#resume').hide();
                };
            } else {
                console.log('>读取用户信息失败:' + res.text);
            }
        },
    });
};

function genCard(show) {
    var card = $('#temp #projectCard').clone(true, true);
    card.find('#title').html(show.title);
    card.find('#brief').html(show.brief);
    card.find('#pic').css('background', 'url("' + show.file + '") 0% 0% / cover #1d768a');
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
