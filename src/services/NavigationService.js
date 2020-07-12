import TabNavigation from "../TabNavigation.js"
import Blacklist from "../model/Blacklist.js"
import NavEvent from "../model/NavEvent.js"
import Config from "../model/Config.js"
import Delay from "../model/Delay.js"

export default class NavigationService {

  static onNavigationEventTrigged (data) {
    if (JSON.parse(Config.isExtensionEnabled()) && NavigationService.isTopLevelFrame(data)) {
      chrome.tabs.getSelected(null, function(tab) {
        const tabId = data.tabId;
        if(tabId === tab.id) {
          const blacklistEntry = Blacklist.getByUrl(data.url);
          if(blacklistEntry) {
            NavigationService.navigateToBlacklistEntry(data, blacklistEntry);
          }
          Delay.removeTimedOutTabs();
        }
      });
    }
  }

  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }

  static navigateToBlacklistEntry(data, blacklistEntry) {
    var tabId = data.tabId;
    if(!Delay.isTabIdInDelay(tabId) && !Delay.isTabIdAllowed(tabId)){
      NavigationService.initiateDelay(data.url, tabId, blacklistEntry);
    }
  }

  static initiateDelay(url, tabId, blacklistEntry) {
    TabNavigation.redirectTabToBackground(tabId);
    NavEvent.addNavigatedEvent(blacklistEntry);           
    Delay.addNewTabToDelay(url, tabId);
    window["interval"+parseInt(tabId)] = setTimeout( () => NavigationService.intervalCompleted(tabId, blacklistEntry), Config.getDelayTime() * 1000 )
  }

  static intervalCompleted(tabId, blacklistEntry) {
    Delay.setAllowed(tabId);
    TabNavigation.loadDelayedUrl(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onTabClosed(tabId) {
    if(Delay.isTabIdInDelay(tabId))
      Delay.removeTabIdFromDelay([tabId]);
  }
  
}