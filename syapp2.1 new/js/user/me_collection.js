var news = 1;
$(function(){
	$('.me_collectionNav > span').click(function(){
		var t =$(this)
		t.css('border-bottom','4px solid #7fcadf').addClass('color_green').siblings('span').css('border-bottom','1px solid #E6EBEC').removeClass('color_green')
		
		$("."+t.attr("data-class")).removeClass('hidden')
		$("."+t.siblings('span').attr("data-class")).addClass('hidden')
		
	})
	$('.me_collectionNav').children('span').eq(0).click(function(){
		$('.news_art_list').removeClass('hidden')
		$('.strategy_contents').addClass('hidden').children().remove();
		page = 0;
		news = 1;
		mui('.me_collections').pullRefresh().refresh(true);
		up()
	})
	$('.me_collectionNav').children('span').eq(1).click(function(){		
		$('.strategy_contents').removeClass('hidden')
		$('.news_art_list').addClass('hidden').children().remove();
		page = 0;
		news = 0;
		mui('.me_collections').pullRefresh().refresh(true);
		up();
		
	})
	
	$('body').on('click','.news_art',function(){
		mui.openWindow({
			url:"../news/news_post.html",
			id:"../news/news_post.html",
			extras:{
				newsId:$(this).attr('data-id'),
				gameId:$(this).attr('data-gameId')
			}
		})
	})
	
	$('body').on('click','.strategy_content',function(){
		mui.openWindow({
			url:"../strategy/strategy_details.html",
			id:"../strategy/strategy_details.html",
			extras:{
				strategyId: $(this).attr('data-id'),
				anchor:true
			}
		})
	})
	
})