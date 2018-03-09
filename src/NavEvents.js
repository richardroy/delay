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

  static filterEventList() {
    const navEvents = this.load();
    const loadedEvents = {};
    const navigatedEvents = {};
    
    for(const index in navEvents) {
      const event = navEvents[index];
      if(event.type === "navigated") {
        this.addFilteredEvent(event.time, loadedEvents);
      } else if(event.type === "loaded") {
        this.addFilteredEvent(event.time, navigatedEvents);
      }
    }

    return { loadedEvents, navigatedEvents };
  }

  static addFilteredEvent(eventTime, filteredEvent) {
    const uniqueDate = this.getDateString(eventTime);
    if(filteredEvent[uniqueDate]) {
      filteredEvent[uniqueDate].count += 1;
    } else {
      filteredEvent[""+uniqueDate] = {}
      filteredEvent[""+uniqueDate].date = eventTime;
      filteredEvent[""+uniqueDate].count = 1;
    }
  }

  static getDateString(millis) {
    const date = new Date(+millis);
    const dateString = 
      String("0" + date.getFullYear().toString()).slice(-2) +
      String("0" + date.getMonth().toString()).slice(-2) +
      String("0" + date.getDate().toString()).slice(-2);
    return dateString;
  }
}