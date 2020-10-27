import LocalStorageService from "../services/LocalStorageService.js";

const CONFIG = "config";
const INITIAL_DELAY_TIME = 15;

/**
 * Config is saved in the LocalStorage
 * Used to control:
 *    - delayTime: The time a delay persists
 *    - enabled: Whether the extension is currently enabled or disabled.
 */
export default class Config {

  static async load() {
    console.log("Load Config")
    return await LocalStorageService.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME, enabled: 'true'});
  }
  
  static save(config) {
    LocalStorageService.saveObject(CONFIG, config);
  }

  static async getDelayTime() {
    const config = await this.load();
    console.log(config)
    const delayTimeSeconds = config.delayTime;
    return delayTimeSeconds;
  }

  static async setDelayTime(time) {
    const config = await this.load();
    console.log('setDelayTime')
    console.log(config)
    config.delayTime = time;
    this.save(config);
  }

  static async isExtensionEnabled() {
    const config = await this.load();
    const enabled = config.enabled ?? true;
    return enabled;
  }

  static async setEnabledStatus(enabled) {
    const config = await this.load();
    config.enabled = enabled;
    this.save(config);
  }

}