var id = userInfojson.id || 0;

$(function() {
	var dataURLup;
	$.ajax({
		type: "get",
		url: config.data + "users/getUserMsgById",
		async: true,
		data: {
			id: id
		},
		success: function(data) {
			if(data.state) {
				var u = data.user;
				var sex_art;
				if(u.sex == "0") {
					sex_art = "保密"
				} else if(u.sex == "1") {
					sex_art = "男"
				} else {
					sex_art = "女"
				}

				$('.personal_id').val(u.id);
				$('.personal_name').val(u.nick_name);
				$('.sexArt').text(sex_art);
				$('.personal_bir').val(u.birthday);
				if(u.portrait){
					$('.profile_header').css('background-image', 'url('+ u.portrait + ')')
				}
			} else {

			}
		}
	});

	//	头像
	var pc = new PhotoClip('#clipArea', {
		size: 260,
		outputSize: 640,
		//adaptive: ['60%', '80%'],
		file: '#file',

		ok: '#clipBtn',
		//img: 'img/mm.jpg',
		loadStart: function() {
			console.log('开始读取照片');
			$('.head_cuts').removeClass('hidden')
		},
		loadComplete: function() {
			console.log('照片读取完成');

		},
		done: function(dataURL) {
			//			console.log(dataURL);
			dataURLup = dataURL
			$('#profile_header').css('background-image', 'url(' + dataURL + ')')
			$('.head_cuts').addClass('hidden')

		},
		fail: function(msg) {
			alert(msg);
		}
	});

	//头像结束

	//	填写性别
	$('.sex').click(function() {
		mui('.mui-popover').popover('toggle', document.getElementById("Popover"));
		var list = document.querySelector('.mui-table-view.mui-table-view-radio');
		var sexnum;
		list.addEventListener('selected', function(e) {
			//			console.log("当前选中的为：" + e.detail.el.innerText);
			//			console.log(typeof(e.detail.el.innerText))

			var sex = e.detail.el.innerText.replace(/[\r\n]/g, "")
			if(sex == "保密") {
				var sexnum = "0";
			} else if(sex == "男") {
				sexnum = "1";
			} else if(sex == "女") {
				sexnum = "2";
			}
			$('.sexArt').text(sex)
			$.ajax({
				type: "get",
				url: config.data + "users/updateSex",
				async: true,
				data: {
					"id": id,
					"sex": sexnum
				},
				success: function(data) {
					if(data.state) {
						$('.sexArt').text(e.detail.el.innerText)
					} else {

					}
				}
			});
		});
	})

	//	填写性别结束

	$('#profile_header').click(function() {
		$('#file').click()

	})
	$('.cancel_button').click(function() {
		$('.head_cuts').addClass('hidden')
	})

	$('.publish').click(function() {
		var name = $('.personal_name').val().trim()
		var bir = $('.personal_bir').val()
		$.ajax({
			type: "get",
			url: config.data + "users/updateNickName",
			async: true,
			data: {
				id: id,
				nickName: name
			},
			success: function(data) {
				if(data.state) {

				} else {

				}
			}
		})

		$.ajax({
			type: "get",
			url: config.data + "users/updateBirthday",
			async: true,
			data: {
				id: id,
				birthday: bir
			},
			success: function(data) {
				if(data.state) {

				} else {

				}
			}
		});

		if (dataURLup) {
			uploadHead(id, dataURLup,function(){
				mui.back()
				
			})
		} else{
			
			mui.back()
		}
		
		
		
		
	})

})

function uploadHead(id, dataURL,callBack) {
	$.ajax({
		type:"post",
		url:config.data + "users/updateHead",
		async:true,
		data:{
			head:dataURL,
			id:id
		},
		success:function(data){
			if (data.state) {
				return callBack()
			} else{
				
			}
		}
	});
	
}