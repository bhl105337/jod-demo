$(function() {
	if(!window.localStorage.getItem("rememberUser")) {
		var img = "../../Public/image/morentouxiang.png";
		$(".me_img").css("background-image", "url(" + img + ")");
		$('.me_username').text("未登录");

		$(document.body).on('tap', function() {
			mui.openWindow({
				url: 'login.html',
				id: 'login.html'
			})
		})
	} else {
		$('.me_share').click(function(){
			openShare()
		})
		var userInfostr = window.localStorage.getItem("userInfo");
		var userInfojson = eval('(' + userInfostr + ')');
		var id = userInfojson.id;
		$.ajax({
			type: "get",
			url: config.data + "users/getUserMsgById",
			async: true,
			data: {
				"id": userInfojson.id
			},
			success: function(data) {
				if(data.state) {
					$('.onlyId').text("ID:" + data.user.only_id);
					if(data.user.portrait) {
						img = data.user.portrait;
					} else {
						img = "../../Public/image/morentouxiang.png"
					}
					$(".me_img").css("background-image", "url(" + img + ")")
					$('.me_username').text(data.user.nick_name);
				} else {
					
				}
			}
		});

		$('.me_img').click(function() {
			mui.openWindow({
				url: 'profile.html',
				id: 'profile.html'
			})
		})

		$('.me_newscenter').children("li").eq(0).click(function() {
			mui.openWindow({
				url: "../news/news_center.html",
				id: "../news/news_center.html",
				
			})
		})
		$('.me_play').children("li").eq(0).click(function() {
			mui.openWindow({
				url: "me_game.html",
				id: "me_game.html"
			})
		})
		$('.me_play').children("li").eq(1).click(function() {
			mui.openWindow({
				url: "me_works.html",
				id: "me_works.html"
			})
		})
		$('.me_play').children("li").eq(2).click(function() {
			mui.openWindow({
				url: "me_collection.html",
				id: "me_collection.html"
			})
		})

		$('.me_us').children("li").eq(1).click(function() {
			mui.openWindow({
				url: "about_us.html",
				id: "about_us.html"
			})
		})
		$('.me_us').children("li").eq(0).click(function() {
			mui.openWindow({
				url: "me_feedBack.html",
				id: "me_feedBack.html"
			})
		})
		$('.me_headerset').click(function() {
			mui.openWindow({
				url: "set_list.html",
				id: "set_list.html"
			})
		})

	}


})

