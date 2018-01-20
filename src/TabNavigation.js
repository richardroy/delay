import BrowserService from "./BrowserService"
import Blacklist from "./Blacklist"
import Delay from "./Delay"

export default class TabNavigation {

  static redirectTab(tabId, url) {
    BrowserService.updateTabUrl(tabId, url);
  }

  static getUrl(filename) {
    const url = BrowserService.getExtensionUrl(filename);
    return url;
  }

  static getBackgroundUrl() {
    return this.getUrl("/src/background.html");
  }
  
  static getHomeUrl() {
    return this.getUrl("/src/home.html");  
  }

  static redirectToOriginalUrl(tabId) {
    let delay = Delay.loadDelay();
    const site = Delay.getSite(delay, tabId);
    this.redirectTab(tabId, site.actualUrl);
  }
  
  static redirectTabToBackground(tabId) {
    const backgroundPageUrl = this.getBackgroundUrl(); 
    this.redirectTab(tabId, backgroundPageUrl);          
  }
  
  static redirectTabToHome(tabId) {
    const homePageUrl = this.getHomeUrl(); 
    this.redirectTab(tabId, homePageUrl);          
  }

  static checkUrlAndRedirect(tab) {
    if(tab.url === backgrounUrl){
      Blacklist.increaseLoadedCount(blacklistObject);
      this.redirectToOriginalUrl(tabId);
    }
  }

  static onHomeRedirectToOriginal(tabId, blacklistObject) {
    const backgrounUrl = this.getBackgroundUrl();
    BrowserService.getTab(tabId, checkUrlAndRedirect);
  }
}