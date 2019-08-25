import BrowserService from "./services/BrowserService"
import NavEvent from "./NavEvent";
import Delay from "./Delay"

export const BACKGROUND_FILE = "/src/background.html";
export const HOME_FILE = "/src/home.html";

/**
 * Controls the navigation events.
 * Use this to trigger a navigation.
 */
export default class TabNavigation {

  static redirectToOriginal(tabId, blacklistEntry) {
    const backgroundUrl = this.getBackgroundUrl();

    //https://stackoverflow.com/questions/28431505/unchecked-runtime-lasterror-when-using-chrome-api
    function callback(tab) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("TabNavigation Error: " + chrome.runtime.lastError.message);
      } else {
        if(tab && tab.url === backgroundUrl){
          NavEvent.addLoadedEvent(blacklistEntry);
          TabNavigation.redirectToOriginalUrl(tabId);
        }
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
    const site = Delay.getSiteByTabId(tabId);
    BrowserService.updateTabUrl(tabId, site.actualUrl);
  }

  static getBackgroundUrl() {
    return BrowserService.getExtensionUrl(BACKGROUND_FILE);
  }
  
  static getHomeUrl() {
    return BrowserService.getExtensionUrl(HOME_FILE);    
  }
  
}