export default class LocalStorage {

  static loadObject(identifier, baseObject) {
    let loadedObject = localStorage.getItem(identifier);
    if(!loadedObject) {
      loadedObject = baseObject;
    } else {
      loadedObject = JSON.parse(loadedObject);
    }
    return loadedObject;
  }

  static saveObject(identifier, object) {
    localStorage.setItem(identifier, JSON.stringify(object));
  }
  
}