import BrowserService from "../services/BrowserService.js";

const NAV_EVENTS = "navEvents";
export const EVENT = {
  NAVIGATED: "navigated",
  LOADED: "loaded"
}

export default class NavEvents {

  static async add(navEvent) {
    const navEvents = await this.load();
    const eventDateTime = await this.getDateString();

    if(navEvents[navEvent][[eventDateTime]]) {
      navEvents[navEvent][[eventDateTime]] += 1;
    } else {
      if(navEvent == EVENT.NAVIGATED) {
        navEvents[navEvent][[eventDateTime]] = 1;
        navEvents[EVENT.LOADED][[eventDateTime]] = 0;
      } else if(navEvent == EVENT.LOADED){
        navEvents[navEvent][[eventDateTime]] = 1;
      }
    }
    this.save(navEvents);
  }

  static save(navEvents) {
    BrowserService.saveObject(NAV_EVENTS, navEvents)
  }

  static async load() {
    return await BrowserService.loadObject(NAV_EVENTS, {[EVENT.NAVIGATED]: {}, [EVENT.LOADED]: {}});
  }

  static async getDateString() {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0]
    return localISOTime;
  }
}