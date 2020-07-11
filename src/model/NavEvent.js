import shortid from "shortid";
import NavEvents from "../NavEvents.js";
import Blacklist from "./Blacklist.js";

export const LOADED = "loaded"; 
export const NAVIGATED = "navigated"; 

export default class NavEvent {

  static create(type) {
    const shortId = shortid.generate();
    const navEvent =  {
      id: shortId,
      type,
      time: Date.now()
    };
    return navEvent;
  }

  static addNavigatedEvent(blacklistEntry) {
    const navEvent = NavEvent.create(LOADED);
    this.addEvent(blacklistEntry, navEvent);
  }

  static addLoadedEvent(blacklistEntry) {
    const navEvent = NavEvent.create(NAVIGATED);
    this.addEvent(blacklistEntry, navEvent);
  }

  static addEvent(blacklistEntry, navEvent) {
    NavEvents.add(navEvent);
    blacklistEntry.navEvents.push(navEvent.id);
    Blacklist.updateEntry(blacklistEntry);
  }
  
}