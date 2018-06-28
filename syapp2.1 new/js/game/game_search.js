var val;
$(function(){
	
	$('.search_img').click(function(){
		val = $('.search_bar').val().replace(/[&\|\\\*^%$#@\-]/g,"");
		$('.search_lists').children().remove();
		
		if(val){
			pages = 1
			$.ajax({
				type:"get",
				url:config.data + "game/searchGameByMsg",
				async:true,
				data:{
					sys:2,
					msg:val,
					sort:"sort",
					page:1
				},
				success:function(data){
					
					if (data.state) {
						var  div = '';
						var g = data.game;
						if (g.length > 0) {
							for (var i = 0; i < g.length; i++) {
								div+=
				
								"<div class='search_list font_12 simHei' data-id='"+ g[i].id +"'>"+
									"<span class='search_liastImg fl' style='background-image: url("+ config.img + encodeURI(g[i].icon) +"'></span>"+
									"<div class='fl' style='margin-left: 1rem;'>"+ g[i].game_name +"</div>"+
								"</div>"
							}
							$('.search_lists').append(div)
						} else{
							
						}
						
					} else{
						var no_content = "<div class='no_content tac '>没有搜到任何内容</div>"
							$('.search_lists').append(no_content)
					}
				}
			});
		}
	})
	
	
	$('body').on('click','.search_list',function(){
		mui.openWindow({
			url:"game_detail.html",
			id:"game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	})
})
