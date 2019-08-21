import LocalStorageService from "./services/LocalStorageService";

const CONFIG = "config";
const INITIAL_DELAY_TIME = 15;

/**
 * Config is saved in the LocalStorage
 * Used to control:
 *    - delayTime: The time a delay persists
 */
export default class Config {

  static load() {
    return LocalStorageService.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME});
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

  static getLastCleanDelay() {
    const config = this.load();
    const cleanDelay = config.cleanDelay;
    return cleanDelay;
  }

  static setCleanDelay(time) {
    const config = this.load();
    config.cleanDelay = time;
    this.save(config);
  }

}