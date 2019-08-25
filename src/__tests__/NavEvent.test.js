import LocalStorageService from '../services/LocalStorageService';
import NavEvents from '../NavEvents';
import NavEvent from '../NavEvent';


const URL_REDDIT = {id: 1, url: "wwww.reddit.com", navEvents: []};
const URL_REDDIT_CLICKED = {...URL_REDDIT};
const URL_FACEBOOK = {id: 2, url: "wwww.facebook.com", navEvents: []};

const CLICKED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];
const LOADED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];

const BLACKLIST = [URL_REDDIT, URL_FACEBOOK];

test("addNavigatedEvent", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();
  NavEvent.create = jest.fn().mockReturnValue({id: 1});
  NavEvents.add = jest.fn();
  NavEvent.addNavigatedEvent(URL_REDDIT);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("addLoadedEvent", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();
  NavEvent.create = jest.fn().mockReturnValue({id: 1});
  NavEvents.add = jest.fn();
  NavEvent.addLoadedEvent(URL_REDDIT_CLICKED);
  expect(NavEvent.create).toHaveBeenCalledTimes(1);
  expect(NavEvents.add).toHaveBeenCalledTimes(1);
  expect(NavEvents.add).toHaveBeenCalledWith({id: 1});
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", LOADED_BLACKLIST);
})
