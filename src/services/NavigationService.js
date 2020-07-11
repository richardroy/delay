import TabNavigation from "../TabNavigation.js"
import Blacklist from "../Blacklist.js"
import NavEvent from "../NavEvent.js"
import Config from "../Config.js"
import Delay from "../Delay.js"

export default class NavigationService {

  static onNavigationEventTrigged (data) {
    if (NavigationService.isTopLevelFrame(data)) {
      chrome.tabs.getSelected(null, function(tab){
        const tabId = data.tabId;
        if(tabId === tab.id) {
          const blacklistEntry = Blacklist.getByUrl(data.url);
          if(blacklistEntry) {
            NavigationService.navigateToBlacklistEntry(data, blacklistEntry);
          }
          Delay.removeInvalidTabs();
        }
      });
    }
  }

  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }

  static navigateToBlacklistEntry(data, blacklistEntry) {
    var tabId = data.tabId;
    if(!Delay.isTabIdAllowed(tabId)){
      NavigationService.initiateDelay(data.url, tabId, blacklistEntry);
    }
  }

  static initiateDelay(url, tabId, blacklistEntry) {
    TabNavigation.redirectTabToBackground(tabId);
    NavEvent.addNavigatedEvent(blacklistEntry);           
    if(Delay.isTabIdInDelay(tabId)) return;
    Delay.addNewTabToDelay(url, tabId);
    window["interval"+parseInt(tabId)] = setTimeout( () => NavigationService.intervalCompleted(tabId, blacklistEntry), Config.getDelayTime() * 1000 )
  }

  static intervalCompleted(tabId, blacklistEntry) {
    Delay.setAllowed(tabId);
    TabNavigation.redirectToOriginal(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onTabClosed(tabId) {
    if(Delay.isTabIdInDelay(tabId))
      Delay.removeDelayEntriesWithTabIds([tabId]);
  }
  
}