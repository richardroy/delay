import BrowserService from "./services/BrowserService"
import NavEvent from "./model/NavEvent";
import Delay from "./model/Delay"

export const BACKGROUND_FILE = "background.html";
export const HOME_FILE = "home.html";

/**
 * Controls the navigation events.
 * Use this to trigger a navigation.
 */
export default class TabNavigation {

  static loadDelayedUrl(tabId, blacklistEntry) {
    const backgroundUrl = this.getBackgroundUrl();

    //https://stackoverflow.com/questions/28431505/unchecked-runtime-lasterror-when-using-chrome-api
    function callback(tab) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("TabNavigation Error: " + chrome.runtime.lastError.message);
      } else {
        if(tab && tab.url === backgroundUrl){
          TabNavigation.redirectTabToDelayedUrl(tabId);
          NavEvent.addLoadedEvent(blacklistEntry);
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

  static redirectTabToDelayedUrl(tabId) {
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