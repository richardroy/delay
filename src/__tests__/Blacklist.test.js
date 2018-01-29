
import LocalStorageService from '../services/LocalStorageService';
import Blacklist from '../Blacklist';
import NavEvents from '../NavEvents';
import NavEvent from '../NavEvent';
import shortId from "shortid";

const URL_REDDIT = {id: 1, url: "wwww.reddit.com", navEvents: []};
const URL_REDDIT_CLICKED = {...URL_REDDIT};
const URL_REDDIT_LOADED = {...URL_REDDIT_CLICKED};
const URL_FACEBOOK = {id: 2, url: "wwww.facebook.com", navEvents: []};
const URL_TWITTER = {id: 3, url: "wwww.twitter.com", navEvents: []};
const URL_TWITTER_CLICKED = {...URL_TWITTER};

const BLACKLIST = [URL_REDDIT, URL_FACEBOOK];
const UPDATED_BLACKLIST = [...BLACKLIST, URL_TWITTER];
const CLICKED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];
const LOADED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];

test("containsUrl: Does contain the url", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue(BLACKLIST);
  const containsUrl = Blacklist.containsUrl(URL_REDDIT.url);
  expect(containsUrl).toBeTruthy();

});

test("containsUrl: Does not contain the url", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([BLACKLIST]);
  const containsUrl = Blacklist.containsUrl(URL_TWITTER.url);
  expect(containsUrl).toBeFalsy();
});

test("getWithUrl: Does contain the url", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  const blacklistEntry = Blacklist.getWithUrl(URL_REDDIT.url);
  expect(blacklistEntry).toEqual(URL_REDDIT);  
}) 

test("getWithUrl: Does not contain the url", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  const blacklistEntry = Blacklist.getWithUrl(URL_TWITTER.url);
  expect(blacklistEntry).toEqual({});  
}) 

test("updateEntry: updates existing entry", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  LocalStorageService.saveObject = jest.fn();
  Blacklist.updateEntry(URL_REDDIT_CLICKED);

  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("updateEntry: entry doesn't exist, doesn't update blacklist", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue(BLACKLIST);
  LocalStorageService.saveObject = jest.fn();
  Blacklist.updateEntry({ ...URL_TWITTER });

  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(0);
})

test("addNavigatedEvent", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();
  NavEvent.create = jest.fn().mockReturnValue({id: 1});
  NavEvents.add = jest.fn();
  Blacklist.addNavigatedEvent(URL_REDDIT);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("addLoadedEvent", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();
  
  Blacklist.addLoadedEvent(URL_REDDIT_CLICKED);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", LOADED_BLACKLIST);
})

test("load: standard load", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();

  const blacklist = Blacklist.load()
  expect(blacklist).toEqual(BLACKLIST);
})

test("load: loads in base object", () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValue([]);
    LocalStorageService.saveObject = jest.fn();
    
    const blacklist = Blacklist.load()
  expect(blacklist).toEqual([]);
})

test("save", () => {
  LocalStorageService.saveObject = jest.fn();
  
  Blacklist.save(BLACKLIST);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", BLACKLIST);
})

test("addNewUrl", () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValue([...BLACKLIST]);
    LocalStorageService.saveObject = jest.fn();
  shortId.generate = jest.fn().mockReturnValue(URL_TWITTER.id);

  Blacklist.addNewUrl(URL_TWITTER.url);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", UPDATED_BLACKLIST);
})