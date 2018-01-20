export default class BrowserService {
  static updateTabUrl(tabId, url) {
    chrome.tabs.update(tabId, {url:url});
  }

  static getExtensionUrl(filename) {
    return chrome.extension.getURL(filename);  
  }

  static getTab(tabId, callback) {
    chrome.tabs.get(tabId, callback);
  }
}