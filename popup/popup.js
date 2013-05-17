$("#toggleBGMs").change(toggleBGMs);

chrome.storage.local.get("offBGMs", function(items) {
  $("#toggleBGMs").attr("checked", items.offBGMs);
});

chrome.tabs.getSelected(null, function(tab) {
    if ((tab.url.indexOf("http://todayhumor.co.kr/board/view.php")) == 0) {
    	$('<button></button><br><br>')
    	.text("당첨자 뽑기")
    	.prependTo("body")
    	.click(function() {
    		sendMessage("lottery");
    	});
    }
});