
export default class LocalStorageService {

  static async loadObject(identifier, baseObject) {
    return await new Promise((resolve, reject) => {
      chrome.storage.sync.get(identifier, function (obj) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("LocalStorageService Error: " + chrome.runtime.lastError.message);
      }
      if(obj[identifier])
        resolve(obj[identifier]);
      else 
        resolve(baseObject);
      });
    })
  }

  static saveObject(identifier, object) {
    console.log('save')
    console.log(identifier)
    console.log(object)
    chrome.storage.sync.set({[[identifier]]: object}, function(result) {
      if(chrome.runtime.lastError) {
        //Could be triggered if tab has been closed before delay
        console.warn("LocalStorageServer Error: " + chrome.runtime.lastError.message);
      }
    });
  }
  
}