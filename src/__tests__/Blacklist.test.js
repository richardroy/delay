
import Blacklist from '../Blacklist'
import LocalStorage from '../LocalStorage'
import shortId from "shortid";

const URL_REDDIT_OLD = "www.reddit.com";
const OLD_BLACKLIST = [URL_REDDIT_OLD];

const URL_REDDIT = {id: 1, url: "wwww.reddit.com", navigatedCount: 0, loadedCount: 0};
const URL_REDDIT_CLICKED = {...URL_REDDIT, navigatedCount: 1};
const URL_REDDIT_LOADED = {...URL_REDDIT_CLICKED, loadedCount: 1};
const URL_FACEBOOK = {id: 2, url: "wwww.facebook.com", navigatedCount: 0};
const URL_TWITTER = {id: 3, url: "wwww.twitter.com", navigatedCount: 0, loadedCount: 0};
const URL_TWITTER_CLICKED = {...URL_TWITTER, navigatedCount: 1, loadedCount: 1};

const BLACKLIST = [URL_REDDIT, URL_FACEBOOK];
const UPDATED_BLACKLIST = [...BLACKLIST, URL_TWITTER];
const CLICKED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];
const LOADED_BLACKLIST = [URL_REDDIT_CLICKED, URL_FACEBOOK];

test("containsUrl: Does contain the url", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue(BLACKLIST);
  const containsUrl = Blacklist.containsUrl(URL_REDDIT.url);
  expect(containsUrl).toBeTruthy();

});

test("containsUrl: Does not contain the url", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([BLACKLIST]);
  const containsUrl = Blacklist.containsUrl(URL_TWITTER.url);
  expect(containsUrl).toBeFalsy();
});

test("getWithUrl: Does contain the url", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  const blacklistEntry = Blacklist.getWithUrl(URL_REDDIT.url);
  expect(blacklistEntry).toEqual(URL_REDDIT);  
}) 

test("getWithUrl: Does not contain the url", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  const blacklistEntry = Blacklist.getWithUrl(URL_TWITTER.url);
  expect(blacklistEntry).toEqual({});  
}) 

test("updateEntry: updates existing entry", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);
  LocalStorage.saveObject = jest.fn();
  Blacklist.updateEntry(URL_REDDIT_CLICKED);

  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorage.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("updateEntry: entry doesn't exist, doesn't update blacklist", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue(BLACKLIST);
  LocalStorage.saveObject = jest.fn();
  Blacklist.updateEntry({ ...URL_TWITTER, navigatedCount: 1 });

  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(0);
})

test("increaseNavigatedCount", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorage.saveObject = jest.fn();
  
  Blacklist.increaseNavigatedCount(URL_REDDIT);
  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorage.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("increaseLoadedCount", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorage.saveObject = jest.fn();
  
  Blacklist.increaseLoadedCount(URL_REDDIT_CLICKED);
  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorage.saveObject).toHaveBeenCalledWith("blacklist", LOADED_BLACKLIST);
})

test("convertOldStructure", () => {
  LocalStorage.saveObject = jest.fn();
  const updatedBlacklist = [{
    id: expect.anything(),
    url: URL_REDDIT_OLD,
    loadedCount: 0,
    navigatedCount: 0
  }];

  Blacklist.convertOldStructure(OLD_BLACKLIST);

  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorage.saveObject).toHaveBeenCalledWith("blacklist", updatedBlacklist);
})

test("load: standard load", () => {
  LocalStorage.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorage.saveObject = jest.fn();

  const blacklist = Blacklist.load()
  expect(blacklist).toEqual(BLACKLIST);
})

test("load: loads in old format", () => {
  LocalStorage.loadObject = jest.fn()
    .mockReturnValueOnce(OLD_BLACKLIST)
    .mockReturnValueOnce([...BLACKLIST]);
  LocalStorage.saveObject = jest.fn();
    
    const blacklist = Blacklist.load()
  expect(blacklist).toEqual(BLACKLIST);
})

test("load: loads in base object", () => {
  LocalStorage.loadObject = jest.fn()
    .mockReturnValue([]);
  LocalStorage.saveObject = jest.fn();
    
    const blacklist = Blacklist.load()
  expect(blacklist).toEqual([]);
})

test("save", () => {
  LocalStorage.saveObject = jest.fn();
  
  Blacklist.save(BLACKLIST);
  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorage.saveObject).toHaveBeenCalledWith("blacklist", BLACKLIST);
})

test("addNewUrl", () => {
  LocalStorage.loadObject = jest.fn()
    .mockReturnValue([...BLACKLIST]);
  LocalStorage.saveObject = jest.fn();
  shortId.generate = jest.fn().mockReturnValue(URL_TWITTER.id);

  Blacklist.addNewUrl(URL_TWITTER.url);
  expect(LocalStorage.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorage.saveObject).toHaveBeenCalledWith("blacklist", UPDATED_BLACKLIST);
})