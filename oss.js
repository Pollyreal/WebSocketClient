//获取签名
var getSign = {
    accessid: '',
    accesskey: '',
    host: '',
    policyBase64: '',
    signature: '',
    callbackbody: '',
    filename: '',
    key: '',
    expire: 0,
    g_object_name: '',
    g_object_name_type: '',
    now: Date.parse(new Date()) / 1000,
    timestamp: Date.parse(new Date()) / 1000,
    serverUrl: 'home/GetOssSignature',
    //后台得到签名
    send_request: function () {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlhttp != null) {
            xmlhttp.open("GET", getSign.serverUrl, false);
            xmlhttp.send(null);
            return xmlhttp.responseText
        } else {
            alert("Your browser does not support XMLHTTP.");
        }
    },
    //设置签名等数据
    get_signature: function () {
        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
        getSign.now = getSign.timestamp = Date.parse(new Date()) / 1000;
        if (getSign.expire < getSign.now + 3) {//后台签名
            getSign.body = getSign.send_request();
            var obj = eval("(" + getSign.body + ")");
            getSign.host = obj['host']
            getSign.policyBase64 = obj['policy']
            getSign.accessid = obj['accessid']
            getSign.signature = obj['signature']
            getSign.expire = parseInt(obj['expire'])
            getSign.callbackbody = obj['callback']
            getSign.key = obj['dir']
            return true;
        }
        return false;
    },
    //设置上传
    set_upload_param: function (up, filename, ret) {
        //if (ret == false) {
        //签名
        ret = getSign.get_signature();
        //}
        getSign.new_multipart_params = {
            'key': getSign.key,
            'policy': getSign.policyBase64,
            'OSSAccessKeyId': getSign.accessid,
            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
            'callback': getSign.callbackbody,
            'signature': getSign.signature,
        };
        //设置上传参数
        up.setOption({
            'url': getSign.host,
            'multipart_params': getSign.new_multipart_params
        });
        //上传开始
        up.start();
    }
}
//上传对象
var uploader = {
    //后台签名数据
    new_multipart_params: "",
    url: "",
    //上传数据
    formdata: "",
    //图片路径
    filepath: "",
    //上传开始
    start: function () {
        //得到文件
        var file = document.getElementById("selectfiles").files[0];
        //如果是以文件名称作为上传名
        this.filepath = getSign.host + "/" + getSign.key + file.name;
        //后台签名数据
        this.new_multipart_params["key"] += "${filename}";
        //上传数据
        this.formdata = new FormData();
        for (var k in this.new_multipart_params) {
            this.formdata.append(k, this.new_multipart_params[k]);
        }
        this.formdata.append("file", file);
        //上传
        this.UploadProgress();
    },
    //上传
    UploadProgress: function () {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlhttp != null) {
            var serverUrl = this.url;
            xmlhttp.open("POST", serverUrl, false);
            xmlhttp.send(this.formdata);
            //上传结束
            this.FileUploaded(xmlhttp);
            return xmlhttp.status;
        }
        else {
            alert("Your browser does not support XMLHTTP.");
        }
    },
    //上传结束
    FileUploaded: function (info) {
        if (info.status == 200) {
            document.getElementById("console").innerHTML = 'upload to oss success, 回调服务器返回的内容是:' + info.response;
        }
        else if (info.status == 203) {
            document.getElementById("console").innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
        }
        else {
            document.getElementById("console").innerHTML = info.response;
        }
    },
    //设置上传参数
    setOption: function (options) {
        this.new_multipart_params = options["multipart_params"];
        this.url = options["url"];
    }
}

