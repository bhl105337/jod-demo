var _PageHeight = document.documentElement.clientHeight,
    _PageWidth = document.documentElement.clientWidth;

var transitionImg = "<img src='../../Public/image/miao.gif' id='transitionImg'  alt='' />"
		
document.write(transitionImg)
document.getElementById('transitionImg').setAttribute('height', _PageHeight)
		
		

//移除loading效果
function completeLoading() {
	if (document.getElementById('transitionImg')) {
		var loadingMask = document.getElementById('transitionImg');
		loadingMask.parentNode.removeChild(loadingMask);
	} else{
		
	}
		
	
}