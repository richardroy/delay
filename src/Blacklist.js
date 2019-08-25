import LocalStorageService from "./services/LocalStorageService";
import shortId from "shortid";

const BLACKLIST = "blacklist";

/**
 * Blacklist is saved in the LocalStorage
 * Is an array of BalcklistEntries:
 *    [
 *      {
 *        id: "HkJ4lUKQV",
 *        navEvents: ["BJCPxUKQ4", "Bkydg8FQN", "BJfuxLKm4", "SkpulUtX4", "B12YxLtQE", "SyX9G4DYQ4", "Syx7NPYQ4",…],
 *        url: "reddit.com"
 *      },
 *      ...
 *    ]
 */
export default class Blacklist {

  static getByUrl(url) {
    const blacklist = this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex].url))
        return blacklist[listIndex];
    }
    return null;
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

  static load() {
    const blacklist = LocalStorageService.loadObject(BLACKLIST, []);
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
      navEvents: []
    });
    this.save(blacklist);
  }
} 