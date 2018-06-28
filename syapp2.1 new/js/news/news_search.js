var val;
$(function(){
	
	$('.search_img').click(function(){
		val = $('.search_bar').val().replace(/[&\|\\\*^%$#@\-]/g,"");
		$('.search_lists').children().remove();
		
		if(val){
			
			pages = 1
			$.ajax({
				type:"get",
				url:config.data + "news/searchNewsByGameName",
				async:true,
				data:{
					sys:2,
					msg:val,
					page:1
				},
				success:function(data){
					
					if (data.state) {
						
						var  div = '';
						var g = data.newsList;
						if (g.length > 0) {
							for (var i = 0; i < g.length; i++) {
								div+=
				
								"<div class='search_list font_12 simHei' data-id='"+ g[i].id +"'>"+
									
									"<div class='fl overflow' style='margin-left: 1rem; width: 24em;'>"+ g[i].title +"</div>"+
								"</div>"
							}
							$('.search_lists').append(div)
						} else{
							
							var no_content = "<div class='no_content tac'>没有搜到任何内容</div>"
							$('.search_lists').append(no_content)
						}
						
					} else{
						mui.toast("搜索失败")
					}
				}
			});
		}
	})
	
	
	$('body').on('click','.search_list',function(){
		mui.openWindow({
			url:"news_post.html",
			id:"news_post.html",
			extras:{
				newsId:$(this).attr('data-id')
			}
		})
	})
})
