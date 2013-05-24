function wrapOKText()
{
	$("#ok_layer").contents().filter(function() {
		  return this.nodeType == 3;
	})
	.wrap('<span class="okSpan"></span>');
}

function addOKListButtonsDivs()
{
	$("#ok_layer > .okSpan").each(function() {
		var $this = $(this);

		var text = $(this).text();
		if ($.trim(text) == "") {
			return;
		}

		var words = text.split(" ");

		var ip = $.trim(words[words.length - 3]);
		var username = $.trim(words[words.length - 2]);
		var usernum = $(this).next("a").text();

		if (username == "") {
		    usernum = "";
		}

		var buttonsSpan = $('<span></span>')
						  .addClass("buttonsSpan")
	  					  .attr("username", username)
						  .attr("usernum", usernum)
						  .attr("ip", ip);

		var num = $(this).next("a");
		if (num.length == 0) {
			buttonsSpan.insertAfter($this);
		} else {
			buttonsSpan.insertAfter(num);
		}
	});
}

function addButtonsSpans()
{
	var writerDiv = $(".writerInfoContents");

	var writerName = writerDiv.find("div > a > font > b").text();

	if (writerName != "") {
		var writerNumber = writerDiv.find("div > a").attr("href").slice(24);

		var writerIp = writerDiv.children(":eq(5)").html();
		writerIp = writerIp.slice(5);

		var buttonsSpan = $('<span></span>')
						  .addClass("buttonsSpan")
				  		  .attr("username", writerName)
						  .attr("usernum", writerNumber)
						  .attr("ip", writerIp)
						  .appendTo(writerDiv.children(":eq(1)"));
	}

	$(".memoInfoDiv").each(function() {
		var $this = $(this);

		var username = $this.find("a > font > b").text();

		if (username != "") {
    		var usernum = $this.children("a").attr("href").slice(15);

			var ip = $this.children("font[color='red']:last").text();
			ip = ip.slice(3);

			var buttonsSpan = $('<span></span>')
							  .addClass("buttonsSpan")
		  					  .attr("username", username)
							  .attr("usernum", usernum)
							  .attr("ip", ip)
							  .appendTo($this);
		}
	});

	addOKListButtonsDivs();
}

function addBlockButton(parent, isBlocked)
{
	if (isBlocked) {
		$("<button></button>")
		.attr("class", "blockButton")
		.text("IP 차단 헤제")
		.click(disableBlockedUser)
		.appendTo(parent);
	} else {
		$("<button></button>")
		.attr("class", "blockButton")
		.text("IP 차단")
		.click(blockUser)
		.appendTo(parent);
	}
}

function addMemoButton(parent)
{
	$("<button></button>")
	.attr("class", "memoButton")
	.text("회원메모")
	.appendTo(parent)
	.click(function() {
		var username = $(this).parent().attr("username");
		var usernum = $(this).parent().attr("usernum");

		chrome.storage.local.get("usermemos", function(items) {
			var usermemos = items.usermemos;

			if (usermemos == undefined) {
			    usermemos = {};
			}

			var memo = prompt("메모내용을 입력해주세요.");

			if ($.trim(memo) == "") {
			    return;
			}

			usermemos[usernum] = {"username": username, "memo": memo};
			chrome.storage.local.set({"usermemos": usermemos});
			
			showUsermemos(usermemos);
		});
	});
}

function addMemoButtons(selector)
{
	if (!selector) {
	    selector = "";
	}

	$(selector + ' .buttonsSpan').each(function() {
		var $this = $(this);

		if ($this.children(".memoButton").length != 0) {
		    return;
		}

		var usernum = $this.attr("usernum");

		if (usernum != "") {
			addMemoButton($this);
		}
	});
}

function addBlockButtons(blockedUsers, selector)
{
	if (blockedUsers == undefined) {
	    blockedUsers = [];
	}

	if (!selector) {
	    selector = "";
	}

	$(selector + ' .buttonsSpan').each(function() {
		var $this = $(this);

		if ($this.children(".blockButton").length != 0) {
		    return;
		}

		var username = $this.attr("username");

		var usernum = $this.attr("usernum");
		var ip = $this.attr("ip");
		ip = ip.slice(3);

		if (username != "") {
			var isBlocked = isBlockedUser(blockedUsers, usernum, ip);
			addBlockButton($this, isBlocked);
		} else if (username == "" && ip != "") {
			var isBlocked = isBlockedUser(blockedUsers, "", ip);
			addBlockButton($this, isBlocked);
		}
	});
}

// 회원메모

function showOKListUsermemos(usermemos)
{
	$("#ok_layer > .okSpan").each(function() {
		var usernum = $(this).next('a').text();
		var usermemo = usermemos[usernum];
		
		if (usermemo != undefined) {
			var memoSpan = $(this).children("span.memoSpan");
			if (memoSpan.length == 0) {
			    $(this).append('<span class="memoSpan"><b>[' + usermemo.memo + ']</b></span>');
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
		var usernum = $(this).attr("href").split('mn=')[1];
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

	var usernum = $this.parent().attr("usernum");
	var username = $this.parent().attr("username");
	var ip = $this.parent().attr("ip");

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

		blockedUsers.unshift({"username": username, "usernum": usernum, "ip": ip});
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

	var usernum = $(this).parent().attr("usernum");
	var ip = $(this).parent().attr("ip");

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
	if (blockedUsers == undefined) {
	    blockedUsers = [];
	}

	$("#ok_layer > span.okSpan").each(function() {
		var usernum = $(this).next("a").text();

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

// 짤
function addJjal(event)
{
	var jjalURL = this.src;
	$("textarea").val($("textarea").val() + jjalURL);
	hideJjals();
}

function hideJjals()
{
	$("#jjals").css("display", "none");
}

function offBGMs()
{
	function R(w) {
		try {
			var d=w.document,j,i,t,T,N,b,r=1,C;
			for(j=0;t=["object", "embed", "applet", "iframe", "video", "audio"][j];++j) {
				T=d.getElementsByTagName(t);

				for(i=T.length-1;(i+1)&&(N=T[i]);--i) {
					var parents = $(T[i]).parents(".contentContainer, #tail_layer");
					if (parents.length == 0) {
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
}

(function () {
	var xbutton = $('<img src="' + chrome.extension.getURL("images/xbutton.png") + '" id="xbutton">')
				  .click(hideJjals);
	$('<div id="jjals"></div>').append(xbutton)
							   .appendTo($("body"));

	$('<input type="button" value="자주쓰는 짤중에서 선택하기">')
	.appendTo($("#memo_insert_submit_image").parent().next())
	.click(function () {
		var jjalsDiv = $("#jjals").css("display", "block");

		if (jjalsDiv.attr("loaded") == undefined) {
			chrome.storage.local.get("jjals", function(items) {
				var jjals = items.jjals;

				if (jjals === undefined) {
				    jjals = resetJjals();
				} else if(jjals.length == 0) {
					jjalsDiv.text("짤이 없습니다.");
					return;
				}

				for (var i = 0; i < jjals.length; i++) {
					var jjalURL = jjals[i];
					$('<img></img>')
					.attr("src", jjalURL)
					.addClass("jjal")
				    .appendTo(jjalsDiv)
				    .click(function() {
			    		var jjalURL = this.src;
						$("textarea").val($("textarea").val() + jjalURL);
						hideJjals();
				    })
				    .error(function() {
				    	this.parentNode.removeChild(this);
				    });
				}

				jjalsDiv.attr("loaded", "loaded");
			});
		}
	});

	wrapOKText();

	chrome.storage.local.get(["blockEnable", "memoEnable", "usermemos", "blockedUsers"], function(items) {
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

		if (!blockEnable && !memoEnable) {
		    return;
		}

		addButtonsSpans();

		$("center > input").click(function () {
			chrome.storage.local.get(["usermemos", "blockedUsers"], function(items) {
				wrapOKText();

				var usermemos = items.usermemos;
				var blockedUsers = items.blockedUsers;

				if (!memoEnable && !blockEnable) {
				    return;
				}

				addOKListButtonsDivs();

				if (memoEnable) {
					if (usermemos != undefined) {
			    		showOKListUsermemos(usermemos);
					}
					addMemoButtons('#ok_layer');
				}
				if (blockEnable) {
					if (blockedUsers != undefined) {
						showOKListBlockedUsers(blockedUsers);
					}
					addBlockButtons(blockedUsers, '#ok_layer');
				}
			});
		});

		var usermemos = items.usermemos;
		if (usermemos == undefined) {
		    usermemos = {};
		}

		if (memoEnable) {
			addMemoButtons();
			showUsermemos(usermemos);					    
		}

		var blockedUsers = items.blockedUsers;
		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (blockEnable) {
			addBlockButtons(blockedUsers);
			showBlockedUsers(blockedUsers);
		}
	});

	chrome.storage.local.get("bestReplyEnable", function(items) {
		var bestReplyEnable = items.bestReplyEnable;

		if (bestReplyEnable == undefined) {
		    chrome.storage.local.set({"bestReplyEnable": false});
		    bestReplyEnable = false;
		}

		if (bestReplyEnable) {
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
	}) ;

	chrome.storage.local.get("offBGMs", function(items) {
		if (items.offBGMs == true) {
			offBGMs();	    
		}
	});

	chrome.storage.local.get("styleRemoveEnable", function(items) {
		if (items.styleRemoveEnable == true) {
			$("#tail_layer style, contentContainer style").remove();
		}
	});

	chrome.runtime.onMessage.addListener(function(message) {
		if (message.text == "lottery") {
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
		} else if (message.text == "offBGMs") {
			offBGMs();
		}
	});
})();