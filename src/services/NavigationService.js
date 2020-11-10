import TabNavigation from "../TabNavigation.js"
import Blacklist from "../model/Blacklist.js"
import Config from "../model/Config.js"
import Tab from "../model/Tab.js"
import NavEvents, { EVENT } from "../model/NavEvents";
import BrowserService from "./BrowserService.js";

export default class NavigationService {

  static async onNavigationEventTrigged (eventData) {
    if(!eventData) return;
    if (await Config.isExtensionEnabled() && NavigationService.isTopLevelFrame(eventData)) {
      BrowserService.getSelectedTab(null, (tab) => NavigationService.processSelectedTab(tab, eventData));
    }
  }

  static async processSelectedTab(tab, eventData) {
    const tabId = eventData.tabId;
    if(tabId === tab.id) {
      const blacklistEntry = await Blacklist.getByUrl(eventData.url);
      if(blacklistEntry) {
        NavigationService.navigateToBlacklistEntry(eventData, blacklistEntry);
      }
      Tab.removeTimedOutTabs();
    }
  }

  static isTopLevelFrame(eventData) {
    return eventData.parentFrameId === -1;
  }

  static async navigateToBlacklistEntry(eventData, blacklistEntry) {
    var tabId = eventData.tabId;
    if(await NavigationService.shoudlTabBeDelayed(tabId)){
      NavigationService.initiateDelay(eventData.url, tabId, blacklistEntry);
    }
  }

  static async shoudlTabBeDelayed(tabId) {
    return !(await Tab.isTabIdStored(tabId) && await Tab.isTabIdAllowed(tabId))
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