var subpages = ['html/news/news.html', 'html/game/game_recommend.html', 'html/strategy/strategy.html', 'html/play/play.html', 'html/user/me.html'];

var Index = 0;
var newVer;
//把子页的路径写在数组里面
var activeTab = subpages[Index];
//选项卡点击事件
var self;
mui.plusReady(function() {
	var wgtVer = null;

	function plusReady() {
		// ......
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			wgtVer = inf.version;
			
			console.log("当前应用版本：" + wgtVer);
			//	检测更新

//			$.ajax({
//				type: "get",
//				url: "http://www.oneyouxi.com.cn:8877/H5/update",
//				async: true,
//				success: function(data) {
//					if(data.state) {
//						newVer = data.mark;
//						console.log(newVer);
//						if(wgtVer && newVer && (wgtVer != newVer)) {
//							downWgt(); // 下载升级包
//						} else {
//							plus.nativeUI.alert("无新版本可更新！");
//						}
//					} else {
//						console.log("检测更新失败！");
//						plus.nativeUI.alert("检测更新失败！");
//					}
//				}
//			});
		});
	}
	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}

	// 检测更新

	//	checkUpdate();
	//
	//	function checkUpdate() {
	//		plus.nativeUI.showWaiting("检测更新...");
	//		var xhr = new XMLHttpRequest();
	//		xhr.onreadystatechange = function() {
	//			switch(xhr.readyState) {
	//				case 4:
	//					plus.nativeUI.closeWaiting();
	//					alert(xhr.status)
	//					if(xhr.status == 200) {
	//						console.log("检测更新成功");
	//						var newVer = JSON.parse(xhr.responseText);
	//
	//					} else {
	//						
	//					}
	//					break;
	//				default:
	//					break;
	//			}
	//		}
	//
	//	}

	// 下载wgt文件
	var wgtUrl = "http://182.61.26.179:8878/www/APK/H5C62934A.wgt";

	function downWgt() {
		plus.nativeUI.showWaiting("下载wgt文件...");
		plus.downloader.createDownload(wgtUrl, {
			filename: "_doc/update/"
		}, function(d, status) {
			if(status == 200) {
				console.log("下载wgt成功：" + d.filename);
				installWgt(d.filename); // 安装wgt包
			} else {
				console.log("下载wgt失败！");
				plus.nativeUI.alert("下载wgt失败！");
			}
			plus.nativeUI.closeWaiting();
		}).start();
	}

	//	var h1 = plus.webview.getLaunchWebview()
	//
	//	var height = document.documentElement.clientHeight || document.body.clientHeight;
	//	window.onresize = function() {
	//		var heightView = document.documentElement.clientHeight || document.body.clientHeight;
	//		if(heightView < height) {
	//			plus.webview.currentWebview().setStyle({
	//				height: height
	//			});
	//			//			//修改父页面高度的时候，也要修改子页面的高度  因为子页面距离父页面底部始终是51px  所以这里只需要用父页面的高度减去51px,就是子页面的高度
	//			//			plus.webview.getWebviewById('html/store/store.html').setStyle({
	//			//				height: (height * 1 - 51)
	//			//			});
	//		} else {
	//
	//		}
	//	}
	var h1 = plus.webview.getLaunchWebview()

	var height = document.documentElement.clientHeight || document.body.clientHeight;
	window.onresize = function() {
		if(plus.webview.getWebviewById('html/play/play.html')) {

			var heightView = document.documentElement.clientHeight || document.body.clientHeight;
			if(heightView < height) {
				//			plus.webview.currentWebview().setStyle({
				//				height: height
				//			});
				////			//修改父页面高度的时候，也要修改子页面的高度  因为子页面距离父页面底部始终是51px  所以这里只需要用父页面的高度减去51px,就是子页面的高度

				plus.webview.getWebviewById('html/play/play.html').setStyle({
					height: (heightView)
				});
				$('#footer').addClass('hidden')
			} else {
				$('#footer').removeClass('hidden')
				plus.webview.getWebviewById('html/play/play.html').setStyle({
					height: (height - 50)
				});
			}
		}
	}

	//	window.addEventListener('toIndex', function(event) {
	//		// mui.fire()传过来的额外的参数，在event.detail中；
	//		var detail = event.detail;
	//		// var param = detail.param;
	//		// 执行相应的ajax或者操作DOM等操作
	//		console.log(name)
	//	});
	//获取当前页面所属的Webview窗口对象
	self = plus.webview.currentWebview();
	var sub = plus.webview.create(
		subpages[0], //子页url
		subpages[0], //子页id
		{
			top: '0px', //设置距离顶部的距离
			bottom: '50px' //设置距离底部的距离
		}
	);
	self.append(sub);
	//	for(var i = 0; i < 4; i++) {
	//		//创建webview子页
	//		var sub = plus.webview.create(
	//			subpages[i], //子页url
	//			subpages[i], //子页id
	//			{
	//				top: '0px', //设置距离顶部的距离
	//				bottom: '50px' //设置距离底部的距离
	//			}
	//		);
	//		//如不是我们设置的默认的子页则隐藏，否则添加到窗口中
	//		if(i != Index) {
	//			sub.hide();
	//		}
	//		//将webview对象填充到窗口
	//		self.append(sub);
	//	}

	mui('.mui-bar-tab').on('tap', 'a', function(e) {

		var index = $(this).index();

		//获取目标子页的id
		var h = plus.webview.getWebviewById(subpages[index])

		document.getElementsByClassName("mui-icon")[1].classList.remove('game_active');
		document.getElementsByClassName("mui-icon")[0].classList.remove('news_active');
		document.getElementsByClassName("mui-icon")[2].classList.remove('strategy_active');
		document.getElementsByClassName("mui-icon")[3].classList.remove('play_active');
		document.getElementsByClassName("mui-icon")[4].classList.remove('me_active');
		this.children[0].classList.add(this.getAttribute('data-img'));
		//			console.log(this.getAttribute('data-img'))
		var targetTab = this.getAttribute('data-href');
		//		console.log(targetTab);
		if(targetTab == activeTab) {

			return;
		}
		if(!h) {
			var sub = plus.webview.create(
				subpages[index], //子页url
				subpages[index], //子页id
				{
					top: '0px', //设置距离顶部的距离
					bottom: '50px' //设置距离底部的距离
				}
			);
			self.append(sub);
		}
		//更换标题
		//	    title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		plus.webview.show(targetTab);
		//隐藏当前选项卡
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;

	});

	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		//  var first;
		//  if(!first){
		//  	
		//      first = new Date().getTime();
		//      mui.toast('再按一次退出应用');
		//      setTimeout(function(){
		//          first = null;
		//      },1000);
		//  }else{
		//      if(new Date().getTime()-first<1000){
		//         plus.runtime.quit();
		//     }
		//}
		//  alert(e.keyType+"\n"+e.keyCode);
		return false;
	}
});

// 更新应用资源
function installWgt(path) {
	plus.nativeUI.showWaiting("安装wgt文件...");
	plus.runtime.install(path, {}, function() {
		plus.nativeUI.closeWaiting();
		console.log("安装wgt文件成功！");
		plus.nativeUI.alert("应用资源更新完成！", function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
		plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
	});
}