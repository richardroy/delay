import BrowserService from "./services/BrowserService"
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

  //Need to refactor chrome out, having trouble getting blacklist entry into the callback function.
  static onHomeRedirectToOriginal(tabId, blacklistEntry) {
    const backgroundUrl = this.getBackgroundUrl();

    function callback(tab) {
      if(tab.url === backgroundUrl){
        Blacklist.increaseLoadedCount(blacklistEntry);
        TabNavigation.redirectToOriginalUrl(tabId);
      }
    }

    BrowserService.getTab(tabId, callback)
  }
  
}