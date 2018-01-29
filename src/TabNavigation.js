import BrowserService from "./services/BrowserService"
import Blacklist from "./Blacklist"
import Delay from "./Delay"

export const BACKGROUND_FILE = "/src/background.html";
export const HOME_FILE = "/src/home.html";


export default class TabNavigation {

  static onBackgroundRedirectToOriginal(tabId, blacklistEntry) {
    const backgroundUrl = this.getBackgroundUrl();

    function callback(tab) {
      if(tab.url === backgroundUrl){
        Blacklist.addLoadedEvent(blacklistEntry);
        TabNavigation.redirectToOriginalUrl(tabId);
      }
    }
    BrowserService.getTab(tabId, callback)
  }

  static redirectTabToBackground(tabId) {
    const backgroundPageUrl = this.getBackgroundUrl(); 
    BrowserService.updateTabUrl(tabId, backgroundPageUrl)
  }
  
  static redirectTabToHome(tabId) {
    const homePageUrl = this.getHomeUrl(); 
    BrowserService.updateTabUrl(tabId, homePageUrl);    
  }

  static redirectToOriginalUrl(tabId) {
    const site = Delay.getSite(tabId);
    BrowserService.updateTabUrl(tabId, site.actualUrl);
  }

  static getBackgroundUrl() {
    return BrowserService.getExtensionUrl(BACKGROUND_FILE);
  }
  
  static getHomeUrl() {
    return BrowserService.getExtensionUrl(HOME_FILE);    
  }
  
}