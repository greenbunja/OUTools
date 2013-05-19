$("#editMemos").submit(saveMemo);
$("#editBlocked").submit(saveBlocked);
$("#editOptions").submit(saveOptions)
$("#add_bookmark").submit(addBookmark);
$("#edit_bookmarks_num").submit(saveBookmarks)
$('#edit_shortcuts').submit(saveShortcuts);
showOptions();
showUsermemosTable();
showBlockedUsersTable();
showSavedTextsTable();
showBookmarksTable();

(function() {
	var elements = document.getElementById("edit_shortcuts").elements;
	
 	chrome.storage.local.get("shortcuts", function(items) {
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
})();

$("#addBlockedUser").click(addBlockedUser);

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