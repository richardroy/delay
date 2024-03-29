import BrowserService from "../services/BrowserService.js";

export const BULKBLOCKLIST = "bulkblocklist";

/**
 * Is an array of urls:
 *    [
 *      "reddit.com"
 *    ]
 */
export default class BulkBlockList {

  static async get() {
    const bulkBlockList = await this.load();
    return bulkBlockList;
  }

  static async contains(url) {
    const bulkBlockList = await this.load();
    return (bulkBlockList.split(',').find(blacklistUrl => url.includes(blacklistUrl)))
  }

  static async load() {
    const bulkBlockList = await BrowserService.loadObject(BULKBLOCKLIST, "");
    return bulkBlockList;
  }
  
  static save(bulkBlockList) {
    BrowserService.saveObject(BULKBLOCKLIST, bulkBlockList);
  }
} 