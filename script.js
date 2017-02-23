//var webSocket=new WebSocket("ws://121.40.68.35:1999");
var webSocket = new WebSocket("ws://127.0.0.1:1999");
var chat = document.getElementById('chat');
var newMsg = document.getElementById('newMsg');
var sendMsg = document.getElementById('sendMsg');
function otherMsg(info, msg) {
	if (!msg) {
		var msgP = document.createElement("p");
		msgP.innerText = info;
		chat.appendChild(msgP);
		return;
	}
	var data = JSON.parse(msg);
	switch (data.type) {
		case "message": {
			var msgP = document.createElement("p");
			msgP.innerText = info + data.content;
			chat.appendChild(msgP);
			break;
		}
		case "image": {
			var msgP = document.createElement("p");
			msgP.innerText = info + data.content;
			chat.appendChild(msgP);
			//图片
			var msgImg= document.createElement("img");
			msgImg.setAttribute("src", data.url);
			msgImg.setAttribute("class", "img-responsive img-rounded")
			chat.appendChild(msgImg);
			break;
		}
		default:
			var msgP = document.createElement("p");
			msgP.innerText = info + msg;
			chat.appendChild(msgP);
			break;
	}
}
webSocket.onopen = function (e) {
	sendMessage.start("Hello World!");
}
webSocket.onclose = function (e) {
	otherMsg("Connnection closed");
}
webSocket.onmessage = function (e) {
	otherMsg("Message received:", e.data);
}
var sendMessage = {
	message: { type: "message", content: "", url: "" },
	start: function (msg) {
		if (msg) {
			this.message.content = msg;
		}
		webSocket.send(JSON.stringify(this.message));
	},
	init: function () {
		this.message.type = "message";
		this.message.content = "";
		this.message.url = "";
		this.message.content = newMsg.value.trim();
	}
};
sendMsg.onclick = function () {
	sendMessage.init();
	//得到文件
	var file = document.getElementById("selectfiles");
	if (sendMessage.message.content || file.files[0]) {
		if (file.files[0]) {
			//存在文件则上传文件
			getSign.set_upload_param(uploader, '', false);
			//图片上传后有回调
			sendMessage.message.type = "image";
			sendMessage.message.url = uploader.filepath;
			sendMessage.start();
			//清空已选择的文件
			if (file.outerHTML) {
				file.outerHTML = file.outerHTML;
			} else {
				file.value = "";
			}
		} else {
			sendMessage.start();
		}
		//清空已发送的文本
		newMsg.value = "";
	}
}

