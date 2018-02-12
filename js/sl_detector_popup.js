console.log("ran sl popup!");

var checkPage = function() {
    console.log("check page");

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {});
    });
}

var checkPageButton = document.getElementsByClassName("check-page-button")[0];
// checkPageButton.dataset.bgColorCode = bgColorCode;
checkPageButton.addEventListener("click", checkPage);

