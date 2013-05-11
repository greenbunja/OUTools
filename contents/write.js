function saveText()
{
	if (!confirm("저장 하시겠습니까?")) {
	    return;
	}
	chrome.storage.local.get("savedTexts", function(items) {
		var subject = $("#subject").val();
		if ($("#tx_canvas_wysiwyg_holder").css("display") == "block") {
		    var text = $("#tx_canvas_wysiwyg").contents().find("body").html();
		} else {
			var text =  $("#tx_canvas_source").val();
		}

		var savedTexts = items.savedTexts;

		if (savedTexts == undefined) {
		    savedTexts = [];
		}

		var now = new Date();
		var nowString = now.getFullYear().toString() + '.' +
					    (now.getMonth() + 1).toString() + '.' +
					    now.getDate().toString() + ' ' +
					    now.getHours().toString() + ':' +
					    now.getMinutes().toString();

		savedTexts.unshift({"subject": subject, "text": text, "date": nowString});
		chrome.storage.local.set({"savedTexts": savedTexts});

		alert("저장 되었습니다.");
	});
}


function loadRecentSave()
{
	if (!confirm("불러 오시겠습니까?")) {
	    return;
	}


	chrome.storage.local.get("savedTexts", function(items) {	
		var savedTexts = items.savedTexts;

		if (savedTexts == undefined || savedTexts.length == 0) {
		    return;
		}
		
		var subject = $("#subject").val();

		if ($("#tx_canvas_wysiwyg_holder").css("display") == "block") {
		    var text = $("#tx_canvas_wysiwyg").contents().find("body").html();
		} else {
			var text =  $("#tx_canvas_source").val();
		}
		
		var now = new Date();
		var nowString = now.getFullYear().toString() + '.' +
					    (now.getMonth() + 1).toString() + '.' +
					    now.getDate().toString() + ' ' +
					    now.getHours().toString() + ':' +
					    now.getMinutes().toString();

		var savedText = savedTexts[0];

		$("#subject").val(savedText.subject);

		if ($("#tx_canvas_wysiwyg_holder").css("display") == "block") {
		    $("#tx_canvas_wysiwyg").contents().find("body").html(savedText.text);
		} else {
			$("#tx_canvas_source").val(savedText.text);
		}
		
		
		savedTexts.unshift({"subject": subject, "text": text, "date": nowString});
		chrome.storage.local.set({"savedTexts": savedTexts});
		alert("원래있던 글은 저장 되었습니다.");
	});
}

function autosave()
{
	chrome.storage.local.get("savedTexts", function(items) {
		var subject = $("#subject").val();
		if ($("#tx_canvas_wysiwyg_holder").css("display") == "block") {
		    var text = $("#tx_canvas_wysiwyg").contents().find("body").html();
		} else {
			var text =  $("#tx_canvas_source").val();
		}

		var savedTexts = items.savedTexts;

		if (savedTexts == undefined) {
		    savedTexts = [];
		}

		var now = new Date();
		var nowString = now.getFullYear().toString() + '.' +
					    (now.getMonth() + 1).toString() + '.' +
					    now.getDate().toString() + ' ' +
					    now.getHours().toString() + ':' +
					    now.getMinutes().toString();

		savedTexts.unshift({"subject": subject, "text": text, "date": nowString});
		chrome.storage.local.set({"savedTexts": savedTexts});
	});
}

function setAutosave()
{
	chrome.storage.local.get("AutosaveInterval", function(items) {
		var interval = items.AutosaveInterval;
		if (interval == undefined || interval <= 0 || interval > 60) {
		    return;
		}

		setInterval(autosave, interval * 60000);
	});
}

$("<button></button>")
.text("임시저장 하기")
.click(saveText)
.insertAfter($("#subject"));

$("<button></button>")
.text("최근 저장된 글 불러오기")
.click(loadRecentSave)
.insertAfter($("#subject"));

setAutosave();