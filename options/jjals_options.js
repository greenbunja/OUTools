$("#editJjalNumber").submit(saveJjalsNum);
$("#resetJjals").click(function() {
	if (!confirm("정말로 초기화 하시겠습니까?")) {
	    return;
	}

	resetJjals();
	location.reload();
});
ShowJjalsTable();
$("#addJjal").click(addJjal)


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