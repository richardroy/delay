import TabNavigation from "../TabNavigation.js"
import Blacklist from "../Blacklist.js"
import NavEvent from "../NavEvent.js"
import Config from "../Config.js"
import Delay from "../Delay.js"

export default class CoreService {
  static intervalCompleted(tabId, blacklistEntry) {
    Delay.setAllowed(tabId);
    TabNavigation.redirectToOriginal(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onNavigationEventTrigged (data) {
    if (CoreService.isTopLevelFrame(data)) {
      const blacklistEntry = Blacklist.getByUrl(data.url);
      if(blacklistEntry) {
        CoreService.navigateToBlacklistEntry(data, blacklistEntry);
      }
    }
    Delay.removeInvalidTabs();
  }

  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }

  static navigateToBlacklistEntry(data, blacklistEntry) {
    var tabId = data.tabId;
    if(!Delay.isTabIdAllowed(tabId)){
      CoreService.initiateDelay(data.url, tabId, blacklistEntry);
    }
  }

  static initiateDelay(url, tabId, blacklistEntry) {
    TabNavigation.redirectTabToBackground(tabId);
    NavEvent.addNavigatedEvent(blacklistEntry);           
    if(Delay.isTabIdInDelay(tabId)) return;
    Delay.addNewTabToDelay(url, tabId);
    window["interval"+parseInt(tabId)] = setTimeout( () => CoreService.intervalCompleted(tabId, blacklistEntry), Config.getDelayTime() * 1000 )
  }

  static onTabClosed(tabId) {
    if(Delay.isTabIdInDelay(tabId))
      Delay.removeDelayEntriesWithTabIds([tabId]);
  }
  
}