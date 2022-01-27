
/**
 * Used to interact with Chrome Browser API
 */
export default class BrowserService {

  static updateTabUrl(tabId, url) {
    if(chrome.runtime.lastError) {
      //Could be triggered if tab has been closed before delay
      console.warn("BrowserService Error: " + chrome.runtime.lastError.message);
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

  static getSelectedTab(tabId, callback) {
    chrome.tabs.getSelected(tabId, callback);      
  }

  static setOnExtensionClickedEvent(listener) {
    chrome.browserAction.onClicked.addListener(listener)
  }

  static setNavigationTriggerEvent(listener) {
    chrome.webNavigation["onBeforeNavigate"].addListener(listener);
  }

  static setTabUpdatedEvent(listener) {
    chrome.tabs.onUpdated.addListener(listener)
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

  static async loadObject(identifier, baseObject) {
    return await new Promise((resolve, reject) => {
      chrome.storage.sync.get(identifier, function (obj) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("BrowserService Error: " + chrome.runtime.lastError.message);
      }
      if(obj[identifier])
        resolve(obj[identifier]);
      else 
        resolve(baseObject);
      });
    })
  }

  static saveObject(identifier, object) {
    chrome.storage.sync.set({[[identifier]]: object}, function(result) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("LocalStorageServer Error: " + chrome.runtime.lastError.message);
      }
    });
  }
}