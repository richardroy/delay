import LocalStorageService from "../services/LocalStorageService.js";

const NAV_EVENTS = "navEvents";
export const EVENT = {
  NAVIGATED: "navigated",
  LOADED: "loaded"
}

export default class NavEvents {

  static async add(navEvent) {
    const navEvents = await this.load();
    const eventDateTime = await this.getDateString();

    if(navEvents[navEvent][[eventDateTime]])
      navEvents[navEvent][[eventDateTime]] += 1;
    else
      navEvents[navEvent][[eventDateTime]] = 1;

    this.save(navEvents);
  }

  static save(navEvents) {
    LocalStorageService.saveObject(NAV_EVENTS, navEvents)
  }

  static async load() {
    return await LocalStorageService.loadObject(NAV_EVENTS, {[EVENT.NAVIGATED]: {}, [EVENT.LOADED]: {}});
  }

  static async getDateString() {
    const dateString = new Date().toISOString().substring(0, 10);
    return dateString;
  }
}