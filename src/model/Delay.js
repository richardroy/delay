import LocalStorageService from "../services/LocalStorageService.js";
const DELAY = "delay";
const MINUTES_15 = 1000 * 60 * 0.25;
/**
 * Delay is saved in the LocalStorage
 * Used to list status of tabs. It contains array, sites:
 *    - "sites": [{
 *          actualUrl: "https://www.reddit.com/",
 *          tabId: 445,
 *          created: 15297377 70815,
 *          allowed: false
 *        },...
 *      ]
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
    if(objIndex != -1){
      delay.sites[objIndex].allowed = true;
      this.save(delay);
    }
  }

  static addNewTabToDelay(actualUrl, tabId) {
    const delay = this.load();
    const site = this.createDelayEntry(actualUrl, tabId);
    delay.sites.push(site);  
    this.save(delay);
  }

  static removeTimedOutTabs() {
    const delay = this.load();
    const filteredSites = delay.sites.filter((site) => {
      return this.wasCreatedLessThanXMinutesAgo(MINUTES_15, site.created);
    });

    this.save({...delay, sites: filteredSites})
  }

  static removeTabIdFromDelay(tabId) {
    const delay = this.load();
    const filteredSites = delay.sites.filter((site) => {
      return site.tabId != tabId;
    });

    this.save({...delay, sites: filteredSites})    
  }

  static wasCreatedLessThanXMinutesAgo(timeInSeconds, creationDate) {
    return (Date.now() - creationDate) < timeInSeconds;
  }

}
