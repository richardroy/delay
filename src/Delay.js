import LocalStorageService from "./services/LocalStorageService";

const DELAY = "delay";

export default class Delay {

  static getSite(tabId) {
    let delay = Delay.loadDelay();    
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        return site;
    }
    return {};
  }

  static saveDelay(delay) {
    LocalStorageService.saveObject(DELAY, delay)
  }

  static loadDelay() {
    return LocalStorageService.loadObject(DELAY, {sites: []});
  }

  static isTabIdInDelay(delay, tabId) {
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        return true;
    }
    return false;
  }

  static addNewTabToDelay(delay, actualUrl, tabId) {
    delay.sites.push({actualUrl: actualUrl, tabId: tabId});  
    this.saveDelay(delay);
  }

}