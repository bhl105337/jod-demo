var clsId;
var page = 0;
var name;
$(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		clsId = self.clsId;
		name = self.name;
		$('.game_nameHeader').text(name)
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
})
