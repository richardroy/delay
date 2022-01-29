import BrowserService from "../services/BrowserService.js";

const CONFIG = "config";
const INITIAL_DELAY_TIME = 15;
const INITIAL_INC_TIME = 0;

/**
 * Config is saved in the LocalStorage
 * Used to control:
 *    - delayTime: The time a delay persists
 *    - enabled: Whether the extension is currently enabled or disabled.
 */
export default class Config {

  static async load() {
    return await BrowserService.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME, enabled: 'true', incEnabled: 'true', incTime: INITIAL_INC_TIME, incStartDate: '0-0-0'});
  }
  
  static save(config) {
    BrowserService.saveObject(CONFIG, config);
  }

  static async getDelayTime() {
    const config = await this.load();
    const delayTimeSeconds = config.delayTime;
    return delayTimeSeconds;
  }

  static async getTotalDelay() {
    await Config.initiliaseIncTime();

    const config = await this.load();
    const delayTimeSeconds = config.delayTime;
    const incTime = await Config.isIncEnabled() ? config.incTime : 0;
    return delayTimeSeconds + incTime;
  }

  static async setDelayTime(time) {
    const config = await this.load();
    config.delayTime = parseInt(time);
    this.save(config);
  }

  static async isExtensionEnabled() {
    const config = await this.load();
    const enabled = JSON.parse(config.enabled) ?? true;
    return enabled;
  }

  static async isIncEnabled() {
    const config = await this.load();
    const enabled = JSON.parse(config.incEnabled) ?? true;
    return enabled;
  }

  static async increaseIncTime() {
    const config = await this.load();
    const incTime = config.incTime;
    config.incTime = incTime+1;
    this.save(config);
  }

  static async initiliaseIncTime() {
    const config = await this.load();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const startDate = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0]
    if(config.incStartDate != startDate) {
      config.incStartDate = startDate 
      config.incTime = 0;
    }
    this.save(config);
    return config.incTime;
  }

  static async setEnabledStatus(enabled) {
    const config = await this.load();
    config.enabled = enabled;
    this.save(config);
  }

  static async setIncEnabledStatus(incEnabled) {
    const config = await this.load();
    config.incEnabled = incEnabled;
    this.save(config);
  }

}