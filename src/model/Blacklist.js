import LocalStorageService from "../services/LocalStorageService.js";
import shortId from "shortid";

export const BLACKLIST = "blacklist";

/**
 * Is an array of urls:
 *    [
 *      "reddit.com"
 *    ]
 */
export default class Blacklist {

  static async getByUrl(url) {
    const blacklist = await this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex].url))
        return blacklist[listIndex];
    }
    return null;
  }

  static async deleteByUrl(url) {
    const blacklist = await this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex].url)) {
        blacklist.splice(listIndex, 1)
        this.save(blacklist);
      }
    }
  }

  static async updateEntry(blacklistEntry) {
    const blacklist = await this.load();
    for(const listIndex in blacklist) {
      if(blacklist[listIndex].id === blacklistEntry.id){
        blacklist[listIndex] = blacklistEntry;
        this.save(blacklist);
        break;
      }
    }
  }

  static async load() {
    const blacklist = await LocalStorageService.loadObject(BLACKLIST, []);
    return blacklist;
  }
  
  static save(blacklist) {
    LocalStorageService.saveObject(BLACKLIST, blacklist);
  }

  static async addNewUrl(url) {
    const blacklist = await this.load();
    blacklist.push({
      url, 
      id: shortId.generate(),
      navEvents: []
    });
    this.save(blacklist);
  }
} 