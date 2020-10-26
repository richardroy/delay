import LocalStorageService from "../services/LocalStorageService.js";

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
      if(url.includes(blacklist[listIndex]))
        return blacklist[listIndex];
    }
    return null;
  }

  static async deleteByUrl(url) {
    const blacklist = await this.load();
    for(const listIndex in blacklist) {
      if(url.includes(blacklist[listIndex])) {
        blacklist.splice(listIndex, 1)
        this.save(blacklist);
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
    blacklist.push(url);
    this.save(blacklist);
  }
} 