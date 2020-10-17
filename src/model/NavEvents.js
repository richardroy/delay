import LocalStorageService from "../services/LocalStorageService.js";
import { LOADED, NAVIGATED } from "./NavEvent.js";

const NAV_EVENTS = "navEvents";

export default class NavEvents {

  static async add(navEvent) {
    const navEvents = await this.load();
    navEvents.push(navEvent);
    this.save(navEvents);
  }

  static save(navEvents) {
    LocalStorageService.saveObject(NAV_EVENTS, navEvents)
  }

  static async load() {
    return await LocalStorageService.loadObject(NAV_EVENTS, []);
  }

  static async filterEventList() {
    const navEvents = await this.load();
    const loadedEvents = {};
    const navigatedEvents = {};
    
    for(const index in navEvents) {
      const event = navEvents[index];
      if(event.type === NAVIGATED) {
        this.addFilteredEvent(event.time, loadedEvents);
      } else if(event.type === LOADED) {
        this.addFilteredEvent(event.time, navigatedEvents);
      }
    }
    return { loadedEvents, navigatedEvents };
  }

  static addFilteredEvent(eventTime, filteredEvent) {
    const uniqueDate = this.getDateString(eventTime);
    if(filteredEvent[uniqueDate]) 
      filteredEvent[uniqueDate] += 1;
    else 
      filteredEvent[uniqueDate] = 1;
  }

  static getDateString(millis) {
    const date = new Date(+millis);
    const dateString = 
      String(date.getFullYear().toString()) + '-' +
      String(date.getMonth().toString()).slice(-2) + '-' +
      String(date.getDate().toString()).slice(-2);
    return dateString;
  }
}