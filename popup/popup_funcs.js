function sendLotteryMessage()
{
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {text: "lottery"}, null);
	});
}
