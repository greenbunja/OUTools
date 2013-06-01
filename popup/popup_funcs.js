function sendMessage(message, callback)
{
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {text: message});
		callback();
	});
}