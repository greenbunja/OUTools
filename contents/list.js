function isBlockedUser(blockedUsers, usernum)
{
	var blockedCount = $.grep(blockedUsers, function(item) {
		return item.usernum == usernum;
	}).length;

	return blockedCount > 0;
}

(function() {
	chrome.storage.local.get(["blockedUsers", "blockEnable"], function(items) {
		if (items.blockEnable == undefined) {
			chrome.storage.local.set({"blockEnable": true});
		    blockEnable = true;
		    return;
		}
		if (!items.blockEnable) {
		    return;
		}


		var blockedUsers = items.blockedUsers;

		if (blockedUsers == undefined) {
		    return;
		}

		if (blockedUsers.length == 0) {
			return;
		}

		$("tr:has(td > a > font > b)").each(function(index) {
			var usernum = $(this).find("td > a:has(font > b)").attr("href").split('mn=')[1];

			if (isBlockedUser(blockedUsers, usernum)) {
				$(this).find("td > a:not(:has(font))").css("color", "#FF0000")
									   	  			  .css("text-decoration", "line-through");
			}
		});
	});

	chrome.storage.local.get(["usermemos", "memoEnable"], function(items) {
		var memoEnable = items.memoEnable;

		if (memoEnable == undefined) {
			chrome.storage.local.set({"memoEnable": true});
		    memoEnable = true;
		}

		if (!memoEnable) {
		    return;
		}

		var usermemos = items.usermemos;

		if (usermemos == undefined) {
		    return;
		}

		if ($.isEmptyObject(usermemos)) {
		    return;
		}

		$("td > a > font > b").each(function(index) {
			var usernum = $(this).parent().parent().attr("href").split('mn=')[1];
			var usermemo = usermemos[usernum];

			if (usermemo == undefined) {
				return;
			}

			var memo = usermemo.memo;

			$(this).parent().parent().after("<b>[" + memo + "]</b> ");
		});
	});
})();