console.log("Up and running 🏃‍♂️");

function addToHistory(data = null) {
  chrome.storage.sync.set({
    history: {
      data,
      path: window.location.pathname + window.location.search,
      timestamp: new Date().getTime(),
    },
  });
}

// Probably not the best to have this here
addToHistory()

function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function buildNoneFoundElement(tag) {
  var el = document.createElement(tag);
  el.classList.add("none-found");
  el.textContent = "None found";
  return el;
}

function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "";
}

function setTheme() {
  chrome.storage.sync.get("theme", (result) => {
    document.body.dataset.theme = result.theme;
  });
}

setTheme();
