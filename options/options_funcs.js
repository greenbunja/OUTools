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