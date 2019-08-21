import LocalStorageService from "./services/LocalStorageService";
const DELAY = "delay";

/**
 * Delay is saved in the LocalStorage
 * Used to list status of tabs, contains array, sites:
 *    - {
 *        actualUrl: "https://www.reddit.com/",
 *        tabId: 445,
 *        created: 1529737770815,
 *        allowed: false
 *      }
 * 
 */
export default class Delay {

  static createDelayEntry(actualUrl, tabId) {
    const created = Date.now();
    return { 
      actualUrl, 
      tabId, 
      created, 
      allowed: false
    }
  }

  static getSiteByTabId(tabId) {
    let delay = Delay.load();
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        return site;
    }
    return null;
  }

  static save(delay) {
    LocalStorageService.saveObject(DELAY, delay)
  }

  static load() {
    return LocalStorageService.loadObject(DELAY, {sites: []});
  }

  static isTabIdInDelay(tabId) {
    const site = this.getSiteByTabId(tabId);
    return site != null;
  }

  static isTabIdAllowed(tabId) {
    const site = this.getSiteByTabId(tabId);
    return site && site.allowed;
  }

  static setAllowed(tabId) {
    let delay = Delay.load();
    const objIndex = delay.sites.findIndex((delay => delay.tabId === tabId));
    delay.sites[objIndex].allowed = true;
    this.save(delay);
  }

  static addNewTabToDelay(actualUrl, tabId) {
    const delay = this.load();
    const site = this.createDelayEntry(actualUrl, tabId);
    delay.sites.push(site);  
    this.save(delay);
  }

  static clean() {
    const sitesToRemove = [];
    const delay = this.load();
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if ((Date.now() - site.created) > 1000 * 60 * 15) {
        sitesToRemove.push(site.tabId);
      }
    }
    
    this.removeDelayEntriesWithTabIds(sitesToRemove);
  }

  static removeDelayEntriesWithTabIds(sitesToRemove) {
    const delay = this.load();
    const filteredSites = delay.sites.filter(function(site){
      return !sitesToRemove.includes(site.tabId);
    });
    const updatedDelay = { ...delay, sites: filteredSites };
    this.save(updatedDelay);
  }

}
