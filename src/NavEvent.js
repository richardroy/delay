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
}