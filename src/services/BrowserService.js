
/**
 * Used to interact with Chrome Browser API
 */
export default class BrowserService {

  static updateTabUrl(tabId, url) {
    if(chrome.runtime.lastError) {
      //Could be triggered if tab has been closed before delay
      console.warn("TabNavigation Error: " + chrome.runtime.lastError.message);
    } else {
      chrome.tabs.update(tabId, {url});
    }
  }

  static getExtensionUrl(filename) {
    return chrome.extension.getURL(filename);  
  }

  static getTab(tabId, callback) {
    chrome.tabs.get(tabId, callback);      
  }

  static setOnExtensionClickedEvent(listener) {
    chrome.browserAction.onClicked.addListener(listener)
  }

  static setNavigationTriggerEvent(listener) {
    chrome.webNavigation["onBeforeNavigate"].addListener(listener);
  }

  static setOnClosedEvent(listener) {
    chrome.tabs.onRemoved.addListener(listener);
  }

  static getAllWindows(callback) {
    chrome.windows.getAll(callback)
  }

  static getAllTabs(windowId, callback) {
    chrome.tabs.getAllInWindow(windowId, callback)
  }
}