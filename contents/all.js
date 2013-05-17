chrome.storage.local.get("dblclickEnable", function(items) {
	var dblclickEnable = items.dblclickEnable;

	if (dblclickEnable == undefined) {
	    chrome.storage.local.set({"dblclickEnable": {"ou": true, "every": false}});
	    dblclickEnable = {"ou": true, "every": false};
	    return;
	}

	if (!items.dblclickEnable.ou) {
	    document.ondblclick = null;
	}
});

chrome.storage.local.get(["bookmarkEnable", "bookmarks"], function(items) {
	var bookmarkEnable = items.bookmarkEnable;
	if (bookmarkEnable == undefined) {
	    chrome.storage.local.set({"bookmarkEnable": true});
	    bookmarkEnable = true;
	}

	if (!bookmarkEnable) {
	    return;
	}

	var bookmarks = items.bookmarks;

	if (bookmarks == undefined || bookmarks.length == 0) {
	    return;
	}

	var bookmarksSelect = $('<select></select>')
				   		 .attr('id', 'bookmarks')
				  		 .append('<option>북마크</option>')
						 .appendTo("#logo_line_container")
				 		 .change(function() {
							 location.replace(this.options[this.selectedIndex].value);
						 });

	for (var i = 0; i < bookmarks.length; i++) {
		var bookmark = bookmarks[i];

		$('<option></options>')
		.text(bookmark.name)
		.val(bookmark.url)
		.appendTo(bookmarksSelect);
	};
});

chrome.storage.local.get(["shortcutEnable", "shortcuts"], function(items) {
	var shortcutEnable = items.shortcutEnable;

	if (shortcutEnable == undefined) {
		chrome.storage.local.set({"shortcutEnable": true});
	    shortcutEnable = true;
	}
	if (!shortcutEnable) {
	    return;
	}

	var shortcuts = items.shortcuts;
	if (shortcuts == undefined || shortcuts.length == 0) {
	    return;
	}

	var altPressed = false;
	var focused = false;

	$(':input').focus(function() {
		focused = true;
	});

	$(':input').blur(function() {
		focused = false;
	});

	$(document).keydown(function (e) {
		if (focused) {
		    return;
		}

		if (e.which == 18) {
		    altPressed = true;
		} else if (altPressed && e.which >= 48 && e.which <= 57) {
			var url = $.trim(shortcuts[e.which - 48]);
			if (url) {
				location.replace(url);
			}
		}
	});

	$(document).keyup(function (e) {
		if (e.which == 18) {
		    altPressed = false;
		}
	});
});