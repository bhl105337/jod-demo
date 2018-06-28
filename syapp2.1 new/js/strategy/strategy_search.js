$(function() {
	$('body').on('input', 'input[type=text],.search_bar', function() {
		$('.search_lists').children().remove()
		var content = $('.search_bar').val()
		if(content) {
			
			$.ajax({
				type: "get",
				url: config.data + "strategy/getStrategyGameNameByMsg",
				async: true,
				data: {
					msg: content
				},
				success: function(data) {
					if(data.state) {
						var gn = data.gameName;
						var div = '';
						for(var i = 0; i < gn.length; i++) {
							div +=
								"<div class='search_list'>" +
								"<div class='fl' style='margin-left: 1rem;'>" + gn[i].game_name + "</div>" +
								"</div>"
						}
						$('.search_lists').append(div)
					} else {

					}
				}
			});
		}
	})

	$("body").on('click','.search_list',function(){
		var msg = $(this).children('div').text();
		mui.openWindow({
			url:"strategy_search_result.html",
			id:"strategy_search_result.html",
			extras:{
				msg:msg
			}
		})
	})
	
	$('.search_img').click(function(){
		var msg = $(this).siblings('div').children('.search_bar').val();
		if (msg) {
			mui.openWindow({
				url:"strategy_search_result.html",
				id:"strategy_search_result.html",
				extras:{
					msg:msg
				}
			})
		} else{
			mui.toast("内容不能为空")
		}
	})
	
})