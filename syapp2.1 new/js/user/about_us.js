$(function(){
	mui.plusReady(function(){
		var backHeight = plus.navigator.getStatusbarHeight();
		var finalHeight = parseInt(backHeight) + 11 + "px";
		$('.back').css('top',finalHeight)
		
	})
	$('.back').click(function(){
		mui.back()
	})
})
