import LocalStorage from "./LocalStorage";
import shortId from "shortid";
const BLACKLIST = "blacklist";

export default class Blacklist {
  static containsUrl(url) {
    const blacklist = this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex].url))
        return true;
    }
    return false;
  }

  static getWithUrl(url) {
    const blacklist = this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex].url))
        return blacklist[listIndex];
    }
    return null;
  }

  static increaseNavigatedCount(blacklistObject) {
    blacklistObject.navigatedCount += 1;

    const blacklist = this.load();
    for(const listIndex in blacklist) {
      if(blacklist[listIndex].id === blacklistObject.id){
        blacklist[listIndex] = blacklistObject;
        break;
      }
    }
    this.save(blacklist);
  }

  static increaseLoadedCount(blacklistObject) {
    blacklistObject.loadedCount += 1;
    
        const blacklist = this.load();
        for(const listIndex in blacklist) {
          if(blacklist[listIndex].id === blacklistObject.id){
            blacklist[listIndex] = blacklistObject;
            break;
          }
        }
        this.save(blacklist);
  }

  static convertOldStructure(blacklist) {
    //to persist list over data structure change
    const newBlacklist = []
    for(const listIndex in blacklist) {
      newBlacklist.push({
        url: blacklist[listIndex], 
        id: shortId.generate(),
        navigatedCount: 0,
        loadedCount: 0        
      });
    }
  
    this.save(newBlacklist);
    return this.load();
  }

  static load() {
    const blacklist = LocalStorage.loadObject(BLACKLIST, []);
    
    //to persist string list data structure change
    if(blacklist && typeof blacklist[0] === "string") {      
      return this.convertOldStructure(blacklist);
    }

    return blacklist;
  }
  
  static save(blacklist) {
    LocalStorage.saveObject(BLACKLIST, blacklist);
  }

  static addNewUrl(url) {
    const blacklist = this.load();
    blacklist.push({
      url, 
      id: shortId.generate(),
      count: 0
    });
    this.save(blacklist);
  }
} 