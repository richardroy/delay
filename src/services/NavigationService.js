import TabNavigationService from "./TabNavigationService.js"
import Blacklist from "../model/Blacklist.js"
import Config from "../model/Config.js"
import Tab from "../model/Tab.js"
import NavEvents, { EVENT } from "../model/NavEvents";
import BrowserService from "./BrowserService.js";
import BulkBlockList from "../model/BulkBlockList.js";
import Whitelist from "../model/Whitelist.js"; // NEW

// Store timeout intervals (replaces window object storage for service worker compatibility)
const activeIntervals = new Map();

export default class NavigationService {

  static async onNavigationEventTrigged (eventData) {
    if(!eventData) return;
    if (await Config.isExtensionEnabled() && NavigationService.isTopLevelFrame(eventData)) {
      NavigationService.processTab(eventData);
    }
  }

  static async onTabUpdated (tabId, update, tabInfo) {
    if(await Config.isExtensionEnabled() && update.status && update.status == 'complete') {
      NavigationService.processTab({url: tabInfo.url, tabId: tabInfo.id});
      Tab.removeTimedOutTabs();
    }
  }

  static isInternalUrl(url) {
    return url?.startsWith('chrome-extension://') || url?.startsWith('chrome://');
  }

  static async processTab(eventData) {
    const url = eventData.url;
    if (!url) return;
    if (NavigationService.isInternalUrl(url)) {
      // never delay internal chrome/extension pages
      return;
    }

    // Whitelist overrides everything
    const whitelisted = await Whitelist.getByUrl(url);
    if (whitelisted) {
      Tab.removeTimedOutTabs();
      return;
    }

    const blockAll = await Config.isBlockAllEnabled();
    let shouldDelay = false;

    if (blockAll) {
      shouldDelay = true;
    } else {
      const blacklistEntry = await Blacklist.getByUrl(url);
      const inBulkList = await BulkBlockList.contains(url);
      shouldDelay = !!blacklistEntry || !!inBulkList;
    }

    if (shouldDelay) {
      // Pass the url through as the "desiredUrl" parameter (matches existing pattern)
      NavigationService.navigateToBlacklistEntry(eventData, url);
    }
    Tab.removeTimedOutTabs();
  }

  static isTopLevelFrame(eventData) {
    return eventData.parentFrameId === -1 && eventData.documentLifecycle == 'active';
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
    TabNavigationService.redirectTabToBackground(tabId, blacklistEntry);
    NavEvents.add(EVENT.NAVIGATED);
    Tab.addNewTab(url, tabId);
    const totalDelayTime =  await Config.getTotalDelay();
    const intervalId = setTimeout( () => NavigationService.processInterval(tabId, blacklistEntry, totalDelayTime * 1000, 0), 250 );
    activeIntervals.set(tabId, intervalId);
    Config.increaseIncTime();
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
        
      const intervalId = setTimeout( () => NavigationService.processInterval(tabId, blacklistEntry, totalDelayTime, intervalTime), 250 );
      activeIntervals.set(tabId, intervalId);
    })
  }

  static intervalCompleted(tabId, blacklistEntry) {
    Tab.setAllowed(tabId);
    TabNavigationService.loadDelayedUrl(tabId, blacklistEntry);
    const intervalId = activeIntervals.get(tabId);
    if (intervalId) {
      clearTimeout(intervalId);
      activeIntervals.delete(tabId);
    }
  }

  static onTabClosed(tabId) {
    if(Tab.isTabIdStored(tabId))
      Tab.removeTabById([tabId]);
    
    // Clean up any active intervals for the closed tab
    const intervalId = activeIntervals.get(tabId);
    if (intervalId) {
      clearTimeout(intervalId);
      activeIntervals.delete(tabId);
    }
  }
  
}