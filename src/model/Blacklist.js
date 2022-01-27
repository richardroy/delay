import BrowserService from "../services/BrowserService.js";

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
    if(blacklist.find(blacklistUrl => url.includes(blacklistUrl) && !url.includes('chrome-extension://')))
      return url;
    return null;
  }

  static async deleteByUrl(url) {
    const blacklist = await this.load();
    const updatedBlacklist = blacklist.filter( blacklistUrl => blacklistUrl != url)
    this.save(updatedBlacklist);
  }

  static async load() {
    const blacklist = await BrowserService.loadObject(BLACKLIST, []);
    return blacklist;
  }
  
  static save(blacklist) {
    BrowserService.saveObject(BLACKLIST, blacklist);
  }

  static async addNewUrl(url) {
    const blacklist = await this.load();
    blacklist.push(url);
    this.save(blacklist);
  }
} 