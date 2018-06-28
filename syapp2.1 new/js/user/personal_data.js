var sex;
$(function() { 
	$('.me_header').click(function() {
		$('#file').click()

	})
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var id = self.id;

		$('.sex_imgs > div').click(function() {
			$(this).addClass($(this).attr("data-cls")).siblings('div').removeClass($(this).siblings('div').attr("data-cls"))
			var sex = $(this).attr('data-sex')
			$.ajax({
				type: "get",
				url: config.data + "users/updateSex",
				async: true,
				data: {
					id: id,
					sex: sex
				},
				success: function(data) {
					if(data.state) {

					} else {

					}
				}
			});
		})

		$('.goTo').click(function() {
			var name = $('.yourName').val().trim();

			$.ajax({
				type: "get",
				url: config.data + "users/updateNickName",
				async: true,
				data: {
					id: id,
					nickName: name
				},
				success: function() {
					$.ajax({
						type: "get",
						url: config.data + "users/getUserMsgById",
						async: true,
						data: {
							id: id
						},
						success: function(data) {
							if(data.state) {
								var userInfo = JSON.stringify(data.user);

								window.localStorage.setItem("rememberUser", "true");

								window.localStorage.setItem("userInfo", userInfo);

							} else {

							}
						}
					});
				}
			});

			mui.openWindow({
				url: '../../index.html',
				id: 'H5C62934A',
				createNew: true,
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: "none" //页面显示动画，默认为”slide-in-right“；

				}

			})
		})

		
		
	})

	
})
