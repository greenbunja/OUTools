// 표

function showUsermemosTable()
{
	chrome.storage.local.get("usermemos", function(items) {
		var usermemos = items.usermemos;

		if ($.isEmptyObject(usermemos)) {
		    $("#MemosTableDiv").text("회원메모가 존재하지 않습니다.");
		    return;
		}

		var table = document.getElementById("MemosTableDiv").appendChild(document.createElement("table"));

		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));


		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("회원이름"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("메모내용"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var usernum in usermemos) {
			var row = tbody.appendChild(document.createElement("tr"));

			var user = row.appendChild(document.createElement("td"))
				    	  .appendChild(document.createElement("a"));


			var userpage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + usernum;

  			user.href = userpage;
			user.target = "_blank";
			user.appendChild(document.createTextNode(usermemos[usernum].username));
			var memo = row.appendChild(document.createElement("td"))
						  .appendChild(document.createElement("input"));

			memo.value = usermemos[usernum].memo;
			memo.name = usernum;
			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("usernum", usernum)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var usernum = $(this).attr("usernum");	
				chrome.storage.local.get("usermemos", function(items) {
					var usermemos = items.usermemos;
					delete usermemos[usernum];
					chrome.storage.local.set({"usermemos": usermemos});

					location.reload();
				});
			});
		}

		$("#editMemos").append('<input type="submit" id="saveMemo" value="변경 저장">');
	});
}

function showBlockedUsersTable()
{
	chrome.storage.local.get("blockedUsers", function(items) {
		var blockedUsers = items.blockedUsers;

		if (blockedUsers == undefined || blockedUsers.length == 0) {
		    $("#BlockedUsersTableDiv").text("차단된 회원이 없습니다.");
		    return;
		} 

		blockedUsers.sort(function(a, b) {
			aPart = a.ip.split('.');
			bPart = b.ip.split('.');

			aFirstPart = parseInt(aPart[0]);
			bFirstPart = parseInt(bPart[0]);

			if (aFirstPart == null || bFirstPart == null) {
			    return;
			}

			if (aFirstPart != bFirstPart) {
			    return aFirstPart - bFirstPart;
			}

			aSecondPart = parseInt(aPart[1]);
			bSecondPart = parseInt(bPart[1]);

			if (aSecondPart == null || bSecondPart == null) {
			    return;
			}

			if (aSecondPart != bSecondPart) {
				return aSecondPart - bSecondPart;			    
			}

			aFourthPart = parseInt(aPart[3]);
			bFourthPart = parseInt(bPart[3]);

			if (aFourthPart == null || bFourthPart == null) {
			    return;
			}

			return aFourthPart - bFourthPart;			    
		});

		chrome.storage.local.set({"blockedUsers": blockedUsers});

		var table = document.getElementById("BlockedUsersTableDiv").appendChild(document.createElement("table"));


		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));


		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("회원이름"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("IP"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("차단사유"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < blockedUsers.length ; i++) {
			blocked = blockedUsers[i];
			var row = tbody.appendChild(document.createElement("tr"));

			if (blocked.username == "") {
				row.appendChild(document.createElement("td"))
				   .appendChild(document.createTextNode("비회원"));
			} else {
				var user = row.appendChild(document.createElement("td"))
					    	  .appendChild(document.createElement("a"));

				var userpage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + blocked.usernum;
				user.href = userpage;
				user.target = "_blank";
				user.appendChild(document.createTextNode(blocked.username));
			}

			row.appendChild(document.createElement("td"))
 			   .appendChild(document.createTextNode(blocked.ip));

			var memoInput = row.appendChild(document.createElement("td"))
							   .appendChild(document.createElement("input"));

			memoInput.type = "text";
			memoInput.name = "BlockedMemo"

			if (blocked.memo) {
			    memoInput.value = blocked.memo;
			}
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("index", i)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				chrome.storage.local.get("blockedUsers", function(items) {
					var blockedUsers = items.blockedUsers;

					delete blockedUsers[index];
					

					chrome.storage.local.set({"blockedUsers": blockedUsers});

					location.reload();
				});
			});
		}

		$("#editBlocked").append('<input type="submit" id="saveBlocked" value="변경 저장">');
	});
}

function showSavedTextsTable() {
	chrome.storage.local.get("savedTexts", function(items) {
		var savedTexts = items.savedTexts;

		if (savedTexts == undefined || savedTexts.length == 0) {
		    $("#SavedTextsTableDiv").text("임시저장된 글이 없습니다.");
		    return;
		} 

		var table = document.getElementById("SavedTextsTableDiv").appendChild(document.createElement("table"));


		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));


		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("제목"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("날짜"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < savedTexts.length ; i++) {
			var savedText = savedTexts[i];

			var row = tbody.appendChild(document.createElement("tr"));

			var text = row.appendChild(document.createElement("td"))
				    	  .appendChild(document.createElement("a"));
			text.href = "javascript:;";
			$(text).click({text: savedText.text}, function(event) {
				var showTextWindow = window.open(null, "_blank", "width=500px, height=500px");
				$("<textarea></textarea>")
				.val(event.data.text)
				.attr("autofocus", "")
				.css("width", "100%")
				.css("height", "100%")
				.focus(function(){$(this).select();})
				.appendTo(showTextWindow.document.body);
			});
			
			if ($.trim(savedText.subject) == "") {
			    savedText.subject = "[무제]";
			}

			text.appendChild(document.createTextNode(savedText.subject));

			row.appendChild(document.createElement("td"))
			   .appendChild(document.createTextNode(savedText.date));

			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("index", i)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				chrome.storage.local.get("savedTexts", function(items) {
					var savedTexts = items.savedTexts;

					delete savedTexts[index];
					

					chrome.storage.local.set({"savedTexts": savedTexts});

					location.reload();
				});			
			});
		}
	});
}

function ShowJjalsTable() {
	chrome.storage.local.get("jjals", function(items) {
		var jjals = items.jjals;

		if (jjals == undefined) {
			jjals = resetJjals();	
		} else if (jjals.length == 0) {
		    $("#JjalsTableDiv").text("짤이 없습니다.");
		    return;
		} 

		var table = document.getElementById("JjalsTableDiv").appendChild(document.createElement("table"));


		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));

		$(row).append("<th>번호</th>")
			  .append("<th>짤</th>")
			  .append("<th></th>")
			  .append("<th>번호</th>")
			  .append("<th>짤</th>")
			  .append("<th></th>")
			  .append("<th>번호</th>")
			  .append("<th>짤</th>")
			  .append("<th></th>");

		//    .appendChild(document.createTextNode("주소"));
		// row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		var row;
		for (var i = 0; i < jjals.length ; i++) {
			var jjal = jjals[i];

			if (i%3 == 0) {
				row = tbody.appendChild(document.createElement("tr"));
			}

			var jjalNum = row.appendChild(document.createElement("td"))
			   				 .appendChild(document.createElement("input"));

			jjalNum.type = "number";
			jjalNum.value = i + 1;
			jjalNum.min = 1;
			jjalNum.max = jjals.length;

			var image = row.appendChild(document.createElement("td"))
				    	   .appendChild(document.createElement("a"))
				    	   .appendChild(document.createElement("img"));
			image.parentNode.href = jjal;
			image.parentNode.target = "_blank";
			image.src = jjal;
			image.className = "jjal";
			
			// var jjalURL = row.appendChild(document.createElement("td"))
			// 		   	     .appendChild(document.createElement("a"));

			// jjalURL.href = jjal;
			// jjalURL.target = "_blank";

			// jjalURL.appendChild(document.createTextNode(jjal));

			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("index", i)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				chrome.storage.local.get("jjals", function(items) {
					var jjals = items.jjals;

					delete jjals[index];
					

					chrome.storage.local.set({"jjals": jjals});

					location.reload();
				});			
			});
		}
		$('<input></input>')
		.attr("type", "submit")
		.val("변경저장")
		.appendTo("#editJjalNumber");
	});
}

function showBookmarksTable()
{
	chrome.storage.local.get("bookmarks", function(items) {
		var bookmarks = items.bookmarks;

		if ($.isEmptyObject(bookmarks)) {
		    $("#bookmarks_div").text("북마크가 없습니다.");
		    return;
		}

		var table = document.getElementById("bookmarks_div").appendChild(document.createElement("table"));

		table.id = "bookmarks_table";

		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));

		$(row).append("<th>번호</th>")
			  .append("<th>이름</th>")
			  .append("<th>주소</th>")
			  .append("<th></th>");

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < bookmarks.length; i++) {
			var bookmark = bookmarks[i];

			var row = tbody.appendChild(document.createElement("tr"));

			var bookmarkNum = row.appendChild(document.createElement("td"))
			   				 .appendChild(document.createElement("input"));

			bookmarkNum.type = "number";
			bookmarkNum.value = i + 1;
			bookmarkNum.min = 1;
			bookmarkNum.max = bookmarks.length;

			$('<input></input>')
			.val(bookmark.name)
			.attr("size", "15")
			.addClass("bookmark_name")
			.appendTo($('<td></td>').appendTo(row));

			$('<input></input>')
			.val(bookmark.url)
			.attr("size", "60")
			.addClass("bookmark_url")
			.appendTo($('<td></td>').appendTo(row));

			$('<a></a>')
			.attr("href", "javascript:;")
			.attr("index", i)
			.text("삭제")
			.appendTo($('<td></td>').appendTo(row))
			.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				chrome.storage.local.get("bookmarks", function(items) {
					var bookmarks = items.bookmarks;

					delete bookmarks[index];
					

					chrome.storage.local.set({"bookmarks": bookmarks});

					location.reload();
				});
			});
		}

		$('<input></input>')
		.attr("type", "submit")
		.val("변경저장")
		.appendTo("#edit_bookmarks_num");
	});
}

//

function showOptions()
{
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
}

function saveOptions()
{
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
}

function addJjal()
{
	var jjalURL = prompt("추가할 짤의 주소를 입력해주세요.");
	if (!($.trim(jjalURL))) {
		return
	}

	chrome.storage.local.get("jjals", function(items) {
		var jjals = items.jjals;
		if (jjals == undefined) {
		    jjals = resetJjals();
		}
		jjals.unshift(jjalURL);
		chrome.storage.local.set({"jjals": jjals});

		location.reload();
	});
}

function addBlockedUser()
{
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
}

function addBookmark()
{
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
}

function saveJjalsNum()
{
	var elements = this.elements;

 	chrome.storage.local.get("jjals", function(items) {
 		var jjals = [];
	 	var jjalsCopy = items.jjals;
	 	var jjalNumbers = [];
		for (var i = 0; i < elements.length; i++) {

			var jjalNumberInput = elements[i];
			var jjalNumber = jjalNumberInput.value;

			if (jjalNumberInput.type != "number") {
			    continue;
			}

			jjalNumbers.push({"i": i, "num": jjalNumber - 1});
		}

		jjalNumbers.sort(function(a,b){return a.num-b.num});

		for (var i = 0; i < jjalNumbers.length; i++) {
			jjals[i] = jjalsCopy[jjalNumbers[i].i];
		}


		chrome.storage.local.set({"jjals": jjals});

		alert("저장 되었습니다.");
		location.reload();
	});
}

function saveBookmarks()
{
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
}