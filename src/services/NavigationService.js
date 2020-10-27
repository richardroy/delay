import TabNavigation from "../TabNavigation.js"
import Blacklist from "../model/Blacklist.js"
import Config from "../model/Config.js"
import Tab from "../model/Tab.js"
import NavEvents, { EVENT } from "../model/NavEvents";

export default class NavigationService {

  static async onNavigationEventTrigged (data) {
    if (JSON.parse(await Config.isExtensionEnabled()) && NavigationService.isTopLevelFrame(data)) {
      chrome.tabs.getSelected(null, async function(tab) {
        const tabId = data.tabId;
        if(tabId === tab.id) {
          const blacklistEntry = await Blacklist.getByUrl(data.url);
          if(blacklistEntry) {
            NavigationService.navigateToBlacklistEntry(data, blacklistEntry);
          }
          Tab.removeTimedOutTabs();
        }
      });
    }
  }

  static isTopLevelFrame(data) {
    return data.parentFrameId === -1;
  }

  static async navigateToBlacklistEntry(data, blacklistEntry) {
    var tabId = data.tabId;
    if(!(await Tab.isTabIdStored(tabId)) && !(await Tab.isTabIdAllowed(tabId))){
      NavigationService.initiateDelay(data.url, tabId, blacklistEntry);
    }
  }

  static async initiateDelay(url, tabId, blacklistEntry) {
    TabNavigation.redirectTabToBackground(tabId);
    NavEvents.add(EVENT.NAVIGATED);
    Tab.addNewTab(url, tabId);
    window["interval"+parseInt(tabId)] = setTimeout( () => NavigationService.intervalCompleted(tabId, blacklistEntry), await Config.getDelayTime() * 1000 )
  }

  static intervalCompleted(tabId, blacklistEntry) {
    Tab.setAllowed(tabId);
    TabNavigation.loadDelayedUrl(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onTabClosed(tabId) {
    if(Tab.isTabIdStored(tabId))
      Tab.removeTabById([tabId]);
  }
  
}