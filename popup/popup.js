$("#toggleBGMs").change(function() {
    chrome.storage.local.set({"offBGMs": this.checked});
    chrome.contextMenus.update("offBGMs", {"checked": this.checked});
    if (this.checked) {
        sendMessage("offBGMs");     
    }
});

chrome.storage.local.get("offBGMs", function(items) {
  $("#toggleBGMs").attr("checked", items.offBGMs);
});

chrome.tabs.getSelected(null, function(tab) {
    if ((tab.url.indexOf("http://todayhumor.co.kr/board/view.php")) == 0) {

        var viewDiv = $('<div id="view_div"></div>')
                      .prependTo("body");

     	$('<button></button>')
    	.html("배경 없애기")
    	.appendTo(viewDiv)
    	.click(function() {
    		sendMessage("removeStyle");
    	});
        viewDiv.append('<br>');

        $('<button></button>')
        .html("이글의 BGM 제거")
        .appendTo(viewDiv)
        .click(function() {
            sendMessage("offBGMs");
        });
        viewDiv.append('<br>');

        $('<button></button>')
        .html("당첨자 뽑기")
        .appendTo(viewDiv)
        .click(function() {
            sendMessage("lottery", function() {
                window.close();
            });
        });
        viewDiv.append('<br><br>');
    }
});