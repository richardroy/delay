
import BrowserService from '../services/BrowserService';
import Blacklist, { BLACKLIST } from '../model/Blacklist';

const URL_REDDIT = "wwww.reddit.com";
const URL_FACEBOOK = "wwww.facebook.com";
const URL_TWITTER = "wwww.twitter.com";

const INITIAL_BLACKLIST = [];
const FILLED_BLACKLIST = [URL_REDDIT, URL_FACEBOOK];
const UPDATED_BLACKLIST = [URL_REDDIT, URL_FACEBOOK, URL_TWITTER];

test("load: standard load", async () => {
  BrowserService.loadObject = jest.fn().mockReturnValue(FILLED_BLACKLIST);  
  BrowserService.saveObject = jest.fn();

  const blacklist = await Blacklist.load()
  expect(blacklist).toEqual(FILLED_BLACKLIST);
})

test("load: loads in base object", async () => {
  BrowserService.loadObject = jest.fn()
    .mockReturnValue([]);
    BrowserService.saveObject = jest.fn();
    
    const blacklist = await Blacklist.load()
  expect(blacklist).toEqual(INITIAL_BLACKLIST);
})

test("save", () => {
  BrowserService.saveObject = jest.fn();
  
  Blacklist.save(FILLED_BLACKLIST);
  expect(BrowserService.saveObject).toHaveBeenCalledTimes(1);
  expect(BrowserService.saveObject).toHaveBeenCalledWith("blacklist", FILLED_BLACKLIST);
})

test("addNewUrl", async () => {
  BrowserService.loadObject = jest.fn()
    .mockReturnValue([...FILLED_BLACKLIST]);
    BrowserService.saveObject = jest.fn();

  await Blacklist.addNewUrl(URL_TWITTER);
  expect(BrowserService.saveObject).toHaveBeenCalledTimes(1);
  expect(BrowserService.saveObject).toHaveBeenCalledWith("blacklist", UPDATED_BLACKLIST);
})

test("getByUrl: has blacklist entry with url", async () => {
  BrowserService.loadObject = jest.fn()
  .mockReturnValue(FILLED_BLACKLIST);
  const returnedBlacklistEntry = await Blacklist.getByUrl(URL_REDDIT);
  expect(returnedBlacklistEntry).toEqual(URL_REDDIT)
})

test("getByUrl: does not have blacklist entry with url", async () => {
  BrowserService.loadObject = jest.fn()
  .mockReturnValue([...INITIAL_BLACKLIST]);
  const returnedBlacklistEntry = await Blacklist.getByUrl(URL_TWITTER);
  expect(returnedBlacklistEntry).toEqual(null)
})

test("deleteByUrl: delete single entry", async () => {
  BrowserService.loadObject = jest.fn().mockReturnValue(UPDATED_BLACKLIST);
  BrowserService.saveObject = jest.fn();
  await Blacklist.deleteByUrl(URL_TWITTER);
  expect(BrowserService.saveObject).toHaveBeenCalledWith(BLACKLIST, FILLED_BLACKLIST);
})