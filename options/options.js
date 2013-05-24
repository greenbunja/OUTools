(function() {
	$("#editMemos").submit(function() {
		var elements = this.elements;

	 	chrome.storage.local.get("usermemos", function(items) {
		 	var usermemos = items.usermemos;
			for (var i = 0; i < elements.length; i++) {
				var memoInput = elements[i];
				var memo = memoInput.value;

				if (memoInput.type != "text") {
				    continue;
				}

				usermemos[memoInput.name].memo = memo;
			}

			chrome.storage.local.set({"usermemos": usermemos});

			alert("저장 되었습니다.");
		});
	});

	$("#editBlocked").submit(function() {
		var elements = this.elements;

	 	chrome.storage.local.get("blockedUsers", function(items) {
		 	var blockedUsers = items.blockedUsers;
			for (var i = 0; i < elements.length; i++) {
				var memoInput = elements[i];
				var memo = memoInput.value;

				if (memoInput.type != "text") {
				    continue;
				}

				blockedUsers[i].memo = memo;
			}

			chrome.storage.local.set({"blockedUsers": blockedUsers});

			alert("저장 되었습니다.");
		});
	});

	$("#editOptions").submit(function() {
		var interval = this.interval.value;
		var bestReplyEnable = this.bestReplyEnable.checked;
		var blockEnable = this.blockEnable.checked;
		var memoEnable = this.memoEnable.checked;
		var dblclickEnable = {"ou": this.dblclick_ou.checked, "every": this.dblclick_every.checked};
		var bookmarkEnable = this.bookmark_enable.checked;
		var shortcutEnable = this.shortcut_enable.checked;
		var blockIlbe = this.block_ilbe.checked;
		var styleRemoveEnable = this.style_remove_enable.checked;

		chrome.storage.local.set({"AutosaveInterval": interval,
								  "bestReplyEnable": bestReplyEnable,
								  "blockEnable": blockEnable,
								  "memoEnable": memoEnable,
								  "dblclickEnable": dblclickEnable,
								  "bookmarkEnable": bookmarkEnable,
								  "shortcutEnable": shortcutEnable,
								  "blockIlbe": blockIlbe,
								  "styleRemoveEnable": styleRemoveEnable});
		alert("저장 되었습니다.");
	});

	$("#add_bookmark").submit(function() {
		var name = this.name.value;
		var url = this.url.value;

		if ($.trim(name) == "") {
			alert("이름을 입력해주세요");
			return;
		}
		if ($.trim(url) == "") {
			alert("주소를 입력해주세요");
			return;
		}

		if (url.slice(0, 4) != "http") {
		   url = "http://" + url;
		}
		chrome.storage.local.get("bookmarks", function(items) {
			var bookmarks = items.bookmarks;
			if (bookmarks == undefined) {
			    bookmarks = [];
			}
			bookmarks.push({"name": name, "url": url});
			chrome.storage.local.set({"bookmarks": bookmarks});

			location.reload();
		});
	});

	$("#edit_bookmarks_num").submit(function() {
		var elements = this.elements;

	 	chrome.storage.local.get("bookmarks", function(items) {
	 		var bookmarks = [];
		 	var bookmarksCopy = items.bookmarks;
		 	var bookmarkNumbers = [];

		 	var nameIndex = 0, urlIndex = 0, numIndex = 0;
			for (var i = 0; i < elements.length; i++) {

				var input = elements[i];
				
				if (input.type == "text") {
					if (input.className == "bookmark_name") {
	   					var name = input.value;
	   					
						bookmarksCopy[nameIndex++].name = name;
						continue; 
					} else if(input.className == "bookmark_url") {
						var url = input.value;
						if ($.trim(url) != "" && url.slice(0, 4) != "http") {
						   url = "http://" + url;
						}
						bookmarksCopy[urlIndex++].url = url;
						continue;
					}
				}
				else if (input.type == "number") {
					var bookmarkNumber = input.value;
					bookmarkNumbers.push({"i": numIndex++, "num": bookmarkNumber - 1});
				}
			}

			bookmarkNumbers.sort(function(a,b){return a.num-b.num});

			for (var i = 0; i < bookmarkNumbers.length; i++) {
				bookmarks[i] = bookmarksCopy[bookmarkNumbers[i].i];
			}


			chrome.storage.local.set({"bookmarks": bookmarks});

			alert("저장 되었습니다.");
			location.reload();
		});
	});

	$('#edit_shortcuts').submit(function() {
		var elements = this.elements;
		delete elements[elements.length - 1];

	 	chrome.storage.local.get("shortcuts", function(items) {
	 		var shortcuts = items.shortcuts;

	 		if (shortcuts == undefined) {
	 		    shortcuts = [];
	 		}

	 		for (var i = 0; i < elements.length; i++) {
	 			if (elements[i].type != "text") {
	 			    continue;
	 			}

	 			var url = elements[i].value;
				if ($.trim(url) != "" && url.slice(0, 4) != "http") {
				   url = "http://" + url;
				}

	 			shortcuts[(i+1) % 10] = url;
	 		}

			chrome.storage.local.set({"shortcuts": shortcuts});

			alert("저장 되었습니다.");
			location.reload();
		});
	});

	$('#export_options').click(function() {
		chrome.storage.local.get(null, function(items) {
			var optionsString = JSON.stringify(items);
			var w = window.open(null, "_blank");
			w.document.write("아래텍스트를 복사해서 텍스트파일에 저장해주세요.");
			$("<textarea></textarea>")
			.val(optionsString)
			.attr("autofocus", "")
			.css("width", "100%")
			.css("height", "95%")
			.focus(function(){$(this).select();})
			.appendTo(w.document.body);
		});
	});

	$('#import_options').click(function() {
		if (!(confirm("정말로 불러오시겠습니까?"))) {
		    return;
		}

		optionsString = $('#options_text').val();
		try {
			var optionsObject = JSON.parse(optionsString);
			chrome.storage.local.set(optionsObject);
			alert("성공적으로 불러왔습니다.");
			location.reload();
		} catch(e) {
			alert("텍스트가 형식에 맞지 않습니다.");
			return;
		}
	});

	chrome.storage.local.get(["AutosaveInterval", "bestReplyEnable", "blockEnable",
							  "memoEnable", "dblclickEnable", "bookmarkEnable",
							  "shortcutEnable", "blockIlbe", "styleRemoveEnable"], 
							  function(items) {
		var interval = items.AutosaveInterval;
		if (interval === undefined) {
		    chrome.storage.local.set({"AutosaveInterval": 3});
		    interval = 3;
		}

		var enableList = items.enableList;

		var bestReplyEnable = items.bestReplyEnable;
		if (bestReplyEnable == undefined) {
		    chrome.storage.local.set({"bestReplyEnable": false});
		    bestReplyEnable = false;
		}

		var blockEnable = items.blockEnable;
		if (blockEnable == undefined) {
		    chrome.storage.local.set({"blockEnable": true});
		    blockEnable = true;
		}

		var memoEnable = items.memoEnable;
		if (memoEnable == undefined) {
		    chrome.storage.local.set({"memoEnable": true});
		    memoEnable = true;
		}

		var dblclickEnable = items.dblclickEnable;
		if (dblclickEnable == undefined) {
		    chrome.storage.local.set({"dblclickEnable": {"ou": true, "every": false}});
		    dblclickEnable = {"ou": true, "every": false};
		}

		var bookmarkEnable = items.bookmarkEnable;
		if (bookmarkEnable == undefined) {
		    chrome.storage.local.set({"bookmarkEnable": true});
		    bookmarkEnable = true;
		}

		var shortcutEnable = items.shortcutEnable;
		if (shortcutEnable == undefined) {
		    chrome.storage.local.set({"shortcutEnable": true});
		    shortcutEnable = true;
		}

		var blockIlbe = items.blockIlbe;
		if (blockIlbe == undefined) {
		    chrome.storage.local.set({"blockIlbe": false});
		    blockIlbe = false;
		}

		var styleRemoveEnable = items.styleRemoveEnable;
		if (styleRemoveEnable == undefined) {
		    chrome.storage.local.set({"styleRemoveEnable": false});
		    styleRemoveEnable = false;
		}

		$("#bestReplyEnable").attr("checked", bestReplyEnable);
		$("#blockEnable").attr("checked", blockEnable);
		$("#memoEnable").attr("checked", memoEnable);
		$("#interval").val(interval);
		$("#dblclick_ou").attr("checked", dblclickEnable.ou);
		$("#dblclick_every").attr("checked", dblclickEnable.every);
		$("#bookmark_enable").attr("checked", bookmarkEnable);
		$("#shortcut_enable").attr("checked", shortcutEnable);
		$("#block_ilbe").attr("checked", blockIlbe);
		$("#style_remove_enable").attr("checked", styleRemoveEnable);
	});

	showUsermemosTable();
	showBlockedUsersTable();
	showSavedTextsTable();
	showBookmarksTable();

		
 	chrome.storage.local.get("shortcuts", function(items) {
		var elements = document.getElementById("edit_shortcuts").elements;
 		var shortcuts = items.shortcuts;

 		if (shortcuts == undefined) {
 		    return;
 		}

		for (var i = shortcuts.length - 1; i >= 0; i--) {
			if (elements[i].type != "text") {
 			    continue;
 			}

			elements[i].value = shortcuts[(i+1) % 10];
		};
	});

	$("#addBlockedUser").click(function() {
		var username = prompt("닉네임을 입력해주세요.(비회원일시 비움)");
		if (username == null) {
		    return;
		}

		var usernum = prompt("회원번호를 입력해주세요(비회원일시 비움)");
		if (usernum == null) {
		    return;
		}

		var ip = prompt("IP를 입력해주세요");
		if (ip == null || ip == "") {
		    return;
		}

		if (!(/^([0-9]{1,3})\.([0-9]{1,3})\.\*\*\*\.([0-9]{1,3})$/.test(ip))) {
		    alert("오유의 IP 형식이랑 맞지 않습니다");
		    return;
		}

		chrome.storage.local.get("blockedUsers", function(items) {
			var blockedUsers = items.blockedUsers;

			if (blockedUsers == undefined) {
			    blockedUsers = [];
			}

			blockedUsers.unshift({"username": username, "usernum": usernum, "ip": ip});
			chrome.storage.local.set({"blockedUsers": blockedUsers});

			location.reload();
		});
	});

	chrome.storage.local.get("dblclickEnable", function(items) {
		var dblclickEnable = items.dblclickEnable;

		if (dblclickEnable == undefined) {
		    chrome.storage.local.set({"dblclickEnable": {"ou": true, "every": false}});
		    dblclickEnable = {"ou": true, "every": false};
		    return;
		}

		if (items.dblclickEnable.every) {
			var toggle = 0;
			function dblclick() {
			    if (toggle == 0) {
			        var sc = 99999; toggle = 1;
			    } else {
			        var sc = 0; toggle = 0;
			    }
			    window.scrollTo(0,sc);
			}

			$(document).dblclick(dblclick);
		}
	});
})();