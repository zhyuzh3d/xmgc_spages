/**
 * 使用方法:
 * 调用$QNUP.upload(file,cbs,tag)方法开始上传
 * tag和file.tag以便于将对应的xhr放入$QUNP.xhrs[tag][file.tag]进行管理；
 * 这两个id可以使用$QNUP.uuid()生成,也可以任意指定,默认tag=default,file.tag=fileKey；
 * cbs可以包含4个函数{success,error,complete,progress}
 * success({key,...},'success',xhr);
 * progress({loaded,total});
 * 同时为file增加xhr属性指向到对应的上传xhr，以便于abort取消;
 * 获得xhr之后可以使用xhr.abort()取消； *
 * 示例
 *
    <input id='fileInput' type="file" />
    <div id='percentDiv'>-</div>

    $('#fileInput').bind('change', function(evt) {
        $('#percentDiv').html(0);
        $QUNP.upload(evt.target.files[0], {
            complete: function(evt) {
                $('#fileInput').files = [];
            },
            progress: function(evt) {
                $('#percentDiv').html(Math.floor(evt.loaded / evt.total * 100) + '%');
            },
        }, 'myphotos')
    })
 *
 */

var $QUNP;
(function() {
    //必须jquery才能使用
    if(!$) {
        console.log('>QNUP:Missing Jquery!')
        return;
    };

    //设置参数
    var tokenApi = 'http://120.55.90.62:8000/uptoken';
    var domain = 'http://files.xmgc360.com/';

    /**
     * 生成一个随机数
     * @param   {string} prefix 前置修饰符
     * @returns {string} uuid
     */
    function uuid(prefix) {
        var ts = Number(new Date()).toString(36)
        var rd = Number(String(Math.random()).replace('.', '')).toString(36);
        var res = ts + '-' + rd;
        if(prefix) res = prefix + '-' + res;
        return res;
    }

    var QNUP = {
        tokenApi: tokenApi,
        domain: domain,
        xhrs: [],
        uuid: uuid,
        upload: startOneFile,
    };

    /**
     * 启动上传单个文件
     * @param {string}   tag  用于标记一组上传文件（例如来自同一个按钮）
     * @param {obj}      file 需要上传的文件对象,{id,uploadId}
     * @param {function} cbs  回调函数{success,error,complete,progress}
     */
    function startOneFile(file, cbs, tag) {
        getToken(function(token) {
            if(!tag) tag = 'default';
            uploadFile(token, file, cbs, tag);
        });
    };

    /**
     * 上传一个文件
     * @param   {string}   token 上传用的token字符串
     * @param   {string}   tag   用于标记一组上传文件（例如来自同一个按钮）
     * @param   {obj}      file  需要上传的文件对象,{id,uploadId}
     * @param   {function} cbs   回调函数{success,error,complete,progress}
     * @returns {xhr}      上传的xhr对象
     */
    function uploadFile(token, file, cbs, tag) {
        var formdata = new FormData();
        formdata.append('token', token);
        formdata.append('file', file);

        //随机上传文件名
        var fkey = QNUP.uuid() + '/' + file.name;
        formdata.append('key', fkey);

        //发起上传
        var set = {
            url: "http://up.qiniu.com",
            data: formdata,
            type: 'POST',
            processData: false, //屏蔽掉ajax自动header处理
            contentType: false, //屏蔽掉ajax自动header处理
        };

        //添加实时进度监听
        if(cbs.progress) {
            set.xhr = function() {
                //为ajax添加progress事件监听
                var xhr = $.ajaxSettings.xhr();
                if(!xhr.file) xhr.file = file;
                xhr.upload.addEventListener("progress", cbs.progress, false);
                return xhr;
            };
        };

        //添加各种监听函数
        if(cbs.success) set.success = cbs.success;
        if(cbs.error) set.error = cbs.error;
        if(cbs.complete) set.complete = cbs.complete;

        var xhr = $.ajax(set);
        xhr.file = file;
        xhr.domain = domain;

        //把xhr存入QNUP.xhrs
        if(tag) {
            if(!file.tag) file.tag = fkey;
            if(!QNUP.xhrs[tag]) QNUP.xhrs[tag] = [];
            QNUP.xhrs[tag][file.tag] = xhr;
        };

        //把xhr存入file.xhr
        file.xhr = xhr;
        file.domain = domain;

        return xhr;
    };


    /**
     * 获取上传用的token,存在于res.uptoken;
     * @param {function} cb fn(res,fname)，fname可选;
     */
    function getToken(cb) {
        $.get(tokenApi, function(res) {
            if(cb) cb(res.uptoken);
        });
    };

    $QUNP = QNUP;
    return QNUP;
})();
