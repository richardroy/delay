import NavEvents, { EVENT } from "../model/NavEvents";
import BrowserService from "./BrowserService"
import Tab from "../model/Tab"

export const BACKGROUND_FILE = "background.html";
export const HOME_FILE = "home.html";

/**
 * Controls the navigation events.
 * Use this to trigger a navigation.
 */
export default class TabNavigationService {

  static loadDelayedUrl(tabId) {
    const backgroundUrl = this.getBackgroundUrl();

    //https://stackoverflow.com/questions/28431505/unchecked-runtime-lasterror-when-using-chrome-api
    function callback(tab) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("TabNavigationService Error: " + chrome.runtime.lastError.message);
      } else {
        if(tab /*&& tab.url === backgroundUrl*/){
          TabNavigationService.redirectTabToDelayedUrl(tabId);
          NavEvents.add(EVENT.LOADED);
        }
      }
    }

    BrowserService.getTab(tabId, callback)
  }

  static redirectTabToBackground(tabId, desiredUrl) {
    const backgroundPageUrl = this.getBackgroundUrl(); 
    BrowserService.updateTabUrl(tabId, backgroundPageUrl+'?'+desiredUrl)
  }
  
  static redirectTabToHome(tabId) {
    const homePageUrl = this.getHomeUrl();
    BrowserService.updateTabUrl(tabId, homePageUrl);    
  }

  static async redirectTabToDelayedUrl(tabId) {
    const site = await Tab.getSiteByTabId(tabId);
    BrowserService.updateTabUrl(tabId, site.actualUrl);
  }

  static getBackgroundUrl() {
    return BrowserService.getExtensionUrl(BACKGROUND_FILE);
  }
  
  static getHomeUrl() {
    return BrowserService.getExtensionUrl(HOME_FILE);    
  }
  
}