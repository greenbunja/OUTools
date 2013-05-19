chrome.storage.local.get("offBGMs", function(items) {
	chrome.contextMenus.create({"type": "normal",
	                            "title": "OU Tools",
	                            "id": "outools",
	                        	"contexts": ["all"]});

	chrome.contextMenus.create({"type": "normal",
								"title": "자주쓰는짤에 추가",
								"contexts": ["image"],
								"parentId": "outools",
								"onclick": function(event) {
		chrome.storage.local.get("jjals", function(items) {
			var jjals = items.jjals;
			if (jjals == undefined) {
			    jjals = resetJjals();
			}
			jjals.unshift(event.srcUrl);
			chrome.storage.local.set({"jjals": jjals});
			alert("추가되었습니다");
		});
	}});

	chrome.contextMenus.create({"type": "normal",
								"title": "당첨자 추첨",
								"parentId": "outools",
								"contexts": ["all"],
								"documentUrlPatterns": ["http://todayhumor.co.kr/board/view.php?*"],
								"onclick": function() {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {"text": "lottery"}, null);
		});
	}});


	chrome.contextMenus.create({"type": "checkbox",
								"id": "offBGMs",
								"title": "BGM 끄기",
								"contexts": ["all"],
								"parentId": "outools",
								"checked": items.offBGMs,
								"onclick": function(event) {
		chrome.storage.local.set({"offBGMs": event.checked});	
	}});

	chrome.contextMenus.create({"type": "separator",
	                            "contexts": ["all"],
								"parentId": "outools"});

	chrome.contextMenus.create({"type": "normal",
								"title": "옵션",
								"contexts": ["all"],
								"parentId": "outools",
								"onclick": function(event) {
		window.open(chrome.extension.getURL("options/options.html"), "_blank");
	}});
});