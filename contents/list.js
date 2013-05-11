function showUsermemo()
{
	chrome.storage.local.get("usermemos", function(items) {
		var usermemos = items.usermemos;

		if ($.isEmptyObject(usermemos)) {
		    return;
		}

		$("td > a > font > b").each(function(index) {
			var username = this.firstChild.nodeValue;
			var usermemo = usermemos[username];

			if (usermemo == undefined) {
				return;
			}

			var memo = usermemo.memo;

			$(this).parent().parent().after("<b>[" + memo + "]</b> ");
		});
	});
}

function isBlockedUser(blockedUsers, usernum)
{
	var blockedCount = $.grep(blockedUsers, function(item) {
		return item.usernum == usernum;
	}).length;

	return blockedCount > 0;
}

function showBlockedUsers()
{
	chrome.storage.local.get("blockedUsers", function(items) {
		var blockedUsers = items.blockedUsers;

		if (blockedUsers.length == 0) {
			return;
		}

		$("tr:has(td > a > font > b)").each(function(index) {
			var usernum = $(this).find("td > a:has(font > b)").attr("href").slice(24);

			if (isBlockedUser(blockedUsers, usernum)) {
				$(this).find("td > a:not(:has(font))").css("color", "#FF0000")
									   	  			  .css("text-decoration", "line-through");
			}
		});
	});
}


showUsermemo();
showBlockedUsers();