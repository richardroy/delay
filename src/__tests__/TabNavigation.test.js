jest.mock("../services/BrowserService");

import TabNavigation, {BACKGROUND_FILE, HOME_FILE} from "../TabNavigation";
import BrowserService from "../services/BrowserService";
import Blacklist from "../Blacklist";
import Delay from "../Delay";

const TAB_ID = 1;
const BACKGROUND_URL = "background.url";
const HOME_URL = "home.url";

const BLACKLIST_ENTRY_REDDIT = {id: 1, url: "wwww.reddit.com", navigatedCount: 0, loadedCount: 0};
const DELAY_ENTRY_REDDIT = {"actualUrl":"https://www.reddit.com/","tabId":1405};

test("redirectTabToBackground", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(BACKGROUND_URL);
  BrowserService.updateTabUrl = jest.fn();
  TabNavigation.redirectTabToBackground(TAB_ID);
  
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(BACKGROUND_FILE);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.updateTabUrl).toBeCalledWith(TAB_ID, BACKGROUND_URL);
})

test("redirectTabToHome", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(HOME_URL);
  BrowserService.updateTabUrl = jest.fn();
  TabNavigation.redirectTabToHome(TAB_ID);

  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(HOME_FILE);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.updateTabUrl).toBeCalledWith(TAB_ID, HOME_URL);
})

test("onBackgroundRedirectToOriginal: still on home Url", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(BACKGROUND_URL);
  Blacklist.addLoadedEvent = jest.fn();
  
  Delay.getSite = jest.fn().mockReturnValue(DELAY_ENTRY_REDDIT);
  BrowserService.updateTabUrl = jest.fn(); 

  TabNavigation.onBackgroundRedirectToOriginal(TAB_ID, BLACKLIST_ENTRY_REDDIT);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);
  expect(BrowserService.getExtensionUrl).toHaveBeenLastCalledWith(BACKGROUND_FILE);

  expect(BrowserService.getTab).toHaveBeenCalledTimes(1);
  expect(BrowserService.getTab).toHaveBeenCalledWith(TAB_ID, expect.any(Function));

  expect(Blacklist.addLoadedEvent).toHaveBeenCalledTimes(1);
  expect(Blacklist.addLoadedEvent).toHaveBeenCalledWith(BLACKLIST_ENTRY_REDDIT);  

  expect(Delay.getSite).toHaveBeenCalledTimes(1);
  expect(Delay.getSite).toHaveBeenCalledWith(TAB_ID);

  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledWith(TAB_ID, DELAY_ENTRY_REDDIT.actualUrl);
  
  (BrowserService.getTab).mockClear();
})

test("onBackgroundRedirectToOriginal: no longer on home url", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(BACKGROUND_URL);
  Blacklist.increaseLoadedCount = jest.fn();
  TabNavigation.redirectToOriginalUrl = jest.fn(); 

  TabNavigation.onBackgroundRedirectToOriginal(TAB_ID, BLACKLIST_ENTRY_REDDIT);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);
  expect(BrowserService.getExtensionUrl).toHaveBeenLastCalledWith(BACKGROUND_FILE);

  expect(BrowserService.getTab).toHaveBeenCalledTimes(1);
  expect(BrowserService.getTab).toHaveBeenCalledWith(TAB_ID, expect.any(Function));

  expect(Blacklist.increaseLoadedCount).not.toHaveBeenCalled();
  expect(TabNavigation.redirectToOriginalUrl).not.toHaveBeenCalled(); 
})