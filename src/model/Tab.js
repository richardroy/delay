import LocalStorageService from "../services/LocalStorageService.js";
const TAB = "tab";
const MINUTES_15 = 1000 * 60 * 0.25;
/**
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

export default class Tab {

  static createTabEntry(actualUrl, tabId) {
    const created = Date.now();
    return { 
      actualUrl, 
      tabId, 
      created, 
      allowed: false
    }
  }

  static async getSiteByTabId(tabId) {
    let tab = await Tab.load();
    for(var siteIndex in tab.sites) {
      const site = tab.sites[siteIndex];
      if (site.tabId === tabId)
        return site;
    }
    return null;
  }

  static save(tab) {
    LocalStorageService.saveObject(TAB, tab)
  }

  static async load() {
    return await LocalStorageService.loadObject(TAB, {sites: []});
  }

  static async isTabIdStored(tabId) {
    const site = await this.getSiteByTabId(tabId);
    return site != null;
  }

  static async isTabIdAllowed(tabId) {
    const site = await this.getSiteByTabId(tabId);
    return site && site.allowed;
  }

  static async setAllowed(tabId) {
    let tab = await Tab.load();
    const objIndex = tab.sites.findIndex((tab => tab.tabId === tabId));
    if(objIndex != -1){
      tab.sites[objIndex].allowed = true;
      this.save(tab);
    }
  }

  static async addNewTab(actualUrl, tabId) {
    const tab = await this.load();
    const site = this.createTabEntry(actualUrl, tabId);
    tab.sites.push(site);  
    this.save(tab);
  }

  static async removeTimedOutTabs() {
    const tab = await this.load();
    const filteredSites = tab.sites.filter((site) => {
      return this.wasCreatedLessThanXMinutesAgo(MINUTES_15, site.created);
    });

    this.save({...tab, sites: filteredSites})
  }

  static async removeTabById(tabId) {
    const tab = await this.load();
    const filteredSites = tab.sites.filter((site) => {
      return site.tabId != tabId;
    });

    this.save({...tab, sites: filteredSites})    
  }

  static wasCreatedLessThanXMinutesAgo(timeInSeconds, creationDate) {
    return (Date.now() - creationDate) < timeInSeconds;
  }

}
