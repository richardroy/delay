import LocalStorageService from "./services/LocalStorageService";

const DELAY = "delay";

export default class Delay {

  static getSite(tabId) {
    let delay = Delay.load();    
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        return site;
    }
    return {};
  }

  static save(delay) {
    LocalStorageService.saveObject(DELAY, delay)
  }

  static load() {
    return LocalStorageService.loadObject(DELAY, {sites: []});
  }

  static isTabIdInDelay(tabId) {
    const delay = this.load();
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        return true;
    }
    return false;
  }

  static isTabIdAllowed(tabId) {
    const delay = this.load();
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId){
        return site.allowed;
      }
    }
    return false;
  }

  static setAllowed(tabId) {
    const delay = this.load();
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        site.allowed = true;
    }
    this.save(delay);
  }

  static addNewTabToDelay(actualUrl, tabId) {
    const delay = this.load();
    delay.sites.push({actualUrl: actualUrl, tabId: tabId, allowed: false});  
    this.save(delay);
  }

}
