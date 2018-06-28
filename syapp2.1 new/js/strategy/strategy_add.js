var strategyId;
var token;
var userId = localStorage.getItem("userId") || 22;
var imgNum = 0;
//	发帖子
var imgArray=[];
$(function() {
	//	点击选择图片
	$('.choose_game').css({'border-radius':'20px','background-color':'#e6ebec'})
	var h = $(window).height()
	$(window).resize(function() {
		var changeHeight = $(window).height();
		if(changeHeight < h) {
			$('.show_imgs,.img_num').addClass('hidden')
			$('.choose_img').css('bottom', '0')
			$('.choose_game').css('bottom','2.625rem')
		} else {
			$('.show_imgs,.img_num').removeClass('hidden')
			$('.choose_img').css('bottom', '10.625rem')
			$('.choose_game').css('bottom','13.25rem')
		}
	});

	document.getElementById('choose_img').addEventListener('tap', function() {
		
		if(mui.os.plus) {
			var buttonTit = [
				{
					title: "从手机相册选择"
				}
			];

			plus.nativeUI.actionSheet({
				title: "上传图片",
				cancel: "取消",
				buttons: buttonTit
			}, function(b) { /*actionSheet 按钮点击事件*/
				
				switch(b.index) {
					case 0:
						break;
					case 1:
					  
						galleryImgs(); /*打开相册*/
						break;
					default:
						break;
				}
			})
		}
	}, false);


	
	
	
	
	$('body').on('click', '.delete_img', function() {
		$(this).parent().parent('.show_imgcontent').remove()
		$('.img_num').text($('.show_imgs > .show_imgcontent').length + "/9")
	})

	
	$('.publish').click(function() {
		

	var content="<div>"+$("#strategy_textarea").html()+"</div>";
  
// 	alert(content);
// 	return false;
  var indexSrc=$("#strategy_textarea img:first").attr("src");
 if(indexSrc!==undefined){
	 var indexImg=indexSrc;
 }else{
	  indexImg=""
 }
//  alert(indexSrc);
//  return false;
		
		var str = $('.strategy_title').val();
	 	var title = str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
		var gameName = $('.choose_game').val().replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");

		if(title && content && gameName){
			mui.toast("正在发布，请等待");
			$.ajax({
				type: "post",
				url: config.data + "strategy/addStrategyMsg",
				async: true,
				data: {
					userId: userId,
					title:title,
					detail:content,
					gameName:gameName,
					top_img_src:indexImg
				},
				success: function(data) {
					if(data.state){
						mui.toast("上传成功");
						 $("#strategy_textarea").html("");
		         $(".strategy_title").val("");
		         $(".choose_game").val("");
						 setTimeout(function(){
							 mui.back();
						 },3000);					 
					} else {
	          mui.toast("上传失败");
					}
				}
			});
		}else{
			mui.toast("标题及内容和游戏名不能为空")
		}
	})

	//	发帖子结束
})

// 从相册中选择图片   
function galleryImgs() {
	// 从相册中选择图片 
	plus.gallery.pick(function(e) {
    mui.toast("正在上传,请等待");
		var uploader = plus.uploader.createUpload(config.url_upload+"adminStrategy/img?title=strategy&token=token&url="+config.url_upload,{
					method: "post"
				}, function(t, status) {
					 var res =JSON.parse(t.responseText)
					 // return false;
					  if(res.errno==0){
						  var src=res.data[0];
							appendHtml(`<img style="width:98%;height:auto;" src="${src}"/>`);						
					  }else{
						  mui.toast("上传图片失败")
					  }
		
				});

				uploader.addFile(e.files[0],{
					"key": "file"
				}); // 固定值，千万不要改！！！！！！
				
				uploader.start();
				

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum:1,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择1张图片');
		}
	});
}


//插入图片
function appendHtml(src){
 var sel, range;
 if(window.getSelection){
	  var sel=window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
      range.deleteContents();
      var el =document.createElement("div");
			el.innerHTML =src;
			 var frag = window.parent.document.createDocumentFragment(), node, lastNode;
        while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
				if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
		}
 }
}



//	选择图片结束
//上传图片
function upLoad(strategyId, key, path) {
	getUpToken('img', key, function(token) {
		var url = "http://upload-z2.qiniup.com/";
		var uploader = plus.uploader.createUpload(url, {
			method: "post"
		}, function(t, status) {
			if(status == 200) {
				console.log(JSON.parse(t.responseText).key)
				$.ajax({
					type: "get",
					url: config.data + "strategy/addStrategyImg",
					async: true,
					data: {
						strategyId: strategyId,
						img: JSON.parse(t.responseText).key
					},
					success: function(data) {
						
						mui.back()
					}
				});
			} else {
				console.log("上传失败 - ", status);
				mui.toast("上传图片失败")
			}

		});

		uploader.addData("key", key);
		uploader.addData("token", token);
		uploader.addFile(path,{
			"key": "file"
		}); // 固定值，千万不要改！！！！！！
		
		uploader.start();
	})
}

function getUpToken(scope, key, callback) {
	$.ajax({
		type: "get",
		url: config.data + "users/getUptokenByMsg",
		async: true,
		data: {
			scope: scope,
			key: key
		},
		success: function(data) {
			token = data.upToken;
			return callback(token)
		}
	});
}
//上传到七牛的function结束