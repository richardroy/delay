import TabNavigationService from "./TabNavigationService.js"
import Blacklist from "../model/Blacklist.js"
import Config from "../model/Config.js"
import Tab from "../model/Tab.js"
import NavEvents, { EVENT } from "../model/NavEvents";
import BrowserService from "./BrowserService.js";
import BulkBlockList from "../model/BulkBlockList.js";

export default class NavigationService {

  static async onNavigationEventTrigged (eventData) {
    if(!eventData) return;
    if (await Config.isExtensionEnabled() && NavigationService.isTopLevelFrame(eventData)) {
      NavigationService.processTab(eventData);
    }
  }

  static async processTab(eventData) {
    const blacklistEntry = await Blacklist.getByUrl(eventData.url);
    const inBulkList = BulkBlockList.contains(eventData.url);
    if(blacklistEntry || inBulkList) {
      NavigationService.navigateToBlacklistEntry(eventData, blacklistEntry);
    }
    Tab.removeTimedOutTabs();
  }

  static isTopLevelFrame(eventData) {
    return eventData.parentFrameId === -1;
  }

  static async navigateToBlacklistEntry(eventData, blacklistEntry) {
    var tabId = eventData.tabId;
    if(await NavigationService.shouldTabBeDelayed(tabId)){
      NavigationService.initiateDelay(eventData.url, tabId, blacklistEntry);
    }
  }

  static async shouldTabBeDelayed(tabId) {
    return !(await Tab.isTabIdStored(tabId) && await Tab.isTabIdAllowed(tabId))
  }

  static async initiateDelay(url, tabId, blacklistEntry) {
    TabNavigationService.redirectTabToBackground(tabId);
    NavEvents.add(EVENT.NAVIGATED);
    Tab.addNewTab(url, tabId);
    const totalDelayTime =  await Config.getDelayTime() * 1000;
    window["interval"+parseInt(tabId)] = setTimeout( () => NavigationService.processInterval(tabId, blacklistEntry, totalDelayTime, 0), 250 )
  }

  static processInterval(tabId, blacklistEntry, totalDelayTime, intervalTime) {
    BrowserService.getTab(tabId, (tab) => {
      if(tab.active) {
        intervalTime += 250;
        if(intervalTime >= totalDelayTime) {
          NavigationService.intervalCompleted(tabId, blacklistEntry)
          return;
        }
      }
        
      window["interval"+parseInt(tabId)] = setTimeout( () => NavigationService.processInterval(tabId, blacklistEntry, totalDelayTime, intervalTime), 250 )
    })
  }

  static intervalCompleted(tabId, blacklistEntry) {
    Tab.setAllowed(tabId);
    TabNavigationService.loadDelayedUrl(tabId, blacklistEntry);
    clearTimeout(window["interval"+parseInt(tabId)]);
  }

  static onTabClosed(tabId) {
    if(Tab.isTabIdStored(tabId))
      Tab.removeTabById([tabId]);
  }
  
}