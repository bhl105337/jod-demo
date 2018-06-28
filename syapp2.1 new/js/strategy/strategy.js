$(function(){
//	$('body').click(function(){
//		mui.openWindow({
//			url:"strategy_add.html"
//		})
//	})
	

	window.addEventListener('refresh',function(event){
	    down()
	});

//	获取顶部搜索
	$.ajax({
		type:"get",
		url:config.data + "strategy/getSearchGame",
		async:true,
		data:{
			sys:2
		},
		success:function(data){
			if (data.state) {
				var li = "";
				var gl = data.gameList;
				for (var i = 0; i < gl.length; i++) {
					li+=
						"<li class='tacI'>"+
							"<div  style='width: 3rem;'>"+
								"<div class='strategy_headImg' style='background-image: url(" + config.img + encodeURI(gl[i].icon) + ");' ></div>"+
								"<div class='font_12 color_282828 strategy_headImgart'>"+ gl[i].game_name +"</div>"+
							"</div>"+
						"</li>"
				}
				$('.strategy_headImgs').append(li)
			} else{
				
			}
		}
	});
	
	$('body').on('click','.tacI',function(){
		var msg = $(this).find('.strategy_headImgart').text();
		mui.openWindow({
			url:"strategy_search_result.html",
			id:"strategy_search_result.html",
			extras:{
				msg:msg	
			}
		})
	})
	
//	获取顶部搜索结束

//	d导航栏点击
	$('.strategy_nav').children().eq(0).click(function(){
		sort = "comment_num"
	})
	$('.strategy_nav').children().eq(1).click(function(){
		sort = "add_time"
	})
	$('.strategy_nav').children().eq(2).click(function(){
		sort = "essence"
	})
	$('.strategy_nav').children().click(function(){
		$('.strategy_contents').children().remove();
		$(this).addClass('color_green border_bottom').siblings().removeClass('color_green border_bottom');
		page = 0;
		mui('.strategy').pullRefresh().refresh(true);
		up()
		
	})
	
//	d导航栏点击结束

	$('body').on('click','.strategy_content',function(){
		var strategyId = $(this).attr('data-id');
		var browseNum = $(this).find('.browseNum').eq(0).text();
//		add(strategyId,"browse_num");
		$(this).find('.browseNum').eq(0).text(parseInt(browseNum)+1) 
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:strategyId,
				anchor: true
			}
		})
	})
	



//	评论
	$('body').on('click','.comment_img',function(event){
		event.preventDefault();
		var strategyId = $(this).attr('data-id');
	
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:strategyId,
				anchor: false
			}
		})
	})
	
//	评论end
	$('.search').click(function(){
		mui.openWindow({
			url:"strategy_search.html",
			id:"strategy_search.html"
		})
	})
	$('.bell').click(function(){
		$.ajax({
			type:"get",
			url:config.data + "news/cancelMessage",
			async:true,
			data:{
				userId:userId
			},
			success:function(data){
				if (data.state) {
					
				} else{
					
				}
			}
		});
		mui.openWindow({
			url:"../news/news_center.html",
			id:"../news/news_center.html"
		})
	})
	
	
	
	
	$('.pen').click(function(){
		if(window.localStorage.getItem("rememberUser")){
			mui.openWindow({
				url:"strategy_add.html",
				id:"strategy_add.html"
			})
		}else{
			mui.openWindow({
				url:"../user/login.html",
				id:"../user/login.html"
			})
		}
		
	})
})

//添加浏览,点赞,评论数
//function add(strategyId,numType){
//	$.ajax({
//		type:"get",
//		url:config.data+ "strategy/addNum",
//		async:true,
//		data:{
//			strategyId:strategyId,
//			numType:numType,
//			num:0
//		},
//		success:function(data){
//			if (data.state) {
//				
//
//			} else{
//				
//			}
//		}
//	});
//}

//添加浏览,点赞,评论数结束