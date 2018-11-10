chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        classes: {}
    });
});

function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

window.cloneObj = cloneObj;