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

  static convertOldStructure() {
    //to persist list over data structure change
    const newBlacklist = []
    for(const listIndex in blacklist) {
      newBlacklist.push({url: blacklist[listIndex], id: shortId.generate()});
    }
  
    this.save(newBlacklist);
    return this.load();
  }

  static load() {
    const blacklist = LocalStorage.loadObject(BLACKLIST, []);
    
    //to persist string list data structure change
    if(blacklist && typeof blacklist[0] === "string") {      
      return this.convertOldStructure(black);
    }

    return blacklist;
  }
  
  static save(blacklist) {
    LocalStorage.saveObject(BLACKLIST, blacklist);
  }

  static addNewUrl(url) {
    const blacklist = this.load();
    blacklist.push({url, id: shortId.generate()});
    this.save(blacklist);
  }
} 