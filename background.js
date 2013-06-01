(function() {
	function sendMessage(message)
	{
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {text: message}, null);
		});
	}


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
			var addJjal = function(jjals) {
				jjals.unshift(event.srcUrl);
				chrome.storage.local.set({"jjals": jjals});
				alert("추가되었습니다");	
			}

			chrome.storage.local.get("jjals", function(items) {
				if (items.jjals == undefined) {
				    resetJjals(function(jjals) {
    					addJjal(jjals);
				    });
				} else {
					addJjal(items.jjals);
				}
			});
		}});

		chrome.contextMenus.create({"type": "separator",
		                            "contexts": ["all"],
									"parentId": "outools"});

		chrome.contextMenus.create({"type": "normal",
									"title": "오유북마크에 현재페이지 추가",
									"contexts": ["all"],
									"parentId": "outools",
									"onclick": function(event, tab) {
			var url = tab.url;
			var name;
			do {
				name = prompt("북마크 이름을 입력해주세요", tab.title);
				if (name == null) {
				    return;
				}
			} while ($.trim(name) == "")

			chrome.storage.local.get("bookmarks", function(items) {
				var bookmarks = items.bookmarks;
				if (bookmarks == undefined) {
				    bookmarks = [];
				}
				bookmarks.push({"name": name, "url": url});
				chrome.storage.local.set({"bookmarks": bookmarks});
				alert("추가되었습니다.");
			});
		}});

		chrome.contextMenus.create({"type": "normal",
									"title": "오유북마크에 링크주소 추가",
									"contexts": ["link"],
									"parentId": "outools",
									"onclick": function(event) {
			var url = event.linkUrl;
			var name;
			do {
				name = prompt("북마크 이름을 입력해주세요");

				if (name == null) {
				    return;
				}
			} while ($.trim(name) == "")

			chrome.storage.local.get("bookmarks", function(items) {
				var bookmarks = items.bookmarks;
				if (bookmarks == undefined) {
				    bookmarks = [];
				}
				bookmarks.push({"name": name, "url": url});
				chrome.storage.local.set({"bookmarks": bookmarks});
				alert("추가되었습니다.");
			});
		}});

		chrome.contextMenus.create({"type": "separator",
		                            "contexts": ["all"],
									"parentId": "outools"});

		chrome.contextMenus.create({"type": "normal",
									"title": "이글의 BGM 제거",
									"contexts": ["all"],
									"parentId": "outools",
									"documentUrlPatterns": ["http://todayhumor.co.kr/board/view.php?*"],
									"onclick": function(event) {
			sendMessage("offBGMs");
		}});


		chrome.contextMenus.create({"type": "checkbox",
									"id": "offBGMs",
									"title": "모든글에서 BGM 자동제거",
									"contexts": ["all"],
									"parentId": "outools",
									"checked": items.offBGMs,
									"onclick": function(event) {
			chrome.storage.local.set({"offBGMs": event.checked});
			sendMessage("offBGMs");
		}});

		chrome.contextMenus.create({"type": "separator",
		                            "contexts": ["all"],
									"parentId": "outools"});

		chrome.contextMenus.create({"type": "normal",
									"title": "당첨자 추첨",
									"parentId": "outools",
									"contexts": ["all"],
									"documentUrlPatterns": ["http://todayhumor.co.kr/board/view.php?*"],
									"onclick": function() {
			sendMessage("lottery");
		}});

		chrome.contextMenus.create({"type": "normal",
									"title": "이글의 배경 없애기",
									"parentId": "outools",
									"contexts": ["all"],
									"documentUrlPatterns": ["http://todayhumor.co.kr/board/view.php?*"],
									"onclick": function() {
			sendMessage("removeStyle");
		}});

		chrome.contextMenus.create({"type": "separator",
		                            "contexts": ["all"],
									"parentId": "outools"});

		chrome.contextMenus.create({"type": "normal",
									"title": "옵션",
									"contexts": ["all"],
									"parentId": "outools",
									"onclick": function(event) {
			window.open("/options/options.html", "_blank");
		}});
	});
})();