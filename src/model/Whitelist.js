import BrowserService from "../services/BrowserService.js";

export const WHITELIST = "whitelist";

/**
 * Is an array of urls:
 *    [
 *      "example.com"
 *    ]
 */
export default class Whitelist {

  static async getByUrl(url) {
    const whitelist = await this.load();
    if (whitelist.find(whitelistUrl => url.includes(whitelistUrl) && !url.includes('chrome-extension://')))
      return url;
    return null;
  }

  static async deleteByUrl(url) {
    const whitelist = await this.load();
    const updatedWhitelist = whitelist.filter(whitelistUrl => whitelistUrl != url);
    this.save(updatedWhitelist);
  }

  static async load() {
    const whitelist = await BrowserService.loadObject(WHITELIST, []);
    return whitelist;
  }

  static save(whitelist) {
    BrowserService.saveObject(WHITELIST, whitelist);
  }

  static async addNewUrl(url) {
    const whitelist = await this.load();
    whitelist.push(url);
    this.save(whitelist);
  }
}