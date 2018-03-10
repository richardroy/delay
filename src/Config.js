import LocalStorageService from "./services/LocalStorageService";

const CONFIG = "config";
const CLEAN_DELAY = "cleanDelay";
const INITIAL_DELAY_TIME = 15;

export default class Config {

  static load() {
    return LocalStorageService.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME});
  }
  
  static save(blacklist) {
    LocalStorageService.saveObject(CONFIG, blacklist);
  }

  static getDelayTime() {
    const config = this.load();
    return config.delayTime;
  }

  static setDelayTime(time) {
    const config = this.load();
    config.delayTime = time;
    this.save(config);
  }

  static getLastCleanDelay(time) {
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