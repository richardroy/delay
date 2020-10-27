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
    if(blacklist.includes(url))
      return url;
    return null;
  }

  static async deleteByUrl(url) {
    const blacklist = await this.load();
    const updatedBlacklist = blacklist.filter( blacklistUrl => blacklistUrl != url)
    this.save(updatedBlacklist);
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