$("#lottery").click(function() {
	sendMessage("lottery");
});
$("#toggleBGMs").change(toggleBGMs);

chrome.storage.local.get("offBGMs", function(items) {
  $("#toggleBGMs").attr("checked", items.offBGMs);
});