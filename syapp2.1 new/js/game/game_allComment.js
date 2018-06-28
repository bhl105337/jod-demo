var page = 0;
var userId = localStorage.getItem("userId") || 22;
var commentId;
var gameId;
var uid; 
var defaultName; 
var targetUserId;
var game_name;
var game_icon;
$(function() {
	
	mui.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		commentId = self.commentId;
		gameId = self.gameId;
		uid =self.uid;
		game_name = self.game_name;
		game_icon = self.game_icon;
		//	获取一级评论单条

		$.ajax({
			type: "get",
			url: config.data + "game/getOneCommentByCommentId",
			async: true,
			data: {
				commentId: commentId
			},
			success: function(data) {

				if(data.state) {
					var com = data.comment;
					$('.news_post_commentContent_head').css("background-image", "url(" + com.portrait + ")")
					$('.comment_user ').text(com.nick_name)
					$('.comment_content').text(com.content)
					$('.comment_summary').attr('data-id',com.game_id);
					if (com.game_icon) {
						$('.comment_summary_img').css('background-image','url(' + config.img + encodeURI(com.game_icon) + ')')
					} else{
						$('.comment_summary_img').css('background-image','url(../../Public/image/link.png)')
					}
					$('.comment_summary_art').text(com.game_name)
					$('.game_commentDay').text(com.add_time)
					defaultName = com.nick_name
					$('.news_secondComment_input').attr('placeholder',"@" + defaultName)
					
				} else {

				}
			}
		});
		
		$('body').on('click','.comment_summary',function(){
			var gameId = $(this).attr('data-id');
			mui.openWindow({
				url:"game_detail.html",
				id:"game_detail.html",
				createNew: true,  
				extras:{
					gameId:gameId,
				}
			})
		})
		
	})

	//	获取一级评论单条结束
	$('body').on('click','.news_post_commentContent',function(){
		defaultName = $(this).find('.nickName').text()
		$('.news_secondComment_input').attr('placeholder',"@" + defaultName)
		targetUserId = $(this).attr('data-userId')
	})
	

	//		点击发布
	$('.publish').click(function() {
		
		var content = $(this).prev().val();
	
		if(content) {
			$.ajax({
				type: "get",
				url: config.data + "game/comment",
				async: true,
				data: {
					"gameId": gameId,
					"parentId": commentId,
					"userId": userId,
					"series": 2,
					"content": content,
					"targetUserId": targetUserId || null,
					"game_name":game_name,
					"game_icon":game_icon
				},
				success: function(data) {
					if(data.state == "1") {
						mui.toast("发送成功")
						$('.news_secondComment_input').val("")
						window.location.reload()
					} else {
						mui.toast("失败")
					}
				}
			});
		} else {
			mui.toast("发送内容不能为空")
		}

	})

	//		点击发布结束

	

})

function up() {
	//		获取二级评论
	
	page++;
	$.ajax({
		type: "get",
		url: config.data + "game/getGameTowComment",
		async: true,
		data: {
			"parentId": commentId,
			"page": page
		},
		success: function(data) {
			if(data.state) {
				
				var com = data.comment;
				
				var div = "";
				for(var i = 0; i < com.length; i++) {
					var ifHidden = com[i].targetNickName || "hidden";
					div +=
						"<div class='news_post_commentContent ofh' style='border-top: 1px solid #e6ebec;margin-top: 0;border-bottom: 0;' data-id='" + com[i].id + "' data-userId='" + com[i].uid + "' >" +
						"<div class='news_post_commentContent_head fl' style='background-image: url("+ com[i].portrait +");'></div>" +
						"<div class='news_post_commentContent_content fl'>" +
						"<div class='comment_user font_12'>" +
						"<span class='nickName'>" + com[i].selfNickName + "</span>" +
						"<span style='color: #7A7A7A;' class='" + ifHidden + "'>回复</span>" +
						"<span class='" + ifHidden + "'>" + ifHidden + "</span>" +
						"</div>" +
						"<div class='comment_content font_14'>" + com[i].content + "</div>" +
						
						"<div class='comment_info ofh'>" +
						"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
						"</div>" +

						"</div>" +
						"</div>"
				}
				$('.news_post_commentContents').append(div);

				if(com.length < 10) {

					mui('.game_post_commentContents').pullRefresh().endPullupToRefresh(true);
					

				} else {

					mui('.game_post_commentContents').pullRefresh().endPullupToRefresh(false);

				}
			} else {
				
			}
		}
	});

	//		获取二级评论结束

}

function down() {
	window.location.reload();
	setTimeout(function() {
		mui('.game_post_commentContents').pullRefresh().endPulldown(true);
	}, 1000);

	//				 mui('#news_content').pullRefresh().endPulldown(true);
}