function initPage()
{
	var xbutton = $('<img src="chrome-extension://pblkcpokpfnkoempdnhpealegchhegdj/images/xbutton.png" id="xbutton">')
				  .click(hideJjals);
	$('<div id="jjals"></div>').append(xbutton)
							   .appendTo($("body"));

	$('<input type="button" value="자주쓰는 짤중에서 선택하기">')
	.click(showJjals)
	.appendTo($("#memo_insert_submit_image").parent().next());

	wrapOKText();
	chrome.storage.local.get(["usermemos", "blockedUsers"], function(items) {
		var usermemos = items.usermemos;
		if (usermemos == undefined) {
		    usermemos = {};
		}

		var blockedUsers = items.blockedUsers;
		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		addButtons(blockedUsers);
		showUsermemos(usermemos);
		showBlockedUsers(blockedUsers);
	});
	$("center > input").click(clickedTotalOKButton);

	chrome.storage.local.get("showBestReply", function(items) {
		var isShowBestReplyOn = items.showBestReply;

		if (isShowBestReplyOn === undefined) {
		    chrome.storage.local.set({"showBestReply": true});
		    isShowBestReplyOn = true;
		}

		if (isShowBestReplyOn) {
		    showBestReply();
		}
	}) ;
}

function wrapOKText()
{
	$("#ok_layer").contents().filter(function() {
		  return this.nodeType == 3;
	})
	.wrap('<span class="okSpan"></span>');
}

function addTwoButtons(parent, username, usernum, userpage, ip, isBlocked)
{
	$("<button></button>")
	.attr("username", username)
	.attr("usernum", usernum)
	.attr("userpage", userpage)
	.text("회원메모")
	.click(writeUsermemos)
	.appendTo(parent);

	if (isBlocked) {
		$("<button></button>")
		.attr("username", username)
		.attr("usernum", usernum)
		.attr("userpage", userpage)
		.attr("ip", ip)
		.text("IP 차단 헤제")
		.click(disableBlockedUser)
		.appendTo(parent);
	} else {
		$("<button></button>")
		.attr("username", username)
		.attr("usernum", usernum)
		.attr("userpage", userpage)
		.attr("ip", ip)
		.text("IP 차단")
		.click(blockUser)
		.appendTo(parent);
	}
}

function addButtons(blockedUsers)
{
	var writerDiv = $(".writerInfoContents");

	var writerName = writerDiv.find("div > a > font > b").text();

	if (writerName != "") {
		var writerNumber = writerDiv.find("div > a").attr("href").slice(24);				// 회원번호만 남기고 지움
		var writerPage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + writerNumber;

		var writerIp = writerDiv.children(":eq(5)").html();
		writerIp = writerIp.slice(5);

		var writerIsBlocked = isBlockedUser(blockedUsers, writerNumber, writerIp);
		addTwoButtons(writerDiv.children(":eq(1)"), writerName, writerNumber, writerPage, writerIp, writerIsBlocked);
	}

	$(".memoInfoDiv").each(function() {
		var username = $(this).find("a > font > b").text();

		if (username != "") {
    		var usernum = $(this).children("a").attr("href").slice(15);
			var userpage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + usernum

			var ip = $(this).children("font[color='red']:last").text();
			ip = ip.slice(3);

			var isBlocked = isBlockedUser(blockedUsers, usernum, ip);
			addTwoButtons($(this), username, usernum, userpage, ip, isBlocked);
		}
	});

	addOKListButtons(blockedUsers);
}

function addOKListButtons(blockedUsers)
{
	$("#ok_layer > span.okSpan").each(function() {
		var text = $(this).text();
		if ($.trim(text) == "") {
			return;
		}

		var words = text.split(" ");

		var ip = $.trim(words[words.length - 3]);
		var username = $.trim(words[words.length - 2]);
		var usernum = $(this).nextAll("a:first").text();
		var userpage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + usernum;

		if (username == "") {
		    usernum = "";
		}

		var isBlocked = isBlockedUser(blockedUsers, usernum, ip);

		if (ip != "" && username == "") {
			if (isBlocked) {
    			$("<button></button>")
				.attr("username", "")
				.attr("usernum", "")
				.attr("userpage", "")
				.attr("ip", ip)
				.text("IP 차단 헤제")
				.click(disableBlockedUser)
				.insertAfter($(this)); 
			} else {
				$("<button></button>")
				.attr("username", "")
				.attr("usernum", "")
				.attr("userpage", "")
				.attr("ip", ip)
				.text("IP 차단")
				.click(blockUser)
				.insertAfter($(this));
			}

			return;
		}

		addTwoButtons($("<span></span>").insertAfter($(this).nextAll("a:first")), username, usernum, userpage, ip, isBlocked);
	});
}

function clickedTotalOKButton()
{
	chrome.storage.local.get(["usermemos", "blockedUsers"], function(items) {
		wrapOKText();

		var usermemos = items.usermemos;
		if (usermemos == undefined) {
			return;
		}

		var blockedUsers = items.blockedUsers;
		if (blockedUsers == undefined) {
			return;
		}

		showOKListUsermemos(usermemos);
		showOKListBlockedUsers(blockedUsers);
		addOKListButtons(blockedUsers);
	});
}

// 회원메모

function showOKListUsermemos(usermemos)
{
	$("#ok_layer > a").each(function() {
		var usernum = $(this).text();
		var usermemo = usermemos[usernum];
		
		if (usermemo != undefined) {
			var memoSpan = $(this).prev("span.memoSpan");
			if (memoSpan.length == 0) {
			    $(this).before('<span class="memoSpan"><b>[' + usermemo.memo + ']</b></span>');
			} else {
			    memoSpan.children().text("[" + usermemo.memo + "]");
			}
		}
	});
}

function showUsermemos(usermemos)
{
	if ($.isEmptyObject(usermemos)) {
	    return;
	}

	$("a:has(font > b)").each(function(index) {
		var usernum = $(this).nextAll("button:first").attr("usernum");
		var usermemo = usermemos[usernum];

		if (usermemo != undefined) {
			var memoSpan = $(this).next("span.memoSpan");
			if (memoSpan.length == 0) {
				$(this).after('<span class="memoSpan"><b>[' + usermemo.memo + ']</b></span>');
			} else {
			    memoSpan.children().text("[" + usermemo.memo + "]");
			}
		}
	});

	showOKListUsermemos(usermemos);
}

function writeUsermemos()
{
	var username = $(this).attr("username");
	var usernum = $(this).attr("usernum");
	var userpage = $(this).attr("userpage");

	chrome.storage.local.get("usermemos", function(items) {
		var usermemos = items.usermemos;

		if (usermemos == undefined) {
		    usermemos = {};
		}

		var memo = prompt("메모내용을 입력해주세요.");

		if ($.trim(memo) == "") {
		    return;
		}

		usermemos[usernum] = {"username": username, "userpage": userpage, "memo": memo};
		chrome.storage.local.set({"usermemos": usermemos});
		
		showUsermemos(usermemos);
	});
}

// 차단 

function isBlockedUser(blockedUsers, usernum, ip)
{
	if (usernum == "") {
		var blockedCount = $.grep(blockedUsers, function(item) {
			return item.ip == ip;
		}).length;
	} else {
		var blockedCount = $.grep(blockedUsers, function(item) {
			return (item.usernum == usernum) || (item.ip == ip);
		}).length;
	}

	return blockedCount > 0;
}

function blockUser()
{
	if (!confirm("정말로 차단 하시겠습니까?")) {
		return;
	} 

	var $this = $(this);

	var usernum = $this.attr("usernum");
	var username = $this.attr("username");
	var userpage = $this.attr("userpage");
	var ip = $this.attr("ip");

	chrome.storage.local.get("blockedUsers", function(items) {
		var blockedUsers = items.blockedUsers;

		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (ip == "") {
			ip = $(".writerInfoContents").children().eq(5).text().slice(5);			
		}
		if (isBlockedUser(blockedUsers, usernum, ip)) {
		    return;
		}

		blockedUsers.unshift({"username": username, "usernum": usernum, "userpage": userpage, "ip": ip});
		chrome.storage.local.set({"blockedUsers": blockedUsers});
		
		showBlockedUsers(blockedUsers);

		$this.text("IP 차단 헤제")
			 .unbind("click", blockUser)
			 .click(disableBlockedUser);
	});
}

function disableBlockedUser()
{
	if (!confirm("정말로 차단 헤제 하시겠습니까?")) {
		return;
	} 

	var usernum = $(this).attr("usernum");
	var ip = $(this).attr("ip");

	chrome.storage.local.get("blockedUsers", function(items) {
		var blockedUsers = items.blockedUsers;

		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (ip == "") {
			ip = $(".writerInfoContents").children(":eq(5)").text().slice(5);			
		}

		for (var i = 0; i < blockedUsers.length; i++) {
			blockedUser = blockedUsers[i];
			if (usernum == "") {
			    if (blockedUser.ip == ip) {
				    delete blockedUsers[i];
				}
			} else {
				if (blockedUser.usernum == usernum || blockedUser.ip == ip) {
				    delete blockedUsers[i];
				}
			}
		}

		chrome.storage.local.set({"blockedUsers": blockedUsers});
		
		location.reload();
	});
}

function showWriterIsBlocked(blockedUsers)
{
	writerIP =  $(".writerInfoContents > div:eq(5)").text();
	writerIP = writerIP.slice(5);

	writerNum = $(".writerInfoContents > div > button").attr("usernum");

	if (isBlockedUser(blockedUsers, writerNum, writerIP)) {
		$(".whole_box").attr("style", "width:100%;margin:0;padding:0;text-align:center;");
		$(".whole_box").addClass("blocked");
	}
}

function showOKListBlockedUsers(blockedUsers)
{
	$("#ok_layer > span.okSpan").each(function() {
		var usernum = $(this).nextAll("a:first").text();

		var text = $(this).text();
		if ($.trim(text) == "") {
			return;
		}

		var words = text.split(" ");
		var ip = $.trim(words[words.length - 3]);
		if (($.trim(words[words.length - 2])) == "") {
		    usernum = "";
		}

		if (isBlockedUser(blockedUsers, usernum, ip)) {
		    $(this).addClass("blockedOK");
		}
	});
}

function showReplyBlockedUsers(blockedUsers)
{
	$(".memoInfoDiv > font[color='red']:last-of-type").each(function() {
		var ip = $(this).text();
		ip = ip.slice(3);

		var usernum = $(this).parent().children("button").attr("usernum");

		if (isBlockedUser(blockedUsers, usernum, ip)) {
		    $(this).parent().parent().css("background-color", "#B3B2B2");
		}
	});
}

function showListBlockedUsers(blockedUsers)
{
	$("tr:has(td > a > font > b)").each(function(index) {
		var usernum = $(this).find("td > a:has(font > b)").attr("href").slice(24);

		if (isBlockedUser(blockedUsers, usernum)) {
			$(this).find("td > a:not(:has(font))").css("color", "#FF0000")
								   	  			  .css("text-decoration", "line-through");
		}
	});
}

function showBlockedUsers(blockedUsers)
{
	if (blockedUsers == undefined || blockedUsers.length == 0) {
	    return;
	}

	showWriterIsBlocked(blockedUsers);
	showReplyBlockedUsers(blockedUsers);
	showListBlockedUsers(blockedUsers);
	showOKListBlockedUsers(blockedUsers);
}

// 추첨

function lottery()
{
		var writer = $(".writerInfoContents > div > a > font > b").text();

		var commentWriters = [];

		$(".memoInfoDiv > a > font > b").each(function(index) {
			var username = this.firstChild.nodeValue;

			if (username == writer) {
				return;
			}
			if ($.inArray(username, commentWriters) !== -1) {
				return;
			}

			commentWriters.unshift(username);
		});

		var winner = commentWriters[Math.floor(Math.random() * commentWriters.length)];

		if (winner === undefined) {
			alert("추첨할 사람이 없습니다.");
			return;
		} 

		alert("당첨자: " + winner);
}

function reciveMessage(message, sender, sendResponse)
{
	if (message.text == "lottery") {
		lottery();
	} else if (message.text == "offBGMs") {
		offBGMs();
	}
}

// 베플

function showBestReply()
{
	var bestReply, secondReply;
	var maxOK = 0, secondOK = 0;
	$('.memoInfoDiv').each(function(index) {
		var okAndNokDiv = $(this).children('font[color="red"]');

		var html = okAndNokDiv.html();
		var okAndNokString = html.split(' / ');
		var okCount = parseInt(okAndNokString[0].split(':')[1]);
		var nokCount = parseInt(okAndNokString[1].split(':')[1]);
		
		if ((okCount >= 10) && (okCount/3 >= nokCount)) {
			if (okCount > secondOK) {
				if (okCount > maxOK) {
				    secondReply = bestReply;
				    bestReply = index;
				    secondOK = maxOK;
				    maxOK = okCount;
				} else {
					secondReply = index;
					secondOK = okCount;
				}
			}
		}
	});

	if (bestReply !== undefined) {
		var bestReplysDiv = $("<div></div>")
						   .attr("id", "bestReplyDiv")
						   .insertBefore($(".memoContainerDiv:first"));

		var firstReplyDiv = $('.memoContainerDiv:eq(' + bestReply + ')').clone(true, true);
		bestReplysDiv.append(firstReplyDiv);

		if (secondReply !== undefined) {
			var secondReplyHtml = $('.memoContainerDiv:eq(' + (secondReply+1) + ')').clone(true, true);
			bestReplysDiv.append(secondReplyHtml);	    
		}
	}	
}

// 짤
function addJjal(event)
{
	var jjalURL = event.data.jjalURL;
	$("textarea").val($("textarea").val() + jjalURL);
	hideJjals();
}

function showJjals()
{
	var jjalsDiv = $("#jjals").css("display", "block");

	if (jjalsDiv.attr("loaded") == undefined) {
		chrome.storage.local.get("jjals", function(items) {
			var jjals = items.jjals;

			if (jjals === undefined) {
				resetJjals();
			} else if(jjals.length == 0) {
				jjalsDiv.text("짤이 없습니다.");
				return;
			}

			for (var i = 0; i < jjals.length; i++) {
				var jjalURL = jjals[i];
				var jjal = $('<img src="' + jjalURL + '" class="jjal">')
						   .click({"jjalURL": jjalURL}, addJjal);
			    jjalsDiv.append(jjal);
			}

			jjalsDiv.attr("loaded", "loaded");
		});
	}
}

function hideJjals()
{
	$("#jjals").css("display", "none");
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

function offBGMs()
{
	(function() {
		function R(w) {
			try {
				var d=w.document,j,i,t,T,N,b,r=1,C;
				for(j=0;t=["object","embed","applet","iframe"][j];++j) {
					T=d.getElementsByTagName(t);

					for(i=T.length-1;(i+1)&&(N=T[i]);--i) {

						if (T[i].id == "ZeroClipboardMovie_1") {
						    continue;
						}

						if(j!=3||!R((C=N.contentWindow)?C:N.contentDocument.defaultView)) {
							b=d.createElement("div");
							b.style.width=N.width;
							b.style.height=N.height;b.innerHTML="<del>"+(j==3?"third-party "+t:t)+"</del>";
							N.parentNode.replaceChild(b,N);
						}
					}
				}
			}catch(E) {
				r=0;
			}
			return r
		}
		R(self);
		var i,x;
		for(i=0;x=frames[i];++i)
			R(x);
	})();
}

initPage();
chrome.storage.local.get("offBGMs", function(items) {
	if (items.offBGMs == true) {
		offBGMs();	    
	}
});
chrome.runtime.onMessage.addListener(reciveMessage);