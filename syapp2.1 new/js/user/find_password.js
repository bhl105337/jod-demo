var username;
var password;
var code;
$(function() {
	
	$('.get_code').click(function() {
		username = $.trim($('.phone_num').val());
		var InterValObj; //timer变量，控制时间
		var count = 60; //间隔函数，1秒执行
		var curCount; //当前剩余秒数
		if(/^1[34578]\d{9}$/.test(username)) {
			(function sendMessage() {
				curCount = count;
				// 设置button效果，开始计时
				document.getElementById("get_code").classList.add("disabled");
//				document.getElementById("get_code").setAttribute("disabled", "true"); //设置按钮为禁用状态
				document.getElementById("get_code").innerHTML = curCount + "s后获取"; //更改按钮文字
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
						document.getElementById("get_code").classList.remove("disabled");
//						document.getElementById("get_code").removeAttribute("disabled"); //移除禁用状态改为可用
						document.getElementById("get_code").innerHTML = "重新发送验证码";
					} else {
						curCount--;
						document.getElementById("get_code").innerHTML = curCount + "s后获取";

					}
				}
			}());
			//timer处理函数
		} else {
			mui.toast("请输入正确的手机号");
			return false
		}
	})
	
	$('.find_password').on('click','.next',function(){
		if ($('.phone_num').val() && $('.set_code').val()) {
			username = $.trim($('.phone_num').val());
			code = $('.set_code').val()
			$('.find_password').addClass("hidden")
			$('.new_passwords').removeClass("hidden")
		} else{
			mui.toast("手机号及验证码不能为空")
		}
	})
	
	$('.new_passwords').on('click','.next',function(){
		
		password = $('.set_newpassword').val()
		
		
		if (/^1[34578]\d{9}$/.test(username) && password.length >= 6 && code.length == 6  && /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(password)) {
			
			$.ajax({
				type:"POST",
				url:config.data + "users/upDatePassword",
				async:true,
				data:{
					tel:username,
					password:password,
					verify:code
				},
				success:function(data){
					
					switch(data.state) {
							case 0:
								mui.toast("找回密码失败，请重试");

								break;
							case 1:
								mui.toast("找回密码成功");
								$('.new_passwords').addClass("hidden")
								$('.set_finishs').removeClass("hidden")
								break;
							case 3:
								mui.toast("验证码错误");
								break;
							case 99:
								mui.toast("参数缺失");
								break;

						}
				}
			});
		} else{
			mui.toast("输入格式有误，请检查")
		}
	})


	$('.set_finishs').on('click','.next',function(){
		$('.set_finishs').addClass("hidden")
		$('.find_password').removeClass("hidden")
		mui.openWindow({
			url:"login.html",
			id:"login.html"
		})
	})
})