import Blacklist from "./Blacklist.js"
import Delay from "./Delay.js"
import Tab from "./Tab.js"

function intervalCompleted(tabId) {
  Tab.onHomeRedirectToOriginal(tabId);
  clearInterval(window["interval"+parseInt(tabId)]);
}

chrome.webNavigation["onBeforeNavigate"].addListener(data => {
  if (typeof data) {
    if(Blacklist.containsUrl(data.url)) {
      var tabId = data.tabId;
      const delay = Delay.loadDelay();            
      if(!Delay.isTabIdInDelay(delay, tabId)){
        Delay.addNewTabToDelay(delay, data.url, tabId);
        Tab.redirectTabToBackground(tabId);
        window["interval"+parseInt(tabId)] = setInterval( () => intervalCompleted(tabId), 5000 );
      }
    }
  } else
    console.error(chrome.i18n.getMessage('inHandlerError'), e);
});

chrome.browserAction.onClicked.addListener(function (tab) {
  Tab.redirectTabToHome(tab.id);
})
