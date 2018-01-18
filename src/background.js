import Blacklist from "./Blacklist.js"
import Config from "./Config.js"
import Delay from "./Delay.js"
import Tab from "./Tab.js"

function intervalCompleted(tabId, blacklistObject) {
  console.log("intervalCompleted");
  Tab.onHomeRedirectToOriginal(tabId, blacklistObject);
  clearInterval(window["interval"+parseInt(tabId)]);
}

chrome.webNavigation["onBeforeNavigate"].addListener(data => {
  if (data.parentFrameId === -1) {
    const blacklistObject = Blacklist.getWithUrl(data.url);
    if(blacklistObject) {
      var tabId = data.tabId;
      const delay = Delay.loadDelay();            
      if(!Delay.isTabIdInDelay(delay, tabId)){
        Blacklist.increaseNavigatedCount(blacklistObject);        
        Delay.addNewTabToDelay(delay, data.url, tabId);
        Tab.redirectTabToBackground(tabId);
        window["interval"+parseInt(tabId)] = setInterval( () => intervalCompleted(tabId, blacklistObject), Config.getDelayTime() * 1000 );
      }
    }
  }
});

chrome.browserAction.onClicked.addListener(function (tab) {
  Tab.redirectTabToHome(tab.id);
})
