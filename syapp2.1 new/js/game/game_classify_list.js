var page = 1;
var tagId;
var tagName;
$(function(){
	
	
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		tagId = self.tagId;
		tagName = self.tagName;
		
		getGamebySign(tagId,tagName)
	})
	
	$('body').on('click','.tag',function(){
		$('.game_lists').children().remove();
		tagId = $(this).attr('data-id');
		tagName = $(this).text();
		getGamebySign(tagId,tagName)
	})
	
	
	$('body').on('click','.game_list',function(){
		mui.openWindow({
			url:"game_detail.html",
			id:"game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	})
	
	mui.init({
				swipeBack: true,
				pullRefresh: {
					container: ".game_listSign", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
					up: {
						height: 50, //可选.默认50.触发上拉加载拖动距离
						auto: false, //可选,默认false.自动上拉加载一次
						contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
						contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: up //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					},
					down: {
						style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
						color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
						height: '50px', //可选,默认50px.下拉刷新控件的高度,
						range: '100px', //可选 默认100px,控件可下拉拖拽的范围
						offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
						auto: false, //可选,默认false.首次加载自动上拉刷新一次
						callback: down //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					}

				}

			})
			
	
	
})
			function up(){
				
				page++;
				
				$.ajax({
					type:"get",
					url:config.data + "game/getGameByTag",
					async:true,
					data:{
						tagId:tagId,
						sys:2,
						page:page
					},
					success:function(data){
						if (data.state) {
							var g = data.game;
							var li = '';
							for (var i = 0; i < g.length; i++) {
								var signs = '';
								var result= g[i].tagList.split(",");
								var resultId = g[i].tagId.split(",");
								for (var j = 0; j < result.length; j++) {
										signs +=
											"<div class='fl tag font_12 border_green border_radius_twenty' data-id='"+ resultId[j] +"'>"+ result[j] +"</div>"
								}
								li +=
								 		"<li class='game_list ofh' data-id="+ g[i].id +">"+
											"<div class='color_9e9e9e fl game_listScore'>"+ ((page-1)*20 + i+1) +"</div>"+
											"<div class='game_listImg fl' style='background-image: url("+ config.img + encodeURI(g[i].game_title_img) +");'></div>"+
											"<div class='fl' style='margin-top: 1rem;margin-left: 0.875rem;'>"+
												"<div class='font_14' style='width: 6em;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;'>"+ g[i].game_name +"</div>"+
												"<div class='font_12'>"+
													"<div class='ofh game_recommend_stars'>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_star fl'></div>"+
														"<div class='game_recommend_starScore fl color_green'>"+ g[i].grade +"</div>"+
													"</div>"+
												"</div>"+
												"<div class='font_12 color_green'>"+
												signs +
								
												"</div>"+
											"</div>"+
											"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>"+
										"</li>"
							}
							
							$('.game_lists').append(li)
							
							$('.game_recommend_stars').each(function(){
				
								var score =  $(this).find('.game_recommend_starScore').eq(0).text()
								var starNum = Math.round(score)
								
								
								if (starNum % 2 == 0) {
									
									var starFinal = (starNum / 2 - 1 ); 
									$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
									$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
								} else{
									var starFinal = ((starNum - 1)/2)
									$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
									$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
								}
							})
							
							if (g.length < 20) {
								mui('.game_listSign').pullRefresh().endPullupToRefresh(true);
							} else{
								mui('.game_listSign').pullRefresh().endPullupToRefresh(false);
							}
	
						} else{
							
						}
					}
				});
				
				
			}
			
			function down() {
				window.location.reload();
				setTimeout(function() {
					mui('.game_listSign').pullRefresh().endPulldown(true);
				}, 1000);

				//				 mui('#news_content').pullRefresh().endPulldown(true);
			}



function getGamebySign(tagId,tagName){
	$('.game_nameHeader').text(tagName)
	$.ajax({
			type:"get",
			url:config.data + "game/getGameByTag",
			async:true,
			data:{
				tagId:tagId,
				sys:2,
				page:1
			},
			success:function(data){
				if (data.state) {
					var g = data.game;
					var li = '';
					for (var i = 0; i < g.length; i++) {
						var signs = '';
						var result= g[i].tagList.split(",");
						var resultId = g[i].tagId.split(",");
						if (result.length <= 3) {
							for (var j = 0; j < result.length; j++) {
								signs +=
									"<div class='fl tag font_12 border_green border_radius_twenty' data-id='"+ resultId[j] +"'>"+ result[j] +"</div>"
							}
						} else{
							for (var j = 0; j < 3; j++) {
								signs +=
									"<div class='fl tag font_12 border_green border_radius_twenty' data-id='"+ resultId[j] +"'>"+ result[j] +"</div>"
							}
						}
						
						li +=
						 		"<li class='game_list ofh' data-id="+ g[i].id +">"+
									"<div class='color_9e9e9e fl game_listScore'>"+ (i+1) +"</div>"+
									"<div class='game_listImg fl' style='background-image: url("+ config.img + encodeURI(g[i].game_title_img) +");'></div>"+
									"<div class='fl' style='margin-top: 1rem;margin-left: 0.875rem;'>"+
										"<div class='font_14' style='width: 6em;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;'>"+ g[i].game_name +"</div>"+
										"<div class='font_12'>"+
											"<div class='ofh game_recommend_stars'>"+
												"<div class='game_recommend_star fl'></div>"+
												"<div class='game_recommend_star fl'></div>"+
												"<div class='game_recommend_star fl'></div>"+
												"<div class='game_recommend_star fl'></div>"+
												"<div class='game_recommend_star fl'></div>"+
												"<div class='game_recommend_starScore fl color_green'>"+ g[i].grade +"</div>"+
											"</div>"+
										"</div>"+
										"<div class='font_12 color_green'>"+
										signs +
						
										"</div>"+
									"</div>"+
									"<div class='fr game_listDownload font_14 color_white backgroundColor_green tac'>下载</div>"+
								"</li>"
					}
					
					$('.game_lists').append(li)
					$('.game_recommend_stars').each(function(){
		
						var score =  $(this).find('.game_recommend_starScore').eq(0).text()
						var starNum = Math.round(score)
						
						
						if (starNum % 2 == 0) {
							
							var starFinal = (starNum / 2 - 1 ); 
							$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_active')
							$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
						} else{
							var starFinal = ((starNum - 1)/2)
							$(this).children('.game_recommend_star').eq(starFinal).prevAll('.game_recommend_star').addClass('game_list_star_active')
							$(this).children('.game_recommend_star').eq(starFinal).addClass('game_list_star_half')
						}
					})
					
				} else{
					
				}
			}
		});
}
		
