$(function() {

	//	document.getElementById("register-back").addEventListener('tap',function(){
	//		mui.openWindow({
	//			url:'html/user/login.html'
	//		})
	//	}) 
	var checked;
	$('#agree').change(function(){
		
		checked = this.checked
	})

	$('#register-get').click(function () {
		
		var username = $.trim($('#register-phone').val());
		var code = $('#register-code').val();
		var password = $('#register-password').val();

		var InterValObj; //timer变量，控制时间
		var count = 60; //间隔函数，1秒执行
		var curCount; //当前剩余秒数
		if(/^1[34578]\d{9}$/.test(username)) {
			(function sendMessage() {
				curCount = count;
				// 设置button效果，开始计时
				document.getElementById("register-get").classList.add("disabled");
//				document.getElementById("register-get").setAttribute("disabled", "true"); //设置按钮为禁用状态
				document.getElementById("register-get").innerHTML = curCount + "s后获取"; //更改按钮文字
				InterValObj = window.setInterval(SetRemainTime, 1000);
				//			 启动计时器timer处理函数，1秒执行一次
				// 向后台发送处理数据
				$.ajax({
					type: "get", // 用get方式传输
					url: config.data + "users/verify", // 目标地址
					data: {
						"tel": username
					},
					success: function(data) {
						if(data.state == "1") {
							mui.toast("短信验证码已发到您的手机,请查收");

						} else if(data.state == "0") {
							mui.toast("短信验证码发送失败，请重新发送");

							return false
						}
					}
				});

				function SetRemainTime() {
					if(curCount == 0) {
						window.clearInterval(InterValObj); // 停止计时器
//						document.getElementById("register-get").removeAttribute("disabled"); //移除禁用状态改为可用
						document.getElementById("register-get").classList.remove("disabled");
						document.getElementById("register-get").innerHTML = "重发验证码";
					} else {
						curCount--;
						document.getElementById("register-get").innerHTML = curCount + "s后获取";

					}
				}
			}());
			//timer处理函数
		} else {
			mui.toast("请输入正确的手机号");
			return false
		}
	})
	$('#register-button').click(function() {
		var username = $.trim($('#register-phone').val());
		var code = $('#register-code').val();
		var password = $('#register-password').val();

		if(/^1[34578]\d{9}$/.test(username) && password.length >= 6 && code.length == 6  && /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(password) && checked) {
			
				$.ajax({
					type: "post",
					url: config.data + "users/reg", // 目标地址
					data: {
						"tel": username,
						"verify": code,
						"password": password
					},
					success: function(data) {

						switch(data.state) {
							case 0:
								mui.toast("注册失败");

								break;
							case 1:
								mui.toast("注册成功");
								//												$('.register').addClass("hidden").siblings().removeClass("hidden");
								mui.openWindow({
									url: "personal_data.html",
									id:"personal_data.html",
									extras:{
										id: data.id
									}
									
								})
								break;
							case 2:
								mui.toast("手机号已被注册");
								break;
							case 3:
								mui.toast("验证码错误");
								break;
							case 99:
								mui.toast("参数缺失");
								break;

						}
					}

				})
			
		} else {
			mui.toast("请检查您的输入");
			return false
		}
	})

	$('.protocol').click(function(){
		mui.openWindow({
			url:'agreement.html',
			id:'agreement.html'
		})
	})

//	$("#qd1,#qd2,#qd3,#qd4").on("tap", function() {
//		$.ajax({
//			type: "get", // 用get方式传输
//			url: config.data + "users/getChannel", // 目标地址
//			data: {
//				"id": $(this).id,
//				"channel": $(this).channel
//			},
//			success: function(data) {
//				if(data.state == "1") {
//					mui.toast("可以传递");
//					mui.openWindow({
//						url: "login.html"
//					})
//
//				} else if(data.state == "0") {
//					mui.toast("传递失败");
//
//					return false
//				}
//			}
//		});
//	})

})
