$(function(){
	var socket = io("ws://103.31.201.154:5555");
	
//	监听服务消息
	socket.on('msg',function(data){
	    socket.emit('msg', {rp:"fine,thank you"}); //向服务器发送消息
	    console.log(data);
	});
	
//	socket.on("String",function(data)) 监听服务端发送的消息 Sting参数与服务端emit第一个参数相同

//------------------------------------

//	监听socket断开与重连。
	socket.on('connect', function() {
	    console.log("连接成功");
	});
	

	socket.on('disconnect', function() {
	    console.log("与服务其断开");
	});


	socket.on('reconnect', function() {
	    console.log("重新连接到服务器");
	});

})
