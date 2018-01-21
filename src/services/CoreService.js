import BrowserService from './BrowserService.js'
import Blacklist from "../Blacklist.js"
import Config from "../Config.js"
import Delay from "../Delay.js"
import Tab from "../TabNavigation.js"


export default class CoreService {
  static intervalCompleted(tabId, blacklistObject) {
    Tab.onHomeRedirectToOriginal(tabId, blacklistObject);
    clearInterval(window["interval"+parseInt(tabId)]);
  }
  
  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }
  
  static blacklistEntryExists(blacklistEntry) {
    return blacklistEntry && !(Object.keys(blacklistEntry).length === 0 && blacklistEntry.constructor === Object)
  }
  
  static onNavigationEventTrigged (data) {
    if (CoreService.isTopLevelFrame(data)) {
      const blacklistEntry = Blacklist.getWithUrl(data.url);
      if(CoreService.blacklistEntryExists(blacklistEntry)) {
        var tabId = data.tabId;
        const delay = Delay.loadDelay();            
        if(!Delay.isTabIdInDelay(delay, tabId)){
          Blacklist.increaseNavigatedCount(blacklistEntry);        
          Delay.addNewTabToDelay(delay, data.url, tabId);
          Tab.redirectTabToBackground(tabId);
          window["interval"+parseInt(tabId)] = setInterval( () => CoreService.intervalCompleted(tabId, blacklistEntry), Config.getDelayTime() * 1000 );
        }
      }
    }
  }
}