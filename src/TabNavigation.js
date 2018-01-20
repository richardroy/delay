import BrowserService from "./BrowserService"
import Blacklist from "./Blacklist"
import Delay from "./Delay"

export default class TabNavigation {

  static getBackgroundUrl() {
    return BrowserService.getExtensionUrl("/src/background.html");
  }
  
  static getHomeUrl() {
    return BrowserService.getExtensionUrl("/src/home.html");    
  }

  static redirectToOriginalUrl(tabId) {
    let delay = Delay.loadDelay();
    const site = Delay.getSite(delay, tabId);
    BrowserService.updateTabUrl(tabId, site.actualUrl);
  }
  
  static redirectTabToBackground(tabId) {
    const backgroundPageUrl = this.getBackgroundUrl(); 
    BrowserService.updateTabUrl(tabId, backgroundPageUrl)
  }
  
  static redirectTabToHome(tabId) {
    const homePageUrl = this.getHomeUrl(); 
    BrowserService.updateTabUrl(tabId, homePageUrl);    
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