$("#editJjalNumber").submit(function() {
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
});


$("#resetJjals").click(function() {
	if (!confirm("정말로 초기화 하시겠습니까?")) {
	    return;
	}

	resetJjals(function() {
		location.reload();
	});
});

function ShowJjalsTable(jjals) {
	if (jjals == undefined) {
    	chrome.storage.local.get("jjals", function(items) {
    		if (items.jjals == undefined) {
				resetJjals(function(jjals) {
					ShowJjalsTable(jjals);
				});
			} else if (items.jjals.length == 0) {
			    $("#JjalsTableDiv").text("짤이 없습니다.");
			    return;
			} else {
				ShowJjalsTable(items.jjals);
			}
    	});
	} else {
		var table = document.getElementById("JjalsTableDiv").appendChild(document.createElement("table"));

		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));

		$(row).append("<th>번호</th>")
			  .append("<th>짤</th>")
			  .append("<th></th>")
			  .append("<th>번호</th>")
			  .append("<th>짤</th>")
			  .append("<th></th>")
			  .append("<th>번호</th>")
			  .append("<th>짤</th>")
			  .append("<th></th>");
			  
		var tbody = table.appendChild(document.createElement("tbody"));

		var row;
		for (var i = 0; i < jjals.length ; i++) {
			var jjal = jjals[i];

			if (i%3 == 0) {
				row = tbody.appendChild(document.createElement("tr"));
			}

			var jjalNum = row.appendChild(document.createElement("td"))
			   				 .appendChild(document.createElement("input"));

			jjalNum.type = "number";
			jjalNum.value = i + 1;
			jjalNum.min = 1;
			jjalNum.max = jjals.length;

			var image = row.appendChild(document.createElement("td"))
				    	   .appendChild(document.createElement("img"));
			image.src = jjal;
			image.className = "jjal";
			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("index", i)
						.text("삭제")
						.click(function() {
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
			});
		}
		$('<input></input>')
		.attr("type", "submit")
		.val("변경저장")
		.appendTo("#editJjalNumber");
	}
}

ShowJjalsTable();

$("#addJjal").click(function() {
	var jjalURL = prompt("추가할 짤의 주소를 입력해주세요.");
	if (!($.trim(jjalURL))) {
		return
	}

	chrome.storage.local.get("jjals", function(items) {
		function addJjal(jjals)
		{
			if (jjals == undefined) {
		        resetJjals(addJjal);
			} else {
				jjals.unshift(jjalURL);
				chrome.storage.local.set({"jjals": jjals});

				location.reload();
			}
		}
		addJjal(items.jjals);
	});
});


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