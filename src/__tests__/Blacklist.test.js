
import LocalStorageService from '../services/LocalStorageService';
import Blacklist from '../Blacklist';
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
  Blacklist.updateEntry({ ...URL_TWITTER, navigatedCount: 1 });

  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(0);
})

test("increaseNavigatedCount", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();
  
  Blacklist.increaseNavigatedCount(URL_REDDIT);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", CLICKED_BLACKLIST);
})

test("increaseLoadedCount", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();
  
  Blacklist.increaseLoadedCount(URL_REDDIT_CLICKED);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", LOADED_BLACKLIST);
})

test("convertOldStructure", () => {
  LocalStorageService.saveObject = jest.fn();
  const updatedBlacklist = [{
    id: expect.anything(),
    url: URL_REDDIT_OLD,
    loadedCount: 0,
    navigatedCount: 0
  }];

  Blacklist.convertOldStructure(OLD_BLACKLIST);

  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", updatedBlacklist);
})

test("load: standard load", () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue([...BLACKLIST]);  
  LocalStorageService.saveObject = jest.fn();

  const blacklist = Blacklist.load()
  expect(blacklist).toEqual(BLACKLIST);
})

test("load: loads in old format", () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValueOnce(OLD_BLACKLIST)
    .mockReturnValueOnce([...BLACKLIST]);
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