import LocalStorageService from "./services/LocalStorageService";
import Config from "./Config";
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
    const created = Date.now();
    const delay = this.load();
    delay.sites.push({actualUrl: actualUrl, tabId: tabId, created, allowed: false});  
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
    
    for(var index in sitesToRemove) {
      this.removeDelayEntryWithTabId(sitesToRemove[index]);
    }
  }

  static removeDelayEntryWithTabId(tabId) {
    const delay = this.load();    
    for(var siteIndex in delay.sites) {
      const site = delay.sites[siteIndex];
      if (site.tabId === tabId)
        delay.sites.splice(siteIndex, 1);
    }
    this.save(delay);
  }

}
