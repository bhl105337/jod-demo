
if(window.localStorage.getItem("userInfo")) {
	var userInfojson = eval('(' + userInfostr + ')');
	var userId = userInfojson.id;
//	var socket = io.connect('http://192.168.2.108:8877/');
//	var socket = io.connect('http://192.168.2.156:8877/');
	var socket = io.connect('http://www.oneyouxi.com.cn:8877/');
	socket.emit('login', {
		userId: userId,
		soc:soc
	});
	
	document.addEventListener("plusready", onPlusReady, false);
	
	function onPlusReady() {
		document.addEventListener("background", onAppBackground, false);
		document.addEventListener("resume", onAppReume, false);
	}

	function onAppBackground() {
		socket.emit('exit', {
			userId: userId
		});
	}
	function onAppReume(){
		socket.emit('login', {
			userId: userId
		});
	}	
	socket.on('newMessage', function (data) {
		
     	
       	document.getElementsByClassName("bell")[0].classList.add("bell_active")
       	

    });
    socket.on('cancelMessage', function (data) {
		
     	
       	document.getElementsByClassName("bell")[0].classList.remove("bell_active")
       

    });
    socket.on('hsaNwsTip', function (data) {
		
     	if (data.tip > 0) {
     		
     		document.getElementsByClassName("bell")[0].classList.add("bell_active")
     	} else{
     		
     	}
       	
       

    });

	
	
} else {
	
}
  		