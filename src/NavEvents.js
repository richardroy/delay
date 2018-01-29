import LocalStorageService from "./services/LocalStorageService";
import shortId from "shortid";

const NAV_EVENTS = "navEvents";

export default class NavEvents {

  static add(navEvent) {
    const navEvents = this.load();
    navEvents.push(navEvent);
    this.save(navEvents);
  }

  static save(navEvents) {
    LocalStorageService.saveObject(NAV_EVENTS, navEvents)
  }

  static load() {
    return LocalStorageService.loadObject(NAV_EVENTS, []);
  }

}