function sendMessage(message)
{
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {text: message}, null);
	});
}

function toggleBGMs()
{
	chrome.storage.local.set({"offBGMs": this.checked});
	if (this.checked) {
		sendMessage("offBGMs");	    
	}
}