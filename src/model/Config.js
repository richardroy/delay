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

  static load() {
    return LocalStorageService.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME, enabled: true});
  }
  
  static save(blacklist) {
    LocalStorageService.saveObject(CONFIG, blacklist);
  }

  static getDelayTime() {
    const config = this.load();
    const delayTimeSeconds = config.delayTime;
    return delayTimeSeconds;
  }

  static setDelayTime(time) {
    const config = this.load();
    config.delayTime = time;
    this.save(config);
  }

  static getEnabledStatus() {
    const config = this.load();
    const enabled = config.enabled;
    if(enabled == undefined)
      return true
    else
      return enabled
  }

  static setEnabledStatus(enabled) {
    const config = this.load();
    config.enabled = enabled;
    this.save(config);
  }

}