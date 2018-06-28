var userId = localStorage.getItem("userId") || 22;
$(function(){
//	点击星星
	$('.stars').children().click(function(){
		
		$('.stars').children().removeClass('staract')
		$(this).addClass('staract').prevAll().addClass('staract')
	})
	
//	点击星星结束
	
	mui.plusReady(function(){
		total_height = plus.navigator.getStatusbarHeight()+ 45;

		
		
		var self = plus.webview.currentWebview();
		var gameId = self.gameId;
		var icon = self.icon;
		var gameName = self.gameName;
		var game_icon = self.game_icon;
		$('#textarea').css("top",total_height  + "px")
		$('.score_game').css("top",total_height + "px")
		$('.score_gameImg').css('background-image','url('+ config.img + encodeURI(game_icon) +')');
		$('.score_gameName').text(gameName)
		
		$('.publish').click(function(){
			var score = $('.staract').length * 2;
			var content = $('#textarea').val();
			if(content == ''){
				mui.toast('请输入内容')
			}else{
				if (score == 0) {
					mui.toast("请先评分")
				} else{
					$.ajax({
						type:"get",
						url:config.data + "game/comment",
						async:true,
						data:{
							gameId:gameId,
							userId:userId,
							score:score,
							content:content,
							series:1,
							game_name:gameName,
							game_title_img:game_icon
						},
						success:function(data){							
							if (data.state) {
								mui.toast('评论成功');
								mui.back();
								mainPage = plus.webview.currentWebview().opener();
								mui.fire(mainPage,"assess",{});
							} else{
								
							}
						}
					});
				}
			}
			
		})
		
	})
})