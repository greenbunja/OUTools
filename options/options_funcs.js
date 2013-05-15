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
			deleteButton.attr("href", '#')
						.attr("usernum", usernum)
						.text("삭제")
						.click(deleteMemo);
		}

		$("#editMemos").append('<input type="submit" id="saveMemo" class="saveOptionsButton" value="변경 저장">');
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
			deleteButton.attr("href", '#')
						.attr("index", i)
						.text("삭제")
						.click(disableBlocked);
		}

		$("#editBlocked").append('<input type="submit" id="saveBlocked" class="saveOptionsButton" value="변경 저장">');
	});
}

function ShowSavedTextsTable() {
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
			$(text).click({text: savedText.text}, openSavedTextWindow);
			
			if ($.trim(savedText.subject) == "") {
			    savedText.subject = "[무제]";
			}

			text.appendChild(document.createTextNode(savedText.subject));

			row.appendChild(document.createElement("td"))
			   .appendChild(document.createTextNode(savedText.date));

			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", '#')
						.attr("index", i)
						.text("삭제")
						.click(deleteSavedText);
		}
	});
}

function ShowJjalsTable() {
	chrome.storage.local.get("jjals", function(items) {
		var jjals = items.jjals;

		if (jjals == undefined) {
			resetJjals();	
		} else if (jjals.length == 0) {
		    $("#JjalsTableDiv").text("짤이 없습니다.");
		    return;
		} 

		var table = document.getElementById("JjalsTableDiv").appendChild(document.createElement("table"));


		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));

		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("번호"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("짤"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("주소"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < jjals.length ; i++) {
			var jjal = jjals[i];

			var row = tbody.appendChild(document.createElement("tr"));

			var jjalNum = row.appendChild(document.createElement("td"))
			   				 .appendChild(document.createElement("input"));

			jjalNum.type = "number";
			jjalNum.name = "jjal" + (i + 1);
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
			
			var jjalURL = row.appendChild(document.createElement("td"))
					   	     .appendChild(document.createElement("a"));

			jjalURL.href = jjal;
			jjalURL.target = "_blank";

			jjalURL.appendChild(document.createTextNode(jjal));

			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", '#')
						.attr("index", i)
						.text("삭제")
						.click(deleteJjal);
		}
		$("#editJjalNumber").append('<input type="submit" id="saveJjalNumber" value="변경 저장">');
	});
}

//

function saveMemo()
{
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
}

function saveBlocked()
{
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
}

function deleteMemo()
{
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
}

function disableBlocked()
{
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
}

function deleteSavedText()
{
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
}

function deleteJjal()
{
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
}

function openSavedTextWindow(event)
{
	var showTextWindow = window.open(null, "_blank", "width=500px, height=500px");
	$("<textarea></textarea>")
	.val(event.data.text)
	.attr("autofocus", "")
	.css("width", "100%")
	.css("height", "100%")
	.focus(function(){$(this).select();})
	.appendTo(showTextWindow.document.body);
}

function showOptions()
{
	chrome.storage.local.get(["AutosaveInterval", "bestReplyEnable", "blockEnable", "memoEnable", "dblclickEnable"], function(items) {
		var interval = items.AutosaveInterval;
		if (interval === undefined) {
		    chrome.storage.local.set({"AutosaveInterval": 3});
		    interval = 3;
		}

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

		$("#bestReplyEnable").attr("checked", bestReplyEnable);
		$("#blockEnable").attr("checked", blockEnable);
		$("#memoEnable").attr("checked", memoEnable);
		$("#interval").val(interval);
		$("#dblclickOnOU").attr("checked", dblclickEnable.ou);
		$("#dblclickOnEveryWebsite").attr("checked", dblclickEnable.every);
	});
}

function saveOptions()
{
	var interval = this.interval.value;
	var bestReplyEnable = this.bestReplyEnable.checked;
	var blockEnable = this.blockEnable.checked;
	var memoEnable = this.memoEnable.checked;
	var dblclickEnable = {"ou": this.dblclickOnOU.checked, "every": this.dblclickOnEveryWebsite.checked};

	chrome.storage.local.set({"AutosaveInterval": interval,
							  "bestReplyEnable": bestReplyEnable,
							  "blockEnable": blockEnable,
							  "memoEnable": memoEnable,
							  "dblclickEnable": dblclickEnable});
	alert("저장 되었습니다.");
}

function addJjal()
{
	var Jjalurl = prompt("추가할 짤의 주소를 입력해주세요.");

	chrome.storage.local.get("jjals", function(items) {
		var jjals = items.jjals;
		if (jjals == undefined) {
		    jjals = [];
		}
		jjals.unshift(Jjalurl);
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

function editJjalNumber()
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

function resetJjals()
{
	var jjals = ["http://i.imgur.com/cn7QOaW.png",
				 "http://i.imgur.com/OiBRlw9.png",
				 "http://i.imgur.com/209M28V.png",
				 "http://i.imgur.com/f6z4ZJb.png",
				 "http://i.imgur.com/vFBgCih.png",
				 "http://i.imgur.com/pHXQMOV.png",
				 "http://i.imgur.com/keXmiA3.png",
				 "http://i.imgur.com/j41OEnF.png",
				 "http://i.imgur.com/rVZ6e6T.png",
				 "http://i.imgur.com/1vS8Cds.png",
				 "http://i.imgur.com/DVpSJdk.png",
				 "http://i.imgur.com/whDkOfU.png",
				 "http://i.imgur.com/f4d02yK.png",
				 "http://i.imgur.com/OPKvJEs.png",
				 "http://i.imgur.com/z54kM2q.png",
				 "http://i.imgur.com/k90QIBV.png",
				 "http://i.imgur.com/51adQbx.png",
				 "http://i.imgur.com/Be7G3d0.png",
				 "http://i.imgur.com/zaNVKo2.png",
				 "http://i.imgur.com/MZpQdPD.png",
				 "http://i.imgur.com/Q3oNbEy.png",
				 "http://i.imgur.com/m38yL7v.png",
				 "http://i.imgur.com/01UqUQU.png",
				 "http://i.imgur.com/vtzKdJy.png",
				 "http://i.imgur.com/wkaX2VL.png",
				 "http://i.imgur.com/7lHYvqN.png",
				 "http://i.imgur.com/8ruvQa9.png",
				 "http://i.imgur.com/7SMhWTj.png",
				 "http://i.imgur.com/a7d6JVC.png",
				 "http://i.imgur.com/mJkHPTi.png",
				 "http://i.imgur.com/JzDGrvL.png",
				 "http://i.imgur.com/DJIqw4H.png",
				 "http://i.imgur.com/54lSFdJ.png",
				 "http://i.imgur.com/oCndH3h.png",
				 "http://i.imgur.com/mjTFXoL.png",
				 "http://i.imgur.com/KKzUkpY.png",
				 "http://i.imgur.com/i1C0vDj.png",
				 "http://i.imgur.com/d9Kfc4X.png",
				 "http://i.imgur.com/SBemsD4.png",
				 "http://i.imgur.com/XKcScn6.png",
				 "http://i.imgur.com/pv0LySM.png",
				 "http://i.imgur.com/rgHoQoS.png",
				 "http://i.imgur.com/qZbIeoe.png",
				 "http://i.imgur.com/gfXEqe9.png",
				 "http://i.imgur.com/taSiLzk.png",
				 "http://i.imgur.com/YB4fxcK.png",
				 "http://i.imgur.com/5XnWfLZ.png",
				 "http://i.imgur.com/enLoyWR.png",
				 "http://i.imgur.com/FPCsToA.png",
				 "http://i.imgur.com/DwLyhvU.png",
				 "http://i.imgur.com/NQLniV9.png",
				 "http://i.imgur.com/ZBLswRI.png",
				 "http://i.imgur.com/hITMJDh.png",
				 "http://i.imgur.com/gfUYqJA.png"];

	chrome.storage.local.set({"jjals": jjals});
}