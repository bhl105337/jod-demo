$(function() {

	mui.plusReady(function() {
		total_height = plus.navigator.getStatusbarHeight() + 45;
		$('.header_box').next().css("margin-top", total_height + 43 + "px");
		$('.game_nav').css("top", total_height + "px");
		$('.game_rank').css("top", total_height + 43 + "px");
		$('.hot_rank').css("top", total_height + 83 + "px")
		mui('.nav_cls_contains').pullRefresh().disablePullupToRefresh();
		$(".game_nav").children('div').eq(0).click(function() {
			mui('.nav_cls_contains').pullRefresh().disablePullupToRefresh();
			up3 = 1;
		})
		$(".game_nav").children('div').eq(1).click(function() {
			mui('.nav_cls_contains').pullRefresh().enablePullupToRefresh();
			up3 = 2;
		})
		$(".game_nav").children('div').eq(2).click(function() {
			mui('.nav_cls_contains').pullRefresh().disablePullupToRefresh();
			up3 = 3;
		})
	})

	//	推荐部分
	//	轮播设置
	$.ajax({
		url: config.data + 'game/carousel',
		type: "GET",
		data: {
			sys: 2
		},
		success: function(data) {
           // alert(JSON.stringify(data));
		   
			var c = data.carousel;
			var divlast = "<div class='mui-slider-item mui-slider-item-duplicate' data-id='" + c[(c.length - 1)].id + "' data-gameId='" + c[(c.length - 1)].game_id + "'>" +
				"<div class='slider_item  home" + (c.length - 1) + " '></div>" +
				"</div>";
			var bb = "home" + (c.length - 1);
			$('.main_slider .mui-slider-group').append(divlast);
			$("." + bb).css("background-image", "url(" + config.img + encodeURI(c[(c.length - 1)].active_img) + ")");
			for(var i = 0; i < c.length; i++) {
				var div = "<div class='mui-slider-item ' data-id='" + c[i].id + "' data-gameId='" + c[i].game_id + "' >" +
					"<div class='slider_item home" + i + " '></div>" +
					"</div>";
				var aa = "home" + i;

				var indicator = "<div class='mui-indicator'></div>";

				$('.main_slider .mui-slider-group').append(div);
				$('.main_slider .mui-slider-indicator').append(indicator);
				//				var gallery = mui('.main_slider');
				//				gallery.slider({
				//					interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
				//				});

				$("." + aa).css("background-image", "url(" + config.img + encodeURI(c[i].active_img) + ")");
				//				$("." + aa).attr('data-id', c[i].game_id);

			}
			$('.main_slider .mui-slider-indicator').children().eq(0).addClass("mui-active");
			var div0 = "<div class='mui-slider-item mui-slider-item-duplicate' data-id='" + c[0].id + "' data-gameId='" + c[0].game_id + "'>" +
				"<div class='slider_item home0'></div>" +
				"</div>";
			$('.main_slider .mui-slider-group').append(div0);
			$(".home0").css("background-image", "url(" + config.img + encodeURI(c[0].active_img) + ")");
			var gallery = mui('.main_slider');
			gallery.slider({
				interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
			});

		}

	})

	$('body').on('click', '.mui-slider-item', function() {
		var gameId = $(this).attr("data-gameId")
		mui.openWindow({
			url: 'game_detail.html',
			id: 'game_detail.html',
			extras: {
				gameId: gameId
			}
		})
	})

	//轮播设置结束

	//活动位开始

	$.ajax({
		type: "get",
		url: config.data + "game/active",
		async: true,
		data: {
			sys: 2
		},
		success: function(data) {
			if(data.state) {
				var active = '';
				var a = data.active;
				for(var i = 0; i < a.length; i++) {
					active +=
						"<div class='game_show' style='background-image: url(" + config.img + encodeURI(a[i].active_img) + ");' data-gameId='" + a[i].game_id + "'></div>"
				}
				$('.game_shows').append(active)
			} else {

			}
		}
	});

	$('body').on('click', '.game_show', function() {
		var id = $(this).attr('data-gameId')

		mui.openWindow({
			url: 'game_detail.html',
			id: 'game_detail.html',
			extras: {
				gameId: id
			}
		})

	})

	//活动位结束

	//专题开始

	$.ajax({
		type: "get",
		url: config.data + "game/getSubject",
		async: true,
		data: {
			sys: 2
		},
		success: function(data) {
			if(data.state) {

				var sub = data.subject;
				$('.game_topicBox').attr('data-id', sub[0].id);
				$('.game_topicBox').find('.game_recommend_topicImg').css('background-image', 'url(' + config.img + encodeURI(sub[0].img) + ')');

				$('.game_topicBox').find('.game_recommend_topicArtstitle').text(sub[0].title);

				$('.game_topicBoxbot').attr('data-id', sub[1].id);
				$('.game_topicBoxbot').find('.game_recommend_topicImg').css('background-image', 'url(' + config.img + encodeURI(sub[1].img) + ')');

				$('.game_topicBoxbot').find('.game_recommend_topicArtstitle').text(sub[1].title);

			} else {

			}
		}
	});

	$('.game_topicBox,.game_topicBoxbot').click(function() {

		mui.openWindow({
			url: 'game_topic.html',
			id: 'game_topic.html',
			extras: {
				subjectId: $(this).attr('data-id'),
				headerArt: $(this).find('.game_recommend_topicArtsart').text()
			}
		})
	})

	//专题结束	

	//标签开始
	$.ajax({
		type: "get",
		url: config.data + "game/getActiveTag",
		async: true,
		data: {
			sys: 2
		},
		success: function(data) {

			if(data.state) {

				var act = data.activeTagGame;
				var div = '';

				for(var i in act) {

					var content = '';
					for(var j = 0; j < Math.floor(act[i].length / 2); j++) {
						var aa = 2 * j;
						var bb = 2 * j + 1;
						content +=

							"<div style='padding-right: 1.0625rem;'>" +
							"<div class='game_detail_content'>" +
							"<div class='game_signTop' data-gameId='" + act[i][aa].gameId + "'>" +
							"<div class='game_signTopimg' style='background-image: url(" + config.img + encodeURI(act[i][aa].game_title_img) + ");'>" +

							"</div>" +
							"<div class='game_signTopart'>" +
							"<div class='fl font_14 overflow'>" + act[i][aa].game_name + "</div>" +
							"<div class='fr font_12 color_green'>" +
							"<span class='game_name_star fl'></span>" +
							"<span>" + act[i][aa].grade + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"<div class='game_signBottom' data-gameId='" + act[i][bb].gameId + "'>" +
							"<div class='game_signBottomimg' style='background-image: url(" + config.img + encodeURI(act[i][bb].game_title_img) + ");'>" +

							"</div>" +
							"<div class='game_signBottomart '>" +
							"<div class='fl font_14 overflow'>" + act[i][bb].game_name + "</div>" +
							"<div class='fr font_12 color_green'>" +
							"<span class='game_name_star fl'></span>" +
							"<span>" + act[i][bb].grade + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>";

					}

					div +=
						"<div class='backgroundColor_white game_signsAll'>" +
						"<div class='ofh' style='height: 2.5rem;line-height: 2.5rem;'>" +
						"<div class='font_14 color_282828 fl'>" + i + "</div>" +
						"<div class='font_12 color_green fr check_more' style='margin-right: 0.9375rem;' data-tagId='" + act[i][0].tagId + "'>查看更多</div>" +
						"</div>" +
						"<div class='game_detail_contents ui_flex_wrapper ui_flex_h'  data-tagId='" + act[i][0].tagId + "'>" +
						content +
						"</div>" +
						"</div>"
				}
				$('.game_signsContent').append(div)
			} else {

			}
		}
	});

	$('body').on('click', '.game_detail_content > div', function() {
		mui.openWindow({
			url: 'game_detail.html',
			id: 'game_detail.html',
			extras: {
				gameId: $(this).attr('data-gameid')
			}
		})
	})

	$('body').on('click', '.check_more', function() {
		var tagId = $(this).attr("data-tagid");
		var tagName = $(this).prev().text();
		mui.openWindow({
			url: "game_classify_list.html",
			id: "game_classify_list.html",
			extras: {
				tagId: tagId,
				tagName: tagName
			}
		})
	})

	//标签结束

	//		底下新加部分

	//		列表部分

	$.ajax({
		type: "get",
		url: config.data + "game/getActiveLenOfTen",
		async: true,
		success: function(data) {
			if(data.state) {
				var g = data.game;

				var list = '';
				for(var i = 0; i < g.length; i++) {
					var signs = '';
					if(g[i].tagList && g[i].tagList !== "null") {
						var result = g[i].tagList.split(",");
						var tagId = g[i].tagIdList.split(",");
						if(result.length > 2) {
							for(var j = 0; j < 3; j++) {
								signs +=
									"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
							}
						} else {
							for(var j = 0; j < result.length; j++) {
								signs +=
									"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
							}
						}

					} else {

					}
					list =
						"<li class='game_list ofh' data-id='" + g[i].id + "'>" +
						"<div class='game_listImg fl' style='background-image: url(" + config.img + encodeURI(g[i].icon) + ");'></div>" +
						"<div class='fl' style='margin-top: 1.25rem;margin-left: 0.875rem;'>" +
						"<div class='font_14'>" + g[i].game_name + "</div>" +
						"<div class='font_12'>" +
						"<div class='ofh game_recommend_stars'>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_starScore fl color_green'>" + g[i].grade + "</div>" +
						"</div>" +
						"</div>" +
						"<div class='font_12 color_green'>" +
						signs +

						"</div>" +
						"</div>" +
						"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>" +
						"</li>";
					if(i < 3) {
						$('.remommend_listFirst').append(list)
					} else if(i < 6) {
						$('.remommend_listSecond').append(list)
					} else {
						$('.remommend_listThird').append(list)
					}

				}

				$('.game_recommend_stars').each(function() {

					var score = $(this).find('.game_recommend_starScore').eq(0).text()
					var starNum = Math.round(score)

					if(starNum % 2 == 0) {

						var starFinal = (starNum / 2 - 1);
						$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
						$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
					} else {
						var starFinal = ((starNum - 1) / 2)
						$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
						$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
					}
				})

			} else {

			}
		}
	});

	//		图片部分

	$.ajax({
		type: "get",
		url: config.data + "game/getActiveLenOfTow",
		async: true,
		success: function(data) {
			if(data.state) {
				var g = data.game;
				$('.remommend_imgFirst').css('background-image', 'url(' + config.img + encodeURI(g[0].game_title_img) + ')').attr("data-id", g[0].id)
				$('.remommend_imgSecond').css('background-image', 'url(' + config.img + encodeURI(g[1].game_title_img) + ')').attr("data-id", g[1].id)

			} else {

			}
		}

	});

	$('.remommend_imgFirst,.remommend_imgSecond').click(function() {
		var gameId = $(this).attr('data-id')
		mui.openWindow({
			url: "game_detail.html",
			id: "game_detail.html",
			extras: {
				gameId: gameId
			}
		})
	})

	//		底下新加部分结束

	//	推荐部分结束	

	//	排行部分开始
	var height = $('.hot_rank').height();
	$('.game_ranks').css('padding-top', (height + 40))
	$('.game_rank').children().eq(0).children().css('background-color', 'white')
	sort = "sort";
	getRank(sort);
	$('.game_rank').children().click(function() {
		mui('.nav_cls_contains').pullRefresh().refresh(true);
		page = 1;
		sort = $(this).attr('data-sort')
		var name = $(this).attr('data-name')
		$(this).children().addClass('border_green color_green').css('background-color', 'white')
		$(this).siblings().children().removeClass('backgroundColor_white border_green color_green').css('background-color', '#E7EAEC')
		$('.hot_rank').css('background-image', 'url(../../Public/image/' + name + '.png)')
		$('.game_lists').children().remove()
		getRank(sort);
	})
	$('.game_rank').children().eq(0).click(function() {
		up2 = 1;

	})
	$('.game_rank').children().eq(1).click(function() {
		up2 = 2;

	})
	$('.game_rank').children().eq(2).click(function() {
		up2 = 3;

	})

	$('body').on('click', '.tag', function(event) {
		event.stopPropagation();
		var tagId = $(this).attr("data-id");
		var tagName = $(this).text();
		mui.openWindow({
			url: "game_classify_list.html",
			id: "game_classify_list.html",
			extras: {
				tagId: tagId,
				tagName: tagName
			}
		})
	})

	$('.first, .second, .third').click(function() {
		mui.openWindow({
			url: "game_detail.html",
			id: "game_detail.html",
			extras: {
				gameId: $(this).attr('data-id')
			}
		})
	})

	$('body').on('click', '.game_list', function() {
		mui.openWindow({
			url: "game_detail.html",
			id: "game_detail.html",
			extras: {
				gameId: $(this).attr('data-id')
			}
		})
	})

	//	排行部分结束

	//	分类开始	

	//		游戏分类
	$.ajax({
		type: "get",
		url: config.data + "game/getGameCls",
		async: true,
		success: function(data) {
			if(data.state) {
				var cls = data.cls;
				var div = '';
				for(var i = 0; i < cls.length; i++) {
					div +=
						"<div class='game_classify_name ofh fl' data-id='" + cls[i].id + "' data-type='" + cls[i].type + "'>" +
						"<div class='game_classify_nameImg fl' style='background-image: url(" + config.img + encodeURI(cls[i].icon) + ");'></div>" +
						"<div class='game_classify_nameArt fl font_14 color_282828'>" + cls[i].cls_name + "</div>" +
						"</div>"
				}
				$('.game_classify_names').append(div)
			} else {

			}
		}
	});

	//		游戏分类结束

	//		应用分类

	$.ajax({
		type: "get",
		url: config.data + "game/getAppCls",
		async: true,
		success: function(data) {
			if(data.state) {
				var cls = data.cls;
				var div = '';
				for(var i = 0; i < cls.length; i++) {
					div +=
						"<div class='apply_classify_name ofh fl' data-id='" + cls[i].id + "' data-type='" + cls[i].type + "'>" +
						"<div class='game_classify_nameImg fl' style='background-image: url(" + config.img + encodeURI(cls[i].icon) + ");'></div>" +
						"<div class='game_classify_nameArt fl font_14 color_282828'>" + cls[i].cls_name + "</div>" +
						"</div>"
				}
				$('.apply_classify_names').append(div)
			} else {

			}
		}
	});

	$('body').on('click', '.game_classify_name,.apply_classify_name', function() {
		mui.openWindow({
			url: "game_classify_sign.html",
			id: "game_classify_sign.html",
			extras: {
				clsId: $(this).attr('data-id'),
				name: $(this).children('.game_classify_nameArt').text()
			}
		})
	})

	//		应用分类结束

	//	分类结束

	$('.search').click(function() {
		mui.openWindow({
			url: "game_search.html",
			id: "game_search.html"
		})
	})
	$('.bell').click(function() {
		$.ajax({
			type: "get",
			url: config.data + "news/cancelMessage",
			async: true,
			data: {
				userId: userId
			},
			success: function(data) {
				if(data.state) {

				} else {

				}
			}
		});
		mui.openWindow({
			url: "../news/news_center.html",
			id: "../news/news_center.html"
		})
	})

	$(".game_nav>div").click(function() {
		$(this).addClass("color_green border_bottom").siblings().removeClass("color_green border_bottom");
		$("." + $(this).attr("data-page")).removeClass("hidden").siblings("").addClass("hidden")
		$('html, body').animate({
			scrollTop: 0
		}, 'normal');
	})
	//		$('.game_shows > div').click(function() {
	//			mui.openWindow({
	//				url: "game_detail.html",
	//				id: "game_detail.html"
	//			})
	//		})

	$('.game_detail_contents > div').click(function() {
		mui.openWindow({
			url: "game_detail.html",
			id: "game_detail.html"
		})
	})

	//	$('.check_more').click(function() {
	//		mui.openWindow({
	//			url: "game_classify_sign.html",
	//			id: "game_classify_sign.html"
	//		})
	//	})

})

function getRank(sort) {
	$.ajax({
		type: "get",
		url: config.data + "game/getGameByMsg",
		async: true,
		data: {
			sys: 2,
			page: 1,
			type: '',
			sort: sort,
		},
		success: function(data) {
			var g = data.game;
			if(data.state) {
				var list = '';
				for(var i = 0; i < g.length; i++) {
					if(i < 3) {
						$('.first').attr('data-id', g[0].id)
						$('.first .y_listImg').css('background-image', 'url(' + config.img + encodeURI(g[0].icon) + ')')
						$('.first .y_listName').text(g[0].game_name)
						$('.first .game_recommend_starScore').text(g[0].grade)
						$('.second').attr('data-id', g[1].id)
						$('.second .y_listImg').css('background-image', 'url(' + config.img + encodeURI(g[1].icon) + ')')
						$('.second .y_listName').text(g[1].game_name)
						$('.second .game_recommend_starScore').text(g[1].grade)
						$('.third ').attr('data-id', g[2].id)
						$('.third  .y_listImg').css('background-image', 'url(' + config.img + encodeURI(g[2].icon) + ')')
						$('.third  .y_listName').text(g[2].game_name)
						$('.third  .game_recommend_starScore').text(g[2].grade)
					} else {
						var signs = '';
						if(g[i].tagList && g[i].tagList !== "null") {
							var result = g[i].tagList.split(",");
							var tagId = g[i].tagId.split(",");
							if(result.length > 2) {
								for(var j = 0; j < 3; j++) {
									signs +=
										"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
								}
							} else {
								for(var j = 0; j < result.length; j++) {
									signs +=
										"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
								}
							}

						} else {

						}

						list +=
							"<li class='game_list ofh' data-id='" + g[i].id + "'>" +
							"<div class='color_9e9e9e fl game_listScore'>" + (i + 1) + "</div>" +
							"<div class='game_listImg fl' style='background-image: url(" + config.img + encodeURI(g[i].icon) + ");'></div>" +
							"<div class='fl' style='margin-top: 1.25rem;margin-left: 0.875rem;'>" +
							"<div class='font_14'>" + g[i].game_name + "</div>" +
							"<div class='font_12'>" +
							"<div class='ofh game_recommend_stars'>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_star fl'></div>" +
							"<div class='game_recommend_starScore fl color_green'>" + g[i].grade + "</div>" +
							"</div>" +
							"</div>" +
							"<div class='font_12 color_green all_signs'>" +
							signs +

							"</div>" +
							"</div>" +
							"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>" +
							"</li>"
					}
				}
				$('.game_lists').append(list)
				$('.game_recommend_stars').each(function() {

					var score = $(this).find('.game_recommend_starScore').eq(0).text()
					var starNum = Math.round(score)

					if(starNum % 2 == 0) {

						var starFinal = (starNum / 2 - 1);
						$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
						$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
					} else {
						var starFinal = ((starNum - 1) / 2)
						$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
						$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
					}
				})
			} else {

			}
		}
	});

}

function getRankup(page, sort) {

	$.ajax({
		type: "get",
		url: config.data + "game/getGameByMsg",
		async: true,
		data: {
			sys: 2,
			page: page,
			type: '',
			sort: sort,
		},
		success: function(data) {
			var g = data.game;
			if(data.state) {
				var list = '';
				for(var i = 0; i < g.length; i++) {
					var signs = '';
					if(g[i].tagList && g[i].tagList !== "null") {
						var result = g[i].tagList.split(",");
						var tagId = g[i].tagId.split(",");

						if (result.length > 2) {
							for(var j = 0; j < 3; j++) {
								signs +=
									"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
							}
						} else{
							for(var j = 0; j < result.length; j++) {
								signs +=
									"<div class='fl tag font_12 border_green border_radius_twenty' data-id='" + tagId[j] + "'>" + result[j] + "</div>"
							}
						}
					} else {

					}
					list +=
						"<li class='game_list ofh' data-id='" + g[i].id + "'>" +
						"<div class='color_9e9e9e fl game_listScore'>" + (i + 1 + (page - 1) * 20) + "</div>" +
						"<div class='game_listImg fl' style='background-image: url(" + config.img + encodeURI(g[i].icon) + ");'></div>" +
						"<div class='fl' style='margin-top: 1.25rem;margin-left: 0.875rem;'>" +
						"<div class='font_14'>" + g[i].game_name + "</div>" +
						"<div class='font_12'>" +
						"<div class='ofh game_recommend_stars'>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_star fl'></div>" +
						"<div class='game_recommend_starScore fl color_green'>" + g[i].grade + "</div>" +
						"</div>" +
						"</div>" +
						"<div class='font_12 color_green'>" +
						signs +

						"</div>" +
						"</div>" +
						"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>" +
						"</li>"

				}
				$('.game_lists').append(list)
				$('.game_recommend_stars').each(function() {

					var score = $(this).find('.game_recommend_starScore').eq(0).text()
					var starNum = Math.round(score)

					if(starNum % 2 == 0) {

						var starFinal = (starNum / 2 - 1);
						$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
						$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
					} else {
						var starFinal = ((starNum - 1) / 2)
						$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
						$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
					}
				})
				if(g.length < 20) {

					mui('.nav_cls_contains').pullRefresh().endPullupToRefresh(true);

				} else {

					mui('.nav_cls_contains').pullRefresh().endPullupToRefresh(false);

				}

			} else {

			}
		}
	});
}