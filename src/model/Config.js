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
    return await BrowserService.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME, enabled: 'true', incEnabled: 'true', incTime: INITIAL_INC_TIME});
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
    const config = await this.load();
    const delayTimeSeconds = config.delayTime;
    const incTime = config.incTime;
    console.log('getTotalDelay')
    console.log(delayTimeSeconds+incTime)
    return delayTimeSeconds + incTime;
  }

  static async setDelayTime(time) {
    const config = await this.load();
    config.delayTime = parseInt(time);
    console.log(config.delayTime)
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