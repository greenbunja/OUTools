$("#editMemos").submit(saveMemo);
$("#editBlocked").submit(saveBlocked);
$("#editOptions").submit(saveOptions)
$("#add_bookmark").submit(addBookmark);
$("#edit_bookmarks_num").submit(saveBookmarks)
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