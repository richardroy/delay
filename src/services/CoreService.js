import BrowserService from "./BrowserService.js"
import TabNavigation from "../TabNavigation.js"
import Blacklist from "../Blacklist.js"
import Config from "../Config.js"
import Delay from "../Delay.js"


export default class CoreService {
  static intervalCompleted(tabId, blacklistEntry) {
    TabNavigation.onBackgroundRedirectToOriginal(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onNavigationEventTrigged (data) {
    if (CoreService.isTopLevelFrame(data)) {
      const blacklistEntry = Blacklist.getWithUrl(data.url);
      if(CoreService.existsInBlacklist(blacklistEntry)) {
        CoreService.navigatedToBlacklistEntry(data, blacklistEntry);
      }
    }
  }
  
  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }
  
  static existsInBlacklist(blacklistEntry) {
    return blacklistEntry && !(Object.keys(blacklistEntry).length === 0 && blacklistEntry.constructor === Object)
  }

  static navigatedToBlacklistEntry(data, blacklistEntry) {
    var tabId = data.tabId;
    const delay = Delay.loadDelay();            
    if(!Delay.isTabIdInDelay(delay, tabId)){
      CoreService.initiateDelay(data.url, delay, tabId, blacklistEntry);
    }
  }

  static initiateDelay(url, delay, tabId, blacklistEntry) {
    Blacklist.increaseNavigatedCount(blacklistEntry);        
    Delay.addNewTabToDelay(delay, url, tabId);
    TabNavigation.redirectTabToBackground(tabId);
    window["interval"+parseInt(tabId)] = setTimeout( () => CoreService.intervalCompleted(tabId, blacklistEntry), Config.getDelayTime() * 1000 )
  }
  
}