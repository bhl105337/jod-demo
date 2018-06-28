var subjectId;
$(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		subjectId = self.subjectId;
		
		

		$.ajax({
			type: "get",
			url: config.data + "game/getSubjectById",
			async: true,
			data: {
				subjectId: subjectId,
				sys: 2,
				page: 1
			},
			success: function(data) {
				if(data.state) {
					var sub = data.subject;
					$('.game_topicsHeadimg').css('background-image', 'url(' + config.img + encodeURI(sub.img) + ')')
					
					
					$('.game_topicsHeadart').text(sub.detail)
					
					
				} else {

				}
			}
		});
		
		
	})
	$('body').on('click','.game_topicsContent',function(){
		mui.openWindow({
			url:"game_detail.html",
			id:"game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	})
})