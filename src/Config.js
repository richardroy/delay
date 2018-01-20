import LocalStorageService from "./services/LocalStorageService";

const CONFIG = "config";
const INITIAL_DELAY_TIME = 15;

export default class Config {

  static load() {
    return LocalStorage.loadObject(CONFIG, {delayTime: INITIAL_DELAY_TIME});
  }
  
  static save(blacklist) {
    LocalStorage.saveObject(CONFIG, blacklist);
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

}