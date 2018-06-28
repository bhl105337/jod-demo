$(function() {
	function plusReady() {}
	if(window.plus) {
		plusReady()
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	mui.plusReady(function() {
		var playTop = plus.navigator.getStatusbarHeight();
		$('.before_search').css('height',playTop)
//		$('.search_head').css('top',playTop)
	})

	

	$('body').on('click', '.search_cancel', function() {
		$('.search_lists').empty();
		$('#searchinput').val("");
		
	})


	

		

		$('#searchinput').on('input propertychange', function() {

			var value = $(this).val().replace(/[\r\n]/g, "");
			$.ajax({
				type: "get",
				url: config.data + "h5/getH5ByMsg",
				async: true,
				data: {
					"msg": value
				},
				success: function(data) {
					if(data.state) {

						var h = data.h5;

						var div = "";
						for(var i = 0; i < h.length; i++) {
							div +=
								"<div class='search_list' data-id=" + h[i].id + " data-sort=" + h[i].sort + " data-url='" + h[i].url + "'>" +
								"<div class='h5img' style='background-image:url(" + config.img + encodeURI(h[i].title_img) + ")'></div>" +
								"<div class='h5art'>" +
								"<div class='ofh' style='line-height: 2.875rem;'>" +
								"<div class='h5head fl' style='background-image:url(" + config.img + encodeURI(h[i].icon) + ")'></div>" +
								"<div class='font_14 fl ofh' style='max-width: 10rem;white-space: nowrap;text-overflow: ellipsis;'>" + h[i].name + "</div>" +
								"<div class='font_14 color_blue fr enter' >进入游戏 >></div>" +
								"</div>" +
								"<div class='font_12' style='margin-left: 0.75rem;margin-bottom: 1rem;'>" + h[i].commend + "</div>" +
								"</div>" +
								"</div>"
						};
						$('.search_lists').empty();
						$('.search_lists').append(div);

						$('.search_lists').on('tap', '.search_list', function() {
							//					console.log($(this).attr('data-url'))
							//					alert("11")
							var url = $(this).attr('data-url');

							mui.openWindow({
								url: 'h5game.html',
								id: 'h5game.html',
								styles: {
									top: 0, //新页面顶部位置
									bottom: 0 //新页面底部位置
									//		   width:100%,//新页面宽度，默认为100%
									//		      height:100%,//新页面高度，默认为100%
								},
								extras: {
									url: url
								},
								createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
								show: {
									autoShow: true, //页面loaded事件发生后自动显示，默认为true
									aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
									//    duration:animationTime//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
								},
								waiting: {
									autoShow: true, //自动显示等待框，默认为true
									title: '正在加载...', //等待对话框上显示的提示内容
									options: {
										//      width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
										//      height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
										//      ......
									}
								}
							})

						})

					} else {

					}
				}
			});
		})
	

	
})