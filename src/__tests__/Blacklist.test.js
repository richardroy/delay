
import LocalStorageService from '../services/LocalStorageService';
import Blacklist, { BLACKLIST } from '../model/Blacklist';

const URL_REDDIT = "wwww.reddit.com";
const URL_FACEBOOK = "wwww.facebook.com";
const URL_TWITTER = "wwww.twitter.com";

const INITIAL_BLACKLIST = [];
const FILLED_BLACKLIST = [URL_REDDIT, URL_FACEBOOK];
const UPDATED_BLACKLIST = [URL_REDDIT, URL_FACEBOOK, URL_TWITTER];

test("load: standard load", async () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue(FILLED_BLACKLIST);  
  LocalStorageService.saveObject = jest.fn();

  const blacklist = await Blacklist.load()
  expect(blacklist).toEqual(FILLED_BLACKLIST);
})

test("load: loads in base object", async () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValue([]);
    LocalStorageService.saveObject = jest.fn();
    
    const blacklist = await Blacklist.load()
  expect(blacklist).toEqual(INITIAL_BLACKLIST);
})

test("save", () => {
  LocalStorageService.saveObject = jest.fn();
  
  Blacklist.save(FILLED_BLACKLIST);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", FILLED_BLACKLIST);
})

test("addNewUrl", async () => {
  LocalStorageService.loadObject = jest.fn()
    .mockReturnValue([...FILLED_BLACKLIST]);
    LocalStorageService.saveObject = jest.fn();

  await Blacklist.addNewUrl(URL_TWITTER);
  expect(LocalStorageService.saveObject).toHaveBeenCalledTimes(1);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith("blacklist", UPDATED_BLACKLIST);
})

test("getByUrl: has blacklist entry with url", async () => {
  LocalStorageService.loadObject = jest.fn()
  .mockReturnValue(FILLED_BLACKLIST);
  const returnedBlacklistEntry = await Blacklist.getByUrl(URL_REDDIT);
  expect(returnedBlacklistEntry).toEqual(URL_REDDIT)
})

test("getByUrl: does not have blacklist entry with url", async () => {
  LocalStorageService.loadObject = jest.fn()
  .mockReturnValue([...INITIAL_BLACKLIST]);
  const returnedBlacklistEntry = await Blacklist.getByUrl(URL_TWITTER);
  expect(returnedBlacklistEntry).toEqual(null)
})

test("deleteByUrl: delete single entry", async () => {
  LocalStorageService.loadObject = jest.fn().mockReturnValue(UPDATED_BLACKLIST);
  LocalStorageService.saveObject = jest.fn();
  await Blacklist.deleteByUrl(URL_TWITTER);
  expect(LocalStorageService.saveObject).toHaveBeenCalledWith(BLACKLIST, FILLED_BLACKLIST);
})