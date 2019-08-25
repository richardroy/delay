import shortid from "shortid";

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
    this.addEvent(navEvent);
  }

  static addLoadedEvent(blacklistEntry) {
    const navEvent = NavEvent.create(NAVIGATED);
    this.addEvent(navEvent);
  }

  static addEvent() {
    NavEvents.add(navEvent);
    blacklistEntry.navEvents.push(navEvent.id);
    this.updateEntry(blacklistEntry);
  }
  
}