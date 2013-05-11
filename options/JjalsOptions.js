$("#editJjalNumber").submit(editJjalNumber);
$("#resetJjals").click(function() {
	if (!confirm("정말로 초기화 하시겠습니까?")) {
	    return;
	}

	resetJjals();
	location.reload();
});
ShowJjalsTable();
$("#addJjal").click(addJjal)
