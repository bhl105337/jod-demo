$(function() {
	mui.plusReady(function(){
		var backHeight = plus.navigator.getStatusbarHeight();
		var finalHeight = parseInt(backHeight) + 11 + "px";
		$('.back').css('top',finalHeight)
		
	})
	$('.back').click(function(){
		mui.back()
	})
	

	$('.login_login').on("tap", function() {
		
		var username = $.trim($('#user-name').val());
		var password = $("#user-password").val();
		var reg = /^1[3|4|5|7|8]\d{9}$/;
		var emailreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if(reg.test(username) || emailreg.test(username)) {
			if(username != "" && password != "") {

				$.ajax({
					type: "POST",
					url: config.data + "users/login",
					data: {
						"tel": username,
						"password": password
					},

					success: function(data) {

						if(data.state == "0") {
							mui.toast("账号或密码错误")
						} else {


							var userInfo = JSON.stringify(data.user);
							var userId = data.user.id;
							window.localStorage.setItem("rememberUser", "true");
							//						window.localStorage.setItem("userName", userName);
							window.localStorage.setItem("userInfo", userInfo);
							window.localStorage.setItem("userId", userId);
							plus.webview.close(plus.webview.getWebviewById("H5C62934A"),"none");
//							plus.webview.close(plus.webview.getWebviewById("HBuilder"),"none");


							mui.openWindow({
								url:'../../index.html',
								id:'H5C62934A',
//								id:'HBuilder',
								createNew:true,
								show:{
      								autoShow:true,//页面loaded事件发生后自动显示，默认为true
      								aniShow:"none"//页面显示动画，默认为”slide-in-right“；
      
    							}
								
								
							})

						}

					}

				})

			} else {
				mui.toast("用户名和密码不能为空")
			}
		} else {
			mui.toast("请检查您的用户名")
		}
	})

	$('.forget').click(function(){
		mui.openWindow({
			url:'find_password.html',
			id:'find_password.html'
		})
	})

	$('.register').on("click", function() {
		mui.openWindow({
			url: 'register.html',
			id:'register.html'
		})
	})
	/*记住用户名和密码*/

})