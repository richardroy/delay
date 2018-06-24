import BrowserService from "./BrowserService.js"
import TabNavigation from "../TabNavigation.js"
import Blacklist from "../Blacklist.js"
import Config from "../Config.js"
import Delay from "../Delay.js"

export default class CoreService {
  static intervalCompleted(tabId, blacklistEntry) {
    Delay.setAllowed(tabId);
    TabNavigation.redirectToOriginal(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onNavigationEventTrigged (data) {
    console.log('onNavigationEventTrigge')
    if (CoreService.isTopLevelFrame(data)) {
      const blacklistEntry = Blacklist.getWithUrl(data.url);
      if(CoreService.existsInBlacklist(blacklistEntry)) {
        CoreService.navigatedToBlacklistEntry(data, blacklistEntry);
      }
    }
    CoreService.cleanDelay();
  }

  static cleanDelay() {
    const cleanTime = Config.getLastCleanDelay();
    if(!cleanTime) {
      Config.setCleanDelay(Date.now());
    } else if((new Date - cleanTime) < 1000 * 60 * 15){
      Delay.clean();
    }
  }
  
  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }
  
  static existsInBlacklist(blacklistEntry) {
    console.log('existsInBlacklist');
    return blacklistEntry && !(Object.keys(blacklistEntry).length === 0 && blacklistEntry.constructor === Object)
  }

  static navigatedToBlacklistEntry(data, blacklistEntry) {
    var tabId = data.tabId;
    if(!Delay.isTabIdAllowed(tabId)){
      CoreService.initiateDelay(data.url, tabId, blacklistEntry);
    }
  }

  static initiateDelay(url, tabId, blacklistEntry) {
    TabNavigation.redirectTabToBackground(tabId);
    Blacklist.addNavigatedEvent(blacklistEntry);           
    if(Delay.isTabIdInDelay(tabId)) return;
    Delay.addNewTabToDelay(url, tabId);
    window["interval"+parseInt(tabId)] = setTimeout( () => CoreService.intervalCompleted(tabId, blacklistEntry), Config.getDelayTime() * 1000 )
  }

  static onTabClosed(tabId, removeInfo) {
    console.log('onTabClosed');
    if(Delay.isTabIdInDelay(tabId))
      Delay.removeDelayEntryWithTabId(tabId);
  }
  
}