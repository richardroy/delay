import LocalStorage from "./LocalStorage";

const BLACKLIST = "blacklist";

export default class Blacklist {
  static containsUrl(url) {
    const blacklist = this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex]))
        return true;
    }
    return false;
  }

  static load() {
    return LocalStorage.loadObject(BLACKLIST, []);
  }
  
  static save(blacklist) {
    LocalStorage.saveObject(BLACKLIST, blacklist);
  }

  static addNewUrl(url) {
    const blacklist = this.load();
    console.log(blacklist);
    blacklist.push(url);
    this.save(blacklist);
  }
} 