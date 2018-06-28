$(function() {

	var h = $(window).height()
	$(window).resize(function() {
		var changeHeight = $(window).height()
		if(changeHeight < h) {
			$('.show_imgs,.img_num').addClass('hidden')
			$('.choose_img').css('bottom', '0')
			$('.choose_game').css('bottom', '2.625rem')
		} else {
			$('.show_imgs,.img_num').removeClass('hidden')
			$('.choose_img').css('bottom', '10.625rem')
			$('.choose_game').css('bottom', '13.25rem')
		}
	});

	$('body').on('click', '.delete_img', function() {
		$(this).parent().parent('.show_imgcontent').remove()

	})
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var strategyId = self.strategyId;
		var proId = self.proId;
		var old_back = mui.back;
		var target_img = self.target_img;
		var target_title = self.target_title;
		mui.back = function() {
			if(plus.webview.getWebviewById("strategy_details.html")) {
				var wobj = plus.webview.getWebviewById("strategy_details.html");
			} else {
				var wobj = plus.webview.getWebviewById("me_works.html");
			}

			mui.fire(wobj,'reload',{});
			old_back();
		}

		document.getElementById('choose_img').addEventListener('tap', function() {
			if(mui.os.plus) {
				var buttonTit = [

					{
						title: "从手机相册选择"
					}
				];

				plus.nativeUI.actionSheet({
					title: "上传图片",
					cancel: "取消",
					buttons: buttonTit
				}, function(b) { /*actionSheet 按钮点击事件*/
					switch(b.index) {
						case 0:
							break;
						case 1:
							galleryImgs(); /*打开相册*/
							break;
						default:
							break;
					}
				})
			}
		}, false);

		$('.publish').click(function() {
			mui.toast("正在发送，请稍候")
			var content = $('#strategy_textarea').val();
			if(content) {
				$.ajax({
					type: "get",
					url: config.data + "strategy/strategyComment",
					async: true,
					data: {
						userId: userId,
						content: content,
						targetCommentId: strategyId,
						targetUserId: proId,
						series: 1,
						target_img:target_img,
						targetid:strategyId,
						target_title:target_title
					},
					success: function(data) {
						if(data.state) {

							var commentId = data.commentId;
							if($('.show_imgs').find('.show_imgcontent').length >= 1) {

								$('.show_imgcontent').each(function(index) {

									var imgPath = $(this).attr('data-src');

									// 上传图片
									upLoad(commentId, 'startegyComment/commentId' + commentId + '/img' + index, imgPath)

								});
							} else {

								mui.back()
							}

						} else {

						}
					}
				});
			} else {
				mui.toast("内容不能为空")
			}
		})

	})

})
// 从相册中选择图片   
function galleryImgs() {
	// 从相册中选择图片  
	plus.gallery.pick(function(path) {

		console.log(path)
		var token;

		if($('.show_imgs > .show_imgcontent').length < 1) {
			var div =
				"<div class='show_imgcontent' data-src = '" + path + "'>" +
				"<div class='img_box'>" +
				"<img class='show_img'  data-preview-group='2' data-preview-src='' src='" + path + "'>" +

				"</img>" +
				"<div class='delete_img'></div>" +
				"</div>" +
				"</div>";
			$('.show_imgs').append(div)

		} else {
			mui.toast("只能发送一张图片，请确认您要发的图片")
		}

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		system: false,

	});
}

//	选择图片结束

//上传图片
function upLoad(commentId, key, path) {
	getUpToken('img', key, function(token) {
		var url = "http://upload-z2.qiniup.com/";
		var uploader = plus.uploader.createUpload(url, {
			method: "post"
		}, function(t, status) {
			if(status == 200) {
				console.log(JSON.parse(t.responseText).key)
				$.ajax({
					type: "get",
					url: config.data + "strategy/updateCommentImg",
					async: true,
					data: {
						commentId: commentId,
						img: JSON.parse(t.responseText).key
					},
					success: function(data) {
						$('.show_imgs').children().remove();
						$('textarea').val("");
						mui.back();
					}
				});
			} else {
				console.log("上传失败 - ", status);
				mui.toast("上传图片失败")
			}

		});

		uploader.addData("key", key);
		uploader.addData("token", token);
		uploader.addFile(path, {
			"key": "file"
		}); // 固定值，千万不要改！！！！！！
		uploader.start();
	})
}

function getUpToken(scope, key, callback) {
	$.ajax({
		type: "get",
		url: config.data + "users/getUptokenByMsg",
		async: true,
		data: {
			scope: scope,
			key: key
		},
		success: function(data) {
			token = data.upToken;
			return callback(token)
		}
	});
}
//上传到七牛的function结束