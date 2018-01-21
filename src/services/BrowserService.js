export default class BrowserService {

  static updateTabUrl(tabId, url) {
    chrome.tabs.update(tabId, {url:url});
  }

  static getExtensionUrl(filename) {
    return chrome.extension.getURL(filename);  
  }

  static getTab(tabId, callback, blacklistEntry) {
    chrome.tabs.get(tabId, callback);
  }

  static setOnExtensionClickedEvent(listener) {
    chrome.browserAction.onClicked.addListener(listener)
  }

  static setNavigationTriggerEvent(listener) {
    chrome.webNavigation["onBeforeNavigate"].addListener(listener);
  }
  
}