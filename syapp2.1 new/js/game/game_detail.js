var icon;
var gameName;
var gameId;
var gameComment = false;
var gameStrategy = false;
var commentModule = false;
var userId = localStorage.getItem("userId");
var game;
var gameImg;
$(function() {

	mui.plusReady(function() {
		mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
		$('.header_box').next().css("margin-top", 0 + "px");
		$('.backImg').css("top", total_height - 36.5 + "px");
		var self = plus.webview.currentWebview();
		gameId = self.gameId;
		$.ajax({
			type: "get",
			url: config.data + "game/getGameById",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					game = data.gameDetail;
					var g = data.gameDetail;
					var icon_img = g.game_title_img;
					icon = icon_img;
					var game_name = g.game_name;
					gameName = game_name;
					$("#game_detail_download").attr("src", g.game_download_andriod);
					var fileName = '_downloads/' + game.game_name + '.apk'
					if(plus.runtime.isApplicationExist({
							pname: game.game_packagename,
							action: ''
						})) {
						$("#game_detail_download").find(".download_btn_text").text("打开");
					} else {
						plus.downloader.enumerate(function(tasks) {
							//		var state;
							var state = false;
							for(var i = 0; i < tasks.length; i++) {
								if(tasks[i].filename == fileName) {
									$(".download_btn_text").text("取消");
									tasks[i].addEventListener("statechanged", onStateChanged, false);
									state = true;
								}
							}
							if(!state) {
								plus.io.resolveLocalFileSystemURL('_downloads/' + game.game_name + '.apk', function(entry) {
									$("#game_detail_download").find(".download_btn_text").text("安装");
									//	可通过entry对象操作文件 
								}, function(e) {
									//console.log("文件不存在 " + e.message);
								});
							}
						});
					}
					gameImg = g.icon;
					$('.game_detailTopimg').css('background-image', 'url(' + config.img + encodeURI(g.game_title_img) + ')');
					$('.game_infoImg').css('background-image', 'url(' + config.img + encodeURI(g.icon) + ')');
					$('.game_call').text(g.game_name);
					$('.game_nameHeader').text(g.game_name);
					$('.game_company').text(g.game_company);
					$('.game_infoScore').text(g.grade + "分");
					$('.gameScore').text(g.grade)
					if(g.tagList) {
						var t = g.tagList.split(',');
						for(var i = 0; i < t.length - 1; i++) {
							var sp = "<span class='color_green'>" + t[i] + "  |</span>"

						}
						$('.game_signs').append(sp)
						var spLast = "<span class='color_green'>" + t[t.length - 1] + "</span>"
						$('.game_signs').append(spLast)

					}

					$('.game_simpleIntro_content').html(g.game_detail)
					$('.game_particular_value').children().eq(0).text(g.game_download_num + "次下载")
					$('.game_particular_value').children().eq(1).text(g.game_version)
					$('.game_particular_value').children().eq(2).text(g.game_size + "MB")
					$('.game_particular_value').children().eq(3).text(g.game_update_date)
					$('.game_particular_value').children().eq(4).text(g.game_company)
					$('.game_particular_value').children().eq(5).text(g.game_company)
					$.ajax({
						type: "get",
						url: config.data + "game/getGameImgListById",
						async: true,
						data: {
							gameId: gameId
						},
						success: function(data) {
							if(data.state) {
								var gl = data.gameList
								var div = ''
								for(var i = 0; i < gl.length; i++) {
									div +=
										"<div style='margin:0.625rem 0.625rem;margin-left: 0;margin-top: 0.125rem;'>" +
										"<img class='game_detail_content' src='" + config.img + encodeURI(gl[i].img_src) + "' data-preview-src='' data-preview-group='2' />" +
										//										"<img class='game_detail_content' style='background-image: url(" + config.img + encodeURI(gl[i].img_src) + ");'></img>" +
										"</div>"
								}
								$('.game_detail_contents').append(div)
							} else {

							}
						}
					});
				} else {

				}
			}

		});

		//		相关资讯
		$.ajax({
			type: "get",
			url: config.data + "game/getNewsByGameId",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					var nl = data.newsList;
					var div = '';
					for(var i = 0; i < nl.length; i++) {
						div +=
							"<div class='game_relatedInfocontent' data-id='" + nl[i].id + "'>" +
							"<div class='game_relatedInfocontentImg' style='background-image: url(" + config.img + encodeURI(nl[i].img) + ");'></div>" +
							"<div class='game_relatedInfocontentArt font_14 simHei color_282828'>" + nl[i].title + "</div>" +
							"<div class='game_relatedInfocontentTime font_12 simHei color_9e9e9e'>" + nl[i].add_time + "</div>" +
							"</div>"
					}
					$('.game_relatedInfocontents').append(div)

				} else {

				}
			}
		});

		$('body').on('click', '.game_relatedInfocontent', function() {
			mui.openWindow({
				url: "../news/news_post.html",
				id: "../news/news_post.html",
				extras: {
					newsId: $(this).attr('data-id'),
					gameId: gameId
				}
			})
		})

		//		相关资讯结束

		//		游戏热评部分
		$.ajax({
			type: "get",
			url: config.data + "game/getGameHotComment",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {

					var com = data.comment;
					var div = '';

					for(var i = 0; i < com.length; i++) {
						if(com[i].state) {
							var ifGood = "good";
						} else {
							var ifGood = "noGood";
						}
						div +=
							"<div class='news_post_commentContent ofh'>" +

							"<div class='ofh'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(com[i].portrait) + ");' ></div>" +
							"<div class='comment_user font_12 font_bold fl'>" + com[i].nick_name + "</div>" +

							"</div>" +
							"<div class='game_comment_content'>" +
							"<div class='comment_content font_14' data-id='" + com[i].id + "'>" + com[i].content + "</div>" +
							"<div class='comment_info ofh'>" +
							"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
							"<div class='fr color_9e9e9e comment_imgs'>" +
							"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "'></span>" +
							"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
							"<span class='comment_img' data-id='" + com[i].id + "'></span>" +
							"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +

							"</div>"
					}
					$('.news_post_commentContentshot').append(div)
				} else {

				}
			}
		});

		//		游戏热评部分结束

		//		相关游戏

		$.ajax({
			type: "get",
			url: config.data + "game/getGameLikeTag",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					var gl = data.gameList;
					var div = '';
					for(var i = 0; i < gl.length; i++) {
						div +=
							"<div>" +
							"<div class='game_similarContent backgroundColor_white ofh' data-id='" + gl[i].id + "'>" +
							"<div class='game_similarContentimg' style='background-image: url(" + config.img + encodeURI(gl[i].icon) + ");' ></div>" +
							"<div class='game_similarContentname font_12 font_bold color_282828'>" + gl[i].game_name + "</div>" +
							"<div class='game_similarContentinfo ofh'>" +
							"<div class='font_12 color_7a7a7a fl' style='margin-left: 0.4375rem;'>" + gl[i].tagList + "</div>" +
							"<div class='fr font_12 color_7a7a7a' style='margin-right: 0.5rem;'>" + gl[i].grade + "分</div>" +
							"<div class='game_star fr'></div>" +
							"</div>" +
							"</div>" +
							"</div>"
					}
					$('.game_similarContents').append(div)
				} else {

				}
			}
		});

		$('body').on('click', '.game_similarContent', function() {

			mui.openWindow({
				url: 'game_detail.html',
				id: 'game_detail.html',
				extras: {
					gameId: $(this).attr('data-id')
				},
				createNew: true //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			})
		})

		//		相关游戏结束

		$('.goToscore').click(function() {
			if(localStorage.getItem("userId")) {
				mui.openWindow({
					url: "game_score.html",
					id: "game_score.html",
					extras: {
						gameId: gameId,
						icon: icon,
						gameName: gameName,
						game_icon:gameImg
					}
				})
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		
		
		
		//详情页

		$('.game_detail_detail').click(function() {
			pageIndex="detail";
			commentModule = false;
			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
			$(this).addClass('game_detail_detail_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_assess_active').removeClass('game_detail_strategy_active')
			$('.game_detail_details').removeClass('hidden').siblings('div').addClass('hidden');

		})

		//		详情页结束

		//		评论页开始

		$('.game_detail_assess').click(function() {		
		    detail_assess();
		});
	

		//		评论页结束		

		//		攻略页开始

		$('.game_detail_strategy').click(function() {				    
			 detail_strategy();
		});
       
	   
		
		
		
		
		//		攻略页结束

		$("#game_detail_download").click(function(ev) {
			//	plus.downloader.clear(  );
			event = ev || window.event;
			event.stopPropagation();
			var t = $(this);
			var isFile = false;
			var fileName = '_downloads/' + game.game_name + '.apk';
			switch($(this).find(".download_btn_text").text()) {
				case "下载":
					createDownload(game.game_name, game.game_download_andriod)
					//				t.text('暂停');
					break;
				case "打开":
					launchApp(game.game_packagename);
					//launchApp(myApp[1].packageName);
					break;
					//				t.launchApp();
				case "取消":
					//				console.log(1)
					plus.downloader.enumerate(function(tasks) {
						//		var state;
						for(var i = 0; i < tasks.length; i++) {
							if(tasks[i].filename == fileName) {
								tasks[i].abort();
							}
						}
					});
					setTimeout(function() {
						$(".download_btn_text").text("下载");
						$("#game_detail_download").removeClass("download_btn_active");
						$("#loading").css("width", 0 + "%");
						mui.toast('下载任务已取消');
					}, 300)

					break;
				case "安装":
					installApp(fileName)
					break;
			}
		})

	})

	$('.backImg').click(function() {
		mui.back()
	})
	$('.comment_content').each(function() {
		var maxWidth = 10;
		if($(this).text().length > maxWidth) {
			$(this).text($(this).text().substring(0, maxWidth));
			$(this).html($(this).html() + "<span class='color_green' style='margin-left:0.2rem;' >详细</span>")
		}
	})

	$(window).scroll(function() {
		var $body = $('body');
		var windowWidth = $(window).width();
		var imgHeight = (0.66 * windowWidth - total_height);
		var setCoverOpacity = function() {
			$body.find('#header').css({
				opacity: ((($body.scrollTop() / imgHeight) > 1) ? 1 : ($body.scrollTop() / imgHeight))
			})
			$body.find('.before_header').css({
				opacity: ((($body.scrollTop() / imgHeight) > 1) ? 1 : ($body.scrollTop() / imgHeight))
			})
		}

		//初始化设置背景透明度 
		setCoverOpacity();
		//监听滚动条事件，改变透明度 
		$(window).scroll(function() {
			setCoverOpacity();
		});
		if($body.scrollTop() >= imgHeight + 106) {
			$('.download').removeClass('hidden')
			$('.border').removeClass('hidden')
			$('.game_detail_nav').css({
				"position": "fixed",
				"top": total_height,
				"border-bottom": "1px solid #E7EAEC"
			});

		} else {
			$('.download').addClass('hidden')
			$('.border').addClass('hidden')
			$('.game_detail_nav').css({
				"position": "static",
				"border-bottom": "0.5rem solid #E7EAEC"
			})
		}
	})

	$('.show_all').click(function() {
		$('.game_simpleIntro_content').removeClass('overflow_two')
		$(this).remove()
	})

	$('body').on('click', '.comment_img,.comment_content', function() {
		if(userId) {
			mui.openWindow({
				url: "game_allComments.html",
				id: "game_allComments.html",
				createNew: true,  
				extras: {
					commentId: $(this).attr('data-id'),
					gameId: gameId,
					uid: $(this).attr('data-uid'),
					game_name:gameName,
					game_icon:gameImg
				}
			})
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html",

			})
		}

	})

	//	游戏点赞

	$('body').on('click', '.thumb', function() {
		if(userId) {
			var ts = $(this);
			if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
				ts.css('background-image', 'url("../../Public/image/good.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
				ts.attr('data-state', 'null')

				$.ajax({
					type: "get",
					url: config.data + "game/unLikeComment",
					async: true,
					data: {
						commentId: ts.siblings('.comment_img').attr('data-id'),
						userId: userId
					},
					success: function(data) {
						if(data.state) {

							mui.toast("取消点赞成功")

						} else {
							mui.toast("取消点赞失败，请重试")
						}
					}
				});
			} else {
				ts.css('background-image', 'url("../../Public/image/diangoodone.png")')
				ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) + 1)
				ts.attr('data-state', 1)
				$.ajax({
					type: "get",
					url: config.data + "game/likeComment",
					async: true,
					data: {
						commentId: ts.siblings('.comment_img').attr('data-id'),
						userId: userId
					},
					success: function(data) {

						if(data.state) {
							mui.toast("点赞成功")

						} else {
							mui.toast("点赞失败，请重试")
						}
					}
				});
			}
		} else {
			mui.openWindow({
				url: "../user/login.html",
				id: "../user/login.html",

			})
		}

	})

	//	游戏点赞结束

})

function createDownload(name, src) {

	$.ajax({
		type: "get",
		url: config.data + "game/addDownloadNum",
		async: true,
		data: {
			id: self.gameId
		},
		success: function(data) {
			if(data.state) {
				$("#game_msg_install").text(parseInt($("#game_msg_install").text()) + 1)
			}
		}
	});
	plus.downloader.enumerate(function(tasks) {
		for(var i = 0; i < tasks.length; i++) {

			if(tasks[i].filename == '_downloads/' + name + '.apk') {
				//				tasks[i].abort();

				return;

			}

		}

		mui.toast("开始下载")
		$(".download_btn_text").text("取消");
		var dtask = plus.downloader.createDownload("http://apk.oneyouxi.com.cn/" + encodeURI(src), {
			method: 'GET',
			data: '',
			filename: '_downloads/' + name + '.apk',
			timeout: '3000',
			retry: 0,
			retryInterval: 0
		}, function(d, status) {
			// 下载完成

			if(status == 200) {
				//				添加到我的游戏
				if(userId) {
					$.ajax({
						type: "get",
						url: config.data + "game/addMyGame",
						async: true,
						data: {
							gameId: gameId,
							userId: userId,
							sys: 2
						},
						success: function(data) {
							if(data.state) {

							} else {

							}
						}
					});
				}
				//				添加到我的游戏结束

				plus.runtime.install(dtask.filename, {}, function(widgetInfo) {
					$(".download_btn_text").text("打开");
				}, function(error) {
					console.log(error)
				});

			} else {
				mui.toast("下载失败: " + status);
				$("#game_detail_download").removeClass("download_btn_active");
			}
		});
		dtask.addEventListener("statechanged", onStateChanged, false);
		dtask.start();
	});
}

function onStateChanged(download, status) {
	//	if(download.state==5){
	//		console.log(download.state)
	//	}

	downloding(download)
	if(download.state == 4 && status == 200) {
		// 下载完成 
		$("#game_detail_download").removeClass("download_btn_active");
		$(".download_btn_text").text("安装");
		console.log("Download success: " + download.filename);

	}
}

function downloding(download) {
	switch(download.state) {
		case 0:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 1:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 2:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 3:
			loading((download.downloadedSize / download.totalSize * 100).toFixed(0))

			break;
		case 4:
			//			$(".ldownload_btn_text").text("打开");
			loading(0)
			break;
	}
}

function loading(num) {
	//	!$("#game_detail_download").hasClass("download_btn_active") ? $("#game_detail_download").addClass("download_btn_active") : "";

	$(".download_loading").css("width", num + "%");

}

function installApp(filename) {
	plus.runtime.install(filename, {}, function(widgetInfo) {

		console.log(widgetInfo)

	}, function(error) {
		mui.toast("打开失败")
		console.log(error)

	});
}

function launchApp(pagename) {
	if(plus.os.name == "Android") {
		plus.runtime.launchApplication({
			pname: pagename,
			extra: {
				url: "http://www.html5plus.org"
			}
		}, function(e) {
			installApp('_downloads/' + game.game_name + '.apk')
		});
	} else if(plus.os.name == "iOS") {
		plus.runtime.launchApplication({
			action: "http://www.html5plus.org"
		}, function(e) {
			alert("Open system default browser failed: " + e.message);
		});
	}
}



function detail_strategy(){
		   $('.news_post_commentContentstra').children().remove();
			commentModule = false;
			pageIndex="strategy";
			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
		    $(".game_detail_strategy").addClass('game_detail_strategy_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_assess_active')
			$('.game_detail_walkThroughs').removeClass('hidden').siblings('div').addClass('hidden');
			//		获取游戏攻略
			$.ajax({
				type: "get",
				url: config.data + "game/getStrategyByGameName",
				async: true,
				data: {
					gameName: gameName,
					page: 1
				},
				success: function(data) {
			    mui('#game_detailContent').pullRefresh().endPulldown(true);
					if(data.state) {
						var str = data.strategy;
						var div = '';
						if(str.length > 0) {
							for(var i = 0; i < str.length; i++) {
								if(str[i].src) {
									var src = "src"
								} else {
									var src = "hidden"
								}
								
								
								if(str[i].top_img_src==""||str[i].top_img_src==null){									
									imgSrc="";
									imgToggle="none";	
								}else{
									imgSrc=str[i].top_img_src;
									imgToggle="block";						
								}
								var detail=$(str[i].mdetail).text();  
								//alert(str[i].mdetail);
								if(str[i].portrait==0||str[i].portrait==null){
									portrait="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAKAAoADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0HRvB/inUbm0t/EggjsrFMwrEw+Y574PvXS6z4e1nxJoWoaZrKRQpgG2dHBJIIIzj6V3+DwR+OaMHvyR+FNaDPMfClp47hEen6tDZHTlTy/MVl3Yx6ZzWZb+GvGXh2fULTw2LeWwuJC+ZWAZc9TkmvYSMgjnn0oUEDHPHvmncVjyK7+HeoR6Da2kDqbia7W6unJ+825SefTippvh5dHWdX1AlPNlVRAB0Aye3416tg5JX6cmnL0PHtRdhYwvCGnT6Zo0cF2QZc5OK36aM45606kNKwUUUUAFFFFABRRRQAUUUUAFJmlNJQAZozRRQAUUUUDCiiigBKMUtFABRSZpCaYC5paZmnDpQAUZoNJQAuaM0lFAC5pQaZmgmgB+aM1HmlzQA/NGaYTSZ96AJM0ZqPPvQDRYB+aCeabmgdaAHE4pMihqMUAGRRkUYo20ALmjNN6UUAOzRmk5ooAXNLTadQAUUlLSAQcDFFLRQISloooAKSlooAKKKKADNFFFABS4pBS0AGKMUUUAGKMUUUAGKMUUUAGKMUUUAGKMUUUAGKMUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRmjNAAaSjNFABRRRQMKKKTNAC0maCeKbTAUmkzSNSUAOzSMeKSg0AOWlzTFbmnGgBSaSgUhNAAaTNITzSZoAdmjNMzRmgB+aM03NGaAHE8UmabnNFADqKTOBSg5oAXNKDTCacPWgBxNGaZnNJuoAkzTgaiDU4GgBzCgCl6ilxxQAmKMUtLikFxuKMU7FGKAuNxzRSmkNAC0U0GloAWiiigAooooEFFFFABRRRQAClpBS5oAKKM0ZoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooADTScU6igBAciloooAKDRQaAEooooAKKKKBhRRSGgBaQ0lGeKYBSUmaCaABqbRmjNABmkJ4pM0E0ACnmpO1RZp6nIoAceAajLUjtg4qMmgCTNGajBozQA7NKpzTSaFoAkopmaM0AOozTCaTNAEhPFANRE05KAJByae3ApiinMc0ANzzRS0hoASnA0yjpQBYU8CnVXVqmU0AOpabmlHSkIWiiigBDSGlNIaBoQUvakopgKKWkFLSEFFFFABRRRQAUUUUAFFFFABRRRQAtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUGig0AJRRRQAUUUUAJQTQabTGLmmk0tIaAGnrQaDTSaACkzSA0hNADscA+tNPPSgsecdRXA/Fb4lWHw+tIXuI/tE8px5YPI96VxHe8jqCB6mhpFC4B5FeNeAvj1oHiW6+zajixmJwm48H9a9fglS6hWeCRJoiMhlPWhDJegB657imE00tgZBwD2pM5pgPBozTM4ozQBIKXNMzSZoAlBzSbqYX44ooAdnNFIKWgAp6CmDk4qdBtHNADgcCmikJoFADs0hoooAQU1qc1J1oAYpwasIcpntVaX5RU0BzEaAJRyM0K4psZyCKYflegCxmlzTEORTqQWA0hpaQ9KAEpaQUvamAClpBS0hAKXFAooAMUYoooAMUYoooAMUlLSUAFFFFAC0UlFAC0UlLQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUmRnFAC0UZpMjGaAFoozRmgAoNFBoASijFGKACiiigYhpvenGm9KYCGkzSnnpTTQA0mmtTjSEZ6UAM/i46+lIDuGSrDb1p4A6cBs9awfG0U8/hbUltbl7eVEJEi9uKAKfjXx1ong/TZLzU7qNv7iKeSa+H/AIu+Orjxx4llvGLLbr8sadsVz/ifWNR1DULhL+8kn2SsAGPHBrGJBzUiBJJEZSjFSvQjtXvfwK+NU/h2VNK8QyPPZPhEkc/6sV4FxT9wGMZ460ID9L7G9ttTsYbyxnWS1cbgynP51ZyANygkep6V8MfCz4x6x4HX7Pk3dkcARyHhRX1d8OfiTo/jxDHph23saB5oz0XNVcZ3Ge+c5ozTGIXOeOccUbhnGeaAHhqXdwahLUAnGe1AEi9eak3VGvTNLwTxQA/JPSnE+lGNq47+lSBQq5bg0ACqF570/eCc54qqwkJPBxUTGRD0OKALrc9KUGqS3DZxirCSA4ycGgCYmm5PrQeRxSUALnPWikNJzQASgFadbHjHam9qICA+CaAJgcNxTnGRmo5ODk05WyMUAEZwcGp6gxzkVIpoAfTCaHNNFABkkfL1p6nPUY9q5zxn4rsPCOnC91MsIc4LAcCqnhz4heHNehEtnqMIGMkM2KAOwoqC2u7e5XdbzRyD1Vs1NkZpAKKWkoLAY560CFooooAKKKKACkpaSgAooooAKKKKAClpKWgAooooAKKKKACiiigAoo70UAFFFFABRTQ2Tj86Nx9KAHVm6zqtpo9pLdX9wkUKKSdx60ms61Y6RYS3d7cRxRxjJJNfC3xl+J2peKtduoLe8f8As5JGVFU4DAHigD2fUv2mLOHXjaRad5lqku3zc9s9eteo+GPiv4X1+RI7bUF81wMo5xg1+em7g+9S211NbOr28jRupyGU80AfqClzAwG24Q7uRhhUiyIThSGPfBr86bL4m+J7QxmPU5vkGAC3Fb2ifHDxdpl2ZVvPODdVkyR/OmM++wfUYFKPrXynpH7TbqYY7+yLjIDsK+lvCuuQeIdEttStFKwzLuXNIRr0UmaWgANJSmkoATFBHFLSGgYmMU1hmnEkjgU0tjjGT3pgMYUx0GVJyT6Cku7mK0jaW5kSKJRkljivKPG/x18M+GiyWz/bpxwREehoA9WcCPLuRGo5JY8V538W/iHo3hzQbuI3sTX0kZCohznivmX4g/HjxD4jE9rYyGzsZOgU/NXkl7fXN7N5l5O80n95jk0AMvpvtF9PN/z0ct+ZqAUo+9QRgY71IhKKKKACu2+GHj288B6rPeWC7mnARx7ZzXE04MR04oA++vh58S9E8X29vFbXJXUzEGli9DXbO5bIxkA9TXwH8JNduNF8bWEts6x+bIqOT6Zr76kkWVo3jIdXQEEdDVIY4HPFO5PA7UxcAZpVOT8vWgCQtgYFTxJhct1qOBVGWfqKbNKSeKALG9RyetMkk8xhjpVfBbkk0eZsoAthsck07ejcGqJlz9KBIB3oAtyRq3K1CyFaRZz6jFSJKGPNACJIw61ZDA9KiaMP92mKGTpQBYzk0UxCSafg0AJ60xTiQZp3OeaY+N4oAsSjeoIqNTjrUsJymKidWDGgCVWqVSMVXj5IzUhyp9qAHtyaTOKAymhvagDH8XaFb+IfDt5ptwqsJUKqWHQ1+evjLTb/AMK+JLzTWkmjMLkKQcAiv0hJyr8civmn9rPwObmzh8RWcYPljbKEHJ68mkI8A8OfEvxP4eA+w6lLgdmavWvCX7S2p2MCR69atdMw/wBYCP8AGvnEfTmjdzkcGgD768H/ABs8Ka7bxLLfR2ty3HlPnk/lXpVndW10m60mjkUjOUYGvy8SRkcOCQw5zXaeDviZ4l8KzmXT7+Qg8FGJIxQB+jScqKWvmn4f/tJWlxHDa+IbdkmJ+aZTwK970DxNpev26z6VeRXEZ/unBFAG3RSZ5xS0AFJS0lABRRRQAUUUUAFFFFABRRRQAtFFFABRRRQAgPJ5pab6Y6VXu7q3tI99zNFFGOSXYCgC1SMwUZYgD1NeTeOPjf4a8NCaKO4+03SjgIcivnXxz+0B4j14NFp0jWEGeqHBI/CgD608W+PtB8NWUs2oXsZaM8xq43Gvn7xr+0tM85TwzagRMCN8nP8AhXzfquq3urXLz6hcyXEp7saoZ+Udc0AdZ4m8feIfEMsrahqU/lSH5oVYha5PuR0FNNFACk/KMdqbTqKAAdKOlFFAFqxha5vIbZCf3jAV+i3wm0t9H8B6VaPnKRDr9Sa+APANuLnxjpUR6GZc1+k2mRrDYW8adFjUfpQBZpaKKACko4FHIHNABTW6UyaVYVaSV1RAOSxwBXl/xG+MmgeEkkijnS5vtvyLGcjNFwPTLy6htI2luZkiiUZJZsV4x8Svjvo/hxZbbS2FzegdVORXzT49+LniPxXdTb7x4LMnC26EgY/OvOZWZnLM24nkmi4HpPjb4w+JfFTGOS7e3gP8CkjIrzaR2d2dmO8nJNMHLDNdP4W8F674lvEtdLsJZHl6M6kKB9TxQM5rAY8E/jWlo+iajq0vlafaSzN3KoTX0r8Pv2bVRYrrxRcL5inJgHQ1734a8J6F4ZAj0jTo4CwwZFAzTA/OrVdNuNLvTa3yMko6qRgiqJyee1erftKeR/wtHUTBjGRk/wDARXlDDB61IgopKKAFopBS0ASW0kkM6SRMVdTkEe1fd/wM1aTW/h1ZSzSF7lFAZj9BXw1o2n3Gq30NnaR75ZWCrX3t8MPDr+FvA1hYOoS6ZQZv97AzVIZ1yqFTmnpgsu3pVeMkthulTu4A2rQA+RhgioOpo3cYoXrQBNGe1JKgIp6DAzTsbqAKQUZwxIFTLFARy3NSmMZqKSEHp1oAWe0IQNEeKhRmVgHHNTL5ijbniicp5fqaAJIpCDwanLA1TtfmFWOhoAnjwKkJ4qAGpM8UAITlqguDtOaleQKKgkkVxjvQBZhbCg1YJDrmqdq+Plq0v7s47UARlSDT4+eDT3AxntTAVJ4oAeYwORSCpF6UxlOaAADByOWNZ3iLSrfWdHurO6iDJIhUg1pZK0sg3RkZwfX0pAfmx8Q/DU/hbxVe6ZOCPJcgEjgj2rmTjPHSvpz9ryPQnvbSS3lQ6oB8yqcg9etfMhoEIKAecjikFLQA8PxkHB7+9dJ4R8Z6x4Yukm0u9kjUEExA4U1zFFAH2P8ADD9oSz1QxWPiLENyx27+gr6BsL23vrdJrWVJImGQysCDX5c5xjnjtXqvws+MWs+D7yGGaZ7nTgQDET90e1AH31mkNcn4I8baP4u02O40y5RmIBeMn5lNdSoOMk5FAD6KQciloAKKKKACiiigAooooAWiiigAooooA+QfE37Td5fWjx6VYtay44Ytnn8q8k8S/FDxT4ji8rUdRcx+kZK/1rh8UtAD5ZWkkLuxdj3Y5pm40hooAUNlskflQcds00U7tQA00UGigBaUqQeaQdasWtu08m0HLdhQBXoFTXVtJbylJV2sOoqNCB1GaAOz+D9k17490qNM7vNB6Zr9D7e7to40iNxCJFUZXzBnp6V8c/soeGZL3xY+quFaG3XGPQ8Gue+KfiLxDYfELWDYXt0qRS4+UttUYFAz7sS9t3+5PEx7gODiqOs6/puk2clxfXkMSIMkbxn8q/PWw+IfiSyuZJotTnLP13Mcfzqhrni7Wtaldr+/mk3jBXccUhH1V8QP2itK0oRxaDGbx3HzSZwF/SuFsf2ndRiyZ7DzAenzCvnFs8DAPatXTdBvdTtZrq2jzBCcMfxoA9F8e/HTxH4k8yG2mNpZydUU84+teU3NxJcSF5XaRj1Zzk1PqOmzWRzKMA9KpKCelADh1OzBHqaQKWBx260uMldoODwPevY/g98GNR8YTpeagjW2mKckkYL0Acp8KvAN/wCNPEEFvbwt9kVg0srKdoXuK+9fD+h2WgaXbWtpBEohjCZVcE4HWofCfhfTPCumRWek26RIo5YD5m+tbLsNxL00MYxHGckE857VUnuFgtLmdn2xqpILN0qV2LN8p4z0ry79o3U5dI+GlybRnjmdtuV9waYHyB8StT/tjxnqN1v3B5SBz0xx/SuVxxn3pzMXZmOSxOSaD04PFSIZijHFLS9sUAJtINXLHTby/kCWdvLNk4yqEitPwZ4cu/FGvW2n2MbMXYAtjgCvuXwV4J0bwjo1vbQWMMtwyjzHdQSDQB4p8Cfg3qVtfW+uaviDYdyRsOSOxr6TmkaV2Y/e6UoPyqoYhAMYHSgYBJXhfeqGAOBjvT0HcioR8zcVYbiOgCMnL8cU+L5mpgHyZqe2TnNAE4HGKdtwOtL2pT0oAjxzzQcdcU/FIRxQBDjJ9qY8IPFTEYpDQAyFBGODT2b2pu0mhqAHq+T0qR22ge9V0+9TL52VlC0APdwSc1EYyTlTTfNKn94v41LFICQVoARX8ognrV+Vt8SstUZyjHHepbGXja/SgCUXOFCkZ9aljCyfdbFQ3MQByvQ1Xjk8twAaANNUZed1Sc45NRKzFMino4ZeaAFLBRlhx61478bvi9ZeDrN7KxkWXUnBGFOdg9azfjp8YrfwzZT6bosqyai4ILDnbXxprOqXWr3sl3fytNPIclmOcUhEmvazea3qM17qErSySMTljnH0rNJpcEjqOO1IaAExS0UUAFA60UUALkHJI5pQ2D0ptFAHR+CvF+p+EtUivNLndNpyyZ4b8K+5PhF8TtN8daOrI4ivkAEsLNznuRX58Ct3wl4k1Dwtq9vqGmytHLG2SoPDj0NMZ+l6MSSMYHY+tSV558IfiJZ+PNCSeJ1S7jAWaE9c+o9q9CHNIBaKKKBBRRRQAUUUUALRRRQAUUUUAfmRrejf2ZDZSC5hnFzH5gCMCV69fypLLSp1gS+ubSUWH/PTacHj1p/iuSSXXrqSSzayy2VtyPue1dhJ42tNR+HTaHdgQTQgeTsjB3HjqaAR51ceUZCYAQvvUQBxzwD3qREMrqqjczHGB3NevxfCeXTfhzJ4k1ZJfOkGYoUBbA45Pp1pjPHNuACRwelT28G6aJJQUV2A3HoBmtLTdCl1C9soInH+ksq7icKpPYmtXxD4P1LTPEMmi/66aIbsKcj35/CgDL17R1tLxksX+0QrGru684zWGevHSt/T7y60972wjty8s42FW5PGen51hyxPFIUlQo4OCG4xSAtaJJbRaravfKWtVcGQDuuea9g1PT/Cg02TxB4NmTz41EbWtxgkkjqAfpXiajmr2mI095FAspi8xgNwbA/GgR2+h+FrHxFp+qSXWoxW2qQDzAksgG/jOACa5zTfC2oX8shigZYI875ivyDB656V694h8BaYnhbSNOsrqO48SXPMbW77twJ/iI+orn9L0zxG2s23gS5UW7vIBKytglT1yfxpjPp74DeCrLwt4OgltG8ya8xJK559uK8w/aYs38N2U7aVpqSR6k2+e5Me4ocY6446V9GeGtNTSNCsrCMkpDGFyaNe0a01vTZbHUIY5reVSpDKOPcUmI/MjJCn0bjmo69l+MXwa1XwpqVxc6bA1zpjklCmSyj6V44yMrMrDDL1BpANye1a1hq09ppktvDPJGrnkKxANZQ4IJ6UnagCe4uppwFmkd8dMnNQjPbFGcNnrV+xhspLeRrqV0lx8oA4oA6v4OaRa61430+C8K+Ssikq/Q81+hFlaQWFmlvaRJHAowFRcCvzu+FIV/Helr5xiHnJgjvyK/ROHPkxgNnCgZ9aEBzHjq58Q2Nos/hyOKUJ80iuoZiO4Fec6b8edMTUU07xFYz2V4DtJkQqPryK9sdjyK8F/ac8BWOpeHpNfgVYry2X5tvG7j/61NjPYNH1zSNYXdpN9b3DEZCLICRmvCv2tfFSW2kW2gIUaSb942OSMcf1r5o8M+KdW8NXq3Om3kscin7u44NR+KfEV74lvzeanM0s3QE9hSEYtBooxngUgA9KsWNrPezJBbRmSRmwFUZJNQFTtHvX0f8Asw/D9Z5JPEmpwkxw/wCpR14f3/WmgO4/Z6+Hk3hLTJdT1aJRe3SDYpH3OnT0r2AyFiaA+8spPC8gYximg4Jqhj4PvnNK5y+O3pSQn5jQOWJoAcn+sqeUYUVBER5lWpx8goAgcZAAq9CMIB7VTXkirq9qAHCloPXIooAKKKKAEYZpmMVLTXHy8UARE+lMJzTl60mBQA0Z64pboFoQ4HSpFA7U9SDGyt3oArx7bi2O7AIFUrYlZCAeKtNGyqVXgVD5flgmgBrnLZ71IpO0Y4qHPzVKM71XHWgDRgmR02seahkhC5b1qKaMwlSDz1qxHPuA3jCDqT0FAElq+0YY8dea8H+O/wAaIdASTSfDkqyXr8SyKfufQ1Q+Pfxpi0qObQ/DUoe7dSssy9E+hr5OuLmS6uXnupHkkYlmLHJY1Ih2pX9xqNy891I8srEksxyaqdqUn0pMUAFFGKMUAFFGKKYBRRjij8KACijn0oNABThw2M0zNFAHd/CXxxdeCvE9vdxsfsxO2UZ42k819/8AhrWrfX9Ht9QsnDJKgIwelfmOpx7jvX1H+yd48kEsvhm+k+RhviZj09s/jQB9Vg5FLSL90UtABRRRQAUUUUAFGaKKADNLSUvagDyb4s/B/R/Glm0tvGtpqK5KyIoG446V8paz8GvF+nXjwjTzJEGwjjPP6V+gRx6Nx7U14o5cFkHHqKAR8mfBf4DX39rJqXiyLyoYiHSL+8a+lvFmlxXXhO7sILdCGiKomOBxxXQBV4wOlBUEnI60DPi+H4KanZ6fPd6pfNp21zIsaDdhRzuzxXOeJvHVvDd6bHo8Aubix+SS9bk3AGBz+R/Ovo39pfxEmheEI1SRVlmlCso6mPIyPyzXynerd3sd1q/hzTNmk242Nhd23PBJzTAyvEniN9S8RHU7a1S1mAHyKOM+tVLHS9S8RvdTwKJDGrSyHp7mmaE9m+rxtqqtJbMcsI+tdP4ZtklbX7jT9SGn26I4RHxmRSDgc+1AHBspDkKOnBp0SO0qLECJGOBT7q3khYGVSgfkHs3vUttZyyxCflIQwUyZ6UCPoz4QeAtXh+x69cz/AGQwDIuGbzff7rcDpX0DoHg3SP7SXXJR9q1N8H7SeM/h07VxvwD8NGz8IRSi+a6S4XLB23A/QHpXsUEaRqqxqFwOgouO5Jt6egpec+1B6c1zfizxno3hTyTrl2ltHLwrMR1pCN66tYLuJormJJEIwQwBrwr4l/s+6Prkct1ormyulywjVchz+ddJqfxx8KQTJDa3sU7N/dYf415/dftIx/8ACSpb2lkJLYna3NID598bfD/xD4amH9oaeyJnarICd3v0rjGBQkNw3QgjpX3jL8WPBGo2A/tea1ExG1opQpx+dYVh8NPhn42muL/SisjyHlY3PH4A0AfFIwDyOKM8gjpX2Rrf7NWizr/xLJXi5/iPb86h0b9mjR4JgdRuHlUfwg4z+tAHhfwB8MTeIvHdmQrIkLibfjj5ecfpX3zGNqhSBkDHFc94L8GaL4P08Wui2qIOpYjLfn1royv500gKsnU5OB618/ftR+IL5tCWw0qCR4H4lkUV9ByDDcnjvXm3xct1t/B901rJDasxJZp0BDdemaGM+B2BBweopKvXkDy6hcCNlkIckleh57VHHbo0EkjPtZP4fWkIq0qnBBHUUpAHA5z0rY8L+Hr7xHqcdlpkLSyN94gfd96VgN34T+G4vEXi20tr2ORrXeNxUcV90WllaaVYQ6fYosNrAoVVUYzXI/CXwPb+C/DS2ssMT3kmHdyoLA/Wuzzu3E81SGPUnaGI5bimnrQnCk9zSLyeaYEkP3z9KcO9NThuKc3DkCgCFX2yAmtSQBrdTWS+Op6itO3bzLXA6igCNBhxVxapLneB3q4tAEgopBS0AFFB4FNDc9KAHUdsUZFNJB6CgA2ioTEQeTU3I6imucigBu0KOTTVc5wKQjKiliUqc0APxnNU7k8ECrz4AyKz7liXO0Z4oAih+Z+asxgfahluB2qC3AJUqcnuKs220XDO5CqoySemKALc6kfvMKFA/i6V82/Hv4zJY202g+FpgZWJWedT909wKj/aE+NAjkm0LwzP1UxzTKenYgfrXy3PM80zSSOzuxySec0ALczSXEzSzMzSOcszHJJqKl6/4mjjHoakQlFKQMc8H0oxkZoASnDOMZFdB4Z8Ha14luRFpVjNMB95wpwK9/8AAn7Nbs8Fz4jmxGVy0I7e1OwHzLDbTXHEETyY6lVzXW6B8M/FWuRh9P013Q9yCP6V9xeEvhl4Z8NIy2GnxOG7yDd/OuxtrO2tVxbwRxD0RQP5UAfBkHwH8cSAl9PCDtliP6Vzvi74c+JPCcKy6zYFIzwGUk/0r9HMDGKoazo9hrNo9tqNtHPEwIwy560AfmBjBPJyOxpMZGa+nPi5+z3PDLJqHhZS8R5+zjnFfOWraVd6TdSW9/BJBMhwVYUAZ+KWnqvzYPA96Tbk4Gc0ANHeuh8DaxJoviexv0kMYjlXfg/w96wVQhjx0712Pw38Daj4y1uG2soWaEt+8kxwB9aAP0K8PahFqmi2d3A26OWNSD+FaPesfwho6aD4dsdNjYuIIwuTWwaBi0UUUAFFFIKAFoophcgfLg46k0CH0jY2jJxzXO+JvGWi+G4C+rX8UBxuALDJr55+If7Sjt51r4Vi2kHAnYZz+HNAHqviH43+D9Hl8v7es5BwTGQR/Or/AIW+LvhfxCwWK9SEk4AkIGTXxD4e0Rbmc3GuyXEOnxP5crqAWU9e/etDxPBpulSGbwlfSzWZHzeZwyn8KAP0PilSRQyMpVuQR3FPJwMmvmj9lHxzq2tPdaNqMjTRW0YdXfr1xivoDxJqa6Rod1qGPliQkg0DPmz9r0afM1o6XqteRnm3Dc/XFfNMOqXkFjJZxXDpbSHLRqeDXsfxT8F6lrySeLYNSgmtbpROYi/MeecdPevFJUKrtPDZwVx0pgRhvmz07da6DSNfe08qJoY5I9w3FuAQKpeGtEutf1mDT7FQ08pwoq94g0a9tdXmsJLcCe2BVtnTK9f5UAWtfvtQ8WXavaWIMVuuAsK8AD/9VevfCj4N2tz4fXVvFL3CJK+Y7ZBwcZ69KytL03UPCfhnTLOGxMk2rSI5nC52Keo/8er6Q8CO11YpZiIpPp4UAOMCTcMn+VAHZ+GtLtNK0qC3sIljiVAFUfStXkNmmQDaijbt45FSmkITqK5nx14P03xfpL2epxBuPlfutdPSNwM0AfD/AMYvBN14VhgtDLYJFbMWhKPmVxz1GPevHZJVguElgf8AedSfevtL9pLwAviXw4+q2m8XtiCxRf4h/k18SSo6SOj8MhwQaQD5ppLiR5ZGJLHJIrovBfiG50LUFlW8nijQbgEYgZ965pDtYED8PWu30jTofE+kW1rCYba8tvk3MceZ25oA9x+GX7RcLsll4pUquQsco7D3r6S0jVrPWLCO906dLi2lHyupyK/OTxXoH/COXgspJ0ku0GXKHIrZ+H/xL17wbcxNaTvJagkmF24NAH6H7uuNvFNY+prxz4Y/HHRfFBjtdRdLO/I5LH5TXr0M0VzEJbdxJGfulT1NUMWRQw5Py96+OP2ofHCavr/9ladduYLUbXVThc8V7n8f/iCPBXh028Oft92pVGHb/Oa+GNQu5b+6mubly00rFiTSYiPzmDbk+Qj0qPcST6nrTT+lPicJIGIyKQCxRvI+2NSzHoBX2T+zp4MTw74XGpXdtsv7kf8ALRedv+RXln7PvgZPFXiBdav7Yx2FkQ6gj5ZMV9XuAqKoVUUDCqvQCgCNmJkLc5NIBgNS0Hmmhgv3KE60dBSx96YAD84p0nEuD1pg+8D6GnynMgagCPAJINT2L+XJtPQ1Fty1ISQ4xQBecbZ8noelTiq5YSxA9xU8ZyBQBIp9adketNpKAFkPHHNRLOF4bj61KCBUUkSycdM0AO85D3FN+0oDwQTUDQ7M7TmoYXMbnzE+U96ALoulY44qUlWXriqZigmbdE+DSRMyvtY9KAL6xgLnNGORngVJA6yxEDqKQLu/CgCC4O1DWUzFmODV3U5ckKn41TWMthQASfU0ADXUFhby3l86wWkKks7HAr5q+NPxpm1G1l03wuGjsSxVrhT9498GvS/jBrmm6dDFbX1zLcTHhLOHBEh/2u9eJal4MvvEL/btSszpWlnBS3txlvrz60AeNCK5v5ncB55jySOfzposZ/P8p0KSddpHNfQun/C7WtdsYbbTbOGz0wMA1yc+cR3JHSvX/h/8GvD/AIdCz3yi/uiMZkFAHyp4Y+FXiDXoPOjgMNsekkgwG+lW7n4L+L4lkaKwklVehVSc/pX3PHYwWaCCGONYE+6oXpVhWAXAC7PpUiPg7TPgz4yvJ/L/ALMliz/FIpA/lXr3w8/ZuWKZbnxTcZxysac8+/TivphHPXCD6ClDEsSWz7U0BQ0XQNN0W3EOm2kUAxjKKOfrWwuR2zmo1NSA0xjhn6U6mg06kAUUUCgBCuVx2rjvGPw58P8Aim1kjvrONZJOsiL81dnRQI+VvGX7MTvMG8NXg8sD7sxx/jXHt+zR4sV8ebakeoc/4V9s03FAHyd4O/Zkuzeq3iO5jFt/EI2JY/yr6Q8IeE9K8K6fHa6VapGiDG7HzGuhpaBiLnHPWilpD1oAKU8VG8ioCX4UdSelcn4o+IHh7w3avLe6hBkdUVstQB14IIyKCQoJJwBXzB4y/aZhhlMfhq089em6Xj+RrxXxF8XfFes3ckzalJFG/wDApwKYH2h4z+J/hnwtbSvd6jDJcJ/ywjbLn8K+cviB+0dqGotJbeHYhBaOuCz8MK8Bvr+7vJmku55JJG6ljnNVQeMDmkI1da1/UdYm8zULuac9tzHArLJz359TTaKAO9tvFsct+/8AaEXnWs7eZNbgY3PjH9BVUWF7retv/Z2nNBbXD7hEPuqOvU/SsWzUXeom7kVZFz5kkK9x6V1ms/EO8n0qTRtGh+yaYVwsYAzj69aEM+iv2brXQo72/GnBY9QiQLcRjsc11v7RHiH+w/AVzGI/Me6zEFHbp/jXnP7Hmm3MNnqWpTRgQzjYJDnPUHFSfGHVYPFPxLsfDMkxjhhblgcjdz/gKYHhGl6TDJ4LOoTatM15FMA1gGOdoI6j0613fwZsfDeuzapqHiWKAWiFY4o2yMEkgf0rQ8f+Atd+HNpqPiaK/tp45XaDyCD9xvlB6f7VHgb4fyXPgqyurkyTT3VwkoReMAMCSaAO61T4V6b4f8P32s6CgTUZebUL2B7j9K0/hf8AC20tfDhu/EcK3Gp3jF5HbJI3cn+ddhbSrq00NhFGZYdNiU5X+M4+7+laD65ZWtzHptwrQXU2Ci/3c9v1oA2rTRbQWtvbG3j8q32iPIzwKty6ePtkcsZ2hRgqoABq1aRmO3RWbcQOtTdO9IQAUtRvIkY+d1UerHFOUg4III9qAHUhGaWigCG4t0nhaKX5kYEMCPvCvij9oz4Zy+GtYl1XT4G/s2YksQPumvt2sTxZoVp4j0O60++jWRJFK8joaAPzO6HjkkcGuo0aDSX8KXc0908eqI37pAcZ5FaXxb8BT+BvEbWj7mt3JaNscY9K4yyn+z3MU+F/dsG2nvikAk73KysJy4dh82/kkVE5XOFyVx+VanibWDreqPeNCsOVxtXpWSvHDcccUAPhZ4v3ke9cfxKcYr1bwX8afEHh9rCGFvPt4QQYmOd3TrXloun+yeQF4z1qKAlZAEJ3H060Aej/ABk+JN948voTd2620cS8IPwrzQnJqe7Eqv8AvtxP+1VegBe1bvg3w/c+IddtrC0iaRpGwcDpWLbo0kqpGMs3AFfZn7PHgGPwz4dGp3Ucct7dYKHqVoA9F8MaJa+HfD1rptnGERVUtxgk45rRPXpipGyX5602TrVWGMpQOaSgH5qLAEny06EbgaJRxS23WgBrAjpTnBEYNPuFI6U0gmKgAi+bB9aQjEhFLCdpAp0wxIPegBsJKOR/CauxEDpVUDPy1JE2Dj0oAuH1oFNBzThQAUoUUhpN2KABom6ioHVhwwyKtrLxzTtyuMHrQBQESH7o2n2ps1u8bmUcoauPbHqtWFh8y32MeKAI7BcQ7l6GpZpFhgZu9PhjEMYUHgVk6lcB5do+7QBTeTeWkY7VJ7/zrmde1S/1Hdp/hoeZNkB7hf8Aln9K1tVsX1BDCJikR+8o649a0NDsrbSrErblY7aMZMh6n1JoA5vw/wDDeysJPtWpsb3UpPmmll5B/wAK5f4q+OPC3gcYht4brVUHyJuOE9OM1hfGb462+kifSvDDCa5YFHugeF7Gvk7U9QutSvZLm8meWaRixdjmkDPQ7X40eJofFo1j7Uxj382/AXb6V9UfDP4q6H44t4181LfVB1hY4yfavgjq3zZ98Vd0/UbrT7uK5s7h45ozlGQ4IoEfpwBvUBj83pUBRskjhR2PWvm74P8A7QKTGDSvFOFbhVuCf519JWs8F9aLcWsqzRuMoymgYsR7U/aQcdqjT5XqZmzTsAIakFRL1qQUAPHWn5pgpwoAdQKKKQhc0ZpKKAFzTTnt1paq3V3BbI5mmWMKMkk9qALG4YPdh2FG7gEjA9DXk/jD44+FNBtZjDcre3ETbTDH94n9K8J8ZftH65qUjf2HF9ityMEN1/rTGfW+s+JNL0a0luNQu4oY4hltzc1474y/aN0HTIgdDVNQcnB54B9+a+aWh8R+OXM9lHeXMp5lO8Y/U1zmvaL/AGQoW4uEa5zhou60Ad94x+OXirXJ5Rb3b2lq/Hlx9MV5fd6hd3cjvcXEshc5O5iarnJHJoI+XpigBN3GDTyMsMDdkZxTrSMSXESMcKzAE+gzXdappOk6BczpdwNc29wv+jToRgUAcCwBAI4+tIAAev41au4kjkAicMP7p6ipo7OBtKNw10gl3YEXrSEZpPNGaeU79KZ0NAFiBnU/u2O4nGB3r2T4C+HND17V5LHUreU6ig+Xj5QD615r4ItHufFemx+VuUyjcMdvevrX4M6ZZj4n+K5rKMR28JxGq9OooQz0/wAP+HbLwf4TksbABIoY2YY/vbcV8ieHrW/vfirdvfE28k8x8uaTvyeBX1d8Ybuay+H+qG0YpdNGFi2dScjpXiPgzRbrUPDOkf2xGr6vbz/anD/fCcY/kaYG58b79YNN8OeGSXvL43EckqdcKGUnP5Gutvrt/D+i3+pNABauiQWkS9QzZXP6itfSPDema94j/wCEpZC8y5iUSDPHr+tSXmmjxF4mji8to9PsGyYz9127H8xRcCb4XaRdaN4UD6iwkurhnmZh1AbkCtzR4bPUDJcSWbCaNiA0g5OD2rZjjjCBEAUDsvtWfruvaboNk9zqd1FCqgnlhk0riNLeNgPAQcHPavMPib8Y9D8HRvCky3N8AdsaHofevIPib+0I93fiy8OgrYq48yXPJA6gV4H4z1aLWtZe6hXAfqe+aAPQvEPxm1zxVqVtFqUj21ikm4R2xwzDPfNfV3ws8b6N4n0WCPT7r9/CgRo5D81fnxZySwzq9uCZFrY8K+KNS8M6wl/p9w8MqPuZEOA3saAP0tz83B5xSr05HNYHgXVJtZ8K6df3IxNNEGat8HIzQAtJ2yRzS0d6AOE+KvgCw8c6DLbTqq3aAtDJjlWr4N8aeFdQ8J67NpmoQsGjJ2kjhh61+lZHr1rz/wCK3w30vx3pbpcRKt4g/dyqPmzSA/PTrz0wOamtLZ7mVI0UBm4FdP4/8C6t4M1iW1v7dzChykoX5WFZsmrxzWMUcNvHDNHg+YBzQAyB4LC7livYw5VCBjs2KpXiRCNJIm/eE5IqrLK0krMx3MTkk96Z1JPfNAD5JWlYFjyBTevAGTT5IwIUcHO7P6VNa2jTpIysAIxkjoSKAK6M0ThlJVh0xXpHgH4v+I/CjCOOc3NqOschrlpdOsJfs0FhP/pMg+Yt0BqbQvB2o63rzaXpyia5VdzHqO3+NAH1l4D+NXh3xLtt7pxp92QMvIeCa9MjaO4iEtpMs0J/jByDX5z6la3GnXsltcgpLExHXkYrtPBfxW8SeGJ4vIvHntwMeS5+UU7jPuHlmwFBx3NPj+YmvH/BPx30PWzHDr4+yXjcD0zXrmmXVnexCWxuoZ1btGc4pgPIwadEcNSzqyP84IPYetNTlvb1oAsyAsOKjjzyKliOQRTI1bzDQBXYYbNTsfMi91qOTh8GlDbSPTvQA9WwBmnr1zTZF3YZegpufegC7GeKkFVYW55NWgeKAA0HpR1ooAYRSDIORTz14ppOOP1oAmjkPSrKkkBV6VUi45PSrLzR21t5s7LEoGWLHpQBX1O7EKbFyWPHFYbk5BcNk15f8R/jlpHh/UpbWwVL2dPvMDlRXno/aZvQ3y6VCwHTI/8Ar0AfSF9dW2m2Ml7f3CwQKPmdzg/Svl/4z/G2fVhJo3hwmKxU4aUH79cN8TfixrPji5C3Dtb2QGBBGcDNecF9wwfwouFySaRpJGaRi7sck1ETmig47UhBSCigUASRsUJIyDjgivov9mDxN4pu9bj06KVptKVgZQ3YV89WFtLeXMdvbqzSyMFVR3Nfd/wN8ExeDfB9s00Sf2jcrukIHr/kUxnpsikY2dO9KE4yKZDJnjtUgYA4A4oAPvDPpQvalYbTkcigcngfhQA9eop9RqeeOcdafuAHPFAB3OTn2oYgDOcD0rNv9d0ywgmluLyBBEMvlhxXjfjz4+6Zp+ms3h9kuLhXKlT7d6APdXlSMZkcKAMkk4ri/FPxL8N+HbSWW41KKSSPOYkPJr468Y/GnxR4imZo7yS0jIwY4jivNb27nupmkuJnlkblmJoA+nfF37TTMwTw7Zlf9qQ9f1rze/8AiHrfibU7a+tZL178Z86FCPL25/wryTcTgt82PWvRfAnimHTNOuLb7Jbw71w90ow4B9KAMq9t4fEXiQqrx2LYJkLZxuqh4mOnWsqWmmjeqD984/iNSa9Hpk7/APEsllmuHfLO/U5/CpE8MT3AVhLDEqrl2z1oAyrPXdRsoxHaXUluMdVPWs64nkuZmkuJGkc9WPermp29pF5f2aRmJ4Yt0FUduBxkZpCOi8I6HBrV15N1dJb7+jv0FXIPCEVxql9p6alb77dSyOc4f2rkwxOACQoPWuh0DTZ9QuVlso0zbJ5rBzjfzTGZ0cL28u9F3yqMtH2AqrcXdxcKqTSM6J91G/hrZ1SaTVNRa506JluJM+ZCg4FafgzRtMu7HUdQ1u48trVcrGernOKAORiEeHMu5mx8oFLa2U95MI7WIyOf4VHSrt5qUTXplgt0SIEhcDrV3RvFMmkpcfZbeNZZRjzAORSEafjHR7HStH0xLeF0u5Y8z78feAGa4hvfrWhqmr3+qlBfXEkxX7u49KomNgcFSCaAPavhloa6f4v1m6vgvkRQFopF5XdX0H+zlpjR+FDrNx81zfncW9R/kV4dolvNpPwmt47mQpe6xdgxf3vLIA/LINfVvhDSovDvhSzsoioSCLsOBxQhnAfFLxLInjzQNFitzOrOzyA9MbT/AIVu+FdIh1LXtS1mWLZKw+zKg6BQT/jXn2u3E0viC91eIi6unIS0CjJDZ5/QmvY/CdtNBpNmJU8uWRBJKMdWPUUwNixtorWyW3hARVGPlHepIoFhjIIBz1IqXcFXJwq9TmvJvij8ZNI8KJJZ2ji71HBGxDnYexJqRHceLvEFl4X0O7u7maMFELKm4ZPFfAfj7xvqvizVrmS/vJZbfzG8pSeAueB+VO8beOte8W6hLcajdSeWxOI1J2ge9clxkd/XtQAgGVIAB96nsGSO5ikljEqIwLRn+IVDgFhgYBPBNaVlY28+mXVxNchJouEX+91oA3NTubLVNcjl0+2/su2kQAJGMkkAA9PeufgthPqohUkgvty3U03StSl029S6jAZkGOelWtIne68S200oG+SYHigD9FPh9CLbwbpcQH3YRXQj0rI8JDHhyw/64itimAUUUUAIaZxknkGnsARzUM0yRK7uwVEGSSeBQBheM9D0jW9GuIdbhikt9hJZx049a/Pnx/p+nab4jvYdIlEtoJCEI6Lz0r3v9oP4vvcSyaBoMp+zK+26ljP3ueQDXiXi/VtAuNDsrLR7ForhPmlmYglyce3tQM4rpTgTgjpmkoznikI67wJ4esdba5k1W9FpaW67ix7/AE/Kud1BUjvZ0tZjNEGKo/quarieQRGMOQhOSvY0wMQSQevFAGtDDJqt7a2tgmJ3KooHc+tdt4Ik1zRdbk0rS5o7HVNp3zsevtnNef6VqFxpt3HcWr7ZU+6fSnXeqXd1fNdySsLg/wASnmgC/wCJrHUIr6S41BkklkY5YEHJz1rE6ArjPPWnTXE02BNIz49TUWSBgHigB4HocEV1XhPxzr3hOcPpN9LCpOWXdkH8q5HJoycYoA+q/BP7R1tdFLfxPAYz0NwP5969q8P+I9F8Q26yaXewOjDPzMM1+dYJz1rT0fXNQ0i4SXT7qSFlOQAeKdwP0gSMoucZUcA0i4L5zivkjwT+0TremskWvKLy3XjjrivcPCvxf8K+IoUc3K2M7EfLKe9MZ6JfR4O4VXU7lxWhDJb31sr28scgIzuVgf0qgF8pyrIx569AaAFiba2w/dpzrg8dKSSMq6nIwewpwbgg0ACEg1NHLUAODg0p9qALqyVIrZNZolK8VMk+SBQBcIViQ3CgZOK8r8efGvw74Xjnt4Cbi9jOPKHc16hHMjbyOcjBFfM3x/8Ag9JLMdc8NQmV3y08a9c/T8qAFj/aify2LaOF9BkV5l44+NnibxMbqFblrexl6QqTwK80ubSe0maK6hkjdT8wZSCKr8YyAaBDnYsSepPJJpnseKc3QD2ptACGkFLRSAKKKKACkpRjPPSt/wAM6PbaxetBcXcdqgjZlZhnJHQUAel/sv8Ah/TNY8arNqUi+ZbkGOI/xHivtBwVkRWPX5Rj+EV8LfBSK8034pWMdnl2V8EjuMivu18Oqlf9YQN4/CmMjUkNxV2Ihhg9aoJlTz83v0qxG2zO7hRyzHjA+tAFxRgYqnqF3bWMJlup4YQgyS7AH8K8x+I/xr0Lwkr29vJ9tvQCAsZ+6fevlTxt8QfE/ja8eW6nlW2U/KiZG0UAfUfi/wCPXhjRo7iOylN7dx/wjpn8q8N8Y/tFeItWwmjk6dGMhtp6j8DXluneE9W1gzSWFvJMqLukZxt/nUZ0qGwLm+nTzI+GhA5zQBYudc8QapaXk893LLbzOPOJb3rEmtlgZcyjY3pWidUhUva2iGKzmADqe5rL1CJIJ9kUm8Y60AII3AEilkiztD4rV8UWOl2SWR0u8Ny8kQabg/K2Bx/Or3hFxfTQ2t+qvp9uwlaPozDqR+lJren2t9LfX9lGtlaI5EUBxnGTQByddD4Vl0+3nkl1S0N2igEL2/GsGLb5g3/dq2Ls26zQxYMcg6UAXdd1KK81T7Rp1stkiDARB/hUE3nGESPIxmkPHzdqXSpbe0VZpl80ngx1HIYpJftLOoXdxEBzQBee3h0+SwlvNtxAeZIl+tTeLmsp7tLjRYDBbSKAIwO9YN1Ksk2YQyrngE9K0YdVkX7KI4gTA2cYzmgBdKvbSyt7mO9sfNmdMIx7Gqf9oTqQUfaQNox2Fb3i3WtK1ZLZ7Cwa0nUYk5HzH16VR1e209bG2ls5gZdvzrjnNAEnhe61Ox1L7TphZblwRvJwMEVnak08c8kNw+WydwB4NKNWuV8tUITYMZAqSXSb97L+0JYma3fneTQBlnGB60lDHIBz+FJQA4MVYMOoqR5HnkBOMgUwAEc4A9TS7eM4/WkI+tNO0u2134o6Hoezz7PQbcRScYUOCT+P3hX0NcT25jktd65KkFR2GK86+BeglNKu/Ed2qPc6zKbkE9UXAGP/AB2vR5LOKOcyRQpk8s5I4pAcJ4G0aJNXvpY7cfZ4yfIZh0b1rq59XGh2M9zr93DFGhJBJA4/OuS+I3xO0HwBYlC8c14cgQxEE598V8e/Ej4ma343v5Xurho7Vj8sCnCgU7ger/GX4+z3bS6b4RZoYTlZJupP06V8/JqNxcXm+4kLvMw3yvycE85NbXhLw5a+ILZ7eC6WHUlBcea4RCAM4547VV12do7RbBrKFWhbY8sajDke460WGWmsrZ9UNhp1xEEkTLySdM47V1/gj4U22p6VeXmuatb2QXetursBvYZwevQ8V5M6vDKN2VYYxj0rWa91DV5IYXlkkiQBVG7Cr9aQjT8ZaXp1kVh0vM8kI2TSrypPt+tcmTtwRggda3NWuZ7KMWIMQA5YxkEH8qxpYmK+Ysb7e5IOKAI84BB6HnitXwvz4gs9oP8ArBx1rKHdV6GvSvgP4OvPE/jWylgXNtaSrJNnuBQB92+Ff+ResOMfuR1rXqC2i8i3jjUAKigVMDnNAC0mRkD1pahnlWCFpZWCogyx9qYDpWAQknGOSfSvl79or4wTW91N4f8ADsuw8rNIver3xl+PVtZQ3Wj+HCzTElHmI6V8p3E1zqNy9xcSO88hyzE5LUAa82sxR6KbRIYnnlOZJXXLfnXO9iMj8qkngeAASxspPTNRjjGPp0pXAQKSOhq3pdlPf3Hk2tvJNJjO1FJNdd8PPDGsatqax2ulyTRTjy/MliO0A8ZBI96+svhX8HbDwXcpdyBZ7maP5y4yEOOn60AfDN1BJbTvHPE0bqcFWGCKiCkmvsj44fBSDxDDJq3h+JYbtAxaIDHmH1r5F1LTLzTb2a0vIHSaMkMpBFAFHgLyOexpUUs3ynPvSSYyNvT0pFYr0oAD1oNFFK5VhMUUtFAWEFKPeiigLC5z259qcjsjhlOCDke1IGwMYpCc07hY7Xwp8TPE3hq6WWy1KZkX/lnIxZfyzXsvhT9pEyDb4nti54wYxgD+dfMlH40XA++PDHxR8Ka/DuhvEtZOwlOP8K7KKWC9jWaynimTHJVxzX5sxPIhzG5X8a6XSPHfiPSQq2OqXKqv8IY4/nTuSfoJIhGDikHTmvkrw3+0VrmniKK/gS4UcMzDmvXvDfx28LayYorkyW9y3XdkLn8qLjPVWxkY5J9Kikypwcg0uj6npep7Xs7+2lJGQEcZ/nS3qEzHO4ge+aExEYkYHKHaf50+3uHj8wDG5h1PI+mKgA9jT+1Nhqch41+HHh7xba3PnWccF6ykiSMBdzV8Y+OPC194S1yawvo2UAnaSOCK++xgH5c59q4H42+D7HxT4Vd53t4tQhGYZHIBb8/xoSbC6W58O4PeitfU9CvrN33Rs6KcF15BNZGOeeDRqJO4lFBooGFFFFIAHWpoJPJlSRCA688jIzUNABIPoKAPQfhX4pbR/iHp+qT8AMFYduo/wr74hczRRXEQ/wCPhVY+2RX5paYk7XEf2aKSSQHKqikkmvqyz+MWrN4Xs9H8P6VdXOuxxhZmkiban5j6U0NHtPizxTo3hmz+06xdRoVGRErDJ/CvnDxv8X/Evja4l0vwXbzRWTfKXRDux659KQ/DzUtWvBqnxQ1pbe2IL+SJRuxnpjNaP/CxfC/hezj/AOED08zSW58qUsvMi+/HSgDmdN+EbWcUd/4wuSPtY3Rz7uAf9r8qh1nUvCvhsTWV4iX11EP3MtphVY/7XXNVdf8AipqetHUDNbI2hSnAgk42Hj7ua8xuNOa+vZW0eCeeEDd8gJ2j3oA3fEPxJ1jVESK1MenRRjaBZr5e4f7WOtYugXGmS387+IhcXG9CQytzuwcdjWGyPHIVIKsvDA9q6fwXqtjpWsRm/s47yFz5Z3gHGe4z9aAOYmw0jbAwUHADHkCmDAHTPvXf+LNI0H+1J5dNnZbdSS6MeQfQVk3fhW7Xw+NWtnimtM4KxkFgP9oCgDm4biSE74pGV/VTgippLszQN50rtI3XJqlRSELkEDtilAyBgEk02p4mWOQM6k/7rUANMbRONwIPUVZWxkaxa6GCoPatGKxnuIkvY9suXEYhA3Mc+34V1Hhn4deKfFFwbeysJraI/wB9Sin88UxnnR6g8j3ra8KXgsdVhlmtGuo93zIFzkV9DeD/ANmSWWPf4luvLYdUjbP6g17T4W+E3hTQLSNItPinkT/lpKoJ/UUAfJEvw8vfFetRt4a0e8tLaXlnnB259uBW7qn7PfiXRrZL6cpdxKdzxRj5sfma+1oLeK3jWOFFSJeiouMVKx6g/wAqAPzyu/Bd3cahMz27aXBGNwacY3Y9uK5/UdY1C6s0sDKBbRnAVeAa/QPx7pWhTaFeXWs2tu6xxMQZABzjjrX5+6tLYzag7xI0TmU7kT7oHtQBmSaddLZpctCRCxwGx1qljjNd/wCJptCHhW1g03ULiS5HLwuDtXp0rg8DcMcDFAEzQbLcS7lOeMZ5rr9EPhW28L3J1ZJpdVcfudp+UfpWTb+GLmfQ31VJoDGnVCwz+Wa58n5e9AH6YWQ03w1oUVuZo4Le1j/iYV89/Fz9oKJbabTvCxDMx2+ce1eCeIfHXiPXN8GoajcYzkKhIzXMx2U8lxFGUzJIdqj1NSIl1rVr3VdQe81CYzTuckk5qLSo4Jr2NLqTy4SwyfQVP4g0O90G+FpqUYjn27sA54rO5zyuTQB0mvnS7JpItGuZJXU8SYK8VT01tR1fbY2y+aw+YYXOMe9ZLEs2G4I44Fe3/A74Ta9rhXWElNlbjBXcv+sHeqGU/hj4S03xDbX2manbXA1mT5YpDGdi4z36Vq6z8EptDiv7gaxB/Z8FuWZlcbmkCn5QM5PNfTuq6La6H4OuBaRQQ3Yt2UzCMbixXrnrXzv8N/Efhe0lvbDxhc3c1zDK8yvLK21uScbScGkwPAJ9Nvof9IltLnyQf9Y0RAI7Vvav4strzQItOg02OF1GGmGMn9K+g/izq2heMvCZtvCN9ZxeUgklhEKqSAPWvlGRCkjI/wDCxB/OkIZwDgZIr7A/Y+0uKPw9dX+D5rNtz7f5FfKSaXJNZSXFuwdUGWx2FfZv7KCqnw4yqgEy/MfzoA9sI6+9L+FIWA6kVj6zr9rpRiNw8Yhf+MtigDYZse3vXm/xT+J+heENJnS7lW5unUqsCHO76+lO+Jk+van4dFx4Ku4tzITnIORz0r5EsPBuq+JY9QvdXu3SWGQgmaQsc8cDP1qgOS8W6vBreuy39taLbLIcmIHNRaVcQ2WqiS9gcxDOARjB7V2kfhDT9B099Q1C+VtQU/uLMoDvHr1+vbtWk+i+H4vCv9r6vJJeavfj93ZwjaIifp/hUsDzHXL2S9vGkkKkdV2jGKueEdFbXdatbSOOVt8i+YY1LYGfbpXb+B/hjqGo+JLCPXLOa1066OQSpzj3r658BfDHQ/Bss0mnQozS4G6RQx4+tAHlvxT8U3fws8L6Rp2g2sYzEP3zL8w4Feq/B3XbvxF4Gs9Q1Bt9w/3jXh37Yl6v2vT7RQMYycHBHSvVv2cH3fDe1BP3eKAPT34fg8AV5F8Y/hNZ+KrC4vtKiWHVlUnA431662NpJ9qiAO7cufrQB+aWvaJf6JqUtnqVu8MqMQdwwKzCAM4596/QP4m/DzRvGmlzJcQJFe4xHMBgk+9fFfj3wLrHhC/kt9StnEK58uRV+Uj3NAHH0UUUigooooAKADRQDQAucUlGaKACijNJQDFoyQeCR9KKXFMkQE9+frSq5U5U4PqKQijFAGxo3iXV9InEmn308T+zmvR/Cvx08S6TODqEn21B/Cw615Dg9xxRnB6k0AfXHhj9oLRdSAXV4WtH7kDP9K9H0Pxr4b1rAsdRiDt0ErBM/ma+EtDtIr/UIrS4cRrIcB/SvW18IaP4NtPt2oao97K0e+GKKTGPyNaQVyZTsfR3jzxrpfgrSpbq7lSW4K5jjQhs/lXyf41+Iut+KLt7ieUxWhPyxo20isHxXr1zrVyHuJpNoGI0ZiwA9650sWOGJ9hniuqFNGT97U7Pwx4ne2kW11RFmsJTtbIyy++ah+IfhhNLmS/00iXTbj5kdece1czDvVSBgsfU5FdZ4Z8QLFZHStYXzdOl4BPJQ+36VNWFtgg7HAsOelNNdb4q8LNpoF3p7/aLF+VdeQB7muTbkmuU2uJSGloxSYxBkkVd0u1W8v4IJHEcbuFZz0A9aqBeRmpVyH4PzA9BQB6nqdjL4X8hNFt0lLplbwsNv59vzrr/AAt8RksPBd/dWrRRa8v+sd1GGx6fpXmdzPNZaBB514ZrWXn7MXwyn+lZLX9idBa3MZNxyQVPQe/rTGbvie613xLoLa9qN9cXBL7doyFA57VylpfvZweZaOUnK7XAHUV0UGua1D4Ga1SCIacX+9tGehrjYJRHITjdu9qAN7SLKXWY0tWuQkuMpG/yqa0bfxHceGrRbTS0SG6yY7hshg9cs00qiIxSfOnRhwR+NVWZmJdyzE85zmgDpdOitvEmsobl1s4Qu64kz1qhrcNrp+tTDS5WntUkJidl6j196yUdl+4SAeDz1rrNXjsbvwxZXkd0sdzGgiaBVHJHf9aAI100S3ttdatcrDaXfzbkO4+vTtUms69DZwS2GhMy2p+WQnjf74rmkW4nCovmyhfuDlhXX+Hfhj4p8QLHJZ6bIIWIy7KR1/CgDhsDHXn6VLBbTTtiGN5D6IMmvpvwn+zPJugn1y8wuQWjX/8AXXtvhf4UeFfDs4ktLBXlwMtINwP50AfFHhT4Y+J/Ey5sNNlVM43ygoP1r2vwp+zK8kMU+uX4hkBBMSjOf1r6kgt4baPZbQxxr/dRQo/SpjjGSBn86AOB8N/CbwpoQgeCwV54wPnfByfyru4beCBQIYkQAY+UYqQZOM4PvS7aAEwMd6XAPUCjpS96ADaKa4PG3gZ5p9RyuEUsSAFGTn0pAeD/ALWHiiPTPCP9lBiLi7Hykduf/rV8dQWN1NaPcRr+7U5LZ5r1j9o/xWuveMLu0J3rauVjI5FeWRHy9NYrdEFv+WYNMBulX1va+ebm2WfeoC57GqUhEkrMqhQx4GelMPBAP6VsaD4fvdbWQ2KBjHyRmkIzo7m4ijaFZH2Hqobirb2VummLNI0yzN90MhCt681p3Phi/wBE1PTf7ahEUM8iscHOUyCf0roviRr2l3d01hpiRnT4YkEJVAGDY+bJ/KmMxvBuu6bYXs8+t2vno0RWMAZ+aucmuHM4dCy4OVIP3eagAAZlJH59KVF3gnI5PQmpET397cX9w0t9PJNKP4nJJotILnUL2KG2hMkzEAIg5JplvaS3F0sFsrSSsdqqBya+wv2e/hBFoFjFrevQBtQmAZI2GdgoA434SfACe8uINU8VqYoz84gHr719UaVYW2mWMdnZxrFBGMKq1YUDadnHtilA25J4GOfaqGZPiyMyeHb4bQxETYz9DX5+eKdTfVfE9zLJFBA9uxiCAABgpxnp7V+iGpoJdMuVIJUxn8eK/NfxgBH4s1dQCMXUo6/7RpMC3Dq9/baRcx20aRwvIN0ijDd+M+hqO30yC90a71Ka8SGeJlAhOMtkH/CsUXMzQ+Vu/d53Y+lT2QdHW4MbyRRuCwxwaQghN0gEcXmgTHBVQfm/Cvsn4Bana+D/AIewQ+JpVsJ3bcEnO0lcnnBryr4a3em+OPGFncXun29lpOmIN+3gMRjljgY717V4WsfDvi6zkvNQf7XFFceTCTwAOeOvPSqGcz41+Mtz4ijvNE8CWNxdXbZTz0Q4H0Irxz4k6R470uw0tNbuJ5GuIyVijlYkcnqPWvrZvBVlpQa68MW0NteEccAA1rx6NHf6fA2tW8M97EPvEA4NJgfIXg3UfH9tFokk5uLbR7HJEzA7QvP3/Xr3qHVNTk1jxN/adrdJI/m/8g+2x+8bH90f4V9ZeIPBtvr+hJpdy/2azP3khGNw/DFYngT4QeH/AAhdtPawm4k3bleUcqf1pCPnq48L+KtV8SWuqXeguLSTCiIodyL9McV9AaZ4Zltb3QY7fR7F9N8vNx5sCl1bB7kZ64r0maS3t0LStGigdTjisa78XeHrVGM+rWiY6jzBmgDUNjZhYg0MZEfCfKOKskHJBPHbA6V5Rr/x08HaI5i+1tOVOMxAN/WvNvF37TaR7v8AhHbMSdgZfl/xoA479re6Fx48iiQkhIh+eK9a+APifSdE+HUP9qX8Nvjs7DP618leNvFd/wCLtal1LUMCRzwq9qyBe3HkGLzpREf4d5xQB9q+Lv2gvDGjXHlWe69YD7ydP0ry/wAS/tMarNMP7EtY409XA/wr51WTEgbG44xzSjBbDHCk8+ooA990D9ojxJda1aQ6q1qti0g8xljXgfXFek/E34r+BLvTRa38S6j5kQyUAJU49q8T0rxD4F0jwn9kjtJbrUph87yR42H2Oa8y1G3MpkureJ/sxY4bqB7UALr8ljJqk0mlKy2rHKq3as0+/WkLEjFGc4HpSAKQ0tG3IyO3WhAJRS7fQ0EY7imAlFLtpMUWAKKXac0oHWiw0IKccgjIrQ0rR7rU5QtrGWX+Jz90fjXVQ6RpWlYFxI095j/VgZX86qMWyZTUThwOxyPwp8VrPM37uNm/Cu3dg7/JZQr6Ac/0qeG2yN0qpCP9mtVRujnlidbI46PRL+UgLbuM9+a6Cw8GNtWW7uEWMcsvfFa76rb2EPlxt5rD1rBv9cmmJwNgPoapUNQ9s2bW7SNGINnGJph3fnFc7rOrzX0hJckdMHt7Cs2S4MjEuxJ9aid88A1tyKIt2NmYkjPWmhgetNYndnrQy5PpSbubqKSJllwQB0q5DKjkK3Ss0naKRX2+9XGRnKFztdB1WbTS0JKTWEgxJFJzx7Zp2u+GLC7tWv8AQpCFP/LBjlveuRS5woBJ4q5b6k0R3JIwc9SD/SplTTM4qcNyudD1BULG0lCr32mqEyusmGG1h2IxXUDVJwyNHcMcclD0NbEV1pOvxfZ9VhWzueAkkfIP+90xXPKjy6o2jVUtDzxfv9frV23nhigG4BpQ2V/+vXW6f8OtQu9eFtHh7ILvNwvK49M+tV5fCsep+IptL8PN5rQoSxk43MMcDrWTujS9zmZ72W4n8x+TwNoHGKm0zT7u8trqS1g3rF80h9BVvTdP1Gz1lrWKwa4ulBXyNuSee1XXstZ8POW1O1uLC2uj8wZMFh6VO4znTd3PkG2EsnkA/c3HFVx8p5U57VZMLXV4yWaPIWPyhRya77Sfg54t1OW2WLT3VZhuDyZGB+VCA86jYxuDgEUsUTzSBUVizHgKM5r6o8D/ALNqnTJl8USiOVjlTEd2On0r2Lwv8JvC2gWsUcVhHPInSSRck1Qz4x8MfC7xLrs8Yg02VIn6SsCAB+Ve36B+zTE72z6tdHy9uXVD3/OvpiC2ht41SGKNFHACqBUuKAPPvCPwm8L+G49ltZpOw5BmUN/PNdxaWsFqnl2sSRL/AHVAAqztBGDRj04pAG0UhXHSnfjRz25pgRkkUZqQr61HtOeM/jQAoNPBqMcHn9Kx73xRoljI6XWp2kbr1UyDP5UAbZPXn8qQdOvHvXz/AOOv2jNI07zrfw8hubxG2guMIfx5rnLH4i+JfEjRvq9/p+nWD/fMU+XA9hgUAfUe4EfKc/hmuV+JetwaD4N1K7uZfLzEVRunNYXgDXPD1lbeSviRb2eQ8CVwDn25Neaftc+KreLRLbQUkzLKPN+U9RyOfyoA+UdVu5L7UJ7mZy7uxO7NU+O1Kx4AptAGjpGl3GotMLcAmJNxz6VtW9/ptj4d2WxvIdYLfMyMyrjj0P1rnbG+uLKQvbSFCwwfcVc1rWDqYt/9HjhMUYQlP4yO5pCJoPEF8JkkuJ2uSiso887gMjHGayZXMru7D5mOeOgqLNSRNtcFunegDorfTpL6P7L9l8meEcnuaqR6FezXkNvbwtLcSttVFHSut0vTfEfxI8YNeaZasHlcFnRcKo/Cvrf4a/C7T/CwS8vFW51Rl+aVhkZ9qLDOL+BPwVh0GNNX8SRCXUG5SJhwle/oAqAdB0AApoYDoMMeorlvHnjnR/BmnNPqNwgkCkrBnkmiwjp7idIInkuHEcajJkPSvIfGXx48P6JctaWGb66XIKrzz+dfO/xK+N+u+LJJYLSQ2enNwIlODXn/AIXuLu01aDUElVBHIu6SQBsZPvTGfcvw18aan4x0y8uL7TJLKHyzsLA88Gvhnx4u3xlrI/6epf8A0I1+hXg66hvPCNtPHIkoe3Bd0UAH5favhL4t3eky+K9RXTIDG4uHDse53HNJiOFA4Gc9O1XoJmWxlTzdoLD5cdaqsy+UFx83rUVIDr9JvtV0zwterZERW1yQJOzOMHpX1Z+yzFHdfDmNZkDLHLvDe+T1r4qWaTyjGJG2nnBPFfXP7P8Aq8mj/BbV7yNfLltlZ1U9zzzTuB6H8UPizo3geEwvIk19t+SIHmvKdD/adEmqxx6np6xWp4ZwTkfhXzT4k1a51jV7q8u5XeV5Scsc4rKbr15ouB9oeI/2kdAtoWOjxm5cD7snyj9DXlnib9pLXdSt2isLWO0J/iVif6V4EAcgdzxVi8tJrRws64zSA63Uvih4s1GJo7nVpmRj90YGK5SfULuaQtLdTuT1zIaqn9KSgBzMXbLsT+OaCSw6jFIR0xQAR3FACdKXORTlIBO7qRxXunwV+CyeMrKPU9SuCtqpIMQHWgDw6CGW4YLEhY+g613fgL4Ya94vv0jgs5IrcH5pGBFfY/hv4U+FPD7JJa2CPIndxnmu0hit7Zdtpbxx/wC4oH8qAPCfCX7OWi6ZdR3OrXL3OB80eOM1hftMWejeFvCVtpGlWcEBmcPkD5sDI/rX0sgBIB4ZjjFfGX7VPiGPVvGSWUbc2KmM/jg0AeGHrQKU0qcsATgHrSKsJTgc49Bx9a6HwJoj+IPFFhYiIukkgDAelfa1t8EPBpSBmsPnQA555P50CPk/wB8Kdc8WYlhtykLj5GYYFX9W+BXjSwWWQWPmwp/EuTn9K+59L0y00yzitrGFIYohgYGKukqVIKgr3z0pkt2PzQvfCmtWUpjuNPuFceiVW/sTUTx9iuM/7lfoT4p8SeGPD6PJqr2YbH3Sik14f4t+OOmI72+gaPbnOQJTEtaKLZDqpHzPDoeozTCL7K8bf7QrotO8MRWh8zU5V3LyEHf61seIvGmpavKWu/JRv+mahf5CuZm1GVzy2fxrWNLUylWb0SOmudQhhtvJskEEZ4JA4/Ost5YkG9SPM9W71iteEfeOarT3pbpW6iomLUpG09+M7ohz3qlcXjyn7547ZrJa5OMComkZvWq5kXCjpqXbi55461XeXcOSM+lQbvWkpcxsoJD3OO1ITwKbmlzxUD5QpM009aU9aCtRevWjAo7UUgFyPSgn0FIOKd2zVK4N9xwZlYYOKmE5OA+cDrt6moF5pash8vQ7Dwj4xvdFk+zyy7rKU7WUnJUHvmrWq6Ymh6idQgvJIo7hGlgnB6secfma4Rhmu38La9Y3Glvo2vpuifiOY/wVhVplxZk6X4v1DTtSm1GFw183CyFQcf5xXrfwnJ+JfiO0Piu8M8lq2fIEagEfhXnfizwr/ZmipdWsZe2XJScdDXrP7Ll6DqTRXFqEeVcCUD6VytWLWp7no3w18J6Te+fb6bG85Oc4yBXaoYUC+SqBU44AGPaq2TvOKdGMKfrQhtFoOoOF4Dc8mn+aB06VWGaeoNMCYS5p2+ogDTgKAJA4o30woeCuAe9HG1iCSPWgCTNA5rn/ABF4p0fw3am51a+igi6Hc3FeHeNv2ibfzLqy8MWjXIVS32heRjuaAPoi7vrazGbiZU+teZeNPjZ4Z8PR3EfnmS/iHyxcfN+tfIuv/EvXPEOpxXWr3crxJwsaNtxjp0xXM+JNZk1rUjdzjqgQfQDFAHsHj346+JdctRNpgFhZg4yvU/pXl+o3Gs6pZNq91cSGNHCF955J5/pXNh5HTYGO1ecZr1n4bfDu11XSTqXiTVBYaaGz5bN9/wDCgDy2C1uLvLQxSSlTzgZrpfDngzxLr83k2FrcMB1BLcCvqDwrpOhabpdzD4d0dWgfH+muu4Nx1Gc11Xhs3kME6eVH5m3gJGBkfgKAOS+FnwSs/DkUeq+ILp5LyMbwm84U+9fPHx08Qy674+vssrRWz+VHg54r61+J2tnw/wDD2+vNSfy72eIpEM45r4KvZnuLqSWRtzuxJNAERHJzyaSirmm2FxqNykFsu+UjhaQinRVnULWSzuXgmXbKpwy+hqtQAneremSrDewyPGJVVgdh/i9qrAHtXZ/CXww3inxrZWO0mINudh2xQB98eFfC2meFrFLPSbZI1QYL45NbTMIlZpSFQDJJ6CszxHr+meH7CS81O4SBEXO1jya+S/i98eNQ18z6f4fZraxBIMinlhTGeq/Fz462Hh2Oew0J1ub0Ar5inhT/AI18jeJfE2qeJL57rVbqSWRjkAngVkzyyTSF5WZnbklj1poyGBIBz2oACpJPdv517X8BvhLc+LbxdQ1MNHpURVtrdJDnpVH4HfCi78Z6xHdX8bw6XEQxYj72O1fbuiaVaaNp0NjYRLFBGuAAP1oAILG30vRWtLOMRwRQlVA+lfm/43YnxhrOef8AS5f/AEM1+keqOIdKu3ZuBG3P4GvzY8YMH8U6qw6G6kP/AI8aTEZA5GKTFA6GnICQcUgNfR5tOj0+6F9G7T/eiKjocd6+o/2Y/E0XiaG90u8tolVY9pjH3WXjr718iEkDGMHvXvP7JOr2+neMbi3n4a4jKqfQ8UASftH/AAstvCko1nS8Lazvhou4Jz/hXjViunnRrgz7vtQf5MdMYr6H/bC1O/F7ZWKk/YWj3n65r5iOBxngfrQAIpOSvUU6WV5TmRyx96bHJsbIFIaAG0pGKVBlhW94X8K6v4kuli0mzkl3NtLgcCgDCVTtB7E4zXX6H4E1DUvDl5rOBHaW+cu+Rn6V718Mf2dFtZ1vPFr7gpysIHBNdF+0kbLw38N4bDSoUtopHK+Wg69OtAHxmx+YL6HrX3H+zGpHw+yh5Jr4cPXp7190fszY/wCFeRkUAerPzyfQUzJGcnHoKdwVOelNmZY4907qkIGd57UAZ+u6mujaHf6jKQvkRM43eoFfnh441mTXvEt9qEww0shI+g4r6T/aW+JmmyaA2gaPd+bO7fvHQ9uf8a+UCc8k5OaAG0UVq+FtIm13XrLTrfiWeQIKEhtnv37JXg/7Xqs+v3Kny4eEOOM8V9cNhQSe3SvObHUvD3wy8F21veywwyRRjzY0PLtXhfxD+PWp6s01voQ+z2ZODIDyBVqHMZynyn0P40+I+heF7dzdXUcl0o4hQ/Nmvnnxv8edX1V5bbRlFtbnjc3BxXiWp6rcX0rzXU0lwx53seazprkuuEOK6IU0jFycjc1PXLm/maS+upbmQ/324rLkuy55YKPQVQ8zC9M1GZST92tLJAqbZaefJ7moDIcnJNR7j3ppbNHMWoWHljnk8U3NITxTc1DkWoocxxSZ9KQ4PWnAgDip5irDeTzTqM5pKOYLC4o6U3NKOaOYLC5pM5opFpphYd2ozQaSncQ484pxH7uojmnqeOaaYNDozTyeajQgZpynJ9q1iyGiQdKQgjHdT1AqRQhHJp8UQ3ZzkU7qWhLdjrfBXis25/snWt0+kTkblbqnbivaPhJAPDXj+3h04i90i/A2Ov8Ayyzjr+tfN0lsWXcTgdOK7v4c+Kv7JvYdP1e5eCyJ/wBep5WsKtHS5UKl9D7swpkwB179qci4yD61l+Gb631XRLeaymEsYUYb1rUG5xgrk5xXJy2Zpre5JjHUGngH0xUF1dQWsayXkscSDgFjXK+LPiJ4d8M2ktxfX8LSp0jjbLGmUdmDkdRTHuIYhmSRU4zya8M0/wCJGt+OVnbwvLZQ2qghhKxD/hivCPF+qeNdJ126lnnv3iUnceNmPagD6d8b/Gnw/wCG5ngif7bOpIZIjkg18++Pv2hda1dpbbSM2lo+V/2q8qvL59dvhJGFhuCCXbJw3/16wZUYXDJjcwOOO5oA7PR/FNumpw3msvc3nlkMY5GyrH35rtr74iaTq2pW72emQWduRsnyuF2dDj3xmvHTYXCTbHibOzeQR2xVuLUmj0d7BLZd0jZD96AJvGE+mSa3cNoiMLNj8u7171iBSRkciu/8G/C3xB4oaNraEw27f8tHHFe5+FvgNomkrby6zcPcXgYZjUfKaAPm7wp4V1fX72I2GnzXEW4bii8Yr6++HPw/udP0yJb6MMhAxDKOFr0zSPD1hpdikGk2UVpGVGWC81q6dafZlP75pc/3u1AGbZ6DFFamGUAIxztUAAVrQ20UONkSjAwMCpsYA5zUV9cLbWksrEKEUnJoA+V/2wPFHmXFroUZI2fvG9O4r5gPPSuy+Kuvz+IvGeo3F024xuUT6VxrA55GDQAlWLW6mtZhLbSMkijCkdagFPRvLOcZNAC3ErzSNJKxaRjliepNR5NK7bjnuaFOxg3WgB7xsg+YEZANfV37IPhryrO91a4hVi+BE5HTrXylJI0zL3JOAK++/wBnSwNj8MdODptkclj+lAHxd4+8eaz4z1KS41K4kMO4skWflQe1cgWOck0DBAzTlUbiHOKQhOW5x+NeqfBf4W3njXU0uJ42j0+NgSzDhqqfB34a3vjbWo90Tpp6MC0hHB9q+4/DWhWXhvSIbDTIljjjGCwHWmMn8P6TaaDpUOnabGqRxDA2itbAxxjpyKg3EDgjJ60pZUAJBPPNAHPfEO+XTvBep3BbCiFhn04NfnPqU32nULmYZYPIzZPua+4/2j/EFro3w9urR2Aku/lQdz/nNfCYOCOenINJgWodPmkiaTG1QM4bvUdpFLLOkUQy7tgCn3N9NdBVdsBRtAHeuh8MtbaPrWn388TXMHV02kbenPNIR0+q+Bnu9J0q102CM6u6kzInUc8Z/DFY/giK/wDDfxB0+3llNtKZ1RyOwrU8QeMbrTvEKa1ogMSuANxPHb/CuVt7i58QeJReyymNy++SQn7vvQB7t+1prtv/AMSrTRaRyTPCJPtB646V80SkFgFAAXjI717X+0HeQa5b6HfaXJ9ptLW3FvNMo4D5zg/hXiLLzQAAEn3rd/4RfVhp8N09nKkUrYjJHL/SsJSUYMOoOa+r/wBnqC+8bJb3HiARzafp4At0A4z7/nQBy/wy/Z5vdXSK/wDEMptIWAdI8feHoa+ofCHhLSPCWmraaTaRR8fMwHWt6NUVAqrtUDhfSl3nOOMU0MduyQM8mvnf9ru8tLXw7ZwvbK80sjYY/hX0KcBuOvevnL9sS3P9j6TchC8YlbJ/KhgfI4J3c96+3f2Y9Rt5vAv2aI5lTO4Z6V8STMjOzKOM8V1PhDx9rvhO3mh0e5MSTAhufWkI+3fHnxJ8P+DYRJeXiSTlSBCp/i7Zr5X+Jfxv1zxRJJb2Er6fYHIKRH749+teV6rql3ql29xfzvcSuSSWOetUxj3zQA6WR5HMjsSzZPJzTQOc9KQjnrmt/wAPeHZdRzPdZhtF6yN0p8rYcyRnabps+o3CQ2yFmbv2H1rtNJht/CVyl3DIJr+Pv/zzPqKrXOpw6fG1tpMYRTw8v976Vz93cM5O9iQfzrenT7mE6nNsa3iTxFf67fPdandSXDHoGPSufkkJOT1psjggKoPHeomkOea1aSJUW9xWkYnrUbEk5NGc0hqHI2jFIAxI60UDpQelTzFiE5opoyaM0uYB1BGKbmgsSKVwsKSDxRmkA5paLgGeKMnFHagdKLjAe9L3pDSL1ouIUnmlFIetLTTAQEk9aOd2M0g4NLyTmncB5oFMY0oOBQmDH4ozjgU3dSAktmtIyIZJnCnPNSRuVUYOKhPPWnHIGBWiZNi8l6VK55FWvtULrzEuT1rGIwBg05HK96tTvozOdJ7o+kv2d/iR/Ze7StUlZrcD5cnpWn42/aOkstSl0/QrBJSp2ea/XP5181aRqMum38NzCcyA5I9a7TxvpUWp2ll4g0OFREy4uWXoj+/4Yrkqw1ua07rRm3438Z6hremQHUNduFuTz9kjPGfyqewsL7V9Ej0+40C2uL6f7uozOd6jHU/Njt6Vj+EdDW3kn1HxFbL9mIytyWBCn6ZzWPN4vitLbUooyZp7k7FmQ42rkHj8qxNAbUD4E1ZILIedeQyZmck4+gx2qDxb8SNf8RXE5nvJFtm4SIAYUelclfXk94Vkmcu4XaW9veqoHvxQBLGS8oDHG5gCR25r2HRPhlZXejWup6ZqSSTod0kUp+ntXl+iRWhczXsyqFyVU+vanyeIbwtKFmdFbjCHAxQM9+0T4b6xrF4jah9git5BtEit8zL6V33hj9n/AEO11L7XqMi3MK/dg7A18p2viHUbazguLLVJo7iJvljVugrpdJ+MfjK3OwatIxJ58w5oA+59O0O0sLVbS2jCWijCxgcCtC1s7e2TbDEAOtfIHh39oPW7KCV9UlFy6n5UGeRXWab+1FbSyol3pUkQPBYkf40AfTR+mKOfavKtG+Ofg+/iBuNQjt5O4YH/AArr9G8d+HNXIFjqdvIfrj+dAHSsT0x2ry79oLxOvh7wFdok5hurmMpGw65/yK9OinhmUmGRJB6qwNfJH7VHiGHWNXbSpZghsBuVf7x9P1oA+cpne5neRiWkZsn3qSC1uLqUpDFJJIOqqKiglMMyyJjIPSuk8PeKJfD1xPdWqRyXE67ckfdFIRj3+lT2SRvKOX/h7is9iSc45rSudVluLuW6nJedyTnsKzmcntQA056mjNFFAGhoEXnazYxkZ8yZFx9WFfpP4Ps0sfDOm28ShQsK5A9cCvgn4G6KmufELTraRcqjeZ+XP9K/Qq2jEMMcSjhVAFAH5ar94V6D8J/h1f8AjjXI4oo2FirAyTY4FRfCv4d6j451qKK1jdLNGBlkI4Ar7o8FeF9O8I6TFpukxLEsa/vCByxoGO8IeHLHwtoyabpUSR+UMM+PvH1rY5JXv60rEOM4xnmjjjHGB2pgANPBCq0jMFVAWJPpUQIC5PBB5FcT8YvFsfhPwZdyh0W6mUoivzkHj+tK4HzX+034juNc8TmG2k83Srf7rg8b/wCIfpXhh5JrQvtUurxpvMlby5ZC5XPAJOaqwW73EwiiUsxOAKGIjQ4YHjj1rsLvxtd32mWeny28At4VK/Kpy1crNazQTNFIhEg6ip9InjtdRhkuE8xEOdtIDVbQL9dIe+vQ1raEkxhxjf8ASsFJGiY7SwU8YHeu58c/ECXxRpljpsttHHaWnC7Bg4rlNcay8+JtO37Cnzbjk5oA9l8D6WutfAjXIt8ayQTiXLdfun/GvCXG2Rh6HFdt4butZTwdqMWnrK1o7fvGU8dO9cWI3lmKopZyfuqOtAEeM19h/shxy/8ACNXLZ+QNx+Qr5FvLSezlENxE0cuOQ1eufBP4wSeB1Gn3UKPYO3zMB8w/GgD7fVztXIyTTgWydy8CvN9S+LPh618JHWba6R8p8kW75t1eDxftM64uoTubSA2x+4NvP481SGfWt9eW1lbtcXkqQIoyZGOMCvmD9o74paDrlj/YemqLp4zn7QOg/wA4ryf4hfFnxB4xldJrloLVuDDESFx9K88z2AOO4oEwJBLHHB6U2lB/P0p5iYEblI4zzUjSuMHUY609ULtgAs56AVPZWU17MsVqjSO3QAdK6+y0u20CDz74CW8/hQdvrVxi2S5paMq6HoMNtD9t1j7g5WHu1T6vq0lzH5aEQ268Ii1Uv9Ue4JkkYFxwB2Ue1Y00+/JPWt4xOeTcth00+B1qoZCTzTWO7rTWOBxWnNYuEEhxcUxjnmkzQTxWTkapB/CabzTgeKTNQ2OwDNFIetJS1AXOKSgjNFJjQUUUUhhRmijFArBmjNGKKAsFGaKKAsLmlpuKXNMNhRQT6UnWlAouAgpwptKPehMTH8U08Hijim/xZFWmKxIBnrRzSZJowPWrTCw6ikGKXirTEOUlME812/gXUBJa3WiXkmIZ13R56bq4lcgnvmrNnI0FxFMjYeNtwNEk5RsidtSxrMmpWc02n3VzJsQ8KTwaxSxLEnvXvvhDwBp/xTs3vo7pYNSUYaPdjJ9hWTrv7PXivSopZ4hFcxpzhOp/WuVqzsy07njPJHtUq2kjWxnAGwVsan4T1zT0Z7vTbmNQcZ2HFZBeaOIxlnVO6kGkxlft14pyqGB5pAMgAcse1OZGRtrrg0rjGAnsaltYxLKFMgTPc1DTgOOmTTAsNthuxzvVevvXTaH4XfXopLwSxWVuowpc/eNQeDvCV94lllFg0YaNdxDdxVu8tbbT7m00+5upp/KlzPsbCJz6UAc9rWk3ek3ggu4yrNyhH8Q9agtr+8tG/cTyxkdcGvYvHdh4ebwTYa9p+ofa9QikEfkTNuIXnt+Aryqa4t5bKaQwhZ5DxgYFAHb/AA6+Luu+EmdftMlxFIfuu2cVyPi3XLvxVrV1qtyDvc5aue6cVIs7qjIDhW60hEbdeKQmg02hgxc0tJRmgBaKBQegoA99/ZK0J7vxi+ogZSBCM/UGvtMDrXzl+x1pklr4fv7mVMeaRtPtmvoxaAOT8G+F9N8JaJBYaVEqBRh3A5c1ut8x3EYU8GkAyfkHyD1p1MYzkHbnIHT6UmM96cThuPxNMADOQgIHUselABI8cdvJNcECGIZZu/FfE37Rnj0+K/E7Wls2bK0bahB4Y9D/ACr1n9o74rR6XYy+HtAnBvHOJ5FOcDuP518kTSNK5Z85bk+5qRFy102a6s550ZFSPkgkAn6VWtLiS1nSaJiHQhh+FRrI4XarYFMoA1J7lLiGW5mmY3rtwO2D1qvAsc7xxqQn95jVM0DigC7qKQRXG21kLRADJPeqnGcDp60AZ4GMn1rpfCZ0eW8hGsLtiibc2P4x6UAeg+G9A1XTfhLf6pDegRSt/qFBJIx3wfavN/CGtx6Brq6hcWiXew58tgMZ/GvpPRY7Xwr8KtRvNWhY2t8/lWqkZ2gjr+lfN/ijw1qGjmOe4t5DazgyRyqp2kZPU0AV/FOuzeINXnvrhAhc/Ko6LWICafjgDqT0plAE3nuYTG0j7ey54qIkhh2pKKADJB4NKM9ic0vUcAfjUkEMkzgRozHPUDiizASNtsiOFB2nJBr1fwT4EvfHnlXc8K6dpNsp865f5dw9vXpXFW2hJDEZtTlVDwVRT1roNW8fatPoMGhWk32TTEHKofvVpCPciU+iN7xBqXhvwnG+meF0W8mTIa7bqPzrzTUNQe5naSSQln6tVN5AWJT7oOPrUL8mt0kjO19ySSToo59/Woy3akJzRT5kilETNNY5FKwBpmMVm2aJC0HpRSZqblWF/hptLmk5pAFFFFK4BRSUopXBBRRRQMKKKKACiiigAooooAKKKKBMKMmg0lAhaBRRQAtHekpc0wFpc03NOB4qkwFBpc0zNGM1aZI8k+tOjfDLu6Z5pmBSqADWilYTVzqPBPiq98Ka/Df2UpQq43IDwVr778D+JLTxR4ct9Tsiv7xBuHU5r83woNe9/sx+PZdI1xdCvJD9muDiIE8A/wCRU1IXV0CdtD66v9Ks9Qtmtry2jmiI5BHBrg9e+DHhHVbeRBp6QSv/ABKBx+lek7suSOVx+tIz7TwK5C0fLfiz9mVoYTN4evQ0wOQjV5D4x+E/izQY/P1CyaVemYhu/lmv0E4LcZBIqOWKOZdkyBwPWgD8x10W/wBrtJazRhOTvQr/ADqGxeOKV2nXIKlfxr9H9W8FaBqscq3dhEwkGGwBXhfjP9mi2uZprnQLrylOSIW/p6VQz5l8O+Ib7QbnzrCUoOQ3uDVa4vvtd7LISY45W3yY711ni/4WeJvDDO93YObcHh0+fP4CuIS3nNwIBFJ5jHGzad35UAEjZJSNm8sngUXE5kVFUAKnFbukeHGuvtq3bm2lhiMio/BbA6VgSqqsFwQc4IoAhx1xRipBzwM+mB1NEqupKujJjkBhikIjak7VJ8uznrUVIRJGE/izSMKQUUxiCnqMuoHOaRf071s+FbP7d4j0+3VSwlnRcD03CgD7s/Z+so7P4baWQm15Ey2RjsK9J6Vl+GtNj0rRbWziGFjjC/pWmpx17UDKAYlRuBGOnGKftOMnaB7nFfMfir9p3gr4ctOOxmT/ABFeZeJvjp4q1xCvni2B/wCeXy/yobA+1db1rTNGtmm1O9hgAGeXFfPvxW/aCgS2l07wsG8wZU3HY183ap4j1jVUC6hqNzcLno8hI/nUGkab/aJmUTpFsUthz1pXEQX15canfyXF05lnmOWJPU1BNE6OVfAYYGKa25HGDjHQ0ruZDuf5m7mgDWvdIgttDtr5btJJZWKmEdVxjnNY2OeMmpEDSEJyR2Ge9SW8ptmZSgY9KAK68nFWorMSWksxkClD931qszbnLEY9hRuYKVBODQAqR5cKetdt8MfAmoeMdfgtobd/siuPNcjbhfrVn4K+Em8XeMrW2ZAbZDmQn0yK+5NA0PTtBtDbaVaw26qAHlCjJoA8n/aJkstG+Fdro6nzZkKpHhcjODXgfjPxB4qi8IWmla1DbpZMmYfkG4Lz3ruP2lfiRp+uS/2Fpke17WX5pguOQP8A69eDanrF/qaxLf3UsyoMLvYnA9qAM8cn0oxzwaXH3sgg9qQepoGAHX2p8cMkjqsalmPQAc1q6ToNzfEOymG36mRuBW013ZaPmHTI1nmH3pnH8q0jFshzS0M6y8PFMS6nIIIxzsJ5NWptTgtkMOlxCNehZxkms68vJrtme4kMnOQGOMVSLsQSeg9eDW0YIhybJZ7p3bLszN33HIqszHJPU9s9qRjnmm5zTaQkhdxzmm5opKkuwZxRu9qRqSoZaQmTRk0nNHPepuAuaQ0UUDuFL260UlFxBRRRUl2ExSiiigQUUUUXAKM0GkpXAXNGaSii4C5ozSUUXAWikFLRcApMUtFO4WCijNGaLhYKKKKAsGKXNJRTuOyFHFGaSgU7siw7NGaKKd2wHo3NX9J1CXTtUtby3YrLA4Kms5OtShiAcY9q6Iy0sQ0fot8LvEaeJvCFjeqwZygDnP8AFXWj3r44/Zj+IbaHqf8AYmoy4s5TiMns1fYsbq6705RhkGuacbMqLHZbPUYpe+RSL0FLUlMQDBzSjv1ope1AEF1Z293EY7mFJkPZxmvKPG/wc029un1fw9HFa6uoym5QUJ+leuKcmkPPGSBQB+enxH0TxPomvTT67bsj/d3xqQrD8K4WR5Jpt+Mn2GcV+lniTw9pniKxkt9TtI5QwwCyjNeD+LvgLHo9ld3vhSNLm5YEmKboPpmgD5KhdoZ0dMb1ORu6Va1C9k1O582YIpAxxwK6G78C6ta2F9e6pGLIwscRz/IX+ma5JlPOQOKQjS1HS4LZIjHdpKzDJAGMVlumDgcgdxT1UsTuIJx60qS7Iyu0HPegCEcU7b9fbjrSE5OTU9vDLcSbII3eQjgAZwKAIQOa99/ZY8EPqviA61ew5sIBhCy9XGf/AK1ee/DP4faj4y1qO3hgkW1Rh5shU4HrX3N4X0Gx8LaJb6TpqKkcagMQMZPr+NMZ0UlxtTCcEUxGkk5zxVQMAcseO9SG5yQIvu0AfmTBG01wka43McDNTX9q1pcPC5BK88U2S2ngkJljkjI9RjFRSO0pZ3YsSec0mIYTmlVmX7rEZ9DSH26UCkBuWurxRaHLYPZxySMciXA3D8cVi7cjPApOQcjihhj2/GgARmQjFXphA9iswYibOCKobSWwOTVmKzuZlzFBI4HXAzQBBwGGDwetT2FpNf3SW1pG0k7thFUZqJYnaXygh8wnAXHOa+uP2cPhfDpmmrr+u2yfa25hR+ePXn8KAN/9n/4bf8Iboj39+MX9yoYg9Vr1pgGQo2djDmgHeeowOw7UoDbcgZPYetAHgHjX9naDVb+61DTr5vNnYtsY9D+deR+LPgZ4q0G0e58hZ4k/uHccV9vf6qPLyrGp67uMV598RPiroHhC3aNnS7uiP9STuBqlFsTkkfDa6Lfm68iW3kjbODuU8Vv2+l6dou176QT3Q6RjkV0XxC+Ij+J9Q+0WVhDYxnrsQf4V5/NIWJLOW+vJ/OtY011M5TfQ1tX1qe6by1UQwjpGvArFeU9gKieUnqeKYWz3rRWWhPLfUez55PWo2OTzzTTmg0cxaQuaQ9aTNGalspIWkNITQKm47CNTQacxB6U0VDKQUUUUgsFHeijvQFhKKKKAsKKKBRSKCiiikIKKKKACkpaSgYUUUUhBRRRQAClpKXNMYCikpc0CCijNGaACijNFAwoopaYCUUtJTJYuaCaSimgsOUmlJOaRWxQDlqqL1JaL1lcSW0scsLFZEYMCD0r7v+Anil/Engq3Er75rdQjEnJPSvgdSQeK+mf2SNZaO/n0/cdrLkj3rSpH3bkJ6n1Vnnb6UuMUduAM1XmuvKPzg49hXMjUs0tVFv7duj043sA/ipgTmj8KqNqFuP4j+VV5dWG07BQBpt0yxAFVZrqNRhOTWS91LcjBbalRSTGNdsXPuaAKXifRdF8QxeVqlik7jp8o4+teLeKv2edLvZJ7jSb0id+RCeAp/OvbWOeuQ3cg0hbJA/8AHhwaAPl3SPgHr8U1wmpwx/Z4+VdW5IrlvEfwz1PSdVhbTLOW6jHzOuwkZ9K+zBNICGOWbpgscYpwmCMSIYiT6oKAPisfDHxT4hv2lt9J+zK3QEbR/KvTPh9+z/d21wl1r959nZf4EP6da+iDKpbIjVfTbxTvMJTBJJ9+aAIvDmkafoFmLfS7dEGPnkCgFq1kzI/ydfU1Rglxwamklz8kZx70AWi8ELEO2T3qaK7tcYwAPXFZggP8fNSrHGB0BoAytc8B+GdZidb3TrZSw5MagfyriLz9n3wTcBzHBOsjdCGOP5166wGDxTRkdKAPnbUf2Z7BpCbS+8tOyk5rn9Z/ZlvYEDWN6r5r6p6jmlUlehoA+S0/Zq1QGHzbtQGPze1dRpn7NFnDcA318JI8dM4r6MDMM89aaQNpByfp1oA8j034B+DbKJDPFJNIG5wx/wAa7nSfBXhvS4zFbaZA0bDbllBOKoeK/E2oeFb0XF7ambR2HMqD7n1rd8P67pHiS0W40q9jmUgErGckexoA8N8afA2RvGtpq+ibDbeeryQgcAZya+graER21vDCqiOKMBh0AIAqwIZVU/Iceg5zXk/7QPja68JeHRbWKlbq6B2uP4R/k0oxuS2dJ4r+I3hvwwjre30Uk69YUIJFeQ+I/wBo05ePQrEgdFdhk181ahqFxfzSTXsryyscklieaqeexGQTxW6pmbkz0LxN8VvFOvK/26/ZIieEi+U/pXD3l5LcuXuJDKT3dyxH51S3k00k8k96pKwrXJHkLMCMsB2FR7ie9NJNBpNlKIpNJmmGlFK5dh2aQmkpKLhYXNFGBSYP4VIwpR0pM+tO7UDGnrSUo5JoNACUUUVAwooooYwoooqQCiiigQUGiigAooooGBpKU0lIQUUUUAFFFFIAooooAKKKKACiiimAUtJS0AFFFFMAoooqkAUUUUAFKvWkpV61UdxMmTqK93/ZQkSPxvKjNyU/xrwhc8Y616z+zpdNbfEOMg4D4H866JfCZPc+6yPm4pHRHBDjOacDkAj0oPJrjRqjOn0uNhmPINUm0+VT0JFb1LTA5xrKTupprW5QZYHFdGVB6iql+8aJtZRigDBdhjC8ComYdjzRO+ZSq/cqLAzmgB+cim96XNGM0AGaOT0pQvrSgYFADMGlU0M+KaG9aAJ0IzyakVQzZBqqMGpEO3pQBa3lTz0p6kE5zTYirgI569G9Ka8bRPsc4B6H1oA2T0puDSg0tADD1owacSM0uwnpQAyl2nryPcdadtwacxIXNAHL/EG0ub3wdfxWCCWUKSsZGdxxXxY2r3mkzXMthdz6TqkLkSW6n5SQeetfejMEBDDKt1FfOH7Q3wiuNRuDr3huHcxH7yFByfU0mDPGoPi/4vgRkOqSs578f4VatvE2peNrWey1m6M12BujZuwHavPtT0u902Yx3trJAc4IcUlheS2l3DLGxUKeSO4pxlYmwXERhmlicYZWIqsM4IArqvFka3cdvqlqgEcy4YDsRx/SuVxwRnnOa6Oa6JtYTpRnPWikPWpbKQGlJzTW6UL0qbjENKKTvTgBRYdxKKGoHSgAoB4oozQFhcCjtSZooAB3pDS000gCiiipuUFFFFK4gooopAFFIaKAFopKKLgLRSUUXAU0lFFIYUUGigAooopCCiiigAooooAKKKKLgFLSUU7gLRSUZpjFooFFO4gooo707gFKvWihaqG5LZMpxzXf/BW5aLx1p7D+JwDXALXU/De5+zeMNMccZkUfrXTJe6R1P0aiOY1+lO71DZtvtYm9VBqauOxaCiig0DA8Vh63NtbyxyTWvcSbI65e7mM1yWPbigCAcLjr70maM8migBw6Uo601TSlsc0AOLYpjv8ALx0qNmyeKQHJC9qAHJ83Jpc8ZHSo532DC05D+5oAcj81IJKrRnJp27EmKALZyVDDhR2q1bzLKvlzkf7J9KoxPiba33TTZwRLgHAPQ0AdKop2KapwM0pfNADgoI96cAR1qPOB70qyY+9QA80mefpSmmmgBpAJJIz7Uxcqx7j0PSnmm7qTA88+K/w0s/HGjNBbpFbXwbcJgOo7ivlzXfhLr/hvUhFc2clxDnAkUfL9a+5t3PBA+tK6rOCk6IyejDOaQj4Rj8NXNrBcaXcOXEg3IQD8vt+teeXcRgmkjxlo2259a/SB9D0iWTMunW/PG7HIr5A/aR8B/wDCM+IhqFlDt064PG0cZ/zmtIyJPFh701utSEbuaawrR7DQw804DFGKWpGNIopWpKYAelHag9KB0oABSHrSnikNIYlLmkooAXtTetOHSmjrSAWiiioKCiiikIKKKKAENFBopAFFFFABRRRQAUUUUAFFFFABRRRSAKKKKACiiigAooooAKKKKACiiimAUUUUAFFFFCAcOaVRzTRT1Naw3JZIrYNa/hOVYfEOmPnpKv8AOscDBzWv4Tt/tPiTTYR/z1T+ddMvhIP0f0CXztGtH9UFaB6VQ0KD7Po1pH/djFXz0FcbLQUH9KKgvJvKiJ7mgZT1KfEbAYyK5/sfc5q9cOZD161SbgmgCPpS9qDQelACZHeopX4IFLJUPO7mgCVThOetKgwpamEZxTbhyseBQAzJeQ1YXAjxVKDI5NTM3bNAEsOC4HakB33JHYU5U2Ql/aq9sxLlqALUx5Xtz1qzejdbo46rVO55UGruPM04jvigDcL8U3fSHGKaTQA/fTg9QE80bqALsLZ3UA8GorXoeetPHBIoAUdaa1LnBprHNAB2opN1AOaAHgd8Z4rifjD4VTxZ4FvYBHuu4oy0Q/2u1dsB8p65pynJwRkHgigTPzP1G2ks7ueCRNksTlWFVsY75r179ozwa3hvxm1xGp+zXeXLAcA+leRFSOtdCd0QJTRSk0lS0NAOtFAFBOKRQ1qMZFLjIoxxQAdBSA5FLjA5pO1IYhpKXrSUAOHQ03PNL2puKzAWiiigoKKKKACiijNIQhooNFIAooooAKKKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRTQCinLnNNFOU1pDcUtibnbXd/BTTP7S8f2MajOxwxrhoSWBNe8fsnaJJceLJb948xxLjOO/NdE3oZR3PsiJdkar6DFOpCwBO44qtcXiRgheT7Vy3LZJPKIFLE5HpWRc3DO24/dPQUjys772OTVaVgQ2Tz2oKHlNts7etUT96tGcFbBT/eFZhPINAAvQ/WkJoXoRSNQBG5wSaiJ5zT5elQjoaAJEPWoLhstUgYBCark5PPegB4Hy5p0KBpQ/wDCelMPTFWlKW9v5j9P4V7igBl65G2H+InmlWPy1CiqVozXF2ZHOfStVcByWPFACXalbMEU+3Ymz/CmXjbrU4PAplu58gKf4lNAG+SaQtTC3vUZb3oAl3Ubqh3+9G/3oAvWz8VOxxWdDJg1c3hloAkzmg1EHweacXGKAFpRTdwxSgigCRelBzj5etNz2zTlBJ5IA9aTYmef/HLwjF4u8FXYWMG6gXfG3fgV8JXUMlvcSwTqVljYqwNfpWZYvLETAMjZU59K+Kf2i/BreGvFT3kaYtb7LjaOFP8AkVpTlrYlqx4+65pKkPQ+vQVFzWzQJi5xSHmgUtZlXAUHpRQaBXGkcUg+7Smj+GpKuA6U09acOlNz7UrgLSUUUgCiiipGFFFIaAFpKKKLjA0UUUrgFFFFIQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFKOlNIAFKODQBTkHf0PStKWrJkWI0JjwOpOK+2P2ZPDUmi+BRcsuJrobwT6cV8s/Cnw1L4n8XWdmsZaBHDyEDtX6AaRYw6bptvZWybI4kCqo6CtKkuhEUMkt7qXkuMGov7Pm7kGtZBhQPSnZrCxZkLpbn7z0kmlKqM7NnANa9Q3f/Hu/wBKYzFviRaxAdAKzGHFat5zaIPes2SgBgFMapQPlqBj1oAjkqKnOTTBQBC2cH0pp5AA609zz6U3csfzYBoAsIFij3TVm3s7TttzhRTp5WkOWJK+hqsDnmgDQsMImaJJ2JbBqFJNsWFHWoySxC9CaALwl3WiJn5mapUfM2zsg5qqoC4J4CDOaElyGcnBkYAe9AHSk5ppzSZ5oJoAQmkzSE0maAJAwzxU6PiqecGpEegC6WyKN/HWoQ/FAUueDgUAS+ZxxmgSGmMsgbC4IppJH3hQBPvOOKaxkYEBuDUYbjipFapEKsfYniuC+OHhH/hLPA9wsUYe8tgXjyccf5Nd+GzUqbGV0lGUYYI9aadmJn5r3Fu8MrxyArJGxUg+tViMda9f/aJ8Ht4Z8ZS3FtHizv8A5kIHAP8AkV5HIK6U7onYjyKBzS4po4NSwQtBooNIY00DpQaB0qWUJ0FJk0ppKkAoopTQAlFFFSUFIaWkNABRRRSAKKKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUwClHSkpRTW4xRU0K5demDxUFXbKLzHjRQS7sAPzrWkrakSPr/APZO8MQW3hiTWJY1+0zNsB/I19ADOBnk1xXwd0gaP4B0yDbtYxh2HvXa1EndijsGAOlFFFIYHiornmFhUx6c1RvZwq4FAzNuvuIvcGs2XhvxrRlO9hVCVcy4oARsKuD3qu3eppTlselQPQBC9M6U9upqNuhoAhfk1HIMYB6U4n5qSc/KKAK07YG1aai/JmlPzOKcTgYFADJG2oADzSR/MRyd1NkUk4pWnWCPYOWoAW6mO0Qoep+Y0+FhNfW8S/cSs4OfMJPetTw7Go1BHkPyjnNAHTmkJpTTTQAxic0m40N1pKADOetODYqM0gagC1G+etW4f3i7T17VmK2KsxS4cHOMUASNJJBJtPT3qVJQ7AOOtNuZlmQADn1qL+IMO1AE92hhcED92aYjfkelWDcrLAUccjpVJTjrRYCyrVIrE4x681VDVIj9eaTA4L4+eE08VeCpJ4oi11aAtHjt/nNfD88bJI6OpVoztYH1r9IY2V0aOQAxOMFTXxn8f/A0nhfxRLeQIfsV0xYED5c/5FbU2ZyR5LjAGaYQtTOD/Wo2XHWtWkShlBpaSs2WAAPWkYY6UHNJ2qGUA560g60o6U0dakBT1pKKKAAUUCipLCkNLSGgQUUUUgCiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFMApRSUo6UIY4Cu0+E+jtr3jjSbLyy0Rl+YjtgE1xgB546V9Ufsj+ECI7rW7qLIdR5LEdDkVunaJi3qfTdjbra2sdvFwkahQKm6UZOTgcCmNIR2JrFFpaDs+3NOPAyTiq8lww6RsT9KoXN3I3GCPamMt3V1+8WKIZY96zr9tsipnLfxVJC/kIz9WPTPaqTNvJY8sepoAcDgE+nSqmd0zH0q9BH50ioOlRXkAt7xlHQjrQBny/eyO9RMakf7xFRNQBEx5qN+hp7daY3Q0AVifmpJvuUjnmg8rQBDH97JpAf3nNGcGo3OOaAFmbDGqUjZfJqxISwFVZhigBIjlmJ6Vp6dDI0DFDjnrWdEhYKqgkk9q7ewsVW0jAHUc+1ADzSZoZhnHNN5zwDQAN1phqTZIf4RTTG46gUARmkqUxE9Aamt7R5HwBQBU57CpkRmIAq41o8Rwy8VLYxBpCW4xQAxIAi/NUEsgztWr142SFAxVOZFTGOtADIwcnPWkY805M7sDk1HJw+KAJFPFKDUatSg0MaJga5v4l+GLfxd4RurWRA1zGh8o+9dCDUkbEMzIOnBFOLsTJXPzu1awm0vULixulKzwMVYH1rPfk819D/tReChZX8evWMWLWY4lYDv/AJxXz02M47jrW8XdGbVmMPFNNPPFMNJ6FLUKa3WlzR1rNlDaSlNKBSsA2ilNJSGFFFFSMKQ0tIaACiiikAUUUUgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooopgFOUZIFNqRB6HmrgrsmT0NHQbB9V1a0soQxaeQKcV+iPw58Ox+GvCVlp8IwVQFvrXxF8JDb2PjPSpbsAneMAj619/2bCS1ikU8MgqqicSI6kvcgdetBYKPmIFIOOKY8KuckmoNCOe6jjU85as5y7tuVc5rUFvF3XNSBFAwFAoAyY7B5iXlYoPSqcyCOUxoc1s6jKIbf5jyeKo6batJJ5rj5T0oAuadbCOPcRzVLW4wJEatj26AVi61MshVV5CnrQBjyDDN9agk6VNKMyZPpUMg4oAjx8uarv1NXFGYz7VUk+9QBVI+Y00HDYqR+DUMnWgCOf5TkVExytSyfMuKhUfu+aAGNkqMdqiVPMfmpcHBxUJJVwozk0ATw5WTdGPuda7Xw7dLc25ycMOK56zgWODJGcjmizmNjeKyk7CeRQB1UFsVQlhzVyGw8xdxIFRQXhaRVlH0rWmbbEdg7UAVBZwr99uaa8NovJPIqaC2LoGkPJpkkMYbBFAFGWWL+BRUSzMHBXir7W6DtUZRQDgUARpNK2SwzUKSbZm9xVu1GC3eqE5Kyk+9AFl1yyk+lVboEc1dbmNW27jjpVOVZHyZPlA7UAQwPsIc96hmbdMSKfI+FqFeeaAHg0/NR0d6AJgachO7PQHrUa08UAZXjLQ4fEfha90y5AdChZCfXtXwdr+lXGjate6bdpiaB8N+dfoVG/lsH647V8yftReC/smrJr9mp8q45mIHQ1pCXQiS6nz2+Nx29KY3SnnkCmt901ctUKLGUmaWk71mWLjigdKO1NoGhT1pKKKkAoooqRhSGlpDQxhRRRSEFFFFIAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKM02Jgas2ih5lU9zVYVcsCRcJt65ramRP4TptNme28V6dj/lnItfodoMnm6LZyf3owa/OWMka9asx6Srmv0R8JSLJ4c08qePKFViOhEGa3eiiisTYKDwM0UUAUpLZribdN/q+1WgoVNqcAdKhkndG5X5KryX244Q4A60AT3M5RRGvMhrJ1EIsOwffPJqYyLGCxfJNZ87lqAKzndj1AxUMnSrMmByR2xURA2ZNADYRlHqjJ1PtWhCGWQ4HyN3qjOmJXFAFdxxVcjIJq4R8tQBtj5PQ8UAVwuaSID7rVYeIxvn+FqpzEoxx3oASaMoxI6VGreXKsjLkVctsSptbqKkk0/zOFPNAF2JxLbbgMZ5qtIAeo6VXijudPkwQWQ1cch/nTgmgDfBK3CE8jNdE75h5Hauedf9U3vXQxD9ySfSgB1o2+Ie1RTttkxxTLV2jUjIxmiRVc7mcCgAdj3FV5JFCtyKbdzQiHEbktWS07OMHtQBsaewyS5GKz79gJjhhjNVftLAbQcVBJmQ5zQBoPOdgCviq0k2TyzE1WIPrQBjnrQBISWbJx9KXuAKjBO6pM0ALg0oFJmlU5oAkXinrUYpwNAiQY6ntXPfEfSIde8E3tpdKv3C+49j/kV0ANcD8dPET6F4Lm8ltss3C/TiqhuKWx8ValbG0u5oP+ebFapseMd62r1hewG7HMx5Ye9YzjAB7nrWz2IiMpO9LSGsmaBnikoooQwozRTTUMB1BoopDExRilooATFGKWigBKKDRUsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooATrRigUtMQtWrF9kwb0qoKnhB3DFb0iJ6o2QS2owMTy0gI9q/QX4byF/B2nMTn90BX54q5a6ix/Cwr7/APg7KZvh/pzHr5YqsQjOB2+OB7UUppK5rmwUUUVSGIw3ZDAYqpNp8UgOMirlNdgoyelAFB9NhVQSxwKyZygkOOg4rQv7l5wYoUYe9Qw6ZNJjzeB60AZ3Unj6VYtNPkuCPNG1PetaHTYomBJ3EdqtkbhjoooApzWMa2TLCvKjg+tcvfRbVBx82eRXbKQFOBwKxdXswCZFHD9R6UAcwR8tV3XJ2kVeePy3O7pUBXksKAGDlfLk69jUBjAYJJ19alKlxuPGKaXD/LIvPrQBTYtDdZH3DWlGVfBUkVVeLI+Y5A6U+LeiZKnFAGmill5ww96ikiB5Uc+lJF5iqpJ4YZqcDb82c0AXBIwQK4zjpVgalME25zTmQE8rUTwJ1AxQA03kh++KY9wx7UjJjgUqr60ARl2bvTNuDnNSsuO1MxjrQA0jPWkK46VJSkUAV2FA4qVlppFADe9KKO1IOooAeKetMFPU0AOzSimk4pwoESL6+leG/tUMzadYxqSABnFe4p98Z6V5d+0Po51HwlHeKpMkfBAqo7kTPkbRZP35jI3B+AKr6vbPaXTI4xnmt/w9pu29DOvC8/jWl4w03z4ftESZcdRWz2Ii9TgmHGRTc5NK2QxBHSmismbAaKDRSQwNJSmkpALRRRUlBRRRQAUUZozQIQ0UUVLAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEozRijFAhRU0TYbrUQqSPqeMmuikTLYvRsftSFBxkZr76+BxLfD3T8/3BXwJan98hPGWAFfffwPVo/h7p4kGG2DNXiDKO56D1P40GgfeI/Gg1ys3AUGmnrQTTQBmkPI5GaWimAgwOgFLmjPtRQAh4ptOPSkwaAEJCjpmmzIrRHzD8pH5U4naCD1NZ2tXBitvLX7zDGKAMG7EcjyIhyQeDVMIQcVZCiPkfePWmqnJPWgCs0Z59PSo4YvNDHrjtVu4JC8Dmm6YALj5uA3WgCrFbF13Keh5HpUksvlqIlXzC36VbvbRoLgvbMCjdcGq0jJbgsp3SN+lADtUlW3tYcH59oyBUcN2rRAsNpxVN0MknmStkelV5X3NgjaAeKAO28wGkYgio+KQmgBDgUwrnvStmmE+9ACZ28Hmk2jrTifWmEjtmgAI9KWk3GjNAAelMIp+c0hFAERHNAHNSbaaRQAlHelxTlHBzQALg9aeaZjB4pw5oEPx8ufSqfiHThq+hXlk6hsxkqPerq88HvU8JInBPTpQnqKWqPja907+y76e0nQpKkhHIqCeQF2RuUYYr2b9oHwt9nli1m0iwHP7zjjH+TXh85xGApz3FbJ3OZrlOH162+y6i+B8jdKyiME11viG0a4s/OUEsOtcnt5xUyRvTd0Noo780VCNUFFFFABRSmkqRhSGlpDQIKKKKQBRRRSAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKMU7AFFKPSlIweaaQMRaepwc0BcjI4owMcmt46EM0NMQzahaRgZ3ygV+inw/sfsHg7T4sYPlAmvgb4fWi33imwhIyFlBFforpaeXptugHRAKVZkLcs9wfWikHAxS1kaiHNJkU5jheKrM7ZoAmLAU0yelRDLUpjZfxoAUuakB4qE4HWmlgDg5oAsZ96a8sUYyzVSuJ9vyqeaoOXkbnmgDVfUIlBI59Kx7xnuZdxPFPMWNowCT2qvcJJHIFbv0xQBA8LA9c0m11HXFW0iKrukJxVaU7m46UAQsrMfvCopIPm4OB61ZjQd6bcvlfLUDPrQBTkkK/IrE4qBYpHk6cVoQwgABxz61JJtT7vFAGZLAYn3tyOmKYlsWywIBbp7VcbLzYbmp4YVjJEgLbjxjtQBcV9y5BpQ3qazEdk5U9O1WIbiNzh+DQBZc81GadlSPkbNKuR95c0AMPNMIxUh+btimke+aAGZpwGe9GKAv92gBQMGnAZoB7HrSEYOaAH7eKay09W+WkPNAEWKKkxRigBgFPAoxTlBJoCw5Rk1fs4Odzciore3LMM9K0tuzCilYDK8VaTBrmhXdhOobehKn0r4z17SX0vWLmzkDK0bYAIwcA19xgHGAOpwfoK8M+P/hFWmTXLFPmbCSEf596uLszGpC6ueBiJH3Bl/dkYxXA67p7WV4+PunkfjXowRt5XjjrWX4o0o3lgXQfOnNbNXM6craHnXb3pKc6lSQ3DA4NNrKx0qQtFJRUloU0lFFSAUhpaKBCUUtFFgEooNFSAUUUUAFFFFABRRRQAUUUUAFFFFFgCiiigAooooAKKKKAClzSUUJ2AdmlyfamUU7jJY5NucqDUkUse/8AeJkVXFFUpENGlCtnO2GUx++as/2M0uRZzJJ6qewrGGD3qaCaSEkxyMpHTBrWMr6ENWOk8HTXOkeJbKeWJlAmCk44r9FdIkEulWrg5DRg5r879K8SlGWPUIkkQENlRzX2l8HPG2m+KPDlvFaTBbmFADEx5xRVjdEJ6npApaRRznOARgClrFM2uB5qJ0qWimMr8jpSrJjhu/SpsAio2hB57igBjYaq88yhSoHzVNKjbcr1qqLeRssRigCBYs5aQ0hIziMc1cFo5GWOfapFiVOi80AV4IRGPMl5J7elU/mknYvyB0rUcAqRjmoYIVUkt1oAyrtZE5IO2q4jzyD1roJIvNQh+naseWIwSEEcHpQBVdSOhpqp/EfvVMy5ORTMbaAF69eDVefluKn+9xTTHg0AD2zNEssPQfeppkaZQkCkHuSKmjuWgUqo+U9aj87r5YwTQBdks7bho3Wqv2eAMc81IbMKRjcD60+O1xyTmgCk0OG/dNxUiNMg+bmrXk5B2jmnxWsrn5hxQBWWYdGWl/dno2DWrHpysPmofS4scHFAGX5fGcimFCPu1Zu9OeFDJG+4elQKz4GF5oAjYYHPWnAjHOfyp/8AvqfwpSYwPuSflQBGCM9ad9OaUGIDO0/jVi2lhV1JU8GgCOGCWXkI2PpSGMhiMEY9RWnJexBR5LEH0xULgXQBTII4NAFELzzVu3t9xyTirEVuuMEZNWVUdqAETCjaB+NPA7mkxzSngUCF3YGc81R1TTIdV0mezuFBR1JGfWrYUsc9hU44GR9KAaufGXi7RJdD8R3VnKrKCxZGx1Gayty8xnlSMZr6U+NPg7+2tL+32cQ+2Q/ewP4f/wBVfNskexnRxh1OK3g7o5pKzPOPFWnm0vWdRhGPXFYJ46c16j4h077fpxyPmUZFeYzRtBIyOORUzRpTd0RmijsDRWZugooopDCiiigAooopCENFBoqWAUUUUAFFFFABRRRQAUUUUAFFFFMAooopAFFFFABRRRQAUUUUAFFFFABS5pKKaEKQOwxTlptOQ4Nax3EyxFKVIyAce1dd4D8UXXhvXLe+06V42VxvTPDCuMXk1OhdGVlroUeZGD0Z+jngXxPb+KdFhvYCu8qN6A52mujY4Pt3r4e+CvxMm8LatBb3EmbKRsSZPQV9o6VqFtqdgt9ZP5kMy5GD0rmnHldjWL0NEdM012whNV7SQ/cJyRTr0lYxj1qCiWM/IG9acWpsX+pWnYzQA3PPtTsnPtRilIwKYxvQ5zSNj05pGOKQHNAEUnX3pF9xSv8AepyLmgBMZHXioriFJkI6MKmZSDTCpA3CgDCmjMTlW4HrUYGeorZuYVuV6cisp42WTBoAZt9KRhUjcHFIBmgCIrmg4X7q1JimNx0oA6B41PXFN8lKXcM0u72oARY1XoBThx0oBzRQBKGpWwVNQg8ZzTxyOoxQAyRBJEVrHRSJSnoa2mwoyKpPEDcBl6daAJo1XKjaM/SrTKmM7F6elVIyBLnsKty9Aw+6aAKLKrEnYv5U0RKSBtA/CrEybZDjpTQM0AMWBFOQB+VSAAdAB9KXbilAoAUCg/KacKMjHzUALuAGajB3tigZZsDpUyqAOOtACqMDFPUDnPpSLzTjwKTAjZRKhhcZDKQc/Svl74s+Fn0HXppQuLWdsggdP85r6iAyST17VyvxK8OReIfDkyMoM0SllP4VUHYiauj5RiiZiQvzRgYrg/Gej+VMbiIfL/EBXpVpC1uJ42GPLZlweuQa8+8RagBqTW0hzE/Wt9zngrHCn17UlX9TtTDMSg/dHlTVEDisZI6YyEooopDCiiihjQd6KO9FSMQ0UGipYBRRRQAUUUUAIaKWjHtQAlLRg8e9SKvXg5FNK4rpDB70E88VYitJpj8qHHrV+PTo4oy87gEdga0VIlzMnaW7UbG7jFX5pIVH7oZ+tU5Zd33elDXKCdyI8UUHp70Vm2WgooopAFFFFABRRRQAhpRSGlFUhCilU4NIOKUDJrVCexIOOasW5DMM9KqrmpEyD8tdEGZTV0aclkxXdB+le3/s/wDxVfw/dLoeuyH7K52q7tnH514rpV2FAjc8NwTV+705ZAjQP+8B3BgeaqdPm1MFPldmfoVayRzxpcW0geFhuVl7ip7iTzIweor5S+CXxfvNAvIdC8R5Ngx2xzNycnt/KvqaGWK5tVntJFkgk5Uqc1wTi4s64STRctGzHg1YFZ8JMbj+7WgCCARQMKD0oFJg0xjCKSnt0plADHPNSRjioyQSadG+KAH8ngCoLqRY1680XNz5YxH1rOkJc5Y80AK87P7fSoJQTzUmPlxSfWgCuF9aCKmK88Ux1KjmgCIim1JjNIVzQBqKakXmo16U4MB0oAeQaMGm7+etSLk+9ACPFlcKaov5kZPJrUUbeoxUEyxNklhQBn/aJNtWrZSybzVR2TzNqc1bjYoiRn7zHP4UAPaIjDDuatTsFhUd6iMgadY1PA6027bLgUAI7buaRKRemKcMDmgB1ABJpBk/Sl3YHHWgBxO0c0xQXNCgv96pkAXpQAoUAe9PApBTloAAKQ+lOpn8VDAcBQ6h0ZGGVYYNKtKTjJ9KSYnsfM/xY0RdG8R3LoNkE65X69/518zeJmY6rNzyDxX2x8fdEkvdFi1GJSVtwS4H+favjPxFYSzSy3kafus4PqK3pvQycbEdkyalYNA5AkXp71iTQmGUrIMFenvT7eV7edXQkbetb13bJqln9rtceag5Ud6GrjRy5BzRgipmUhyG4x2ph5GazsaXGUUuKQ9aVrgmFFJRSsVcDRSgUYqbDEooIx2zR0pCuFFPRGc/IC1XLXTJp+WUoPU1Sg2JySKIxnnpTljZzhATW9DpFrEu65uB9Kkku7C0XFuoZh3q1DqzN1L7FHS9P3vuuBhfetJ4LOAFyQRWXc6q8qkL8ufSs95XYfM5+lVzRRPLJmvdamEXbbqAtZM1w0md5PNQk5oqXM0UAJ44NFFFQ22PlENApaKkoKKKKACiiigAooooAQ0oopapBYKVaSlHtVpia0HLUg71Euc0/JraDJaJ4HweOa3LK6IZSTiueQ46VZt5iBzXTBnLVp32Opbyb1SjnDdVYcbTXq/wa+KF74VvItJ112m0liESdjnBPA/pXicF1vUKPvDnNbukXUNxEbW+AZTwCeMH1qatNSV0ZQqODsz72triG/sUubGVZYX6EVbtZdo2N1FfOfwM8bzaHdDw9q7mW1cj7PMx9e38q+iZE3tvRuo6iuCS5dzvg+fVF3IIyKU1UgmKttk596tH26UkNDWpp6U8gHvUTnb16UxjGG7iobiUKu1epoln6heDVbGc560AMYt160DnqKkxRigCPFN2mpsU7AxQBX2mkYZ61MaicCgCPbSFCRxUgGelOCMvJPFAH//Z";						
								}else{
									portrait=str[i].portrait;
								}
								
								 // alert(str[i].agree_num);
							   // alert(JSON.stringify(str[i]));
								div +=
									"<div class='news_post_commentContent strategy_indent ofh' data-id='" + str[i].id + "'>" +
									"<div class='ofh'>" +
									"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");' ></div>" +
									"<div class='comment_user font_14 font_bold fl'>" + str[i].nick_name + "</div>" +
									"</div>" +
									"<div class='game_comment_content'>" +
									"<div class='font_bold color_282828' style='margin-top:0.625rem;margin-bottom: 0.5625rem;'>" +
									"<span>" + str[i].title + "</span>" +
									"</div>" +
									"<div class='font_14 overflow_two color_7a7a7a simHei'>" 
									+ 
									 "<img style='width:100%;display:"+imgToggle+"' src="+imgSrc+">"+
									 "<div class='strategy_content'>"+detail+"</div>"+	
									"</div>" +
									//"<img class='game_strategyImg " + src + "' src='" + config.img + str[i].src + "'/>" +
									"<div class='comment_info ofh'>" +
									"<div class='font_12 color_9e9e9e fl'>" + str[i].add_time + "</div>" +
									"<div class='fr color_9e9e9e comment_imgs'>" +
									 "<span class='thumb'></span>" +
									 "<span class='thumb_num font_14'>" + str[i].agree_num + "</span>" +
									 "<span class='comment_img'></span>" +
									 "<span class='comment_num font_14'>" + str[i].comment_num + "</span>" +
									"</div>" +
									"</div>" +
									"</div>" +

									"</div>"

							}
							$('.news_post_commentContentstra').append(div)
						} else {
							$('.news_post_commentContentstra').append("<div class='no_strategy'></div>")

						}

					} else {

					}
				}
			});
			//		获取游戏攻略结束

			$('.news_post_commentContentstra').on('click','.news_post_commentContent', function() {
				var strategyId = $(this).attr("data-id");
				mui.openWindow({
					url: "../strategy/strategy_details.html",
					id: "../strategy/strategy_details.html",
					extras: {
						strategyId: strategyId
					}
				})
			})
	   }
		

	
		function detail_assess(){	
			commentModule = true;
			pageIndex="assess";
			$(".game_detail_assess").addClass('game_detail_assess_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_strategy_active');
			$('.game_detail_comments').removeClass('hidden').siblings('div').addClass('hidden');
			$.ajax({
				type: "get",
				url: config.data + "game/getGameCommentScore",
				async: true,
				data: {
					gameId: gameId
				},
				success: function(data) {
					 mui('#game_detailContent').pullRefresh().endPulldown(true);
					if(data.state) {
						var s = data.scoreList;
						var total = 0;
						var arr = [];
						for(var i = 0; i < s.length; i++) {
							arr.push(parseInt(s[i].num))
							total += s[i].num
						}
						for(var j = 0; j < arr.length; j++) {

							$(".bar" + j).css('width', arr[j] / total * 10 + "rem")
						}

					} else {

					}
				}
			});

			//		获取游戏评论
			if(!gameComment) {

				gameComment = true;
				$.ajax({
					type: "get",
					url: config.data + "game/getGameCommentById",
					async: true,
					data: {
						gameId: gameId,
						page: 1,
					},
					success: function(data) {
						if(data.state) {
							var com = data.comment;
							var div = '';
							for(var i = 0; i < com.length; i++) {
								if(com[i].state) {
									var ifGood = "good";
								} else {
									var ifGood = "noGood";
								}
								div +=
									"<div class='news_post_commentContent ofh'>" +

									"<div class='ofh'>" +
									"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(com[i].portrait) + ");' ></div>" +
									"<div class='comment_user font_12 font_bold fl'>" + com[i].nick_name + "</div>" +

									"</div>" +
									"<div class='game_comment_content'>" +
									"<div class='comment_content font_14' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'>" + com[i].content + "</div>" +
									"<div class='comment_info ofh'>" +
									"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
									"<div class='fr color_9e9e9e comment_imgs'>" +
									"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "'></span>" +
									"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
									"<span class='comment_img' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'></span>" +
									"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
									"</div>" +
									"</div>" +
									"</div>" +

									"</div>"
							}
							$('.news_post_commentContents').append(div)

						} else {

						}
					}
				});
			}

			//		获取游戏评论结束
		}