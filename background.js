chrome.storage.local.get("offBGMs", function(items) {
	chrome.contextMenus.create({"type": "normal", "title": "OU Tools", "id": "outools"});
	chrome.contextMenus.create({"type": "normal",
								"title": "당첨자 추첨",
								"parentId": "outools",
								"documentUrlPatterns": ["http://todayhumor.co.kr/board/view.php?*"],
								"onclick": function() {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {"text": "lottery"}, null);
		});
	}});


	chrome.contextMenus.create({"type": "checkbox",
								"id": "offBGMs",
								"title": "BGM 끄기",
								"parentId": "outools",
								"checked": items.offBGMs,
								"onclick": function(event) {
		chrome.storage.local.set({"offBGMs": event.checked});	
	}});

	chrome.contextMenus.create({"type": "separator",
								"parentId": "outools"});

	chrome.contextMenus.create({"type": "normal",
								"title": "옵션",
								"parentId": "outools",
								"onclick": function(event) {
		window.open(chrome.extension.getURL("options/options.html"), "_blank ");
	}});
});