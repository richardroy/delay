import LocalStorageService from "./services/LocalStorageService";
import NavEvents from "./NavEvents";
import NavEvent, {LOADED, NAVIGATED} from "./NavEvent";
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
    return {};
  }

  static updateEntry(blacklistEntry) {
    const blacklist = this.load();
    let updated = false;
    for(const listIndex in blacklist) {
      if(blacklist[listIndex].id === blacklistEntry.id){
        blacklist[listIndex] = blacklistEntry;
        updated = true;
        break;
      }
    }
    if(updated) this.save(blacklist);
  }

  static addNavigatedEvent(blacklistEntry) {
    const navEvent = NavEvent.create(LOADED);
    NavEvents.add(navEvent);    
    blacklistEntry.navEvents.push(navEvent.id)
    this.updateEntry(blacklistEntry);
  }

  static addLoadedEvent(blacklistEntry) {
    const navEvent = NavEvent.create(NAVIGATED);
    NavEvents.add(navEvent);    
    blacklistEntry.navEvents.push(navEvent.id);
    this.updateEntry(blacklistEntry);    
  }

  static convertOldStructure(blacklist) {
    //to persist list over data structure change
    const newBlacklist = []
    for(const listIndex in blacklist) {
      newBlacklist.push({
        url: blacklist[listIndex], 
        id: shortId.generate(),
        navigatedCount: 0,
        loadedCount: 0,
        navEvents: []  
      });
    }
  
    this.save(newBlacklist);
    return this.load();
  }

  static load() {
    const blacklist = LocalStorageService.loadObject(BLACKLIST, []);
    
    //to persist string list data structure change
    if(blacklist && typeof blacklist[0] === "string") {      
      return this.convertOldStructure(blacklist);
    }

    return blacklist;
  }
  
  static save(blacklist) {
    LocalStorageService.saveObject(BLACKLIST, blacklist);
  }

  static addNewUrl(url) {
    const blacklist = this.load();
    blacklist.push({
      url, 
      id: shortId.generate(),
      navigatedCount: 0,
      loadedCount: 0,
      navEvents: []
    });
    this.save(blacklist);
  }
} 